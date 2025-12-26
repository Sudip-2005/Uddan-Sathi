import React from 'react';

export default function EmergencyContacts({ flight }) {
	return (
		<div className="space-y-3">
			<div className="p-3 bg-rose-50 rounded">
				<div className="text-sm font-semibold text-rose-700">Airport Helpline</div>
				<div className="text-xs text-slate-700">+91 1800-UDAN-HELP</div>
			</div>

			<div className="p-3 bg-slate-50 rounded">
				<div className="text-sm font-semibold text-slate-900">Airline Support</div>
				<div className="text-xs text-slate-700">support@udaansathi.example</div>
				<div className="text-xs text-slate-700">+91 22 1234 5678</div>
			</div>

			<div className="p-3 bg-slate-50 rounded">
				<div className="text-sm font-semibold text-slate-900">On-ground Assistance</div>
				<div className="text-xs text-slate-700">Proceed to the airline counter at the airport for immediate help.</div>
			</div>
		</div>
	);
}
