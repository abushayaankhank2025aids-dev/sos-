import { BackendSOSData, SOSAlert } from '../data/mockData';
import { transformBackendData } from '../utils/sosUtils';

// Backend API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:5000';

export interface Rescuer {
  id: string;
  name: string;
  phone: string;
}

/**
 * WebSocket connection for real-time SOS alerts
 */
export class SOSWebSocket {
  private ws: WebSocket | null = null;
  private reconnectInterval: number = 5000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private onMessageCallback: ((alert: SOSAlert) => void) | null = null;
  private onStatusChangeCallback: ((status: 'connected' | 'disconnected' | 'error') => void) | null = null;

  constructor() {
    this.connect();
  }

  /**
   * Establish WebSocket connection
   */
  private connect() {
    try {
      this.ws = new WebSocket(`${WS_BASE_URL}/sos-feed`);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected to backend');
        this.onStatusChangeCallback?.('connected');
        this.clearReconnectTimer();
      };

      this.ws.onmessage = async (event) => {
        try {
          const backendData: BackendSOSData = JSON.parse(event.data);

          // Generate unique ID (you may receive this from backend)
          const id = `SOS-${Date.now()}`;

          // Transform backend data to frontend format
          const alert = await transformBackendData(backendData, id, 'Pending', false, true);

          this.onMessageCallback?.(alert);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.onStatusChangeCallback?.('error');
      };

      this.ws.onclose = () => {
        console.warn('⚠️ WebSocket disconnected');
        this.onStatusChangeCallback?.('disconnected');
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      console.log('🔄 Attempting to reconnect WebSocket...');
      this.connect();
    }, this.reconnectInterval);
  }

  /**
   * Clear reconnection timer
   */
  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Register callback for new messages
   */
  onMessage(callback: (alert: SOSAlert) => void) {
    this.onMessageCallback = callback;
  }

  /**
   * Register callback for connection status changes
   */
  onStatusChange(callback: (status: 'connected' | 'disconnected' | 'error') => void) {
    this.onStatusChangeCallback = callback;
  }

  /**
   * Close WebSocket connection
   */
  disconnect() {
    this.clearReconnectTimer();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

/**
 * REST API calls for SOS management
 */

/**
 * Fetch all active SOS alerts
 */
export async function fetchActiveAlerts(): Promise<SOSAlert[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts/active`);
    if (!response.ok) throw new Error('Failed to fetch alerts');

    const backendAlerts: BackendSOSData[] = await response.json();

    // Transform all backend data to frontend format
    const transformedAlerts = await Promise.all(
      backendAlerts.map((data, index) =>
        transformBackendData(data, `SOS-${Date.now()}-${index}`, 'Pending', false, false)
      )
    );

    return transformedAlerts;
  } catch (error) {
    console.error('Error fetching active alerts:', error);
    return [];
  }
}

/**
 * Fetch alert history (resolved alerts)
 */
export async function fetchAlertHistory(): Promise<SOSAlert[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts/history`);
    if (!response.ok) throw new Error('Failed to fetch history');

    const backendAlerts: BackendSOSData[] = await response.json();

    const transformedAlerts = await Promise.all(
      backendAlerts.map((data, index) =>
        transformBackendData(data, `SOS-${Date.now()}-${index}`, 'Resolved', false, false)
      )
    );

    return transformedAlerts;
  } catch (error) {
    console.error('Error fetching alert history:', error);
    return [];
  }
}

/**
 * Update SOS alert status
 */
export async function updateAlertStatus(
  alertId: string,
  newStatus: SOSAlert['status'],
  rescuerName: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
        rescuer: rescuerName,
        timestamp: new Date().toISOString(),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating alert status:', error);
    return false;
  }
}

/**
 * Assign alert to rescuer
 */
export async function assignAlert(alertId: string, rescuerId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sosId: alertId,
        rescuerId,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error assigning alert:', error);
    return false;
  }
}

export async function resolveAlert(alertId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sosId: alertId,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error resolving alert:', error);
    return false;
  }
}

export async function fetchSOSData(): Promise<BackendSOSData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sos`);
    if (!response.ok) throw new Error('Failed to fetch SOS data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching SOS data:', error);
    return [];
  }
}

export async function fetchRescuers(): Promise<Rescuer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/rescuers`);
    if (!response.ok) throw new Error('Failed to fetch rescuers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching rescuers:', error);
    return [];
  }
}

/**
 * Authenticate rescuer
 */
export async function authenticateRescuer(name: string, phone: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error authenticating rescuer:', error);
    return false;
  }
}
