import React, { useState } from 'react';
import { 
  GitMerge, 
  Calendar, 
  ShieldAlert, 
  ArrowRight, 
  Send, 
  Bell, 
  CheckCircle2, 
  FileCheck, 
  Sparkles,
  Layers,
  Building,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DELIMITATION_EPOCHS, MYSURU_OFFICES, MYSURU_POLYGONS } from '../data/mysuruJurisdictions.js';
import { sounds } from '../services/soundEffects.js';

export function DelimitationStudio({
  activeEpoch,
  onSelectEpoch,
  activeGazetteChanges,
  onExecuteGazetteShift,
  migrationAuditLogs,
  citizenNotifications,
  inFlightComplaintsCount,
  lang = 'en',
  t
}) {
  const [selectedArea, setSelectedArea] = useState('BOGADI_TP');
  const [targetOffice, setTargetOffice] = useState('MCC_ZONE_3');
  const [gazetteNo, setGazetteNo] = useState('GO-UDD/142/MLR/2025');
  const [handoverPhase, setHandoverPhase] = useState('Phase 2 - Civil Sanitation & Streetlights Cutover');
  const [isExecuting, setIsExecuting] = useState(false);

  const handlePublishGazette = () => {
    setIsExecuting(true);
    sounds.playBoundaryShift();

    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setTimeout(() => {
      onExecuteGazetteShift({
        annexedAreaId: selectedArea,
        targetOfficeId: targetOffice,
        gazetteNo,
        phase: handoverPhase
      });
      setIsExecuting(false);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Studio Header Card */}
      <div className="glass-card highlight">
        <div className="card-header">
          <div className="card-title-row">
            <h2 className="card-title" style={{ color: '#fbbf24' }}>
              <GitMerge size={24} />
              <span>{t.studioTitle}</span>
            </h2>
            <span style={{
              fontSize: '0.75rem',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontWeight: 800
            }}>
              ⚡️ THE TWIST ENGINE
            </span>
          </div>
          <p className="card-subtitle">{t.studioDesc}</p>
        </div>

        {/* Temporal Epoch Timeline Stepper */}
        <div style={{ margin: '1rem 0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} style={{ color: 'var(--color-mcc)' }} />
            <span>{t.timelineControl}</span>
          </div>

          <div className="timeline-stepper">
            {DELIMITATION_EPOCHS.map((epoch) => {
              const isActive = activeEpoch.id === epoch.id;
              return (
                <button
                  key={epoch.id}
                  className={`timeline-step-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playClick();
                    onSelectEpoch(epoch);
                  }}
                >
                  <span>{epoch.year}</span>
                  <span className="step-subtitle">
                    {lang === 'kn' ? epoch.titleKn : epoch.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Epoch Detailed Overview */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}>
            <strong style={{ color: 'var(--color-mcc)' }}>
              {lang === 'kn' ? activeEpoch.titleKn : activeEpoch.title}:
            </strong>{' '}
            {lang === 'kn' ? activeEpoch.descriptionKn : activeEpoch.description}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Shift Workbench vs Live Migration Stream */}
      <div className="studio-grid">
        {/* Left Column: Gazette Ingestion Workbench */}
        <div className="glass-card">
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: '1.1rem' }}>
              <Layers size={18} style={{ color: 'var(--color-mcc)' }} />
              <span>{t.absorbAreaTitle}</span>
            </h3>
            <p className="card-subtitle">
              {lang === 'kn' 
                ? 'ಪ್ರದೇಶವನ್ನು ಪಾಲಿಕೆಗೆ ವಿಲೀನಗೊಳಿಸಿ ಮತ್ತು ಗಡಿ ನವೀಕರಣವನ್ನು ಪರೀಕ್ಷಿಸಿ' 
                : 'Select an administrative enclave to absorb and trigger instant system re-indexing'}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">{t.selectAreaToAnnex}</label>
            <select
              className="form-select"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="BOGADI_TP">Bogadi Town Panchayat (ಬೋಗಾದಿ ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ)</option>
              <option value="ALANAHALLI_GP">Alanahalli Gram Panchayat (ಆಲನಹಳ್ಳಿ ಗ್ರಾಮ ಪಂಚಾಯಿತಿ)</option>
              <option value="SRIRAMPURA_TP">Srirampura Town Panchayat (ಶ್ರೀರಾಮಪುರ ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ)</option>
              <option value="HOOTAGALLI_TMC">Hootagalli TMC (ಹೂಟಗಳ್ಳಿ ನಗರ ಸಭೆ)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t.selectTargetAuthority}</label>
            <select
              className="form-select"
              value={targetOffice}
              onChange={(e) => setTargetOffice(e.target.value)}
            >
              <option value="MCC_ZONE_3">Mysuru City Corporation - Zone 3 (Kuvempunagar)</option>
              <option value="MCC_ZONE_7">Mysuru City Corporation - Zone 7 (Vidyaranyapuram)</option>
              <option value="MCC_ZONE_9">Mysuru City Corporation - Zone 9 (Vijayanagar / Hebbal)</option>
              <option value="MCC_HQ">Mysuru City Corporation - Central Headquarters</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Government Order / Gazette Notification ID</label>
            <input
              type="text"
              className="form-input"
              value={gazetteNo}
              onChange={(e) => setGazetteNo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Handover Phase / Transition Protocol</label>
            <input
              type="text"
              className="form-input"
              value={handoverPhase}
              onChange={(e) => setHandoverPhase(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)', 
              color: '#fff',
              marginTop: '0.5rem'
            }}
            onClick={handlePublishGazette}
            disabled={isExecuting}
          >
            {isExecuting ? (
              <RefreshCw size={18} className="spin" />
            ) : (
              <Sparkles size={18} />
            )}
            <span>{t.applyAnnexationBtn}</span>
          </button>

          {/* Active Gazette List */}
          {activeGazetteChanges.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                ACTIVE CUSTOM GAZETTE ORDERS ({activeGazetteChanges.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {activeGazetteChanges.map((g) => (
                  <div key={g.id} style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid #fbbf24' }}>
                    <strong style={{ color: '#fbbf24' }}>{g.gazetteNo}:</strong> {g.areaId} &rarr; {g.newOfficeName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Automated Cascade Migration & Citizen SMS Alerts */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title-row">
              <h3 className="card-title" style={{ fontSize: '1.1rem' }}>
                <Send size={18} style={{ color: 'var(--color-mcc)' }} />
                <span>{t.cascadeMigrationTitle}</span>
              </h3>
            </div>
            <p className="card-subtitle">
              {lang === 'kn'
                ? 'ಗಡಿ ಬದಲಾದಾಗ ಚಾಲ್ತಿಯಲ್ಲಿರುವ ದೂರುಗಳು ಕಳೆದುಹೋಗದಂತೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮರು-ವರ್ಗಾವಣೆಯಾಗುತ್ತವೆ'
                : 'In-flight grievances are hot-reassigned with full provenance audit and citizen dispatch'}
            </p>
          </div>

          {/* Audit Logs Stream */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{t.migrationLogsTitle}</span>
              <span style={{ color: 'var(--color-mcc)' }}>
                {migrationAuditLogs.length} Re-assignments
              </span>
            </div>

            <div className="stream-list">
              {migrationAuditLogs.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
                  No boundary shifts executed in current session yet. Click the button on the left to simulate a Gazette annexation!
                </div>
              ) : (
                migrationAuditLogs.map((log, i) => (
                  <div key={i} className="stream-item">
                    <div className="stream-item-header">
                      <span className="stream-badge transfer">REASSIGNED</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      Ticket #{log.ticketId}: {log.title}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem' }}>
                      <span style={{ color: '#ef4444' }}>{log.from}</span>
                      <ArrowRight size={12} />
                      <span style={{ color: '#34d399', fontWeight: 600 }}>{log.to}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Simulated Citizen SMS / WhatsApp Alerts */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Bell size={13} style={{ color: '#34d399' }} />
              <span>{t.notificationSimulationTitle}</span>
            </div>

            <div className="stream-list">
              {citizenNotifications.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                  Citizen notifications will appear here when complaints are migrated across authorities.
                </div>
              ) : (
                citizenNotifications.map((notif, i) => (
                  <div key={i} style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.7rem', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#34d399', fontWeight: 700 }}>
                      <span>SMS Dispatch &rarr; {notif.phone}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{notif.timestamp}</span>
                    </div>
                    <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                      {notif.message}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
