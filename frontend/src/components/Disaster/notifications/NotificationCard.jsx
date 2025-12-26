import React from 'react';

function NotificationCard({ notification }) {
	const message = notification.message || notification.text || notification.title || 'No message';
	const flightId = notification.flightId || notification.flight || '—';
	const type = notification.type || notification.notificationType || 'UNKNOWN';
	const createdRaw = notification.created || notification.createdAt || notification.timestamp;
	const created = createdRaw ? new Date(createdRaw).toLocaleString() : 'Unknown time';

	const isCancelled = String(type).toUpperCase() === 'CANCELLED';

	const baseClass = isCancelled
		? 'bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded mb-3'
		: 'bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded mb-3 shadow-sm';

	return (
		<div className={baseClass} role={isCancelled ? 'alert' : 'region'}>
			<div className="mb-1 font-semibold">{message}</div>
			<div className="text-sm text-gray-600">Flight: {flightId}</div>
			<div className="text-sm text-gray-600">Type: {type}</div>
			<div className="text-sm text-gray-500">Created: {created}</div>
		</div>
	);
}

export default NotificationCard;

