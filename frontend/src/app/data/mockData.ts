export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Pending' | 'Accepted' | 'Reached' | 'Resolved';
export type TriggerType = 'voice' | 'manual';

// Backend data format (from API/WebSocket)
export interface BackendSOSData {
  id?: string;
  latitude: number;
  longitude: number;
  message: string;
  battery: number;
  timestamp: string;
  status?: string;
  assignedRescuer?: string;
}

// Frontend enhanced data (with derived fields and state)
export interface SOSAlert {
  id: string;
  message: string;
  battery: number; // Battery percentage (0-100)
  aiSummary: string;
  priority: Priority;
  triggerType: TriggerType;
  timestamp: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  status: Status;
  assignedToMe: boolean;
  assignedRescuer?: string;
  isNew?: boolean;
}

// San Francisco roughly 37.7749, -122.4194
export const mockSOSData: SOSAlert[] = [
  {
    id: "SOS-8831",
    message: "Water level is rising rapidly in our basement. We have two elderly people here who cannot climb stairs easily. We need immediate evacuation assistance.",
    battery: 15,
    triggerType: "manual",
    aiSummary: "Trapped elderly individuals due to rising flood waters. Evacuation required.",
    priority: "High",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    location: {
      address: "142 Riverfront Ave, Sector 4",
      lat: 37.7858,
      lng: -122.4064,
    },
    status: "Pending",
    assignedToMe: false,
    isNew: true,
  },
  {
    id: "SOS-8832",
    message: "Emergency voice alert activated. Power line down across our driveway, sparking. We are staying inside but smell smoke from the nearby trees. Please send fire department.",
    battery: 42,
    triggerType: "voice",
    aiSummary: "Active downed power line causing fire hazard. Containment needed.",
    priority: "High",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    location: {
      address: "89 Pine Ridge Rd, North Hills",
      lat: 37.7958,
      lng: -122.4064, // close to 8831
    },
    status: "Accepted",
    assignedToMe: true,
  },
  {
    id: "SOS-8833",
    message: "We are out of drinking water and baby formula. The roads are blocked by debris. We are 3 adults and 1 infant, safe for now but supplies are gone.",
    battery: 67,
    triggerType: "manual",
    aiSummary: "Safe but stranded. Requires water and infant supplies delivery.",
    priority: "Medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    location: {
      address: "Appt 4B, 550 West St",
      lat: 37.7650,
      lng: -122.4200,
    },
    status: "Pending",
    assignedToMe: false,
  },
  {
    id: "SOS-8834",
    message: "Road is completely washed out on Highway 9 near the bridge. No vehicles can pass. Marking this for other units.",
    battery: 85,
    triggerType: "manual",
    aiSummary: "Infrastructure damage. Highway 9 bridge impassable.",
    priority: "Low",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    location: {
      address: "Highway 9, Mile Marker 42",
      lat: 37.7400,
      lng: -122.4500,
    },
    status: "Pending",
    assignedToMe: false,
  },
  {
    id: "SOS-8835",
    message: "Voice activated emergency alert. Medical emergency. My husband is having chest pains and we cannot get out because of the mudslide blocking our street.",
    battery: 8,
    triggerType: "voice",
    aiSummary: "Severe medical emergency (chest pain) blocked by mudslide. Needs medevac/immediate access.",
    priority: "High",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    location: {
      address: "202 Valley View Dr",
      lat: 37.7550,
      lng: -122.4800,
    },
    status: "Reached",
    assignedToMe: true,
  },
  {
    id: "SOS-8836",
    message: "Requesting a wellness check on my grandmother. I haven't been able to reach her for 24 hours since the storm hit.",
    battery: 91,
    triggerType: "manual",
    aiSummary: "Post-storm wellness check requested for elderly relative.",
    priority: "Medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    location: {
      address: "710 Maple Lane",
      lat: 37.7200,
      lng: -122.4300,
    },
    status: "Resolved",
    assignedToMe: true,
  }
];
