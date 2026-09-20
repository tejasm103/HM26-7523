import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info, ShieldAlert, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { MYSURU_POLYGONS, MYSURU_OFFICES } from '../data/mysuruJurisdictions.js';
import { sounds } from '../services/soundEffects.js';

const MIN_LNG = 76.565;
const MAX_LNG = 76.745;
const MIN_LAT = 12.235;
const MAX_LAT = 12.395;
const SVG_WIDTH = 620;
const SVG_HEIGHT = 420;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MYSURU_CENTER = { lat: 12.302, lng: 76.608 };
const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps?q=Mysuru%2C%20Karnataka&output=embed';

function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps);

  if (window.__googleMapsPromise) return window.__googleMapsPromise;

  window.__googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-google-maps]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      existingScript.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.dataset.googleMaps = 'true';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });

  return window.__googleMapsPromise;
}

function lngLatToSvg(lng, lat) {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * SVG_WIDTH;
  const y = SVG_HEIGHT - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * SVG_HEIGHT;
  return [x, y];
}

function svgToLngLat(x, y) {
  const lng = MIN_LNG + (x / SVG_WIDTH) * (MAX_LNG - MIN_LNG);
  const lat = MIN_LAT + ((SVG_HEIGHT - y) / SVG_HEIGHT) * (MAX_LAT - MIN_LAT);
  return { lng: Number(lng.toFixed(4)), lat: Number(lat.toFixed(4)) };
}

