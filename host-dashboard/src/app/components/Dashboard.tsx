import { FC, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { MapSection } from "./MapSection";
import { RightPanel } from "./RightPanel";
import { BottomAnalytics } from "./BottomAnalytics";
import { HistoryView } from "./HistoryView";
import { SOSAlert, Rescuer } from "../data";
import socket from "../../services/socket";

export const Dashboard: FC = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [rescuers, setRescuers] = useState<Rescuer[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);

  useEffect(() => {
    // Fetch initial SOS alerts and rescuer locations from backend
    const fetchInitialData = async () => {
      try {
        const [sosRes, rescuerRes] = await Promise.all([
          fetch("http://localhost:5000/sos"),
          fetch("http://localhost:5000/rescuer-locations")
        ]);
        
        const sosData = await sosRes.json();
        const rescuerData = await rescuerRes.json();
        
        const formattedAlerts: SOSAlert[] = sosData.map((sos: any) => ({
          id: sos.id,
          victimName: "Emergency Victim",
          message: sos.message,
          battery: sos.battery,
          timestamp: sos.timestamp,
          lat: sos.latitude,
          lng: sos.longitude,
          severity: sos.battery <= 20 ? "CRITICAL" : sos.battery <= 50 ? "HIGH" : "MEDIUM",
          status: sos.status || "ACTIVE"
        }));
        
        const formattedRescuers: Rescuer[] = rescuerData.map((rescuer: any) => ({
          rescuerId: rescuer.rescuerId,
          rescuerName: rescuer.rescuerName,
          latitude: rescuer.latitude,
          longitude: rescuer.longitude,
          status: rescuer.status || "ONLINE"
        }));
        
        setAlerts(formattedAlerts);
        setRescuers(formattedRescuers);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleNewSOS = (sosData: any) => {
      const newAlert: SOSAlert = {
        id: sosData.id,
        victimName: "Emergency Victim",
        message: sosData.message,
        battery: sosData.battery,
        timestamp: sosData.timestamp,
        lat: sosData.latitude,
        lng: sosData.longitude,
        severity: sosData.battery <= 20 ? "CRITICAL" : sosData.battery <= 50 ? "HIGH" : "MEDIUM",
        status: "ACTIVE"
      };
      setAlerts(prev => [newAlert, ...prev]);
    };

    const handleRescuerUpdate = (rescuerData: any) => {
      setRescuers(prev => {
        const existing = prev.findIndex(r => r.rescuerId === rescuerData.rescuerId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = {
            rescuerId: rescuerData.rescuerId,
            rescuerName: rescuerData.rescuerName,
            latitude: rescuerData.latitude,
            longitude: rescuerData.longitude,
            status: rescuerData.status
          };
          return updated;
        } else {
          return [...prev, {
            rescuerId: rescuerData.rescuerId,
            rescuerName: rescuerData.rescuerName,
            latitude: rescuerData.latitude,
            longitude: rescuerData.longitude,
            status: rescuerData.status
          }];
        }
      });
    };

    socket.on("newSOS", handleNewSOS);
    socket.on("rescuerLocationUpdate", handleRescuerUpdate);

    return () => {
      socket.off("newSOS", handleNewSOS);
      socket.off("rescuerLocationUpdate", handleRescuerUpdate);
    };
  }, []);

  const handleAssign = (alertId: string, rescuerId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, status: "ASSIGNED", assignedTo: rescuerId } : a
    ));
    setSelectedAlert(null);
  };

  const renderContent = () => {
    if (activeTab === "History") {
      return <HistoryView />;
    }

    return (
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 relative flex flex-col">
          <MapSection alerts={alerts} rescuers={rescuers} selectedAlert={selectedAlert} />
          <BottomAnalytics />
        </main>
        
        <RightPanel 
          alerts={alerts} 
          rescuers={rescuers}
          selectedAlert={selectedAlert}
          onSelectAlert={setSelectedAlert}
          onAssign={handleAssign}
        />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#060913] text-slate-200 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col relative">
        <TopHeader />
        {renderContent()}
      </div>
    </div>
  );
};
