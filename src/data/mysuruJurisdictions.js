/**
 * Mysuru Administrative & Jurisdictional Database
 * Captures real-world Mysuru local bodies, parastatal authorities,
 * spatial polygons (WGS84 approx coordinates), departments, and delimitation transition states.
 */

export const JURISDICTION_TYPES = {
  CITY_CORPORATION: 'CITY_CORPORATION', // Mysuru City Corporation (MCC)
  TOWN_PANCHAYAT: 'TOWN_PANCHAYAT',     // Town Municipal Councils & Town Panchayats (TMC / TP)
  GRAM_PANCHAYAT: 'GRAM_PANCHAYAT',     // Gram Panchayats (GP) under Taluk Panchayat
  PARASTATAL: 'PARASTATAL',             // Specialized bodies: MUDA, CHESCOM, KUWSDB/VVWW, NHAI/PWD
};

export const TRANSITION_STATUS = {
  STABLE: 'STABLE',                     // Fully established jurisdiction
  IN_TRANSITION: 'IN_TRANSITION',       // Active Gazette notification / Handover in progress
  SCHEDULED_ANNEXATION: 'SCHEDULED_ANNEXATION', // Gazetted for absorption in upcoming epoch
  LEGACY_SPLIT: 'LEGACY_SPLIT',         // Historic boundary prior to delimitation
};