export function MysuruMap({ 
  selectedPoint, 
  onSelectPoint, 
  activeEpoch, 
  activeGazetteChanges = [],
  highlightArea = null,
  lang = 'en' 
}) {
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [mouseCoord, setMouseCoord] = useState(null);
  const [fallbackZoom, setFallbackZoom] = useState(1);
  const [googleMapsState, setGoogleMapsState] = useState(GOOGLE_MAPS_API_KEY ? 'loading' : 'fallback');
  const googleMapElementRef = useRef(null);
  const googleMapRef = useRef(null);
  const googleOverlaysRef = useRef([]);
  const googleMarkerRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return undefined;

    let cancelled = false;
    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !googleMapElementRef.current) return;

        googleMapRef.current = new maps.Map(googleMapElementRef.current, {
          center: MYSURU_CENTER,
          zoom: 12,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: false,
          styles: document.documentElement.dataset.theme === 'dark' ? [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#d8dee9' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] }
          ] : []
        });

        googleMapRef.current.addListener('click', (event) => {
          const coords = { lng: Number(event.latLng.lng().toFixed(4)), lat: Number(event.latLng.lat().toFixed(4)) };
          sounds.playClick();
          onSelectPoint(coords);
        });

        setGoogleMapsState('ready');
      })
      .catch(() => setGoogleMapsState('fallback'));

    return () => {
      cancelled = true;
    };
  }, [onSelectPoint]);

  useEffect(() => {
    const maps = window.google?.maps;
    const map = googleMapRef.current;
    if (!maps || !map) return;

    googleOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    googleOverlaysRef.current = [];

    if (selectedPoint) {
      googleMarkerRef.current?.setMap(null);
      googleMarkerRef.current = new maps.Marker({
        position: selectedPoint,
        map,
        title: 'Selected civic location'
      });
    }

    return () => {
      googleOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
      googleOverlaysRef.current = [];
      googleMarkerRef.current?.setMap(null);
    };
  }, [activeEpoch, activeGazetteChanges, highlightArea, selectedPoint]);

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewBoxWidth = SVG_WIDTH / fallbackZoom;
    const viewBoxHeight = SVG_HEIGHT / fallbackZoom;
    const viewBoxX = (SVG_WIDTH - viewBoxWidth) / 2;
    const viewBoxY = (SVG_HEIGHT - viewBoxHeight) / 2;
    const x = viewBoxX + ((e.clientX - rect.left) / rect.width) * viewBoxWidth;
    const y = viewBoxY + ((e.clientY - rect.top) / rect.height) * viewBoxHeight;
    const coords = svgToLngLat(x, y);
    sounds.playClick();
    onSelectPoint(coords);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewBoxWidth = SVG_WIDTH / fallbackZoom;
    const viewBoxHeight = SVG_HEIGHT / fallbackZoom;
    const viewBoxX = (SVG_WIDTH - viewBoxWidth) / 2;
    const viewBoxY = (SVG_HEIGHT - viewBoxHeight) / 2;
    const x = viewBoxX + ((e.clientX - rect.left) / rect.width) * viewBoxWidth;
    const y = viewBoxY + ((e.clientY - rect.top) / rect.height) * viewBoxHeight;
    const coords = svgToLngLat(x, y);
    setMouseCoord(coords);
  };

  // Convert polygon coordinates to SVG path string
  const polygonToPath = (coords) => {
    return coords.map((pt, i) => {
      const [x, y] = lngLatToSvg(pt[0], pt[1]);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';
  };

  // Check if a polygon is currently transitioned or absorbed
  const getPolygonStatus = (polyKey) => {
    // Custom Gazette
    const custom = activeGazetteChanges.find(g => g.areaId === polyKey);
    if (custom) return { isAbsorbed: true, newOffice: custom.newOfficeId, label: 'Absorbed via Gazette' };

    // Active Epoch
    if (activeEpoch?.absorbedAreas) {
      const match = activeEpoch.absorbedAreas.find(a => a.areaId === polyKey);
      if (match) return { isAbsorbed: true, newOffice: match.newOffice, label: match.phase };
    }

    return { isAbsorbed: false, newOffice: null, label: null };
  };

  // Selected Pin Coordinates in SVG space
  const [pinX, pinY] = selectedPoint ? lngLatToSvg(selectedPoint.lng, selectedPoint.lat) : [310, 210];

  const changeZoom = (direction) => {
    const map = googleMapRef.current;
    if (map) {
      map.setZoom(Math.max(8, Math.min(18, (map.getZoom() || 12) + direction)));
      return;
    }

    setFallbackZoom((currentZoom) => Math.max(0.75, Math.min(2, currentZoom + direction * 0.25)));
  };

  const fallbackViewBox = `${(SVG_WIDTH - SVG_WIDTH / fallbackZoom) / 2} ${(SVG_HEIGHT - SVG_HEIGHT / fallbackZoom) / 2} ${SVG_WIDTH / fallbackZoom} ${SVG_HEIGHT / fallbackZoom}`;
  const embeddedMapUrl = `${GOOGLE_MAPS_EMBED_URL}&z=${Math.round(12 + (fallbackZoom - 1) * 4)}`;

  return (
    <div className="map-container">
      {/* Top Map Control Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Layers size={15} style={{ color: 'var(--color-mcc)' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {lang === 'kn' ? 'ಮೈಸೂರು ಮೂಲ ನಕ್ಷೆ' : 'Original Mysuru Map'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
          <Navigation size={13} style={{ color: 'var(--color-mcc)' }} />
          <span>{lang === 'kn' ? 'ನಕ್ಷೆಯಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ' : 'Click anywhere to pin location'}</span>
        </div>
      </div>

      {/* SVG GIS Viewport */}
      <div
        className="map-viewport" 
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHoveredPolygon(null);
          setMouseCoord(null);
        }}
      >
        <div className="map-zoom-controls" aria-label="Map zoom controls">
          <button type="button" className="btn-icon" onClick={(event) => { event.stopPropagation(); changeZoom(1); }} aria-label="Zoom in" title="Zoom in">
            <ZoomIn size={17} />
          </button>
          <button type="button" className="btn-icon" onClick={(event) => { event.stopPropagation(); changeZoom(-1); }} aria-label="Zoom out" title="Zoom out">
            <ZoomOut size={17} />
          </button>
        </div>
        {googleMapsState !== 'fallback' && (
          <div ref={googleMapElementRef} className="google-map" aria-label="Interactive Google map of Mysuru" />
        )}

        {googleMapsState === 'loading' && (
          <div className="map-loading">Loading Google Maps...</div>
        )}

        {googleMapsState === 'fallback' && !GOOGLE_MAPS_API_KEY && (
          <div className="google-map-image-wrap" onClick={handleMapClick}>
            <iframe
              className="google-map-image"
              src={embeddedMapUrl}
              title="Original Google Maps view of Mysuru"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex="-1"
            />
          </div>
        )}

        {googleMapsState === 'fallback' && GOOGLE_MAPS_API_KEY && (
        <svg 
          className="map-svg" 
          viewBox={fallbackViewBox}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle GIS Background Grid */}
          <defs>
            <pattern id="gis-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
            <radialGradient id="pin-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#gis-grid)" />

          {/* Mysuru Outer Ring Road (ORR) Expressway Contour */}
          <ellipse 
            cx="310" 
            cy="215" 
            rx="210" 
            ry="145" 
            fill="none" 
            stroke="rgba(239, 68, 68, 0.4)" 
            strokeWidth="3" 
            strokeDasharray="6 4"
          />
          <text x="310" y="75" fill="rgba(239, 68, 68, 0.7)" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="0.1em">
            MYSURU OUTER RING ROAD (NHAI / ORR 6-LANE CORRIDOR)
          </text>

          {/* Major Radial Highway Spokes */}
          <line x1="80" y1="210" x2="260" y2="210" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="310" y1="20" x2="310" y2="180" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="310" y1="240" x2="310" y2="400" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="360" y1="220" x2="560" y2="235" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="3 3" />

          {/* Render Jurisdictional Polygons */}
          {Object.entries(MYSURU_POLYGONS).map(([key, poly]) => {
            const status = getPolygonStatus(key);
            const isHovered = hoveredPolygon?.id === poly.id;
            const isHighlighted = highlightArea === key;
            const office = MYSURU_OFFICES[poly.officeId];

            // If absorbed into MCC, tint border cyan
            const strokeColor = status.isAbsorbed ? '#00f0ff' : poly.strokeColor;
            const fillColor = status.isAbsorbed 
              ? 'rgba(0, 240, 255, 0.22)' 
              : isHovered 
                ? 'rgba(255, 255, 255, 0.2)' 
                : poly.fillColor;

            return (
              <g 
                key={key}
                onMouseEnter={() => setHoveredPolygon({ ...poly, status, office })}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={polygonToPath(poly.coordinates)}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isHovered || isHighlighted ? 3 : status.isAbsorbed ? 2 : 1.5}
                  strokeDasharray={status.isAbsorbed ? '4 3' : 'none'}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: isHovered || isHighlighted ? 'drop-shadow(0 0 10px ' + strokeColor + ')' : 'none'
                  }}
                />
              </g>
            );
          })}

          {/* Chamundi Hill Contour Crest Label */}
          <text x="440" y="325" fill="#8b5cf6" fontSize="10" fontWeight="800" letterSpacing="0.05em">
            ⛰️ CHAMUNDI HILL (1074m)
          </text>

          {/* Selected Location Pin Marker with Radar Wave */}
          {selectedPoint && (
            <g transform={`translate(${pinX}, ${pinY})`}>
              <circle r="20" fill="url(#pin-glow)" opacity="0.6" className="epoch-pulse" />
              <circle r="5" fill="#00f0ff" stroke="#fff" strokeWidth="2" />
              <path 
                d="M 0 0 L -8 -22 A 8 8 0 1 1 8 -22 Z" 
                fill="#00f0ff" 
                stroke="#040814" 
                strokeWidth="1.5" 
                transform="scale(0.85) translate(0, -6)"
              />
              <circle cx="0" cy="-25" r="3" fill="#040814" />
            </g>
          )}
        </svg>
        )}

        {/* Floating Polygon Hover Details Tooltip */}
        {hoveredPolygon && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(8, 14, 28, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-md)',
            padding: '0.6rem 0.85rem',
            fontSize: '0.78rem',
            pointerEvents: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            maxWidth: '300px'
          }}>
            <div style={{ fontWeight: 800, color: 'var(--color-mcc)', marginBottom: '0.2rem' }}>
              {hoveredPolygon.label}
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
              <strong>Authority:</strong> {hoveredPolygon.office?.name}
            </div>
            {hoveredPolygon.status.isAbsorbed && (
              <div style={{ color: '#fbbf24', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <ShieldAlert size={12} />
                <span>Delimitation Active: {hoveredPolygon.status.label}</span>
              </div>
            )}
          </div>
        )}

        {/* Live Coordinate Crosshair Readout */}
        {mouseCoord && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0, 0, 0, 0.65)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.25rem 0.5rem',
            fontSize: '0.7rem',
            fontFamily: 'monospace',
            color: 'var(--color-mcc)',
            pointerEvents: 'none'
          }}>
            Lat: {mouseCoord.lat}°N | Lng: {mouseCoord.lng}°E
          </div>
        )}

      </div>

      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#00f0ff' }} />
          <span>MCC (City Corp)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ec4899' }} />
          <span>Hootagalli TMC</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#f59e0b' }} />
          <span>Bogadi / Srirampura TP</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#10b981' }} />
          <span>Gram Panchayats (Alanahalli / Siddalingapura)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#8b5cf6' }} />
          <span>Chamundi Hill Authority</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ef4444' }} />
          <span>NHAI Ring Road</span>
        </div>
      </div>
    </div>
  );
}
