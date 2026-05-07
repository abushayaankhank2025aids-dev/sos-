import { FC, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { MapSection } from "./MapSection";
import { RightPanel } from "./RightPanel";
import { BottomAnalytics } from "./BottomAnalytics";
import { HistoryView } from "./HistoryView";
import { SOSAlert, MOCK_ALERTS, MOCK_RESCUERS } from "../data";
import socket from "../../services/socket";

export const Dashboard: FC = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [alerts, setAlerts] = useState<SOSAlert[]>(MOCK_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);

  useEffect(() => {
    const handleNewSOS = (sosData: any) => {
      const newAlert: SOSAlert = {
        id: sosData.id,
        victimName: "Unknown Victim", // Default since not provided
        message: sosData.message,
        battery: sosData.battery,
        timestamp: sosData.timestamp,
        lat: sosData.latitude,
        lng: sosData.longitude,
        severity: "HIGH", // Default severity
        status: "ACTIVE"
      };
      setAlerts(prev => [newAlert, ...prev]);
    };

    socket.on("newSOS", handleNewSOS);

    return () => {
      socket.off("newSOS", handleNewSOS);
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
          <MapSection alerts={alerts} rescuers={MOCK_RESCUERS} selectedAlert={selectedAlert} />
          <BottomAnalytics />
        </main>
        
        <RightPanel 
          alerts={alerts} 
          rescuers={MOCK_RESCUERS}
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
