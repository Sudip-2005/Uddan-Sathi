import React from 'react';
import FlightSearchForm from '../../components/flight/FlightSearchForm';
import DisasterModePage from './DisasterModePage';
import FlightCard from '../../components/flight/FlightCard';
import useFlights from '../../hooks/useFlights';

const SearchFlightsPage = () => {
  const { flights, loading } = useFlights();
  const disasterList = Array.isArray(flights)
    ? flights.filter(f => f.status === 'Cancelled' || f.status === 'Diverted')
    : [];

  return (
    <div className="fade-in">
      <div style={styles.header}>
        <h1 style={styles.title}>Flight Tracker Pro</h1>
        <p style={styles.subtitle}>Check live arrival and departure status across all domestic airlines.</p>
      </div>

      {disasterList.length > 0 && <DisasterModePage flights={disasterList} />}

      <FlightSearchForm />

      <div style={styles.resultsGrid}>
        <div style={styles.listSection}>
          <h3 style={styles.label}>Live Network Results</h3>
          {loading ? <div>Synchronizing...</div> : 
            flights.map(f => <FlightCard key={f.id} flight={f} />)
          }
        </div>
        
        <aside style={styles.sideInfo}>
          <div style={styles.promoCard}>
            <h4>Airline Partners</h4>
            <div className="airline-chip">Air India</div>
            <div className="airline-chip">IndiGo</div>
            <div className="airline-chip">SpiceJet</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', color: '#1E293B', fontWeight: '800' },
  subtitle: { color: '#64748B', fontSize: '14px' },
  resultsGrid: { display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', marginTop: '30px' },
  listSection: { display: 'flex', flexDirection: 'column', gap: '16px' },
  sideInfo: { background: '#FFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', height: 'fit-content' }
};

export default SearchFlightsPage;