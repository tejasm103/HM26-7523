/**
 * Delimitation Engine (The Twist Lifecycle Manager)
 * Handles dynamic boundary shifts, gazette ingestion, and automated cascade grievance migration.
 */

import { MYSURU_OFFICES } from '../data/mysuruJurisdictions.js';
import { routeComplaint } from './routingEngine.js';

/**
 * Executes an administrative gazette boundary shift and performs
 * hot-reassignment on all in-flight complaints.
 */
export function executeGazetteShift({
  existingComplaints = [],
  annexedAreaId,
  targetOfficeId,
  gazetteNo = 'GO-UDD/89/MLR/2025',
  effectiveDate = new Date().toISOString(),
  phase = 'Phase 2 - Mandatory Asset & Service Cutover',
  activeEpoch = null,
  activeGazetteChanges = []
}) {
  const targetOffice = MYSURU_OFFICES[targetOfficeId];
  if (!targetOffice) {
    throw new Error(`Target office ID ${targetOfficeId} not found in registry.`);
  }

  // Record this gazette order
  const newGazetteRecord = {
    id: `GAZETTE-${Date.now()}`,
    gazetteNo,
    areaId: annexedAreaId,
    newOfficeId: targetOfficeId,
    newOfficeName: targetOffice.name,
    effectiveDate,
    phase,
    timestamp: new Date().toISOString()
  };

  const updatedGazetteChanges = [...activeGazetteChanges, newGazetteRecord];

  // Perform Automated Cascade Migration
  const migrationLogs = [];
  const citizenNotifications = [];
  let affectedCount = 0;

  const updatedComplaints = existingComplaints.map(complaint => {
    // Check if complaint is still active / open
    if (complaint.status === 'RESOLVED') {
      return complaint;
    }

    // Re-route with the new gazette changes active
    const newRouting = routeComplaint({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      locationName: complaint.locationName,
      coordinates: complaint.coordinates,
      pincode: complaint.pincode,
      activeEpoch,
      activeGazetteChanges: updatedGazetteChanges
    });

    // Check if office has changed
    const previousOfficeId = complaint.assignedOffice?.id;
    const hasShifted = previousOfficeId !== newRouting.office.id;

    if (hasShifted) {
      affectedCount++;

      const transferDocket = {
        transferId: `XFR-${Date.now()}-${affectedCount}`,
        timestamp: new Date().toLocaleTimeString(),
        previousOffice: complaint.assignedOffice?.name || 'Previous Local Body',
        previousOfficeCode: complaint.assignedOffice?.code || 'N/A',
        newOffice: newRouting.office.name,
        newOfficeCode: newRouting.office.code,
        gazetteNo,
        phase,
        reason: `Statutory jurisdiction shift under Gazette ${gazetteNo}. Responsibility transferred to ${newRouting.office.shortName}.`,
        newNodalOfficer: newRouting.escalationContact,
        newPhone: newRouting.escalationPhone
      };

      // Citizen Alert Simulation
      const notificationMsg = `[MYSURU CIVIC NOTIFICATION]\nTicket #${complaint.id}: Your grievance at "${complaint.locationName}" has been AUTOMATICALLY TRANSFERRED from ${complaint.assignedOffice?.shortName} to ${newRouting.office.name}.\nAuthority Order: ${gazetteNo}\nAssigned Officer: ${newRouting.escalationContact} (${newRouting.escalationPhone})\nStatus: Active In-Transition.`;

      citizenNotifications.push({
        ticketId: complaint.id,
        citizenName: complaint.citizenName || 'Mysuru Citizen',
        phone: complaint.phone || '+91 98450 XXXXX',
        message: notificationMsg,
        timestamp: new Date().toLocaleTimeString()
      });

      migrationLogs.push({
        type: 'JURISDICTION_REASSIGNMENT',
        ticketId: complaint.id,
        title: complaint.title,
        from: complaint.assignedOffice?.shortName,
        to: newRouting.office.shortName,
        order: gazetteNo,
        timestamp: new Date().toLocaleTimeString()
      });

      return {
        ...complaint,
        assignedOffice: newRouting.office,
        department: newRouting.department,
        routingMeta: newRouting,
        status: 'MIGRATED',
        isTransitioning: true,
        transferHistory: [...(complaint.transferHistory || []), transferDocket],
        lastUpdated: new Date().toISOString()
      };
    }

    return complaint;
  });

  return {
    updatedComplaints,
    updatedGazetteChanges,
    gazetteRecord: newGazetteRecord,
    affectedCount,
    migrationLogs,
    citizenNotifications
  };
}
