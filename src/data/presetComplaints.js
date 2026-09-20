/**
 * Preset Real-World Mysuru Civic Grievance Scenarios
 * Demonstrates edge cases, boundary ambiguity, parastatal arbitration,
 * and delimitation shift migration.
 */

export const PRESET_COMPLAINTS = [
  {
    id: 'PRESET-01',
    title: 'Drainage Overflow on Bogadi Ring Road Junction',
    titleKn: 'ಬೋಗಾದಿ ವರ್ತುಲ ರಸ್ತೆ ಜಂಕ್ಷನ್‌ನಲ್ಲಿ ಒಳಚರಂಡಿ ಉಕ್ಕಿ ಹರಿಯುತ್ತಿದೆ',
    description: 'Severely choked underground drainage overflowing into the service lane right next to the Bogadi 2nd Stage Ring Road signal. Heavy stench and water entering nearby commercial shops.',
    category: 'DRAINAGE',
    locationName: 'Bogadi 2nd Stage, Ring Road Junction',
    coordinates: { lng: 76.608, lat: 12.302 },
    pincode: '570026',
    landmark: 'Near Bogadi Signal & Ring Road Flyover pillar 14',
    urgency: 'HIGH',
    edgeCaseType: 'BORDER_DELIMITATION',
    expectedOffice2023: 'BOGADI_TP',
    expectedOffice2025: 'MCC_ZONE_3', // With transition notice!
    expectedOffice2026: 'MCC_ZONE_3',
    notes: 'Classic boundary shift test case. In 2023, Bogadi TP claimed jurisdiction. In 2025, MCC Zone 3 handles civil sanitation under Gazette UDD 142.'
  },
  {
    id: 'PRESET-02',
    title: 'Drinking Water Contamination in Alanahalli Outskirts',
    titleKn: 'ಆಲನಹಳ್ಳಿ ಬಡಾವಣೆಯಲ್ಲಿ ಕುಡಿಯುವ ನೀರು ಕಲುಷಿತಗೊಂಡಿದೆ',
    description: 'Muddy and foul-smelling tap water supplied for the last 4 days in Lalithadripura Cross, Alanahalli. Residents are forced to buy private water tankers.',
    category: 'WATER_SUPPLY',
    locationName: 'Alanahalli Gram Panchayat, Bannur Road',
    coordinates: { lng: 76.705, lat: 12.308 },
    pincode: '570028',
    landmark: 'Opposite Lalithadripura Community Hall',
    urgency: 'CRITICAL',
    edgeCaseType: 'RURAL_VS_URBAN_WATER',
    expectedOffice2023: 'ALANAHALLI_GP',
    expectedOffice2025: 'ALANAHALLI_GP', // RDPR Joint Custody
    expectedOffice2026: 'MCC_HQ', // Absorbed into Greater Mysuru
    notes: 'Tests rural water supply (RDPR) vs urban Vani Vilas Water Works (VVWW). During Greater Mysuru absorption, transitions to MCC/VVWW.'
  },
  {
    id: 'PRESET-03',
    title: 'High-Voltage Transformer Sparking & Power Outage',
    titleKn: 'ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್‌ನಲ್ಲಿ ಕಿಡಿ ಹೊತ್ತಿಕೊಂಡು ವಿದ್ಯುತ್ ವ್ಯತ್ಯಯ',
    description: 'Distribution transformer near Vijayanagar 4th stage junction is sparking violently with loud bangs. 4 streets have lost power completely.',
    category: 'ELECTRICITY_CHESCOM',
    locationName: 'Vijayanagar 4th Stage, Hootagalli Border',
    coordinates: { lng: 76.598, lat: 12.338 },
    pincode: '570018',
    landmark: 'Behind Vijayanagar High Tension Feeder Substation',
    urgency: 'EMERGENCY',
    edgeCaseType: 'PARASTATAL_CHESCOM',
    expectedOffice2023: 'CHESCOM_POWER',
    expectedOffice2025: 'CHESCOM_POWER',
    expectedOffice2026: 'CHESCOM_POWER',
    notes: 'Power grid issues route to CHESCOM, not MCC or TMC, regardless of municipal boundaries!'
  },
  {
    id: 'PRESET-04',
    title: 'Illegal Encroachment of CA Site in Unhanded-Over Layout',
    titleKn: 'ಮುಡಾ ಹಸ್ತಾಂತರಿಸದ ಬಡಾವಣೆಯಲ್ಲಿ ಸಿಎ ನಿವೇಶನ ಒತ್ತುವರಿ',
    description: 'Unauthorized fencing and construction debris dumped on Civic Amenity (CA) site No. 12 in a private residential enclave near Dattagalli. Layout has not yet received final MCC handover.',
    category: 'TOWN_PLANNING',
    locationName: 'Dattagalli 3rd Stage (MUDA Layout)',
    coordinates: { lng: 76.618, lat: 12.282 },
    pincode: '570022',
    landmark: 'Adjacent to Kanakadasa Nagar Water Tank',
    urgency: 'MEDIUM',
    edgeCaseType: 'MUDA_VS_MCC_HANDOVER',
    expectedOffice2023: 'MUDA_PARASTATAL',
    expectedOffice2025: 'MUDA_PARASTATAL',
    expectedOffice2026: 'MCC_ZONE_3',
    notes: 'Demonstrates layout handover dispute. Unhanded-over sites route to MUDA Town Planning rather than MCC Zonal office.'
  },
  {
    id: 'PRESET-05',
    title: 'Deep Crater Pothole on Outer Ring Road Expressway Arm',
    titleKn: 'ಹೊರ ವರ್ತುಲ ರಸ್ತೆಯ ಮುಖ್ಯ ಕ್ಯಾರಿಯೇಜ್‌ವೇನಲ್ಲಿ ಅಪಾಯಕಾರಿ ಗುಂಡಿ',
    description: 'Massive pothole in the middle lane of the 6-lane Outer Ring Road near Hootagalli flyover. Causing two-wheelers to skid and severe traffic bottleneck.',
    category: 'ROADS_HIGHWAY',
    locationName: 'Outer Ring Road (ORR), Near Hootagalli Flyover',
    coordinates: { lng: 76.590, lat: 12.330 },
    pincode: '570018',
    landmark: 'Flyover Ramp 2, NHAI Milestone KM 12',
    urgency: 'HIGH',
    edgeCaseType: 'NHAI_VS_MCC_ROAD',
    expectedOffice2023: 'NHAI_PWD',
    expectedOffice2025: 'NHAI_PWD',
    expectedOffice2026: 'NHAI_PWD',
    notes: 'ORR main carriageway is maintained by NHAI / National Highway wing, while the service roads fall under Corporation/TMC.'
  },
  {
    id: 'PRESET-06',
    title: 'Broken Safety Railing on Chamundi Hill Pilgrimage Steps',
    titleKn: 'ಚಾಮುಂಡಿ ಬೆಟ್ಟದ ಮೆಟ್ಟಿಲು ಮಾರ್ಗದ ಸುರಕ್ಷತಾ ತಡೆಗೋಡೆ ಮುರಿದಿದೆ',
    description: 'Around step 450 on the historic Chamundi Hill ascent, the stone & iron safety railing has collapsed down the slope, posing extreme danger to daily pilgrims and tourists.',
    category: 'HERITAGE_PILGRIM',
    locationName: 'Chamundi Hill Step Path, Step 450',
    coordinates: { lng: 76.672, lat: 12.272 },
    pincode: '570010',
    landmark: 'Near Nandi Statue & Step 450 Rest Shelter',
    urgency: 'HIGH',
    edgeCaseType: 'AUTONOMOUS_TEMPLE_BOARD',
    expectedOffice2023: 'CHAMUNDI_HILL_AUTH',
    expectedOffice2025: 'CHAMUNDI_HILL_AUTH',
    expectedOffice2026: 'CHAMUNDI_HILL_AUTH',
    notes: 'Pilgrimage reserve falls under the autonomous Chamundi Hill Authority / Muzrai Temple Board rather than standard MCC Wards.'
  }
];