export const MYSURU_OFFICES = {
  MCC_HQ: {
    id: 'MCC_HQ',
    code: 'MCC-00',
    type: JURISDICTION_TYPES.CITY_CORPORATION,
    name: 'Mysuru City Corporation (Headquarters)',
    nameKn: 'ಮೈಸೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ (ಕೇಂದ್ರ ಕಚೇರಿ)',
    shortName: 'MCC Head Office',
    level: 'Tier 1 - City Corporation',
    address: 'Sayyaji Rao Road, Agrahara, Mysuru - 570001',
    helpline: '0821-2418800 / 0821-2440890',
    tollFree: '1800-425-4560',
    email: 'commissioner@mysurucitycorporation.co.in',
    commissioner: 'A. Lakshmikanth Reddy, IAS (Commissioner)',
    color: '#00f0ff',
    badgeColor: 'rgba(0, 240, 255, 0.15)',
    boundaryColor: '#00d2ff',
    departments: [
      { id: 'SWM', name: 'Solid Waste & Sanitation', nameKn: 'ಘನತ್ಯಾಜ್ಯ ಮತ್ತು ನೈರ್ಮಲ್ಯ', head: 'Dr. D.G. Nagaraj (Health Officer)' },
      { id: 'PWD_ENGG', name: 'Civil Works & Roads', nameKn: 'ಲೋಕೋಪಯೋಗಿ ಮತ್ತು ರಸ್ತೆಗಳು', head: 'Mahesh K. (Superintending Engineer)' },
      { id: 'VVWW', name: 'Vani Vilas Water Works (VVWW)', nameKn: 'ವಾಣಿ ವಿಲಾಸ ನೀರು ಸರಬರಾಜು', head: 'Sujatha R. (Executive Engineer - Water)' },
      { id: 'ELEC', name: 'Streetlights & Electrical', nameKn: 'ಬೀದಿ ದೀಪ ಮತ್ತು ವಿದ್ಯುತ್', head: 'Anand Kumar (AEE Electrical)' },
      { id: 'TOWN_PLANNING', name: 'Town Planning & Khata', nameKn: 'ನಗರ ಯೋಜನೆ ಮತ್ತು ಖಾತೆ', head: 'C. Venkatesh (Joint Director)' },
      { id: 'REVENUE', name: 'Property Tax & Revenue', nameKn: 'ಆಸ್ತಿ ತೆರಿಗೆ ಮತ್ತು ಕಂದಾಯ', head: 'N. Savitha (Deputy Commissioner - Rev)' }
    ]
  },

  MCC_ZONE_3: {
    id: 'MCC_ZONE_3',
    code: 'MCC-Z03',
    type: JURISDICTION_TYPES.CITY_CORPORATION,
    name: 'MCC Zonal Office 3 (Kuvempunagar)',
    nameKn: 'ಮಹಾನಗರ ಪಾಲಿಕೆ ವಲಯ ಕಚೇರಿ ೩ (ಕುವೆಂಪುನಗರ)',
    shortName: 'MCC Zone 3',
    level: 'Zonal Municipal Office',
    address: 'Kuvempunagar Complex, Vishwamanava Double Road, Mysuru - 570023',
    helpline: '0821-2543210',
    email: 'zonal3@mysurucitycorporation.co.in',
    nodalOfficer: 'Suresh Kumar (Zonal Assistant Commissioner)',
    officerPhone: '+91 94481 23412',
    color: '#3b82f6',
    badgeColor: 'rgba(59, 130, 246, 0.15)',
    boundaryColor: '#3b82f6',
    wardsCovered: [44, 45, 46, 47, 48, 62, 63, 64],
    expandedWards: [66, 67] // Bogadi absorbed wards under Greater Mysuru
  },

  MCC_ZONE_7: {
    id: 'MCC_ZONE_7',
    code: 'MCC-Z07',
    type: JURISDICTION_TYPES.CITY_CORPORATION,
    name: 'MCC Zonal Office 7 (Vidyaranyapuram / J.P. Nagar)',
    nameKn: 'ಮಹಾನಗರ ಪಾಲಿಕೆ ವಲಯ ಕಚೇರಿ ೭ (ವಿದ್ಯಾರಣ್ಯಪುರಂ / ಜೆ.ಪಿ. ನಗರ)',
    shortName: 'MCC Zone 7',
    level: 'Zonal Municipal Office',
    address: 'Sewage Farm Road, Vidyaranyapuram, Mysuru - 570008',
    helpline: '0821-2489012',
    email: 'zonal7@mysurucitycorporation.co.in',
    nodalOfficer: 'Manjunatha Rao (Zonal Commissioner)',
    officerPhone: '+91 94481 44521',
    color: '#6366f1',
    badgeColor: 'rgba(99, 102, 241, 0.15)',
    boundaryColor: '#6366f1',
    wardsCovered: [55, 56, 57, 58, 59],
    expandedWards: [72, 73] // Srirampura absorbed wards
  },

  MCC_ZONE_9: {
    id: 'MCC_ZONE_9',
    code: 'MCC-Z09',
    type: JURISDICTION_TYPES.CITY_CORPORATION,
    name: 'MCC Zonal Office 9 (Vijayanagar / Hebbal)',
    nameKn: 'ಮಹಾನಗರ ಪಾಲಿಕೆ ವಲಯ ಕಚೇರಿ ೯ (ವಿಜಯನಗರ / ಹೆಬ್ಬಾಳ)',
    shortName: 'MCC Zone 9',
    level: 'Zonal Municipal Office',
    address: 'High Tension Double Road, Vijayanagar 2nd Stage, Mysuru - 570017',
    helpline: '0821-2412891',
    email: 'zonal9@mysurucitycorporation.co.in',
    nodalOfficer: 'Chidananda Murthy (Zonal Assistant Commissioner)',
    officerPhone: '+91 94481 99812',
    color: '#06b6d4',
    badgeColor: 'rgba(6, 182, 212, 0.15)',
    boundaryColor: '#06b6d4',
    wardsCovered: [26, 27, 28, 29, 30, 31],
    expandedWards: [78, 79, 80] // Hootagalli integration
  },

  HOOTAGALLI_TMC: {
    id: 'HOOTAGALLI_TMC',
    code: 'TMC-HTG',
    type: JURISDICTION_TYPES.TOWN_PANCHAYAT,
    name: 'Hootagalli Town Municipal Council (TMC)',
    nameKn: 'ಹೂಟಗಳ್ಳಿ ನಗರ ಸಭೆ',
    shortName: 'Hootagalli TMC',
    level: 'Tier 2 - Urban Local Body (TMC)',
    address: 'KRS Main Road, Near Ring Road Junction, Hootagalli, Mysuru - 570018',
    helpline: '0821-2404111',
    email: 'tmchootagalli@karnataka.gov.in',
    nodalOfficer: 'Smt. Roopa M. (Chief Officer - TMC)',
    officerPhone: '+91 98450 78219',
    transitionOfficer: 'Pradeep Gowda (Joint Delimitation Taskforce)',
    color: '#ec4899',
    badgeColor: 'rgba(236, 72, 153, 0.15)',
    boundaryColor: '#ec4899',
    zones: ['Hootagalli Core', 'Belavadi Industrial', 'Koorgalli', 'Hinkal West'],
    transitionStatus: TRANSITION_STATUS.IN_TRANSITION,
    transitionDetails: {
      gazetteNo: 'UDD 88 MLR 2024 (Dated 14-Aug-2024)',
      phase: 'Phase 2: Joint Assets & Service Transfer',
      targetCorporationZone: 'MCC Zone 9',
      handoverSLA: 'Joint Custody until Dec 2025'
    }
  },

  BOGADI_TP: {
    id: 'BOGADI_TP',
    code: 'TP-BGD',
    type: JURISDICTION_TYPES.TOWN_PANCHAYAT,
    name: 'Bogadi Town Panchayat (Pattana Panchayati)',
    nameKn: 'ಬೋಗಾದಿ ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ',
    shortName: 'Bogadi Town Panchayat',
    level: 'Tier 2 - Peri-Urban Panchayat',
    address: 'Gaddige Main Road, Bogadi 2nd Stage, Mysuru - 570026',
    helpline: '0821-2598301',
    email: 'bogaditp-my@karnataka.gov.in',
    nodalOfficer: 'Basavarajappa (Chief Officer)',
    officerPhone: '+91 94498 62013',
    transitionOfficer: 'K.V. Shivalingaiah (MCC Deputy Delimitation Liaison)',
    color: '#f59e0b',
    badgeColor: 'rgba(245, 158, 11, 0.15)',
    boundaryColor: '#f59e0b',
    transitionStatus: TRANSITION_STATUS.IN_TRANSITION,
    transitionDetails: {
      gazetteNo: 'UDD 142 MLR 2024 (Greater Mysuru Delimitation Order)',
      phase: 'Phase 3: Solid Waste & Streetlights merged; Khata transfer underway',
      targetCorporationZone: 'MCC Zone 3 (Ward 66 & 67)',
      handoverSLA: 'Complete Cutover target: Q1 2026'
    }
  },

  SRIRAMPURA_TP: {
    id: 'SRIRAMPURA_TP',
    code: 'TP-SRP',
    type: JURISDICTION_TYPES.TOWN_PANCHAYAT,
    name: 'Srirampura Town Panchayat',
    nameKn: 'ಶ್ರೀರಾಮಪುರ ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ',
    shortName: 'Srirampura TP',
    level: 'Tier 2 - Peri-Urban Panchayat',
    address: 'HD Kote Road, Srirampura 2nd Stage, Mysuru - 570008',
    helpline: '0821-2361099',
    email: 'srirampuraptp@karnataka.gov.in',
    nodalOfficer: 'Jayanthi R. (Chief Officer)',
    officerPhone: '+91 98862 33410',
    color: '#f97316',
    badgeColor: 'rgba(249, 115, 22, 0.15)',
    boundaryColor: '#f97316',
    transitionStatus: TRANSITION_STATUS.IN_TRANSITION,
    transitionDetails: {
      gazetteNo: 'UDD 142 MLR 2024',
      phase: 'Phase 1: Survey and Property Tax Enumeration',
      targetCorporationZone: 'MCC Zone 7 (Ward 72)',
      handoverSLA: 'Transition mode active'
    }
  },

  ALANAHALLI_GP: {
    id: 'ALANAHALLI_GP',
    code: 'GP-ALN',
    type: JURISDICTION_TYPES.GRAM_PANCHAYAT,
    name: 'Alanahalli Gram Panchayat (Mysuru Taluk)',
    nameKn: 'ಆಲನಹಳ್ಳಿ ಗ್ರಾಮ ಪಂಚಾಯಿತಿ (ಮೈಸೂರು ತಾಲ್ಲೂಕು)',
    shortName: 'Alanahalli GP',
    level: 'Tier 3 - Rural Local Body (Panchayat Raj)',
    address: 'Bannur Road, Near Lalithadripura Cross, Alanahalli, Mysuru - 570028',
    helpline: '0821-2473820',
    email: 'pdo.alanahalli@karnataka.gov.in',
    nodalOfficer: 'Shivaramegowda (Panchayat Development Officer - PDO)',
    officerPhone: '+91 94808 61245',
    color: '#10b981',
    badgeColor: 'rgba(16, 185, 129, 0.15)',
    boundaryColor: '#10b981',
    transitionStatus: TRANSITION_STATUS.SCHEDULED_ANNEXATION,
    transitionDetails: {
      gazetteNo: 'Draft Notification UDD 2025/Annex-Alanahalli',
      phase: 'Preliminary Public Consultation for Greater Mysuru Merger',
      targetCorporationZone: 'MCC Zone 1 / Expanded Ward 75',
      handoverSLA: 'Rural RDPR Water Scheme handover in progress'
    }
  },

  SIDDALINGAPURA_GP: {
    id: 'SIDDALINGAPURA_GP',
    code: 'GP-SDL',
    type: JURISDICTION_TYPES.GRAM_PANCHAYAT,
    name: 'Siddalingapura Gram Panchayat',
    nameKn: 'ಸಿದ್ಧಲಿಂಗಪುರ ಗ್ರಾಮ ಪಂಚಾಯಿತಿ',
    shortName: 'Siddalingapura GP',
    level: 'Tier 3 - Rural Local Body',
    address: 'Bengaluru-Mysuru Highway, Siddalingapura, Mysuru - 570003',
    helpline: '0821-2581022',
    email: 'pdo.siddalingapura@karnataka.gov.in',
    nodalOfficer: 'Puttegowda (PDO)',
    officerPhone: '+91 94808 55412',
    color: '#14b8a6',
    badgeColor: 'rgba(20, 184, 166, 0.15)',
    boundaryColor: '#14b8a6',
    transitionStatus: TRANSITION_STATUS.STABLE
  },

  CHAMUNDI_HILL_AUTH: {
    id: 'CHAMUNDI_HILL_AUTH',
    code: 'CHA-CMH',
    type: JURISDICTION_TYPES.PARASTATAL,
    name: 'Chamundi Hill Development Authority / Temple Board',
    nameKn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟ ಅಭಿವೃದ್ಧಿ ಪ್ರಾಧಿಕಾರ ಮತ್ತು ದೇವಸ್ಥಾನ ಮಂಡಳಿ',
    shortName: 'Chamundi Hill Authority',
    level: 'Autonomous Pilgrim & Eco-Heritage Zone',
    address: 'Sri Chamundeshwari Temple Complex, Chamundi Hill, Mysuru - 570010',
    helpline: '0821-2590027',
    email: 'chamunditemple@karnataka.gov.in',
    nodalOfficer: 'M.J. Rupa (Executive Officer / KAS)',
    officerPhone: '+91 94483 10090',
    color: '#8b5cf6',
    badgeColor: 'rgba(139, 92, 246, 0.15)',
    boundaryColor: '#8b5cf6',
    transitionStatus: TRANSITION_STATUS.STABLE
  },

  MUDA_PARASTATAL: {
    id: 'MUDA_PARASTATAL',
    code: 'PAR-MUDA',
    type: JURISDICTION_TYPES.PARASTATAL,
    name: 'Mysuru Urban Development Authority (MUDA)',
    nameKn: 'ಮೈಸೂರು ನಗರಾಭಿವೃದ್ಧಿ ಪ್ರಾಧಿಕಾರ (ಮುಡಾ)',
    shortName: 'MUDA',
    level: 'Parastatal Urban Planning Body',
    address: 'J.H. Patel Bhavan, JLB Road, Mysuru - 570005',
    helpline: '0821-2426100 / 0821-2426101',
    email: 'commissioner@mudamysore.gov.in',
    nodalOfficer: 'K.R. Dinesh (Superintendent Engineer - Layout Handover)',
    officerPhone: '+91 821 2426105',
    color: '#a855f7',
    badgeColor: 'rgba(168, 85, 247, 0.15)',
    boundaryColor: '#a855f7',
    competency: 'Unhanded-over private & MUDA layouts, CA sites, peripheral layout civil works before formal municipal adoption',
    transitionStatus: TRANSITION_STATUS.STABLE
  },

  CHESCOM_POWER: {
    id: 'CHESCOM_POWER',
    code: 'PAR-CHESCOM',
    type: JURISDICTION_TYPES.PARASTATAL,
    name: 'Chamundeshwari Electricity Supply Corporation (CHESCOM)',
    nameKn: 'ಚಾಮುಂಡೇಶ್ವರಿ ವಿದ್ಯುತ್ ಸರಬರಾಜು ನಿಗಮ (ಚೆಸ್ಕಾಂ)',
    shortName: 'CHESCOM',
    level: 'State Electricity Distribution Utility',
    address: 'Corporate Office, No. 29, Vijayanagar 2nd Stage, Mysuru - 570017',
    helpline: '1912 (24x7 Power Outages) / 0821-2343384',
    email: 'contact@chescom.karnataka.gov.in',
    nodalOfficer: 'Nagesh H.R. (Chief Engineer - Mysuru Zone)',
    officerPhone: '+91 94484 91912',
    color: '#eab308',
    badgeColor: 'rgba(234, 179, 8, 0.15)',
    boundaryColor: '#eab308',
    competency: 'Transformers, 11kV/33kV distribution lines, feeder lines, power failures, metering across urban and rural zones',
    transitionStatus: TRANSITION_STATUS.STABLE
  },

  NHAI_PWD: {
    id: 'NHAI_PWD',
    code: 'PAR-NHAI',
    type: JURISDICTION_TYPES.PARASTATAL,
    name: 'National Highways Authority of India (NHAI / PWD Special Div)',
    nameKn: 'ಭಾರತೀಯ ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ ಪ್ರಾಧಿಕಾರ (ಎನ್.ಹೆಚ್.ಎ.ಐ / ಲೋಕೋಪಯೋಗಿ)',
    shortName: 'NHAI / Outer Ring Road',
    level: 'Central/State Highway Authority',
    address: 'Project Implementation Unit, Near Ramanahalli Toll Plaza, Mysuru - 570019',
    helpline: '1033 (National Highway Emergency) / 0821-2970110',
    email: 'piumysore@nhai.org',
    nodalOfficer: 'B.T. Sridhar (Project Director - NHAI)',
    officerPhone: '+91 94480 81033',
    color: '#ef4444',
    badgeColor: 'rgba(239, 68, 68, 0.15)',
    boundaryColor: '#ef4444',
    competency: 'Outer Ring Road (ORR) 6-lane main carriageway, Bengaluru-Mysuru Expressway, flyovers, median barriers',
    transitionStatus: TRANSITION_STATUS.STABLE
  }
};

