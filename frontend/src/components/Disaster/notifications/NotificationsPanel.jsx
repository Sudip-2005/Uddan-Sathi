import React, { useEffect, useState } from 'react';
import NotificationCard from './NotificationCard';

function NotificationsPanel({ pnr }) {
	const [notifications, setNotifications] = useState(null);

	useEffect(() => {
		if (!pnr) {
			setNotifications([]);
			return;
		}

		let cancelled = false;

		async function fetchNotifications() {
			try {
				const res = await fetch(`/notifications/${encodeURIComponent(pnr)}`);
				if (!res.ok) throw new Error('Network response was not ok');
				const data = await res.json();
				if (!cancelled) setNotifications(Array.isArray(data) ? data : []);
			} catch (err) {
				if (!cancelled) setNotifications([]);
			}
		}

		fetchNotifications();

		return () => {
			cancelled = true;
		};
	}, [pnr]);

	if (notifications === null) return null;

	if (notifications.length === 0) return <div>No notifications</div>;

	return (
		<div>
			{notifications.map((n, idx) => (
				<NotificationCard
					key={n.id || n._id || n.timestamp || idx}
					notification={n}
				/>
			))}
		</div>
	);
}

export default NotificationsPanel;

