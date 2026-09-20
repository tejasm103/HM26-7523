import React from 'react';
import { 
  Compass, 
  Globe, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  GitMerge
} from 'lucide-react';
import { sounds } from '../services/soundEffects.js';
import mysuruCityImage from '../assets/mysuru-city.svg';

export function Header({ 
  lang, 
  onToggleLang, 
  theme, 
  onToggleTheme, 
  activeEpoch, 
  soundMuted, 
  onToggleSound,
  t 
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand Section */}
        <div className="brand-section" onClick={() => sounds.playClick()}>
          <div className="brand-crest">
            <img
              src={mysuruCityImage}
              alt={lang === 'kn' ? 'ಮೈಸೂರು ನಗರ ನೋಟ' : 'Mysuru city view'}
            />
          </div>
          <div className="brand-text">
            <h1>
              {lang === 'kn' ? 'ಮೈಸೂರು ಸಿವಿಕ್‌ರೂಟ್ AI' : 'Mysuru CivicRoute AI'}
              <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(0,240,255,0.15)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '9999px', color: '#00f0ff', letterSpacing: '0.05em' }}>
                v2.5
              </span>
            </h1>
            <p>{lang === 'kn' ? 'ಸ್ವಾಯತ್ತ ದೂರು ವರ್ಗಾವಣೆ & ಗಡಿ ಪುನರ್‌ವಿಂಗಡಣಾ ವ್ಯವಸ್ಥೆ' : 'Autonomous Complaint Routing & Delimitation Engine'}</p>
          </div>
        </div>

        {/* Center Delimitation Epoch Badge */}
        <div className="epoch-pill" title={activeEpoch.description}>
          <span className="epoch-pulse" />
          <GitMerge size={15} style={{ color: '#00f0ff' }} />
          <span>
            {lang === 'kn' ? activeEpoch.titleKn : activeEpoch.title} ({activeEpoch.year})
          </span>
        </div>

        {/* Right Action Controls */}
        <div className="header-controls">
          {/* Audio Sound FX Toggle */}
          <button 
            className="btn-icon" 
            onClick={() => {
              onToggleSound();
              sounds.playClick();
            }}
            title={soundMuted ? t.soundOff : t.soundOn}
            aria-label="Toggle Sound Effects"
          >
            {soundMuted ? <VolumeX size={18} /> : <Volume2 size={18} style={{ color: '#00f0ff' }} />}
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button 
            className="btn-icon" 
            onClick={() => {
              onToggleTheme();
              sounds.playClick();
            }}
            title={theme === 'dark' ? t.themeLight : t.themeDark}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Kannada / English Toggle */}
          <button 
            className="lang-toggle-btn" 
            onClick={() => {
              onToggleLang();
              sounds.playClick();
            }}
            aria-label="Toggle Language"
          >
            <Globe size={15} />
            <span>{lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