/**
 * Spatial Boundary Polygons for Mysuru Regions
 * Coordinates in [longitude, latitude] format for GIS polygon math.
 * Centered on Mysuru: Lat ~ 12.28 to 12.36 N, Lng ~ 76.58 to 76.72 E
 */
export const MYSURU_POLYGONS = {
  // Core MCC Urban Territory (Historical 65 Wards)
  MCC_CORE: {
    id: 'MCC_CORE',
    label: 'Mysuru City Corporation (Core)',
    officeId: 'MCC_HQ',
    fillColor: 'rgba(0, 240, 255, 0.12)',
    strokeColor: '#00f0ff',
    coordinates: [
      [76.620, 12.345],
      [76.670, 12.345],
      [76.690, 12.320],
      [76.685, 12.280],
      [76.650, 12.270],
      [76.625, 12.285],
      [76.610, 12.315],
      [76.620, 12.345]
    ]
  },

  // Kuvempunagar & Southern Urban (MCC Zone 3)
  MCC_KUVEMPUNAGAR: {
    id: 'MCC_KUVEMPUNAGAR',
    label: 'MCC Zone 3 (Kuvempunagar / Ramakrishnanagar)',
    officeId: 'MCC_ZONE_3',
    fillColor: 'rgba(59, 130, 246, 0.15)',
    strokeColor: '#3b82f6',
    coordinates: [
      [76.615, 12.295],
      [76.645, 12.295],
      [76.648, 12.275],
      [76.620, 12.270],
      [76.612, 12.285],
      [76.615, 12.295]
    ]
  },

  // Hootagalli TMC (West Peri-Urban / Industrial)
  HOOTAGALLI_TMC: {
    id: 'HOOTAGALLI_TMC',
    label: 'Hootagalli TMC (Hootagalli, Belavadi, Koorgalli, Hinkal)',
    officeId: 'HOOTAGALLI_TMC',
    fillColor: 'rgba(236, 72, 153, 0.18)',
    strokeColor: '#ec4899',
    coordinates: [
      [76.580, 12.355],
      [76.615, 12.350],
      [76.615, 12.325],
      [76.585, 12.320],
      [76.575, 12.338],
      [76.580, 12.355]
    ]
  },

  // Bogadi Town Panchayat (South-West Peri-Urban)
  BOGADI_TP: {
    id: 'BOGADI_TP',
    label: 'Bogadi Town Panchayat (Bogadi 1st & 2nd Stage)',
    officeId: 'BOGADI_TP',
    fillColor: 'rgba(245, 158, 11, 0.20)',
    strokeColor: '#f59e0b',
    coordinates: [
      [76.585, 12.315],
      [76.615, 12.310],
      [76.615, 12.285],
      [76.580, 12.280],
      [76.575, 12.300],
      [76.585, 12.315]
    ]
  },

  // Srirampura Town Panchayat (South Peri-Urban)
  SRIRAMPURA_TP: {
    id: 'SRIRAMPURA_TP',
    label: 'Srirampura Town Panchayat (BEML Layout fringe)',
    officeId: 'SRIRAMPURA_TP',
    fillColor: 'rgba(249, 115, 22, 0.18)',
    strokeColor: '#f97316',
    coordinates: [
      [76.615, 12.270],
      [76.645, 12.270],
      [76.642, 12.245],
      [76.610, 12.245],
      [76.615, 12.270]
    ]
  },

  // Alanahalli Gram Panchayat (East Peri-Urban)
  ALANAHALLI_GP: {
    id: 'ALANAHALLI_GP',
    label: 'Alanahalli Gram Panchayat (Lalithadripura / Bannur Rd)',
    officeId: 'ALANAHALLI_GP',
    fillColor: 'rgba(16, 185, 129, 0.18)',
    strokeColor: '#10b981',
    coordinates: [
      [76.690, 12.325],
      [76.725, 12.325],
      [76.730, 12.285],
      [76.690, 12.285],
      [76.685, 12.305],
      [76.690, 12.325]
    ]
  },

  // Chamundi Hill Pilgrim Reserve
  CHAMUNDI_HILL: {
    id: 'CHAMUNDI_HILL',
    label: 'Chamundi Hill Pilgrim Authority',
    officeId: 'CHAMUNDI_HILL_AUTH',
    fillColor: 'rgba(139, 92, 246, 0.22)',
    strokeColor: '#8b5cf6',
    coordinates: [
      [76.660, 12.280],
      [76.685, 12.280],
      [76.685, 12.260],
      [76.655, 12.260],
      [76.660, 12.280]
    ]
  },

  // Siddalingapura GP (North Bengaluru Highway)
  SIDDALINGAPURA_GP: {
    id: 'SIDDALINGAPURA_GP',
    label: 'Siddalingapura Gram Panchayat (NH-275 corridor)',
    officeId: 'SIDDALINGAPURA_GP',
    fillColor: 'rgba(20, 184, 166, 0.18)',
    strokeColor: '#14b8a6',
    coordinates: [
      [76.635, 12.380],
      [76.675, 12.380],
      [76.675, 12.348],
      [76.635, 12.348],
      [76.635, 12.380]
    ]
  }
};

