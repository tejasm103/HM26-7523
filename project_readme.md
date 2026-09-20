# HackMysuru 1.0 - Unified Civic Governance Platform

> **Mission**: Unifying civic grievance tracking and automated resolution across Mysuru City Corporation (MCC), Town Panchayats, and Gram Panchayats.

---

## 1. Problem Understanding & Sub-problem Definition
* **Civic Fragmentation**: Mysuru handles hundreds of tonnes of waste, drainage clogs, potholes, and broken streetlights daily.
* **Jurisdictional Bouncing**: Citizens face circular referrals between MCC urban wards, peri-urban Town Panchayats, and rural Gram Panchayats.
* **Lack of Accountability**: Informal complaints lack an immutable audit trail, clear SLA tracking, or verified completion proof.
* **Target Sub-problem**: Unified geo-fenced intake, dynamic jurisdiction routing, offline-first field synchronization, and verifiable civic audit trails.

---

## 2. Target Users & Mysuru Context
* **Citizen Persona**: Residents and tourists reporting broken streetlights, waste, or road damage in both Kannada and English with minimal bandwidth.
* **Field Inspector / Civic Staff**: Field engineers and sanitary supervisors navigating patchy connectivity in Gram Panchayat areas.
* **Administrative Leadership**: MCC Commissioners and Panchayat Development Officers (PDOs) monitoring live turnaround times and Dasara surge spikes across all 65+ wards.

---

## 3. Solution Overview & Core Journey
* **Single Digital Frontdoor**: Progressive Web App (PWA) with GPS lock, offline photo capture, and multilingual audio-to-text reporting.
* **Automated Boundary Engine**: Geo-coordinates automatically map complaints to MCC ward boundary polygons or Gram Panchayat cadastral maps.
* **Resolution Proof**: Field technicians upload before/after photos with tamper-evident metadata to trigger ticket closure.

---

## 4. Architecture
See the detailed architectural diagrams and data schemas in [`docs/architecture.md`](docs/architecture.md).

* **Client**: React / Next.js PWA + IndexedDB for local offline queuing.
* **API Gateway & Routing Engine**: Node.js microservices evaluating GIS spatial queries (PostGIS).
* **Database**: PostgreSQL with PostGIS extension for boundary polygon containment queries.
* **Deduplication Engine**: Perceptual image hashing + spatio-temporal clustering (50m radius within 24h).

---

## 5. Tech Stack & AI Usage
* **Frontend**: Next.js 14, Tailwind CSS, Workbox (Service Worker / Offline sync)
* **Backend**: Node.js / Express, PostGIS, Prisma ORM
* **Storage**: AWS S3-compatible bucket for geocoded imagery
* **AI Disclosure (`ai.md`)**: Full inventory of assistive AI tools and verified manual checks documented in [`ai.md`](ai.md).

---

## 6. Decision Log Summary & Link
* **Key Architecture Trade-Offs**: Evaluated monolithic vs. event-driven architecture; prioritized local-first SQLite/IndexedDB syncing over constant websocket connectivity for rural reliability.
* **Full Defense**: Read the complete 1-page defense document linked in [`resource.md`](resource.md) and [`docs/constraints.md`](docs/constraints.md).

---

## 7. Setup & Run Instructions
Detailed local environment setup, containerized services, and test seed data are available in [`docs/setup.md`](docs/setup.md).

```bash
# Clone the repository
git clone https://github.com/<TeamID>-submission.git
cd <HM26-7523>-submission

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start the local development server
npm run dev
```

---

## 8. Known Limitations & Roadmap
* **Edge Cases**: Boundary disputes on unincorporated peri-urban ring-roads require administrative manual override.
* **Dasara Scalability**: Caching static map tiles and offloading batch image analysis to handle 10x concurrent report spikes during festival seasons.
* **Roadmap**: Automated SMS gateway integration for non-smartphone users via Gram Panchayat kiosks.
