import React, { useEffect, useState } from 'react';

export default function AlternativeFlights({ flight }) {
	const [alternatives, setAlternatives] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let mounted = true;
		async function fetchAlternatives() {
			setLoading(true);
			try {
				// attempt to fetch from backend; if no endpoint exists this will fail silently
				const res = await fetch('http://localhost:5000/alternatives');
				if (!mounted) return;
				if (res.ok) {
					const data = await res.json();
					setAlternatives(Array.isArray(data) ? data : []);
				} else {
					setAlternatives([]);
				}
			} catch (e) {
				setAlternatives([]);
			} finally {
				if (mounted) setLoading(false);
			}
		}

		fetchAlternatives();
		return () => { mounted = false; };
	}, [flight]);

	if (loading) return <div className="text-sm text-slate-500">Loading alternatives...</div>;
	if (!alternatives || alternatives.length === 0) return <div className="text-sm text-slate-500">No rail or bus alternatives found.</div>;

	return (
		<div className="space-y-3">
			{alternatives.map((a, idx) => (
				<div key={idx} className="p-3 border rounded-md">
					<div className="flex justify-between items-center">
						<div>
							<div className="text-sm font-semibold text-slate-900">{a.type} — {a.provider}</div>
							<div className="text-xs text-slate-500">{a.from} → {a.to} · {a.departure}</div>
						</div>
						<div className="text-sm font-medium text-rose-600">{a.price ? `₹ ${a.price}` : ''}</div>
					</div>
				</div>
			))}
		</div>
	);
}
