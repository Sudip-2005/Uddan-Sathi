import React from 'react';

export default function AssistancePanel({ flight }) {
	const handleClaimRefund = () => {
		window.alert('Refund claim initiated — follow up in Support inbox.');
	};

	const handleDownloadVoucher = () => {
		// placeholder: would trigger a backend call to generate voucher
		window.alert('Hotel voucher downloaded (placeholder).');
	};

	return (
		<div className="flex flex-col sm:flex-row gap-3">
			<button onClick={handleClaimRefund} className="w-full sm:w-auto px-4 py-2 rounded-md bg-rose-600 text-white font-semibold">Claim Refund</button>
			<button onClick={handleDownloadVoucher} className="w-full sm:w-auto px-4 py-2 rounded-md border border-rose-600 text-rose-600 font-semibold">Download Hotel Voucher</button>
		</div>
	);
}
