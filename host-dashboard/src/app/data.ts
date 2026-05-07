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
  rescuerId: string;
  rescuerName: string;
  latitude: number;
  longitude: number;
  status: "ONLINE" | "BUSY" | "OFFLINE";
};

export type HistoryLog = {
  id: string;
  alertId: string;
  rescuerName: string;
  resolvedAt: string;
  duration: string;
};