export const CIVIC_CATEGORIES = [
  { id: 'DRAINAGE', icon: 'Waves', label: 'Drainage & Sewage', labelKn: 'ಒಳಚರಂಡಿ ಮತ್ತು ತ್ಯಾಜ್ಯ ನೀರು', defaultUrgency: 'HIGH', dept: 'VVWW' },
  { id: 'WATER_SUPPLY', icon: 'Droplets', label: 'Drinking Water Supply', labelKn: 'ಕುಡಿಯುವ ನೀರು ಸರಬರಾಜು', defaultUrgency: 'HIGH', dept: 'VVWW' },
  { id: 'SOLID_WASTE', icon: 'Trash2', label: 'Garbage & Sanitation', labelKn: 'ಘನತ್ಯಾಜ್ಯ ಮತ್ತು ಸ್ವಚ್ಛತೆ', defaultUrgency: 'MEDIUM', dept: 'SWM' },
  { id: 'ROADS_POTHOLES', icon: 'Construction', label: 'Roads & Potholes', labelKn: 'ರಸ್ತೆಗಳು ಮತ್ತು ಗುಂಡಿಗಳು', defaultUrgency: 'MEDIUM', dept: 'PWD_ENGG' },
  { id: 'STREETLIGHTS', icon: 'Lightbulb', label: 'Streetlights & Poles', labelKn: 'ಬೀದಿ ದೀಪಗಳು', defaultUrgency: 'LOW', dept: 'ELEC' },
  { id: 'ELECTRICITY_CHESCOM', icon: 'Zap', label: 'Power Grid & Transformers', labelKn: 'ವಿದ್ಯುತ್ ಜಾಲ ಮತ್ತು ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್', defaultUrgency: 'EMERGENCY', dept: 'CHESCOM_POWER' },
  { id: 'TOWN_PLANNING', icon: 'Building2', label: 'Encroachment & Layouts', labelKn: 'ಒತ್ತುವರಿ ಮತ್ತು ಬಡಾವಣೆ ಯೋಜನೆ', defaultUrgency: 'MEDIUM', dept: 'TOWN_PLANNING' },
  { id: 'HEALTH_HYGIENE', icon: 'ShieldAlert', label: 'Public Health & Fogging', labelKn: 'ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಮತ್ತು ಕೀಟನಾಶಕ', defaultUrgency: 'HIGH', dept: 'SWM' }
];
