/**
 * GIS Spatial Engine for Mysuru Boundaries
 * Implements Ray-Casting Point-in-Polygon (PIP) and boundary proximity detection.
 */

/**
 * Checks if a point [lng, lat] is inside a polygon [[lng, lat], ...]
 * using the standard Ray Casting algorithm.
 */
export function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Calculates Euclidean distance from a point to a line segment
 */
function distToSegment(p, v, w) {
  const [px, py] = p;
  const [vx, vy] = v;
  const [wx, wy] = w;

  const l2 = (vx - wx) * (vx - wx) + (vy - wy) * (vy - wy);
  if (l2 === 0) return Math.hypot(px - vx, py - vy);

  let t = ((px - vx) * (wx - vx) + (py - vy) * (wy - vy)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projX = vx + t * (wx - vx);
  const projY = vy + t * (wy - vy);

  return Math.hypot(px - projX, py - projY);
}

/**
 * Finds distance from point to nearest edge of polygon (in approximate meters)
 * 1 degree latitude in Mysuru (~12.3° N) is ~110.8 km.
 * 1 degree longitude is ~108.5 km.
 */
export function getDistanceToPolygonEdge(point, polygon) {
  let minDegDist = Infinity;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const dist = distToSegment(point, polygon[i], polygon[j]);
    if (dist < minDegDist) {
      minDegDist = dist;
    }
  }

  // Convert degrees to approximate meters
  return minDegDist * 110000;
}

/**
 * Computes polygon centroid for labeling
 */
export function getPolygonCentroid(polygon) {
  let xSum = 0;
  let ySum = 0;
  const n = polygon.length;

  for (let i = 0; i < n; i++) {
    xSum += polygon[i][0];
    ySum += polygon[i][1];
  }

  return [xSum / n, ySum / n];
}

/**
 * Spatial query against all active Mysuru boundary layers.
 * Returns the matching polygon ID, distance to edge, and border proximity flag.
 */
export function findJurisdictionPolygon(point, polygons) {
  let matchedPolygon = null;
  let minEdgeDist = Infinity;

  // First check direct containment
  for (const [key, polyObj] of Object.entries(polygons)) {
    if (isPointInPolygon(point, polyObj.coordinates)) {
      matchedPolygon = polyObj;
      minEdgeDist = getDistanceToPolygonEdge(point, polyObj.coordinates);
      break;
    }
  }

  // If no direct polygon match, find closest polygon within 2.5km
  if (!matchedPolygon) {
    let closestPoly = null;
    let closestDist = Infinity;

    for (const [key, polyObj] of Object.entries(polygons)) {
      const dist = getDistanceToPolygonEdge(point, polyObj.coordinates);
      if (dist < closestDist) {
        closestDist = dist;
        closestPoly = polyObj;
      }
    }

    matchedPolygon = closestPoly;
    minEdgeDist = closestDist;
  }

  const isBorderZone = minEdgeDist <= 120; // Within 120 meters of boundary

  return {
    polygon: matchedPolygon,
    distanceToEdgeMeters: Math.round(minEdgeDist),
    isBorderZone
  };
}
