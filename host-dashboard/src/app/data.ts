export type SOSAlert = {
  id: string;
  victimName: string;
  message: string;
  battery: number;
  timestamp: string;
  lat: number;
  lng: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  status: "ACTIVE" | "ASSIGNED" | "RESOLVED";
  assignedTo?: string;
};

export type Rescuer = {
  id: string;
  name: string;
  phone: string;
  status: "ONLINE" | "BUSY" | "OFFLINE";
  lat: number;
  lng: number;
  activeAssignments: number;
};

export type HistoryLog = {
  id: string;
  alertId: string;
  rescuerName: string;
  resolvedAt: string;
  duration: string;
};

export const MOCK_ALERTS: SOSAlert[] = [
  {
    id: "SOS-8821",
    victimName: "Sarah Jenkins",
    message: "Trapped in vehicle after collision. Need immediate medical.",
    battery: 15,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    lat: 34.0522,
    lng: -118.2437, // LA
    severity: "CRITICAL",
    status: "ACTIVE"
  },
  {
    id: "SOS-8822",
    victimName: "Michael Chang",
    message: "Lost on hiking trail, out of water. Disoriented.",
    battery: 42,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    lat: 47.6062,
    lng: -122.3321, // Seattle
    severity: "HIGH",
    status: "ACTIVE"
  },
  {
    id: "SOS-8823",
    victimName: "Unknown",
    message: "Automated crash detection triggered.",
    battery: 89,
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    lat: 41.8781,
    lng: -87.6298, // Chicago
    severity: "CRITICAL",
    status: "ASSIGNED",
    assignedTo: "R-004"
  }
];

export const MOCK_RESCUERS: Rescuer[] = [
  { id: "R-001", name: "David Miller", phone: "+1 (555) 019-2831", status: "ONLINE", lat: 34.0622, lng: -118.2537, activeAssignments: 0 },
  { id: "R-002", name: "Elena Rostova", phone: "+1 (555) 012-9932", status: "ONLINE", lat: 47.6162, lng: -122.3421, activeAssignments: 0 },
  { id: "R-003", name: "Marcus Johnson", phone: "+1 (555) 018-8834", status: "ONLINE", lat: 34.0422, lng: -118.2337, activeAssignments: 0 },
  { id: "R-004", name: "Sarah Connor", phone: "+1 (555) 011-2244", status: "BUSY", lat: 41.8881, lng: -87.6398, activeAssignments: 1 },
  { id: "R-005", name: "James Bond", phone: "+1 (555) 007-0007", status: "OFFLINE", lat: 51.5074, lng: -0.1278, activeAssignments: 0 },
];

export const MOCK_HISTORY: HistoryLog[] = [
  { id: "H-101", alertId: "SOS-8799", rescuerName: "David Miller", resolvedAt: "10:42 AM", duration: "14m" },
  { id: "H-102", alertId: "SOS-8798", rescuerName: "Marcus Johnson", resolvedAt: "09:15 AM", duration: "22m" },
  { id: "H-103", alertId: "SOS-8795", rescuerName: "Elena Rostova", resolvedAt: "08:05 AM", duration: "45m" }
];
