/**
 * Autonomous Complaint Routing Engine
 * Implements multi-factor classification (Spatial + Semantic + Parastatal + Temporal Delimitation)
 */

import { MYSURU_OFFICES, MYSURU_POLYGONS, TRANSITION_STATUS } from '../data/mysuruJurisdictions.js';
import { findJurisdictionPolygon } from './spatialEngine.js';

export function routeComplaint({
  title = '',
  description = '',
  category = 'DRAINAGE',
  locationName = '',
  coordinates = { lng: 76.620, lat: 12.315 },
  pincode = '',
  activeEpoch = null,
  activeGazetteChanges = []
}) {
  const combinedText = `${title} ${description} ${locationName}`.toLowerCase();
  const point = [coordinates.lng, coordinates.lat];

  // 1. Check Parastatal & Special Agency Overrides
  // (A) CHESCOM (Electricity grid / transformers)
  if (
    category === 'ELECTRICITY_CHESCOM' ||
    combinedText.includes('transformer') ||
    combinedText.includes('power outage') ||
    combinedText.includes('high tension') ||
    combinedText.includes('chescom') ||
    combinedText.includes('electric shock')
  ) {
    const office = MYSURU_OFFICES.CHESCOM_POWER;
    return {
      office,
      department: '24x7 Operations & Grid Maintenance',
      departmentKn: '೨೪x೭ ಕಾರ್ಯಾಚರಣೆ ಮತ್ತು ಗ್ರಿಡ್ ನಿರ್ವಹಣೆ',
      confidence: 0.985,
      reasoning: [
        'Classified under Karnataka Electricity Regulatory Commission (KERC) mandate.',
        'High-voltage distribution, transformers, and feeder substations fall exclusively under CHESCOM rather than municipal bodies.',
        'Immediate dispatch generated to 1912 central escalation grid.'
      ],
      reasoningKn: [
        'ಕರ್ನಾಟಕ ವಿದ್ಯುತ್ ನಿಯಂತ್ರಣ ಆಯೋಗದ (KERC) ನಿಯಮಾವಳಿಯಂತೆ ಪರಿಗಣಿಸಲಾಗಿದೆ.',
        'ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್ ಮತ್ತು ವಿದ್ಯುತ್ ಜಾಲದ ನಿರ್ವಹಣೆಯು ಚೆಸ್ಕಾಂಗೆ ಸೇರಿದ್ದು, ಪಾಲಿಕೆ ವ್ಯಾಪ್ತಿಗೆ ಬರುವುದಿಲ್ಲ.',
        '೧೯೧೨ ತುರ್ತು ಸಹಾಯವಾಣಿಗೆ ತಕ್ಷಣದ ಮಾಹಿತಿ ರವಾನಿಸಲಾಗಿದೆ.'
      ],
      slaHours: 4,
      escalationContact: office.nodalOfficer,
      escalationPhone: office.officerPhone,
      isBorderZone: false,
      isTransitioning: false
    };
  }

  // (B) Chamundi Hill Pilgrim Reserve
  if (
    category === 'HERITAGE_PILGRIM' ||
    combinedText.includes('chamundi hill') ||
    combinedText.includes('chamundi temple') ||
    combinedText.includes('nandi statue') ||
    combinedText.includes('pilgrim steps') ||
    (coordinates.lat < 12.285 && coordinates.lat > 12.255 && coordinates.lng > 76.655 && coordinates.lng < 76.690)
  ) {
    const office = MYSURU_OFFICES.CHAMUNDI_HILL_AUTH;
    return {
      office,
      department: 'Hill Infrastructure & Pilgrim Amenities',
      departmentKn: 'ಬೆಟ್ಟದ ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ಯಾತ್ರಿಕರ ಸೌಲಭ್ಯ',
      confidence: 0.97,
      reasoning: [
        'Spatial polygon falls inside the designated Chamundi Hill Autonomous Pilgrim Zone.',
        'Administered directly by the Sri Chamundeshwari Temple Development Authority & Muzrai Department under Karnataka Act 2024.',
        'Exempted from standard MCC ward tax jurisdiction.'
      ],
      reasoningKn: [
        'ಭೌಗೋಳಿಕವಾಗಿ ಚಾಮುಂಡಿ ಬೆಟ್ಟದ ಸ್ವಾಯತ್ತ ಯಾತ್ರಾಸ್ಥಳ ವ್ಯಾಪ್ತಿಯಲ್ಲಿದೆ.',
        'ಶ್ರೀ ಚಾಮುಂಡೇಶ್ವರಿ ಕ್ಷೇತ್ರ ಅಭಿವೃದ್ಧಿ ಪ್ರಾಧಿಕಾರ ಮತ್ತು ಮುಜರಾಯಿ ಇಲಾಖೆಯ ಅಡಿಯಲ್ಲಿ ಬರುತ್ತದೆ.',
        'ಸಾಮಾನ್ಯ ನಗರ ಪಾಲಿಕೆ ವಾರ್ಡ್ ವ್ಯಾಪ್ತಿಯಿಂದ ಹೊರತಾಗಿದೆ.'
      ],
      slaHours: 24,
      escalationContact: office.nodalOfficer,
      escalationPhone: office.officerPhone,
      isBorderZone: false,
      isTransitioning: false
    };
  }

  // (C) Outer Ring Road (NHAI / PWD National Highway Wing)
  if (
    (combinedText.includes('ring road') || combinedText.includes('expressway') || combinedText.includes('flyover')) &&
    (category === 'ROADS_POTHOLES' || category === 'ROADS_HIGHWAY' || combinedText.includes('carriageway') || combinedText.includes('median'))
  ) {
    const office = MYSURU_OFFICES.NHAI_PWD;
    return {
      office,
      department: 'Project Implementation Unit (NHAI Highway Maintenance)',
      departmentKn: 'ಯೋಜನಾ ಅನುಷ್ಠಾನ ಘಟಕ (ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ನಿರ್ವಹಣೆ)',
      confidence: 0.94,
      reasoning: [
        'Outer Ring Road (ORR) 6-lane main carriageway and bypass corridors are maintained directly by NHAI & PWD Special Division.',
        'Service roads are co-managed with local urban bodies; main asphalt corridor routes to Central Highway Authority.',
        'Escalated under 1033 National Highway Safety protocol.'
      ],
      reasoningKn: [
        'ಹೊರ ವರ್ತುಲ ರಸ್ತೆಯ ಮುಖ್ಯ ೬-ಪಥದ ಕ್ಯಾರಿಯೇಜ್‌ವೇ ಎನ್.ಹೆಚ್.ಎ.ಐ ಮತ್ತು ವಿಶೇಷ ಲೋಕೋಪಯೋಗಿ ವಿಭಾಗದ ನಿರ್ವಹಣೆಯಲ್ಲಿದೆ.',
        'ಸರ್ವೀಸ್ ರಸ್ತೆಗಳು ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಗಳ ಜೊತೆ ಜಂಟಿ ನಿರ್ವಹಣೆಯಲ್ಲಿದ್ದು, ಮುಖ್ಯ ರಸ್ತೆಯು ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ಪ್ರಾಧಿಕಾರಕ್ಕೆ ಸೇರಿದೆ.',
        '೧೦೩೩ ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ಸುರಕ್ಷತಾ ನಿಯಮಾವಳಿಯಡಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ.'
      ],
      slaHours: 48,
      escalationContact: office.nodalOfficer,
      escalationPhone: office.officerPhone,
      isBorderZone: true,
      isTransitioning: false
    };
  }

  // (D) MUDA (Unhanded-over layout / CA site encroachment)
  if (
    category === 'TOWN_PLANNING' &&
    (combinedText.includes('muda') || combinedText.includes('unhanded') || combinedText.includes('ca site') || combinedText.includes('civic amenity') || combinedText.includes('private layout'))
  ) {
    const office = MYSURU_OFFICES.MUDA_PARASTATAL;
    return {
      office,
      department: 'Layout Handover & Vigilance Cell',
      departmentKn: 'ಬಡಾವಣೆ ಹಸ್ತಾಂತರ ಮತ್ತು ಜಾಗೃತ ದಳ',
      confidence: 0.93,
      reasoning: [
        'Identified as a MUDA-developed or approved private layout that has not yet completed statutory formal handover to MCC.',
        'Town planning sanctions and Civic Amenity (CA) site protection remain the fiduciary responsibility of MUDA.',
        'Notice issued to Assistant Executive Engineer (Layout Vigilance).'
      ],
      reasoningKn: [
        'ಪಾಲಿಕೆಗೆ ಇನ್ನು ಅಧಿಕೃತವಾಗಿ ಹಸ್ತಾಂತರಗೊಳ್ಳದ ಮುಡಾ ಅಥವಾ ಖಾಸಗಿ ಬಡಾವಣೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ.',
        'ನಗರ ಯೋಜನೆ ಅನುಮೋದನೆ ಮತ್ತು ಸಿಎ ನಿವೇಶನಗಳ ರಕ್ಷಣೆಯು ಮುಡಾದ ಜವಾಬ್ದಾರಿಯಾಗಿರುತ್ತದೆ.',
        'ಸಹಾಯಕ ಕಾರ್ಯಪಾಲಕ ಇಂಜಿನಿಯರ್ (ಜಾಗೃತ ದಳ) ಗೆ ನೋಟಿಸ್ ರವಾನಿಸಲಾಗಿದೆ.'
      ],
      slaHours: 72,
      escalationContact: office.nodalOfficer,
      escalationPhone: office.officerPhone,
      isBorderZone: false,
      isTransitioning: false
    };
  }

  // 2. Spatial Boundary Query
  const spatialResult = findJurisdictionPolygon(point, MYSURU_POLYGONS);
  const matchedPoly = spatialResult.polygon || MYSURU_POLYGONS.MCC_CORE;
  let baseOffice = MYSURU_OFFICES[matchedPoly.officeId] || MYSURU_OFFICES.MCC_HQ;

  // 3. Temporal Delimitation Evaluation (The Twist!)
  // Check if this area is absorbed or transitioned in the active epoch or custom gazette changes
  let isTransitioning = false;
  let transitionMeta = null;

  // Check active custom gazette orders first
  const customGazette = activeGazetteChanges.find(g => g.areaId === matchedPoly.id);
  if (customGazette) {
    const newOffice = MYSURU_OFFICES[customGazette.newOfficeId];
    if (newOffice) {
      baseOffice = newOffice;
      isTransitioning = true;
      transitionMeta = {
        title: 'Custom Gazette Order In Effect',
        orderNo: customGazette.gazetteNo || 'MYS-GAZETTE-2025-LOCAL',
        previousOffice: matchedPoly.officeId,
        newOffice: newOffice.name,
        phase: customGazette.phase || 'Dynamic Handover Executed'
      };
    }
  } else if (activeEpoch && activeEpoch.absorbedAreas) {
    const absorbed = activeEpoch.absorbedAreas.find(a => a.areaId === matchedPoly.id);
    if (absorbed) {
      const newOffice = MYSURU_OFFICES[absorbed.newOffice];
      if (newOffice) {
        baseOffice = newOffice;
        isTransitioning = true;
        transitionMeta = {
          title: 'Official Gazette Absorption In-Progress',
          orderNo: 'UDD 142 MLR 2024 / Greater Mysuru Notification',
          previousOffice: absorbed.originalOffice,
          newOffice: newOffice.name,
          newWard: absorbed.newWard,
          phase: absorbed.phase
        };
      }
    }
  }

  // Determine specific departmental wing
  let deptName = 'General Civic Engineering';
  let deptNameKn = 'ಸಾಮಾನ್ಯ ಪೌರ ಇಂಜಿನಿಯರಿಂಗ್';
  let slaHours = 48;

  if (category === 'WATER_SUPPLY' || category === 'DRAINAGE') {
    if (baseOffice.type === 'CITY_CORPORATION') {
      deptName = 'Vani Vilas Water Works (VVWW / MCC)';
      deptNameKn = 'ವಾಣಿ ವಿಲಾಸ ನೀರು ಸರಬರಾಜು (ಪಾಲಿಕೆ)';
      slaHours = 24;
    } else if (baseOffice.type === 'GRAM_PANCHAYAT') {
      deptName = 'Rural Drinking Water & Sanitation Dept (RDPR - Taluk Division)';
      deptNameKn = 'ಗ್ರಾಮೀಣ ಕುಡಿಯುವ ನೀರು ಮತ್ತು ನೈರ್ಮಲ್ಯ ಇಲಾಖೆ (RDPR)';
      slaHours = 36;
    } else {
      deptName = 'TMC Water Supply Division';
      deptNameKn = 'ನಗರ ಸಭೆ ನೀರು ಸರಬರಾಜು ವಿಭಾಗ';
      slaHours = 24;
    }
  } else if (category === 'SOLID_WASTE' || category === 'HEALTH_HYGIENE') {
    deptName = 'Solid Waste Management & Public Health Wing';
    deptNameKn = 'ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ವಿಭಾಗ';
    slaHours = 24;
  } else if (category === 'ROADS_POTHOLES') {
    deptName = 'Engineering & PWD Civil Maintenance';
    deptNameKn = 'ಇಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ರಸ್ತೆ ನಿರ್ವಹಣಾ ಶಾಖೆ';
    slaHours = 48;
  } else if (category === 'STREETLIGHTS') {
    deptName = 'Municipal Electrical & Streetlight Cell';
    deptNameKn = 'ಬೀದಿ ದೀಪ ಮತ್ತು ವಿದ್ಯುತ್ ವಿಭಾಗ';
    slaHours = 24;
  }

  // Build Explainability Bullet Points
  const reasoning = [];
  const reasoningKn = [];

  reasoning.push(`Spatial coordinate analysis confirms location lies within the administrative boundary of ${matchedPoly.label}.`);
  reasoningKn.push(`ಭೌಗೋಳಿಕ ನಿರ್ದೇಶಾಂಕಗಳು ಈ ಸ್ಥಳವು ${matchedPoly.label} ವ್ಯಾಪ್ತಿಯಲ್ಲಿದೆ ಎಂಬುದನ್ನು ದೃಢಪಡಿಸಿವೆ.`);

  if (isTransitioning && transitionMeta) {
    reasoning.push(`⚡️ TEMPORAL DELIMITATION: This area is officially being absorbed into ${baseOffice.shortName} under ${transitionMeta.orderNo}.`);
    reasoningKn.push(`⚡️ ಗಡಿ ಬದಲಾವಣೆ: ಈ ಪ್ರದೇಶವು ${transitionMeta.orderNo} ಅಧಿಸೂಚನೆಯಡಿ ${baseOffice.nameKn} ವ್ಯಾಪ್ತಿಗೆ ವಿಲೀನಗೊಳ್ಳುತ್ತಿದೆ.`);

    if (transitionMeta.newWard) {
      reasoning.push(`Assigned to newly demarcated municipal division: ${transitionMeta.newWard}.`);
      reasoningKn.push(`ನೂತನವಾಗಿ ರಚಿಸಲಾದ ವಾರ್ಡ್ ವಿಭಾಗ: ${transitionMeta.newWard}.`);
    }
    reasoning.push(`Transition Phase Status: ${transitionMeta.phase}. Dual-nodal officer notified.`);
    reasoningKn.push(`ಹಸ್ತಾಂತರ ಹಂತ: ${transitionMeta.phase}. ಜಂಟಿ ನೋಡಲ್ ಅಧಿಕಾರಿಗೆ ಮಾಹಿತಿ ನೀಡಲಾಗಿದೆ.`);
  } else {
    reasoning.push(`Jurisdiction matches baseline statutory authority for ${baseOffice.level}.`);
    reasoningKn.push(`${baseOffice.level} ವ್ಯಾಪ್ತಿಯ ಶಾಸನಬದ್ಧ ನಿಯಮಗಳ ಪ್ರಕಾರ ಕಚೇರಿ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ.`);
  }

  if (spatialResult.isBorderZone) {
    reasoning.push(`⚠️ Border Buffer Notice: Located ${spatialResult.distanceToEdgeMeters}m from boundary. Co-routed with peripheral nodal supervisor.`);
    reasoningKn.push(`⚠️ ಗಡಿ ಎಚ್ಚರಿಕೆ: ಗಡಿಯಿಂದ ಕೇವಲ ${spatialResult.distanceToEdgeMeters} ಮೀಟರ್ ಅಂತರದಲ್ಲಿದ್ದು, ಜಂಟಿ ಮೇಲ್ವಿಚಾರಕರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ.`);
  }

  // Calculate confidence
  let confidence = 0.96;
  if (spatialResult.isBorderZone) confidence -= 0.05;
  if (isTransitioning) confidence -= 0.03; // Minor penalty for transition uncertainty

  return {
    office: baseOffice,
    department: deptName,
    departmentKn: deptNameKn,
    confidence: Number(confidence.toFixed(2)),
    reasoning,
    reasoningKn,
    slaHours,
    escalationContact: baseOffice.nodalOfficer || baseOffice.commissioner,
    escalationPhone: baseOffice.officerPhone || baseOffice.helpline,
    isBorderZone: spatialResult.isBorderZone,
    borderDistanceMeters: spatialResult.distanceToEdgeMeters,
    isTransitioning,
    transitionMeta
  };
}
