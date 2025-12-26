import { useEffect, useState } from 'react';
import { getFlights } from '../services/api';

// Simple hook to return the user's currently relevant ticket(s).
// It fetches flights and exposes any that are in emergency states.
export default function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchTickets() {
      setLoading(true);
      try {
        const res = await getFlights();
        if (!mounted) return;
        if (res && res.ok) {
          const data = Array.isArray(res.data)
            ? res.data
            : Object.entries(res.data || {}).map(([id, val]) => ({ id, ...val }));

          setTickets(data);
        } else {
          setTickets([]);
        }
      } catch (err) {
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTickets();
    const interval = setInterval(fetchTickets, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // convenience selectors
  const emergencyTickets = tickets.filter((t) =>
    ['Cancelled', 'Terminated', 'Diverted'].includes(t.status)
  );

  const activeTicket = emergencyTickets.length > 0 ? emergencyTickets[0] : null;

  return { tickets, emergencyTickets, activeTicket, loading, error };
}