/**
 * Temporal Delimitation Epochs (The Twist Timeline)
 * Tracks how jurisdictions evolve across administrative gazette notifications.
 */
export const DELIMITATION_EPOCHS = [
  {
    id: 'EPOCH_2023',
    year: '2023',
    title: 'Pre-Delimitation (Historic Boundaries)',
    titleKn: 'ಗಡಿ ಪುನರ್‌ವಿಂಗಡಣೆ ಪೂರ್ವ (ಹಳೆಯ ಗಡಿಗಳು)',
    statusBadge: 'Legacy 65 Wards',
    description: 'Mysuru City Corporation restricted to inner 65 wards. Outer areas (Hootagalli, Bogadi, Srirampura, Alanahalli) operated as independent rural or semi-urban panchayats.',
    descriptionKn: 'ಮೈಸೂರು ನಗರ ಪಾಲಿಕೆಯು ಕೇವಲ ೬೫ ವಾರ್ಡ್‌ಗಳಿಗೆ ಸೀಮಿತವಾಗಿತ್ತು. ಹೂಟಗಳ್ಳಿ, ಬೋಗಾದಿ, ಶ್ರೀರಾಮಪುರ, ಆಲನಹಳ್ಳಿ ಪ್ರತ್ಯೇಕ ಪಂಚಾಯಿತಿಗಳಾಗಿದ್ದವು.',
    absorbedAreas: [],
    mccWardCount: 65,
    activeJurisdictions: ['MCC_HQ', 'MCC_ZONE_3', 'MCC_ZONE_7', 'MCC_ZONE_9', 'HOOTAGALLI_TMC', 'BOGADI_TP', 'SRIRAMPURA_TP', 'ALANAHALLI_GP', 'SIDDALINGAPURA_GP', 'CHAMUNDI_HILL_AUTH']
  },
  {
    id: 'EPOCH_2025',
    year: '2025',
    title: 'Current Transition (Delimitation In-Progress)',
    titleKn: 'ಪ್ರಸ್ತುತ ಪರಿವರ್ತನಾ ಹಂತ (ಗಡಿ ಬದಲಾವಣೆ ಪ್ರಕ್ರಿಯೆ)',
    statusBadge: 'Gazette Handover Active',
    isCurrent: true,
    description: 'Karnataka Gazette Notification UDD/142/MLR/2024 active. Hootagalli TMC, Bogadi TP, and Srirampura TP are in phased absorption into MCC with Joint Nodal Taskforces. Sanitation transferred; Khata and Water in dual custody.',
    descriptionKn: 'ಕರ್ನಾಟಕ ರಾಜಪತ್ರ ಅಧಿಸೂಚನೆ ಅನ್ವಯ ಹೂಟಗಳ್ಳಿ, ಬೋಗಾದಿ, ಶ್ರೀರಾಮಪುರ ಪಾಲಿಕೆಗೆ ವಿಲೀನ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದ್ದು, ಜಂಟಿ ನೋಡಲ್ ಅಧಿಕಾರಿಗಳ ಸುಪರ್ದಿಯಲ್ಲಿದೆ.',
    absorbedAreas: [
      {
        areaId: 'BOGADI_TP',
        originalOffice: 'BOGADI_TP',
        newOffice: 'MCC_ZONE_3',
        newWard: 'Ward 66 (Bogadi Urban)',
        phase: 'Phase 2 (Civil & Sanitation to MCC; Revenue joint)'
      },
      {
        areaId: 'HOOTAGALLI_TMC',
        originalOffice: 'HOOTAGALLI_TMC',
        newOffice: 'MCC_ZONE_9',
        newWard: 'Wards 78-80 (Industrial & Residential)',
        phase: 'Phase 2 (Joint asset verification)'
      },
      {
        areaId: 'SRIRAMPURA_TP',
        originalOffice: 'SRIRAMPURA_TP',
        newOffice: 'MCC_ZONE_7',
        newWard: 'Ward 72 (Srirampura)',
        phase: 'Phase 1 (Enumeration & joint survey)'
      }
    ],
    mccWardCount: 75,
    activeJurisdictions: ['MCC_HQ', 'MCC_ZONE_3', 'MCC_ZONE_7', 'MCC_ZONE_9', 'HOOTAGALLI_TMC', 'BOGADI_TP', 'SRIRAMPURA_TP', 'ALANAHALLI_GP', 'SIDDALINGAPURA_GP', 'CHAMUNDI_HILL_AUTH']
  },
  {
    id: 'EPOCH_2026',
    year: '2026',
    title: 'Greater Mysuru (BMMP Unified Corporation)',
    titleKn: 'ಬೃಹತ್ ಮೈಸೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ (ಸಂಪೂರ್ಣ ವಿಲೀನ)',
    statusBadge: 'Greater Mysuru 85 Wards',
    description: 'Full statutory cutover. Peripheral Town Panchayats and Alanahalli Gram Panchayat fully integrated into Bruhat Mysuru Mahanagara Palike (BMMP). Single unified tax register, MCC engineering divisions, and automated single-window grievance handling.',
    descriptionKn: 'ಬೃಹತ್ ಮೈಸೂರು ಮಹಾನಗರ ಪಾಲಿಕೆಯಾಗಿ ರೂಪಾಂತರಗೊಂಡಿದ್ದು, ಎಲ್ಲಾ ಬಾಹ್ಯ ಪಂಚಾಯಿತಿಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಪಾಲಿಕೆಯ ನೂತನ ವಲಯ ಕಚೇರಿಗಳ ಅಡಿಯಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿವೆ.',
    absorbedAreas: [
      {
        areaId: 'BOGADI_TP',
        originalOffice: 'BOGADI_TP',
        newOffice: 'MCC_ZONE_3',
        newWard: 'Ward 66 & 67',
        phase: 'Cutover Complete'
      },
      {
        areaId: 'HOOTAGALLI_TMC',
        originalOffice: 'HOOTAGALLI_TMC',
        newOffice: 'MCC_ZONE_9',
        newWard: 'Wards 78, 79, 80',
        phase: 'Cutover Complete'
      },
      {
        areaId: 'SRIRAMPURA_TP',
        originalOffice: 'SRIRAMPURA_TP',
        newOffice: 'MCC_ZONE_7',
        newWard: 'Ward 72',
        phase: 'Cutover Complete'
      },
      {
        areaId: 'ALANAHALLI_GP',
        originalOffice: 'ALANAHALLI_GP',
        newOffice: 'MCC_HQ',
        newWard: 'Ward 82 (Alanahalli Enclave)',
        phase: 'Cutover Complete'
      }
    ],
    mccWardCount: 85,
    activeJurisdictions: ['MCC_HQ', 'MCC_ZONE_3', 'MCC_ZONE_7', 'MCC_ZONE_9', 'SIDDALINGAPURA_GP', 'CHAMUNDI_HILL_AUTH']
  }
];
