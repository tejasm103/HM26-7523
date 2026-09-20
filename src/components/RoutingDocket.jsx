import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  Building, 
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../services/soundEffects.js';

export function RoutingDocket({ 
  routingResult, 
  complaintData, 
  onSaveToLedger, 
  onReset,
  lang = 'en',
  t 
}) {
  if (!routingResult) return null;

  const {
    office,
    department,
    departmentKn,
    confidence,
    reasoning,
    reasoningKn,
    slaHours,
    escalationContact,
    escalationPhone,
    isBorderZone,
    borderDistanceMeters,
    isTransitioning,
    transitionMeta
  } = routingResult;

  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="docket-container glass-card highlight">
      {/* Header Banner */}
      <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
        <div className="card-title-row">
          <div className="card-title" style={{ color: 'var(--color-mcc)' }}>
            <Sparkles size={20} />
            <span>{t.officialDocket}</span>
          </div>
          <span style={{ 
            fontSize: '0.72rem', 
            background: 'rgba(16, 185, 129, 0.15)', 
            color: '#34d399', 
            border: '1px solid rgba(16, 185, 129, 0.3)', 
            padding: '0.2rem 0.6rem', 
            borderRadius: '9999px',
            fontWeight: 700
          }}>
            VERIFIED AUTONOMOUS
          </span>
        </div>
        <div className="card-subtitle">
          {lang === 'kn' ? 'ಸ್ಥಳ ಮತ್ತು ವಿಷಯದ ಆಧಾರದ ಮೇಲೆ ಕಚೇರಿ ನಿಗದಿಯಾಗಿದೆ' : 'Routed via Spatial Point-in-Polygon & Gazette Rules'}
        </div>
      </div>

      {/* Office Hero Section */}
      <div 
        className="docket-office-hero"
        style={{ 
          background: `linear-gradient(135deg, ${office.badgeColor}, rgba(15, 23, 42, 0.9))`,
          borderColor: office.boundaryColor 
        }}
      >
        <div className="docket-crest" style={{ background: office.color }}>
          <Building size={28} />
        </div>
        <div className="docket-office-details">
          <div className="docket-office-tier" style={{ color: office.color }}>
            {office.level}
          </div>
          <h3 style={{ color: '#fff' }}>
            {lang === 'kn' ? (office.nameKn || office.name) : office.name}
          </h3>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
            <MapPin size={13} style={{ color: office.color }} />
            <span>{office.address}</span>
          </div>
          <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-mcc)' }}>
            <strong>Department:</strong> {lang === 'kn' ? departmentKn : department}
          </div>
        </div>
      </div>

      {/* Confidence Gauge */}
      <div className="confidence-meter-box">
        <div className="confidence-header">
          <span>{t.confidenceScore}</span>
          <span style={{ color: confidencePercent > 90 ? '#34d399' : '#fbbf24', fontWeight: 800 }}>
            {confidencePercent}%
          </span>
        </div>
        <div className="confidence-bar-track">
          <div 
            className="confidence-bar-fill" 
            style={{ 
              width: `${confidencePercent}%`,
              background: confidencePercent > 90 
                ? 'linear-gradient(90deg, #10b981, #00f0ff)' 
                : 'linear-gradient(90deg, #f59e0b, #eab308)'
            }} 
          />
        </div>
      </div>

      {/* ⚡️ The Twist: Delimitation Transition Notice Banner */}
      {isTransitioning && (
        <div className="transition-banner">
          <div className="transition-banner-title">
            <ShieldAlert size={16} />
            <span>{t.transitionAlertTitle}</span>
          </div>
          <p className="transition-banner-text">
            {transitionMeta ? (
              <>
                <strong>{transitionMeta.title}:</strong> {transitionMeta.phase}. {transitionMeta.orderNo && `(${transitionMeta.orderNo})`}.
                Responsibility is dynamically transitioning to <strong>{office.shortName}</strong>. Joint nodal oversight is enforced.
              </>
            ) : t.transitionAlertDesc}
          </p>
        </div>
      )}

      {/* Border Dispute Buffer Warning */}
      {isBorderZone && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 0.85rem',
          marginBottom: '1rem',
          fontSize: '0.8rem'
        }}>
          <div style={{ color: '#f87171', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <AlertTriangle size={15} />
            <span>{t.borderDisputeTitle}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t.borderDisputeDesc} {borderDistanceMeters && `(Approx ${borderDistanceMeters}m from line)`}.
          </p>
        </div>
      )}

      {/* Jurisdictional Reasoning & Explainability */}
      <div style={{ marginBottom: '1.2rem' }}>
        <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          {t.routingReasoning}
        </h4>
        <ul className="reasoning-list">
          {(lang === 'kn' ? reasoningKn : reasoning).map((point, idx) => (
            <li key={idx} className="reasoning-item">
              <CheckCircle2 size={15} style={{ color: 'var(--color-mcc)', flexShrink: 0, marginTop: '2px' }} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Designated Officer & SLA Bar */}
      <div className="officer-contact-card">
        <div className="officer-info">
          <h4>{escalationContact}</h4>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
            <Phone size={13} style={{ color: 'var(--color-mcc)' }} />
            <span>{escalationPhone}</span>
          </p>
        </div>
        <div className="sla-badge">
          <Clock size={14} />
          <span>SLA: {slaHours} hrs</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <button 
          className="btn-primary" 
          style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', boxShadow: 'none' }}
          onClick={() => {
            sounds.playClick();
            onReset();
          }}
        >
          {t.fileNewComplaint}
        </button>

        <button 
          className="btn-primary"
          onClick={() => {
            sounds.playSuccess();
            onSaveToLedger();
          }}
        >
          <span>{t.viewInLedger}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
