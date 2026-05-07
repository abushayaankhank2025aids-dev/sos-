import { BackendSOSData, SOSAlert, Priority, TriggerType } from '../data/mockData';

/**
 * Derives priority level from message content, battery level, and keywords
 * HIGH: Medical emergencies, life-threatening situations, battery < 20%
 * MEDIUM: Stranded, supplies needed, moderate urgency
 * LOW: Infrastructure reports, wellness checks
 */
export function derivePriority(message: string, battery: number): Priority {
  const lowercaseMsg = message.toLowerCase();

  // Critical keywords = High priority
  const criticalKeywords = [
    'medical', 'emergency', 'chest pain', 'injured', 'bleeding', 'unconscious',
    'fire', 'smoke', 'flood', 'trapped', 'drowning', 'evacuate', 'evacuation',
    'life-threatening', 'critical', 'urgent', 'help immediately'
  ];

  // Medium urgency keywords
  const mediumKeywords = [
    'stranded', 'supplies', 'water', 'food', 'baby', 'infant', 'elderly',
    'blocked', 'stuck', 'cannot move', 'assistance needed'
  ];

  // Check for critical situations
  const hasCritical = criticalKeywords.some(keyword => lowercaseMsg.includes(keyword));
  if (hasCritical || battery < 20) {
    return 'High';
  }

  // Check for medium urgency
  const hasMedium = mediumKeywords.some(keyword => lowercaseMsg.includes(keyword));
  if (hasMedium || battery < 50) {
    return 'Medium';
  }

  return 'Low';
}

/**
 * Detects if SOS was triggered by voice or manual activation
 */
export function deriveTriggerType(message: string): TriggerType {
  const lowercaseMsg = message.toLowerCase();
  const voiceKeywords = ['voice', 'voice activated', 'voice alert', 'voice trigger', 'voice emergency'];

  return voiceKeywords.some(keyword => lowercaseMsg.includes(keyword)) ? 'voice' : 'manual';
}

/**
 * Generates AI summary based on message content
 * In production, this would call an actual AI service
 */
export function generateAISummary(message: string, priority: Priority): string {
  const lowercaseMsg = message.toLowerCase();

  // Medical emergencies
  if (lowercaseMsg.includes('medical') || lowercaseMsg.includes('chest pain') || lowercaseMsg.includes('injured')) {
    return 'Medical emergency detected. Immediate response required.';
  }

  // Fire/hazard
  if (lowercaseMsg.includes('fire') || lowercaseMsg.includes('smoke') || lowercaseMsg.includes('power line')) {
    return 'Fire/electrical hazard. Emergency services needed.';
  }

  // Flood/water
  if (lowercaseMsg.includes('flood') || lowercaseMsg.includes('water') || lowercaseMsg.includes('rising')) {
    return 'Flooding situation. Evacuation may be required.';
  }

  // Trapped/blocked
  if (lowercaseMsg.includes('trapped') || lowercaseMsg.includes('blocked') || lowercaseMsg.includes('stuck')) {
    return 'Individuals trapped or blocked. Rescue assistance needed.';
  }

  // Supplies
  if (lowercaseMsg.includes('supplies') || lowercaseMsg.includes('food') || lowercaseMsg.includes('formula')) {
    return 'Supply shortage. Delivery or assistance required.';
  }

  // Wellness check
  if (lowercaseMsg.includes('wellness') || lowercaseMsg.includes('check on')) {
    return 'Wellness check requested for individual.';
  }

  // Infrastructure
  if (lowercaseMsg.includes('road') || lowercaseMsg.includes('bridge') || lowercaseMsg.includes('infrastructure')) {
    return 'Infrastructure damage reported. Route planning affected.';
  }

  // Default based on priority
  return priority === 'High'
    ? 'High-priority emergency situation requiring immediate attention.'
    : priority === 'Medium'
    ? 'Moderate urgency situation requiring assistance.'
    : 'Low-priority report logged for awareness.';
}

/**
 * Reverse geocodes coordinates to address
 * In production, this would call a geocoding API
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  // TODO: Replace with actual geocoding API call
  // Example: OpenStreetMap Nominatim, Google Maps Geocoding API, etc.

  // For now, return formatted coordinates as fallback
  return `Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

/**
 * Transforms backend SOS data into frontend SOSAlert format
 */
export async function transformBackendData(
  backendData: BackendSOSData,
  id: string,
  status: SOSAlert['status'] = 'Pending',
  assignedToMe: boolean = false,
  isNew: boolean = true,
  assignedRescuer?: string
): Promise<SOSAlert> {
  const priority = derivePriority(backendData.message, backendData.battery);
  const triggerType = deriveTriggerType(backendData.message);
  const aiSummary = generateAISummary(backendData.message, priority);

  // Attempt reverse geocoding, fallback to coordinates
  let address: string;
  try {
    address = await reverseGeocode(backendData.latitude, backendData.longitude);
  } catch (error) {
    address = `${backendData.latitude.toFixed(4)}, ${backendData.longitude.toFixed(4)}`;
  }

  return {
    id,
    message: backendData.message,
    battery: backendData.battery,
    triggerType,
    aiSummary,
    priority,
    timestamp: backendData.timestamp,
    location: {
      address,
      lat: backendData.latitude,
      lng: backendData.longitude,
    },
    status,
    assignedToMe,
    assignedRescuer,
    isNew,
  };
}
