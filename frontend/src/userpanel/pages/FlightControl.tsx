import * as React from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Plane, Zap, Clock, XCircle, Plus, MapPin, RefreshCw, ChevronsLeft, ChevronsRight } from "lucide-react";
import { getFlights, addFlight, cancelFlight, updateFlightStatus } from "../services/api";

export default function AdminDashboard() {
	const { user } = useUser();
	const [flights, setFlights] = React.useState<any[]>([]);
	const [selectedAirport, setSelectedAirport] = React.useState("DEL");
	const [loading, setLoading] = React.useState(false);
	const [submitting, setSubmitting] = React.useState(false);
	const [sidebarCollapsed, setSidebarCollapsed] = React.useState<boolean>(() => {
		return typeof window !== "undefined" && localStorage.getItem("sidebarCollapsed") === "true";
	});

	// restore controlled form state (was missing — caused crash)
	const [formData, setFormData] = React.useState({
		flight_number: "",
		airline: "",
		destination: "",
		dest_city: "",
		dep_time: "",
		arrival_time: "",
	});

	// ref to the table section so GO can navigate/scroll to it
	const tableRef = React.useRef<HTMLDivElement | null>(null);

	// helper to hide/show common sidebar elements
	const applySidebarState = (collapsed: boolean) => {
		if (typeof document === "undefined") return;
		const selectors = ['.dashboard-sidebar', '.sidebar', '.sidenav', 'nav[role="navigation"]'];
		const els = Array.from(document.querySelectorAll(selectors.join(','))) as HTMLElement[];
		els.forEach(el => {
			el.style.display = collapsed ? "none" : "";
		});
		try { localStorage.setItem("sidebarCollapsed", collapsed ? "true" : "false"); } catch {}
	};

	React.useEffect(() => {
		// apply on mount and when state changes
		applySidebarState(sidebarCollapsed);
	}, [sidebarCollapsed]);

	const loadData = React.useCallback(async (airport?: string) => {
		const src = airport || selectedAirport;
		setLoading(true);
		try {
			const res = await getFlights(src);
			if (res && res.data) {
				setFlights(Object.entries(res.data).map(([id, val]: any) => ({ id, ...val })));
			} else {
				setFlights([]);
			}
		} catch (err) {
			console.error("Failed to load flights", err);
			setFlights([]);
		} finally {
			setLoading(false);
		}
	}, [selectedAirport]);

	React.useEffect(() => {
		loadData(selectedAirport);
	}, [selectedAirport, loadData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const payload = { ...formData, source: selectedAirport, status: "On Time" };
			await addFlight(payload);
			// reset controlled form state
			setFormData({
				flight_number: "",
				airline: "",
				destination: "",
				dest_city: "",
				dep_time: "",
				arrival_time: "",
			});
			await loadData();
		} catch (err) {
			console.error("Failed to add flight", err);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelay = async (id: string) => {
		// find flight and sanitize id (strip accidental ".json" suffix which caused 404)
		const flight = flights.find((f) => f.id === id);
		const sanitizeId = (raw: string) => raw.replace(/\.json$/i, "");
		const currentDep = flight?.dep_time ?? "";
		// prompt for new time or duration
		const input = window.prompt(
			`Enter new departure time (HH:MM) or delay duration (HH:MM).\nCurrent scheduled departure: ${currentDep}`,
			currentDep
		);
		if (input === null) return; // cancelled

		// determine if input is a time (contains :) and looks like HH:MM
		const isTime = /^\d{1,2}:\d{2}$/.test(input.trim());
		const isDuration = /^\d{1,2}:\d{2}$/.test(input.trim()); // same pattern; we'll treat as duration if differs logically

		let newDepTime: string | null = null;
		let delayStr = "";

		if (isTime) {
			// treat as absolute new departure time
			newDepTime = input.trim();
			const oldM = toMinutes(currentDep) ?? 0;
			const newM = toMinutes(newDepTime);
			if (newM === null) {
				console.error("Invalid new departure time");
				return;
			}
			const diff = newM - oldM;
			delayStr = humanDelay(diff > 0 ? diff : 0);
		} else if (isDuration) {
			// treat as duration to add to current departure
			const added = addDuration(currentDep, input.trim());
			if (!added) {
				console.error("Invalid duration");
				return;
			}
			newDepTime = added;
			const diff = toMinutes(newDepTime)! - (toMinutes(currentDep) ?? 0);
			delayStr = humanDelay(diff > 0 ? diff : 0);
		} else {
			// fallback: treat input as HH:MM anyway
			const trimmed = input.trim();
			if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
				newDepTime = trimmed;
				const oldM = toMinutes(currentDep) ?? 0;
				const newM = toMinutes(newDepTime) ?? oldM;
				delayStr = humanDelay(newM - oldM);
			} else {
				// invalid input
				window.alert("Invalid input. Please enter times in HH:MM format.");
				return;
			}
		}

		// call backend directly to avoid helpers that add ".json" suffix unexpectedly
		const clean = sanitizeId(id);
		const encId = encodeURIComponent(clean);
		try {
			setLoading(true);
			const payload: any = { status: "Delayed", delay: delayStr, notifyPassengers: true };
			if (newDepTime) payload.dep_time = newDepTime;

			const url = `/flights/${encodeURIComponent(selectedAirport)}/${encId}`;
			const res = await fetch(url, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
				credentials: "include",
			});

			if (res.status === 404) {
				console.error("Delay failed: flight not found (404)", { id: clean, airport: selectedAirport });
				window.alert("Flight not found (404).");
				const note = { id: clean, airport: selectedAirport, type: "delay_failed", message: `Delay failed for ${clean}`, ts: Date.now() };
				try { const arr = JSON.parse(localStorage.getItem("flight_notifications") || "[]"); arr.push(note); localStorage.setItem("flight_notifications", JSON.stringify(arr)); window.dispatchEvent(new CustomEvent("flight-notification", { detail: note })); } catch {}
			} else if (res.ok) {
				await loadData();
				const note = { id: clean, airport: selectedAirport, type: "delayed", message: `Flight ${flight?.flight_number || clean} delayed to ${payload.dep_time || "updated"} (${payload.delay})`, ts: Date.now() };
				try { const arr = JSON.parse(localStorage.getItem("flight_notifications") || "[]"); arr.push(note); localStorage.setItem("flight_notifications", JSON.stringify(arr)); window.dispatchEvent(new CustomEvent("flight-notification", { detail: note })); } catch {}
				window.alert(`Flight delayed → new departure ${payload.dep_time || "updated"} (${payload.delay}). Passengers will be notified.`);
			} else {
				const text = await res.text().catch(() => "");
				console.error("Delay request failed", res.status, text);
				window.alert("Failed to apply delay. Check console for details.");
			}
		} catch (err) {
			console.error("Delay request error", err);
			window.alert("Failed to apply delay. Check console for details.");
		} finally {
			setLoading(false);
		}
	};
	
	const handleCancel = async (id: string) => {
		if (!window.confirm("Cancel this flight? This will notify passengers.")) return;
		const sanitizeId = (raw: string) => raw.replace(/\.json$/i, "");
		const clean = sanitizeId(id);
		const flight = flights.find((f) => f.id === id || f.id === clean);

		setLoading(true);
		try {
			let result: any;
			let usedFallback = false;

			try {
				// preferred: shared API helper
				result = await cancelFlight(selectedAirport, clean);
			} catch (err) {
				// helper failed — log and fallback to raw DELETE
				console.error("cancelFlight helper threw:", err);
				usedFallback = true;
				const url = `/flights/${encodeURIComponent(selectedAirport)}/${encodeURIComponent(clean)}`;
				const res = await fetch(url, { method: "DELETE", credentials: "include" });
				result = res;
			}

			// If we got a fetch Response, inspect it for more info
			if (result && typeof (result as Response).ok === "boolean") {
				const res = result as Response;
				if (res.ok) {
					await loadData();
					const note = { id: clean, airport: selectedAirport, type: "cancelled", message: `Flight ${flight?.flight_number || clean} cancelled`, ts: Date.now() };
					try { const arr = JSON.parse(localStorage.getItem("flight_notifications") || "[]"); arr.push(note); localStorage.setItem("flight_notifications", JSON.stringify(arr)); window.dispatchEvent(new CustomEvent("flight-notification", { detail: note })); } catch {}
					window.alert("Flight cancelled. Passengers will be notified.");
					return;
				}
				// read body (if any) to give clearer logs
				const bodyText = await res.text().catch(() => "<no body>");
				console.error("DELETE response not ok", { status: res.status, body: bodyText, usedFallback });
				if (res.status === 404) window.alert("Cancel failed: flight not found (404). See console for details.");
				else window.alert(`Cancel failed: ${res.status}. See console for details.`);
				return;
			}

			// helper success shapes: boolean / { ok: true } / { success: true }
			const ok =
				result === true ||
				(result && (result.ok === true || result.success === true)) ||
				(result && typeof result.status === "number" && (result.status === 200 || result.status === 204));

			if (ok) {
				await loadData();
				const note = { id: clean, airport: selectedAirport, type: "cancelled", message: `Flight ${flight?.flight_number || clean} cancelled`, ts: Date.now() };
				try { const arr = JSON.parse(localStorage.getItem("flight_notifications") || "[]"); arr.push(note); localStorage.setItem("flight_notifications", JSON.stringify(arr)); window.dispatchEvent(new CustomEvent("flight-notification", { detail: note })); } catch {}
				window.alert("Flight cancelled. Passengers will be notified.");
				return;
			}

			// unexpected result shape
			console.error("Unexpected cancel result", { result, usedFallback });
			window.alert("Failed to cancel. Check console for details.");
		} catch (err) {
			console.error("Cancel request error (unexpected)", err);
			window.alert("Failed to cancel. Check console for details.");
		} finally {
			setLoading(false);
		}
	};
	
	// full airport list (used by the dropdown)
	const airports = [
		{ code: "AMS", city: "Amsterdam" },
		{ code: "BKK", city: "Bangkok" },
		{ code: "BLR", city: "Bengaluru" },
		{ code: "BOM", city: "Mumbai" },
		{ code: "CAN", city: "Guangzhou" },
		{ code: "CCU", city: "Kolkata" },
		{ code: "CDG", city: "Paris" },
		{ code: "DEL", city: "Delhi" },
		{ code: "DFW", city: "Dallas" },
		{ code: "DOH", city: "Doha" },
		{ code: "DXB", city: "Dubai" },
		{ code: "FRA", city: "Frankfurt" },
		{ code: "HKG", city: "Hong Kong" },
		{ code: "HND", city: "Tokyo" },
		{ code: "ICN", city: "Seoul" },
		{ code: "IST", city: "Istanbul" },
		{ code: "JFK", city: "New York" },
		{ code: "LAX", city: "Los Angeles" },
		{ code: "LHR", city: "London" },
		{ code: "MAA", city: "Chennai" },
		{ code: "ORD", city: "Chicago" },
		{ code: "SFO", city: "San Francisco" },
		{ code: "SIN", city: "Singapore" },
		{ code: "SYD", city: "Sydney" },
		{ code: "YYZ", city: "Toronto" }
	];

	// option inline style (helps on some platforms where the native dropdown is white)
	const optionStyle: React.CSSProperties = { backgroundColor: "#020617", color: "#e6eef8" };

	return (
		<div style={styles.container}>
			<header style={styles.header}>
				<div style={styles.brand}>
					<Zap size={22} color="#60a5fa" />
					<div>
						<div style={styles.titleRow}><span style={styles.title}>AIRCARE</span><span style={styles.altTitle}>OPS</span></div>
						<div style={styles.subtitle}>Flight Control · Command Center</div>
					</div>
				</div>

				<div style={styles.headerControls}>
					<div style={styles.airportPicker}>
						<MapPin size={16} color="#93c5fd" />
						<select
							value={selectedAirport}
							onChange={(e) => setSelectedAirport(e.target.value)}
							style={{ ...styles.select, backgroundColor: "rgba(255,255,255,0.02)", WebkitAppearance: "none", appearance: "none" }}
							aria-label="Select Airport"
						>
							{airports.map(a => (
								<option key={a.code} value={a.code} style={optionStyle}>
									{a.city} ({a.code})
								</option>
							))}
						</select>
						{/* Refresh (fetch) */}
						<button type="button" onClick={() => loadData()} style={styles.refreshBtn} title="Refresh">
							<RefreshCw size={16} className={loading ? "animate-spin" : ""} />
						</button>
						{/* GO: explicit navigation/fetch button (scrolls to table) */}
						<button
							type="button"
							onClick={() => { loadData(selectedAirport); tableRef.current?.scrollIntoView({ behavior: "smooth" }); }}
							style={styles.goBtn}
							title="Fetch & Navigate"
						>
							GO
						</button>
					</div>

					<div style={{display:'flex', alignItems:'center', gap:12}}>
						{/* Sidebar collapse/expand toggle */}
						<button
							aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
							onClick={() => setSidebarCollapsed(s => !s)}
							style={styles.collapseBtn}
							title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
						>
							{sidebarCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
						</button>
						<UserButton afterSignOutUrl="/Uddan-Sathi/" />
					</div>
				</div>
			</header>

			{/* attach ref here so GO can scroll to the table area */}
			<section ref={tableRef} style={styles.deployPanel}>
				<form onSubmit={handleSubmit} style={styles.form}>
					<div style={styles.inputGroup}>
						<label style={styles.label}>FLIGHT #</label>
						<input value={formData.flight_number} onChange={e => setFormData({...formData, flight_number: e.target.value})} style={styles.input} placeholder="6E-213" required />
					</div>
					<div style={styles.inputGroup}>
						<label style={styles.label}>AIRLINE</label>
						<input value={formData.airline} onChange={e => setFormData({...formData, airline: e.target.value})} style={styles.input} placeholder="IndiGo" required />
					</div>
					<div style={styles.inputGroup}>
						<label style={styles.label}>DEST</label>
						<input value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} style={styles.input} placeholder="DXB" required />
					</div>
					<div style={styles.inputGroup}>
						<label style={styles.label}>CITY</label>
						<input value={formData.dest_city} onChange={e => setFormData({...formData, dest_city: e.target.value})} style={styles.input} placeholder="Dubai" required />
					</div>
					<div style={styles.inputGroup}>
						<label style={styles.label}>DEP</label>
						<input type="time" value={formData.dep_time} onChange={e => setFormData({...formData, dep_time: e.target.value})} style={styles.input} required />
					</div>
					<div style={styles.inputGroup}>
						<label style={styles.label}>ARR</label>
						<input type="time" value={formData.arrival_time} onChange={e => setFormData({...formData, arrival_time: e.target.value})} style={styles.input} required />
					</div>
					<button type="submit" style={{...styles.submitBtn, opacity: submitting ? 0.7 : 1}} disabled={submitting}>
						<Plus size={16} /> DEPLOY
					</button>
				</form>
			</section>

			<main style={styles.main}>
				<div style={styles.tableHeader}>
					<div>
						<h2 style={styles.tableTitle}><Plane size={18} /> ACTIVE AIRSPACE — {selectedAirport}</h2>
						<div style={styles.subtitleSm}>{flights.length} flights · live operations</div>
					</div>
					<div style={styles.badge}>{loading ? "UPDATING..." : `${flights.length} TRACKED`}</div>
				</div>

				<div style={styles.tableScroll}>
					<table style={styles.table}>
						<thead>
							<tr style={styles.thRow}>
								<th style={styles.th}>IDENTIFIER</th>
								<th style={styles.th}>DESTINATION</th>
								<th style={styles.th}>SCHEDULE</th>
								<th style={styles.th}>CURRENT STATUS</th>
								<th style={{...styles.th, textAlign:'right'}}>INTERVENTION</th>
							</tr>
						</thead>
						<tbody>
							{flights.map(f => (
								<tr key={f.id} style={styles.tr}>
									<td style={styles.td}>
										<div style={styles.bold}>{f.flight_number}</div>
										<div style={styles.sub}>{f.airline}</div>
									</td>
									<td style={styles.td}>
										<div style={styles.bold}>{f.destination}</div>
										<div style={styles.sub}>{f.dest_city}</div>
									</td>
									<td style={styles.td}>
										<div style={styles.bold}>{f.dep_time} → {f.arrival_time}</div>
									</td>
									<td style={styles.td}>
										<div style={{
											...styles.status,
											color: f.status === "Delayed" ? "#fbbf24" : f.status === "Cancelled" ? "#fb7185" : "#34d399"
										}}>
											{f.status}
										</div>
									</td>
									<td style={styles.td}>
										<div style={styles.actionCell}>
											<button type="button" disabled={loading} onClick={() => handleDelay(f.id)} style={styles.delayBtn}><Clock size={14}/> DELAY</button>
											<button type="button" disabled={loading} onClick={() => handleCancel(f.id)} style={styles.cancelBtn}><XCircle size={14}/> CANCEL</button>
										</div>
									</td>
								</tr>
							))}
							{flights.length === 0 && !loading && (
								<tr><td colSpan={5} style={{padding:30, textAlign:'center', color:'#94a3b8'}}>No flights found for {selectedAirport}</td></tr>
							)}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
}

const styles: any = {
	container: {
		background: 'linear-gradient(180deg,#020617 0%, #030618 100%)',
		minHeight: '100vh',
		width: '100vw',
		color: '#e6eef8',
		fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
		paddingBottom: 60
	},
	header: {
		height: 84,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '18px 28px',
		backdropFilter: 'blur(8px)',
		background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
		borderBottom: '1px solid rgba(255,255,255,0.02)',
		boxShadow: '0 6px 24px rgba(2,6,23,0.6)'
	},
	brand: { display: 'flex', alignItems: 'center', gap: 14 },
	titleRow: { display: 'flex', alignItems: 'baseline', gap: 8 },
	title: { fontSize: 18, fontWeight: 800, color: '#fff' },
	altTitle: { color: '#60a5fa', fontWeight: 900, marginLeft: 6 },
	subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
	headerControls: { display: 'flex', alignItems: 'center', gap: 18 },
	collapseBtn: {
		background: 'transparent',
		border: '1px solid rgba(255,255,255,0.04)',
		color: '#cfe8ff',
		padding: '8px',
		borderRadius: 8,
		cursor: 'pointer',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	airportPicker: {
		display: 'flex', alignItems: 'center', gap: 10,
		background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
		border: '1px solid rgba(255,255,255,0.03)',
		padding: '8px 10px', borderRadius: 10,
		backdropFilter: 'blur(6px)'
	},
	select: { background:'transparent', border:'none', color:'#e6eef8', fontWeight:700, outline:'none', padding:'4px 8px', cursor:'pointer' },
	refreshBtn: { background: 'transparent', border: 'none', color: '#93c5fd', cursor: 'pointer' },
	goBtn: {
		background: 'rgba(255,255,255,0.04)',
		border: '1px solid rgba(255,255,255,0.03)',
		color: '#e6eef8',
		padding: '6px 10px',
		borderRadius: 8,
		cursor: 'pointer',
		fontWeight: 800
	},

	deployPanel: { padding: '18px 28px', marginTop: 12 },
	form: { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' },
	inputGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
	label: { fontSize: 10, color: '#94a3b8', fontWeight: 700 },
	input: {
		background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
		border: '1px solid rgba(255,255,255,0.03)', color:'#e6eef8',
		padding: '8px 10px', borderRadius: 8, fontSize: 13, outline: 'none', minWidth: 140
	},
	submitBtn: {
		background: 'linear-gradient(90deg,#60a5fa,#3b82f6)', color:'#021124', border:'none', padding:'10px 16px',
		borderRadius: 10, cursor:'pointer', fontWeight:800, display:'flex', gap:8, alignItems:'center'
	},

	main: { padding: '22px 28px' },
	tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
	tableTitle: { fontSize: 16, fontWeight: 800, display: 'flex', gap: 8, alignItems: 'center' },
	subtitleSm: { fontSize: 12, color: '#9aa6bf' },
	badge: { background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: 20, fontSize: 12, color: '#60a5fa', border: '1px solid rgba(96,165,250,0.12)' },

	tableScroll: { background: 'linear-gradient(180deg,#071026, #051226)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)', overflow: 'hidden' },
	table: { width: '100%', borderCollapse: 'collapse' },
	thRow: { background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.03)' },
	th: { padding: '16px 20px', textAlign: 'left', fontSize: 12, color: '#9fb0d6', textTransform: 'uppercase' },
	tr: { borderBottom: '1px solid rgba(255,255,255,0.02)' },
	td: { padding: '14px 20px', verticalAlign: 'middle' },
	bold: { fontWeight: '800', color: '#eef6ff' },
	sub: { fontSize: 12, color: '#98a7bf' },
	status: { fontWeight: 800, fontSize: 13 },
	actionCell: { display: 'flex', gap: 10, justifyContent: 'flex-end' },

	delayBtn: {
		background: 'linear-gradient(90deg, rgba(251,191,36,0.12), rgba(251,191,36,0.06))',
		border: '1px solid rgba(251,191,36,0.28)', color: '#fbbf24',
		padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 800, display:'flex', gap:8, alignItems:'center'
	},
	cancelBtn: {
		background: 'linear-gradient(90deg, rgba(251,113,113,0.08), rgba(251,113,113,0.04))',
		border: '1px solid rgba(251,113,113,0.22)', color: '#fb7185',
		padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 800, display:'flex', gap:8, alignItems:'center'
	}
};

// compute minutes from "HH:MM"
const toMinutes = (t?: string) => {
	if (!t) return null;
	const m = t.split(":").map(Number);
	if (m.length !== 2 || Number.isNaN(m[0]) || Number.isNaN(m[1])) return null;
	return m[0] * 60 + m[1];
};

// format minutes back to "HH:MM"
const minutesToHHMM = (mins: number) => {
	mins = ((mins % (24 * 60)) + 24 * 60) % (24 * 60);
	const h = Math.floor(mins / 60).toString().padStart(2, "0");
	const m = (mins % 60).toString().padStart(2, "0");
	return `${h}:${m}`;
};

// add duration (HH:MM) to a base time (HH:MM)
const addDuration = (base: string | undefined, duration: string) => {
	const baseM = toMinutes(base) ?? 0;
	const durM = toMinutes(duration);
	if (durM === null) return null;
	return minutesToHHMM(baseM + durM);
};

// human readable delay from minutes
const humanDelay = (mins: number) => {
	if (mins <= 0) return "0m";
	const h = Math.floor(mins / 60);
	const m = mins % 60;
	return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
};