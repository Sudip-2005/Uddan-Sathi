import * as React from "react";
import { getFlights } from "../userpanel/services/api";
import { ShieldAlert, User, Coffee, Home } from "lucide-react";

export default function AffectedManifest() {
  const [affected, setAffected] = React.useState<any[]>([]);

  React.useEffect(() => {
    getFlights("DEL").then(res => {
      const all = Object.entries(res.data).map(([id, d]: any) => ({ id, ...d }));
      setAffected(all.filter(f => f.status === 'Cancelled' || f.status === 'Delayed'));
    });
  }, []);

  return (
    <div style={{animation: 'fadeIn 0.5s'}}>
      <h2 style={{color: '#f43f5e', fontSize: '14px', marginBottom: '20px'}}><ShieldAlert size={16}/> DISASTER MODE: PASSENGER PRIORITY LIST</h2>
      
      {affected.map(f => (
        <div key={f.id} style={{border: '1px solid #f43f5e33', borderRadius: '12px', padding: '15px', marginBottom: '15px'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom: '10px'}}>
            <span style={{color:'#fff', fontWeight:'bold'}}>{f.id} — {f.status.toUpperCase()}</span>
            <span style={{fontSize:'10px'}}>IMPACT: {Object.keys(f.passengers || {}).length} PASSENGERS</span>
          </div>
          
          <div style={{display:'grid', gap:'10px'}}>
            {Object.entries(f.passengers || {}).map(([id, p]: any) => (
              <div key={id} style={paxStyles.item}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <User size={14} color="#3b82f6" />
                  <span>{p.name}</span>
                </div>
                <div style={{display:'flex', gap:'10px'}}>
                  <button style={paxStyles.toolBtn} title="Book Hotel"><Home size={12}/> HOTEL</button>
                  <button style={paxStyles.toolBtn} title="Meal Voucher"><Coffee size={12}/> MEAL</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const paxStyles = {
  item: { background: '#020617', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', alignItems: 'center' },
  toolBtn: { background: '#1e293b', border: 'none', color: '#94a3b8', padding: '6px', borderRadius: '4px', cursor: 'pointer' }
};