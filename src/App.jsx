import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  GitMerge, 
  FileText, 
  BarChart3, 
  AlertCircle 
} from 'lucide-react';
import { Header } from './components/Header.jsx';
import { MysuruMap } from './components/MysuruMap.jsx';
import { ComplaintForm } from './components/ComplaintForm.jsx';
import { RoutingDocket } from './components/RoutingDocket.jsx';
import { DelimitationStudio } from './components/DelimitationStudio.jsx';
import { GrievanceLedger } from './components/GrievanceLedger.jsx';
import { CivicAnalytics } from './components/CivicAnalytics.jsx';

import { DELIMITATION_EPOCHS } from './data/mysuruJurisdictions.js';
import { PRESET_COMPLAINTS } from './data/presetComplaints.js';
import { TRANSLATIONS } from './services/translations.js';
import { routeComplaint } from './services/routingEngine.js';
import { executeGazetteShift } from './services/delimitationEngine.js';
import { sounds } from './services/soundEffects.js';

export function App() {
  // Navigation & Preferences
  const [activeTab, setActiveTab] = useState('ROUTING');
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [soundMuted, setSoundMuted] = useState(false);

  // Delimitation & Boundary State (The Twist!)
  const [activeEpoch, setActiveEpoch] = useState(DELIMITATION_EPOCHS[1]); // Default to 2025 Current Transition
  const [activeGazetteChanges, setActiveGazetteChanges] = useState([]);
  const [migrationAuditLogs, setMigrationAuditLogs] = useState([]);
  const [citizenNotifications, setCitizenNotifications] = useState([]);

  // Map & Form Coordinates State
  const [selectedCoordinates, setSelectedCoordinates] = useState({ lng: 76.608, lat: 12.302 });
  const [selectedLocationName, setSelectedLocationName] = useState('Bogadi 2nd Stage, Ring Road Junction');

  const handleMapLocationSelect = (coordinates) => {
    const nearestLandmark = PRESET_COMPLAINTS.reduce((nearest, preset) => {
      const distance = Math.hypot(
        (preset.coordinates.lng - coordinates.lng) * Math.cos(coordinates.lat * Math.PI / 180),
        preset.coordinates.lat - coordinates.lat
      );
      return distance < nearest.distance ? { preset, distance } : nearest;
    }, { preset: PRESET_COMPLAINTS[0], distance: Number.POSITIVE_INFINITY });

    setSelectedCoordinates(coordinates);
    setSelectedLocationName(
      `${nearestLandmark.preset.locationName} | Landmark: ${nearestLandmark.preset.landmark}`
    );
  };

  // Complaints State: initialize with pre-routed realistic Mysuru tickets
  const [complaints, setComplaints] = useState(() => {
    return PRESET_COMPLAINTS.map((preset, idx) => {
      const routing = routeComplaint({
        title: preset.title,
        description: preset.description,
        category: preset.category,
        locationName: preset.locationName,
        coordinates: preset.coordinates,
        pincode: preset.pincode,
        activeEpoch: DELIMITATION_EPOCHS[1],
        activeGazetteChanges: []
      });

      return {
        id: `MYS-${8100 + idx}`,
        title: preset.title,
        titleKn: preset.titleKn,
        description: preset.description,
        category: preset.category,
        locationName: preset.locationName,
        coordinates: preset.coordinates,
        pincode: preset.pincode,
        assignedOffice: routing.office,
        department: routing.department,
        routingMeta: routing,
        status: routing.isTransitioning ? 'MIGRATED' : 'ROUTED',
        isTransitioning: routing.isTransitioning,
        transferHistory: routing.isTransitioning ? [
          {
            transferId: `XFR-INIT-${idx}`,
            timestamp: '09:30 AM',
            previousOffice: preset.expectedOffice2023,
            newOffice: routing.office.name,
            gazetteNo: 'UDD 142 MLR 2024',
            phase: 'Phase 2 Absorption',
            reason: 'Delimitation Handover',
            newNodalOfficer: routing.escalationContact,
            newPhone: routing.escalationPhone
          }
        ] : [],
        createdAt: new Date().toISOString()
      };
    });
  });

  // Current Active Grievance Routing Docket in Citizen View
  const [activeComplaintData, setActiveComplaintData] = useState(null);
  const [activeRoutingResult, setActiveRoutingResult] = useState(() => {
    // Initial routing docket for first preset
    const firstPreset = PRESET_COMPLAINTS[0];
    return routeComplaint({
      title: firstPreset.title,
      description: firstPreset.description,
      category: firstPreset.category,
      locationName: firstPreset.locationName,
      coordinates: firstPreset.coordinates,
      pincode: firstPreset.pincode,
      activeEpoch: DELIMITATION_EPOCHS[1],
      activeGazetteChanges: []
    });
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Apply Theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Handle Complaint Submission from Form
  const handleAnalyzeComplaint = (formData) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const routing = routeComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        locationName: formData.locationName,
        coordinates: formData.coordinates,
        pincode: formData.pincode,
        activeEpoch,
        activeGazetteChanges
      });

      setActiveComplaintData(formData);
      setActiveRoutingResult(routing);
      setIsAnalyzing(false);
    }, 450);
  };

  // Save current active docket to persistent registry
  const handleSaveToLedger = () => {
    if (!activeRoutingResult) return;

    const newTicket = {
      id: `MYS-${Math.floor(8200 + Math.random() * 800)}`,
      title: activeComplaintData?.title || 'Civic Grievance',
      description: activeComplaintData?.description || '',
      category: activeComplaintData?.category || 'CIVIC',
      locationName: activeComplaintData?.locationName || 'Mysuru Locality',
      coordinates: selectedCoordinates,
      pincode: activeComplaintData?.pincode || '570001',
      photo: activeComplaintData?.photo || null,
      assignedOffice: activeRoutingResult.office,
      department: activeRoutingResult.department,
      routingMeta: activeRoutingResult,
      status: activeRoutingResult.isTransitioning ? 'MIGRATED' : 'ROUTED',
      isTransitioning: activeRoutingResult.isTransitioning,
      transferHistory: activeRoutingResult.isTransitioning ? [
        {
          transferId: `XFR-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          previousOffice: activeRoutingResult.transitionMeta?.previousOffice || 'Pre-Annexation Body',
          newOffice: activeRoutingResult.office.name,
          gazetteNo: activeRoutingResult.transitionMeta?.orderNo || 'Gazette 2025',
          phase: activeRoutingResult.transitionMeta?.phase || 'Cutover',
          reason: 'Absorbed under Delimitation',
          newNodalOfficer: activeRoutingResult.escalationContact,
          newPhone: activeRoutingResult.escalationPhone
        }
      ] : [],
      createdAt: new Date().toISOString()
    };

    setComplaints([newTicket, ...complaints]);
    setActiveTab('LEDGER');
  };

  // Handle Timeline Epoch Shift
  const handleSelectEpoch = (epoch) => {
    setActiveEpoch(epoch);

    // Re-route active docket
    if (activeComplaintData) {
      const routing = routeComplaint({
        ...activeComplaintData,
        activeEpoch: epoch,
        activeGazetteChanges
      });
      setActiveRoutingResult(routing);
    }
  };

  // ⚡️ The Twist: Execute Live Gazette Boundary Shift & Cascade Migration
  const handleExecuteGazetteShift = ({ annexedAreaId, targetOfficeId, gazetteNo, phase }) => {
    const result = executeGazetteShift({
      existingComplaints: complaints,
      annexedAreaId,
      targetOfficeId,
      gazetteNo,
      phase,
      activeEpoch,
      activeGazetteChanges
    });

    setComplaints(result.updatedComplaints);
    setActiveGazetteChanges(result.updatedGazetteChanges);
    setMigrationAuditLogs([...result.migrationLogs, ...migrationAuditLogs]);
    setCitizenNotifications([...result.citizenNotifications, ...citizenNotifications]);

    // Also update active docket if affected
    if (activeComplaintData) {
      const routing = routeComplaint({
        ...activeComplaintData,
        activeEpoch,
        activeGazetteChanges: result.updatedGazetteChanges
      });
      setActiveRoutingResult(routing);
    }
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <Header
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'kn' : 'en')}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        activeEpoch={activeEpoch}
        soundMuted={soundMuted}
        onToggleSound={() => setSoundMuted(sounds.toggleMute())}
        t={t}
      />

      {/* Nav Tabs Bar */}
      <nav className="nav-tabs-bar">
        <div className="nav-tabs-inner">
          <button
            className={`tab-btn ${activeTab === 'ROUTING' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setActiveTab('ROUTING');
            }}
          >
            <Compass size={17} />
            <span>{t.navRouting}</span>
          </button>

          <button
            className={`tab-btn twist-tab ${activeTab === 'TWIST' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setActiveTab('TWIST');
            }}
          >
            <GitMerge size={17} />
            <span>{t.navTwist}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'LEDGER' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setActiveTab('LEDGER');
            }}
          >
            <FileText size={17} />
            <span>{t.navLedger}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'ANALYTICS' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setActiveTab('ANALYTICS');
            }}
          >
            <BarChart3 size={17} />
            <span>{t.navAnalytics}</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'ROUTING' && (
          <div className="router-layout-grid">
            {/* Left Column: Complaint Form & Preset Hotspots */}
            <ComplaintForm
              onSubmitComplaint={handleAnalyzeComplaint}
              selectedCoordinates={selectedCoordinates}
              onCoordinatesChange={handleMapLocationSelect}
              mapLocationName={selectedLocationName}
              isAnalyzing={isAnalyzing}
              lang={lang}
              t={t}
            />

            {/* Right Column: Interactive Map & Autonomous Docket */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card">
                <MysuruMap
                  selectedPoint={selectedCoordinates}
                  onSelectPoint={handleMapLocationSelect}
                  activeEpoch={activeEpoch}
                  activeGazetteChanges={activeGazetteChanges}
                  lang={lang}
                />
              </div>

              {activeRoutingResult && (
                <RoutingDocket
                  routingResult={activeRoutingResult}
                  complaintData={activeComplaintData || PRESET_COMPLAINTS[0]}
                  onSaveToLedger={handleSaveToLedger}
                  onReset={() => {
                    setActiveComplaintData(null);
                    handleMapLocationSelect({ lng: 76.620, lat: 12.315 });
                  }}
                  lang={lang}
                  t={t}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'TWIST' && (
          <DelimitationStudio
            activeEpoch={activeEpoch}
            onSelectEpoch={handleSelectEpoch}
            activeGazetteChanges={activeGazetteChanges}
            onExecuteGazetteShift={handleExecuteGazetteShift}
            migrationAuditLogs={migrationAuditLogs}
            citizenNotifications={citizenNotifications}
            inFlightComplaintsCount={complaints.filter(c => c.status !== 'RESOLVED').length}
            lang={lang}
            t={t}
          />
        )}

        {activeTab === 'LEDGER' && (
          <GrievanceLedger
            complaints={complaints}
            lang={lang}
            t={t}
          />
        )}

        {activeTab === 'ANALYTICS' && (
          <CivicAnalytics
            complaints={complaints}
            activeEpoch={activeEpoch}
            lang={lang}
            t={t}
          />
        )}
      </main>
    </div>
  );
}
export default App;
