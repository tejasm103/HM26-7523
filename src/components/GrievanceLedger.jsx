import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  Building, 
  MapPin, 
  History, 
  X, 
  ShieldAlert,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { sounds } from '../services/soundEffects.js';

export function GrievanceLedger({ complaints = [], lang = 'en', t }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inspectedComplaint, setInspectedComplaint] = useState(null);

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assignedOffice?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="glass-card">
      <div className="card-header">
        <div className="card-title-row">
          <h2 className="card-title">
            <FileText size={22} style={{ color: 'var(--color-mcc)' }} />
            <span>{t.ledgerTitle}</span>
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {filteredComplaints.length} Records
          </span>
        </div>
        <p className="card-subtitle">{t.ledgerDesc}</p>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">{t.filterAll}</option>
            <option value="ROUTED">{t.filterRouted}</option>
            <option value="MIGRATED">{t.filterMigrated}</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints Ledger Table */}
      <div className="ledger-table-container">
        <table className="civic-table">
          <thead>
            <tr>
              <th>{t.ticketId}</th>
              <th>{t.summary}</th>
              <th>{t.location}</th>
              <th>{t.office}</th>
              <th>{t.status}</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No complaints found matching criteria.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-mcc)' }}>
                    #{item.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Category: {item.category}
                    </div>
                    {item.photo && (
                      <img src={item.photo.dataUrl} alt="Complaint evidence" style={{ width: 52, height: 38, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginTop: '0.4rem', border: '1px solid var(--border-medium)' }} />
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                      <MapPin size={12} style={{ color: 'var(--color-mcc)' }} />
                      <span>{item.locationName}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: item.assignedOffice?.color || 'var(--text-primary)' }}>
                      {item.assignedOffice?.shortName || item.assignedOffice?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.department}
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${item.status}`}>
                      {item.status === 'MIGRATED' ? '⚡️ MIGRATED' : item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-icon"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      onClick={() => {
                        sounds.playClick();
                        setInspectedComplaint(item);
                      }}
                    >
                      <History size={14} />
                      <span>Audit</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Provenance Audit Modal */}
      {inspectedComplaint && (
        <div className="modal-overlay" onClick={() => setInspectedComplaint(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={20} style={{ color: 'var(--color-mcc)' }} />
                <h3 style={{ fontSize: '1.15rem' }}>Grievance Provenance & Migration Audit</h3>
              </div>
              <button 
                className="btn-icon" 
                onClick={() => setInspectedComplaint(null)}
                style={{ borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TICKET ID</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-mcc)' }}>#{inspectedComplaint.id}</div>
              <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{inspectedComplaint.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{inspectedComplaint.locationName}</div>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              JURISDICTIONAL AUDIT LIFECYCLE:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Initial Creation */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #3b82f6', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '0.2rem' }}>
                  Step 1: Grievance Initially Filed
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  Filed at coordinates [{inspectedComplaint.coordinates?.lng}, {inspectedComplaint.coordinates?.lat}].
                </div>
              </div>

              {/* Transfer Dockets */}
              {inspectedComplaint.transferHistory && inspectedComplaint.transferHistory.length > 0 ? (
                inspectedComplaint.transferHistory.map((hist, i) => (
                  <div key={i} style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #f59e0b', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#fbbf24', display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span>⚡️ Hot-Reassignment via {hist.gazetteNo}</span>
                      <span style={{ fontSize: '0.7rem' }}>{hist.timestamp}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      Transferred from <strong>{hist.previousOffice}</strong> &rarr; <strong>{hist.newOffice}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <strong>Reason:</strong> {hist.reason}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-mcc)', marginTop: '0.2rem' }}>
                      <strong>Nodal Officer:</strong> {hist.newNodalOfficer} ({hist.newPhone})
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem' }}>
                  No boundary migration required yet. Grievance remains under original jurisdiction.
                </div>
              )}

              {/* Current Active Status */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #10b981', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '0.2rem' }}>
                  Current Active Jurisdiction
                </div>
                <div>
                  <strong>{inspectedComplaint.assignedOffice?.name}</strong> ({inspectedComplaint.department})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
