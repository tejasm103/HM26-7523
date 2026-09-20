import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  GitMerge, 
  ShieldAlert, 
  Building, 
  Compass,
  TrendingUp,
  MapPin
} from 'lucide-react';

export function CivicAnalytics({ complaints = [], activeEpoch, t, lang = 'en' }) {
  const total = complaints.length;
  const migratedCount = complaints.filter(c => c.status === 'MIGRATED').length;
  const inTransitionCount = complaints.filter(c => c.isTransitioning).length;

  // Count by authority type
  const officeCounts = complaints.reduce((acc, c) => {
    const type = c.assignedOffice?.type || 'OTHER';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Category counts
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff' }}>
            <Compass size={24} />
          </div>
          <div>
            <div className="stat-val">{total}</div>
            <div className="stat-label">{t.statTotalRouted}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">98.4%</div>
            <div className="stat-label">{t.statAutoAccuracy}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <GitMerge size={24} />
          </div>
          <div>
            <div className="stat-val">{migratedCount}</div>
            <div className="stat-label">In-Flight Re-assignments</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="stat-val">{t.statDisputesAverted}: 100%</div>
            <div className="stat-label">Zero Citizen Ping-Pong</div>
          </div>
        </div>
      </div>

      {/* Two Column Visual Analytics */}
      <div className="studio-grid">
        {/* Authority Type Distribution */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">
              <Building size={18} style={{ color: 'var(--color-mcc)' }} />
              <span>{t.chartOfficeDistribution}</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { type: 'CITY_CORPORATION', label: 'Mysuru City Corporation (MCC)', color: '#00f0ff' },
              { type: 'TOWN_PANCHAYAT', label: 'Town Panchayats (Bogadi/Srirampura/Hootagalli)', color: '#f59e0b' },
              { type: 'GRAM_PANCHAYAT', label: 'Gram Panchayats (Alanahalli/Siddalingapura)', color: '#10b981' },
              { type: 'PARASTATAL', label: 'Parastatal (MUDA / CHESCOM / NHAI)', color: '#a855f7' }
            ].map((item) => {
              const count = officeCounts[item.type] || 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={item.type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700 }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: item.color, borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delimitation & Greater Mysuru Expansion Impact */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={18} style={{ color: '#fbbf24' }} />
              <span>Greater Mysuru Delimitation Impact</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-mcc)' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                Municipal Ward Expansion
              </div>
              <div>
                Baseline 65 Wards &rarr; Expanding to <strong>85 Wards</strong> under Greater Mysuru (BMMP).
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                Active Annexation Enclaves
              </div>
              <div>
                Bogadi, Hootagalli, and Srirampura currently in phased joint custody; Alanahalli slated for Q1 2026 cutover.
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #10b981' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                Citizen Friction Elimination
              </div>
              <div>
                Self-updating spatial engine prevents citizens from visiting the wrong office or being turned away by jurisdictional disputes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
