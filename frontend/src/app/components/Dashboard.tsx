import React, { useState, useMemo, useEffect } from 'react';
import { SOSAlert } from '../data/mockData';
import { SOSCard } from './SOSCard';
import { RealMapView } from './RealMapView';
import { Activity, History, Filter, Map as MapIcon, List as ListIcon, LogOut, Wifi, Radio, Signal, RefreshCw, User, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import appIcon from '../../imports/app_icon.png';
import { fetchSOSData, fetchRescuers, assignAlert, resolveAlert, Rescuer } from '../services/api';
import { transformBackendData } from '../utils/sosUtils';

export function Dashboard() {
  // Constant for current rescuer ID
  const CURRENT_RESCUER_ID = 'rescuer_1';
  
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [rescuers, setRescuers] = useState<Rescuer[]>([]);
  const [activeTab, setActiveTab] = useState<'Active' | 'History'>('Active');
  const [filterMode, setFilterMode] = useState<'All' | 'Assigned'>('All');
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'List' | 'Map'>('List');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ============================================
  // BACKEND INTEGRATION - WebSocket Connection
  // ============================================
  useEffect(() => {
    // TODO: Uncomment when backend is ready
    /*
    const ws = new SOSWebSocket();
    wsRef.current = ws;

    // Listen for new real-time alerts
    ws.onMessage((newAlert: SOSAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
      // Optional: Play notification sound for new alerts
      // new Audio('/notification.mp3').play();
    });

    // Listen for connection status changes
    ws.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    // Cleanup on unmount
    return () => {
      ws.disconnect();
    };
    */

    // MOCK: Simulate connection status for development
    setConnectionStatus('connected');
  }, []);

  // ============================================
  // BACKEND INTEGRATION - Auto-Refresh & Data Fetch
  // ============================================
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const [sosData, rescuerData] = await Promise.all([
          fetchSOSData(),
          fetchRescuers(),
        ]);

        const transformedAlerts = await Promise.all(
          sosData.map((data, index) =>
            transformBackendData(
              data,
              data.id || `SOS-${data.timestamp}-${data.latitude.toFixed(4)}-${data.longitude.toFixed(4)}-${index}`,
              (data.status as SOSAlert['status']) || 'Pending',
              data.assignedRescuer === CURRENT_RESCUER_ID,
              false,
              data.assignedRescuer
            )
          )
        );

        // Merge polled data with local state, preserving local assignments
        setAlerts(prevAlerts => {
          const alertMap = new Map(prevAlerts.map(a => [a.id, a]));
          
          transformedAlerts.forEach(newAlert => {
            const existingAlert = alertMap.get(newAlert.id);
            if (existingAlert && existingAlert.assignedRescuer) {
              // Preserve local assignment
              alertMap.set(newAlert.id, {
                ...newAlert,
                assignedRescuer: existingAlert.assignedRescuer,
                assignedToMe: true,
              });
            } else {
              // Use new data from backend
              alertMap.set(newAlert.id, newAlert);
            }
          });
          
          return Array.from(alertMap.values());
        });
        
        setRescuers(rescuerData);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Failed to load backend data:', error);
        setConnectionStatus('error');
      }
    };

    loadBackendData();

    const timer = setInterval(() => {
      setLastRefresh(new Date());
      loadBackendData();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // ============================================
  // BACKEND INTEGRATION - Status Update
  // ============================================
  const handleUpdateStatus = async (id: string, newStatus: SOSAlert['status']) => {
    const previousAlerts = alerts;

    if (newStatus === 'Accepted') {
      // Optimistically update UI for assignment
      setAlerts(prev => prev.map(alert => {
        if (alert.id === id) {
          return {
            ...alert,
            status: newStatus,
            assignedToMe: true,
            assignedRescuer: CURRENT_RESCUER_ID,
            isNew: false,
          };
        }
        return alert;
      }));

      try {
        const success = await assignAlert(id, CURRENT_RESCUER_ID);
        if (!success) {
          setAlerts(previousAlerts);
          console.error('Failed to assign alert on backend');
        }
      } catch (error) {
        setAlerts(previousAlerts);
        console.error('Error assigning alert:', error);
      }
    } else if (newStatus === 'Resolved') {
      // Optimistically update UI for resolution
      setAlerts(prev => prev.map(alert => {
        if (alert.id === id) {
          return {
            ...alert,
            status: newStatus,
            resolvedAt: new Date().toISOString(),
            isNew: false,
          };
        }
        return alert;
      }));

      try {
        const success = await resolveAlert(id);
        if (!success) {
          setAlerts(previousAlerts);
          console.error('Failed to resolve alert on backend');
        }
      } catch (error) {
        setAlerts(previousAlerts);
        console.error('Error resolving alert:', error);
      }
    } else {
      // For other status updates, just update locally
      setAlerts(prev => prev.map(alert => {
        if (alert.id === id) {
          return {
            ...alert,
            status: newStatus,
            isNew: false,
          };
        }
        return alert;
      }));
    }
  };

  const displayedAlerts = useMemo(() => {
    let filtered = alerts;
    
    if (activeTab === 'Active') {
      filtered = filtered.filter(a => a.status !== 'Resolved');
      
      // If viewing "Assigned to Me", show only alerts assigned to current rescuer
      if (filterMode === 'Assigned') {
        filtered = filtered.filter(a => a.assignedRescuer === CURRENT_RESCUER_ID);
      } else {
        // For "All Alerts", exclude alerts assigned to current rescuer
        filtered = filtered.filter(a => a.assignedRescuer !== CURRENT_RESCUER_ID);
      }
    } else {
      // History tab shows resolved alerts
      filtered = filtered.filter(a => a.status === 'Resolved');
    }
    
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    return filtered.sort((a, b) => {
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [alerts, activeTab, filterMode, CURRENT_RESCUER_ID]);

  return (
    <div className="flex flex-col h-screen bg-[#0b1120] text-slate-200 overflow-hidden font-sans">
      
      {/* HEADER */}
      <header className="flex-none bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-950 rounded-full flex items-center justify-center border border-slate-700/50 shadow-md overflow-hidden">
              <img src={appIcon} alt="ARS Icon" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-tight">ARS Control</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Live</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                  <RefreshCw className="w-3 h-3 animate-[spin_4s_linear_infinite]" />
                  <span>Refreshing every 10s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-4 ml-4">
            <div className="flex p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('Active')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${activeTab === 'Active' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Activity className="w-4 h-4" /> Active Missions
              </button>
              <button
                onClick={() => setActiveTab('History')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${activeTab === 'History' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <History className="w-4 h-4" /> History
              </button>
            </div>
            <div className="flex p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => setFilterMode('All')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterMode === 'All' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                All Alerts
              </button>
              <button
                onClick={() => setFilterMode('Assigned')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterMode === 'Assigned' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Assigned to Me
              </button>
            </div>
          </div>
        </div>

        {/* Rescuer Identity Panel */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2 border-r border-slate-700 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{user?.name}</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">On Duty</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">{user?.phone}</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex flex-col items-center justify-center ${
                connectionStatus === 'connected' ? 'text-emerald-500' :
                connectionStatus === 'error' ? 'text-red-500' : 'text-yellow-500'
              }`}
              title={connectionStatus === 'connected' ? 'System Online' : connectionStatus === 'error' ? 'Connection Error' : 'Connecting...'}
            >
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                connectionStatus === 'connected' ? 'bg-emerald-500/10 border-emerald-500/20' :
                connectionStatus === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-yellow-500/10 border-yellow-500/20'
              }`}>
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">
                  {connectionStatus === 'connected' ? 'Live System Active' :
                   connectionStatus === 'error' ? 'Connection Error' : 'Connecting...'}
                </span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex md:hidden p-1 bg-slate-800 rounded-lg border border-slate-700 ml-2">
             <button
                onClick={() => setMobileView('List')}
                className={`p-2 rounded-md transition-colors ${mobileView === 'List' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileView('Map')}
                className={`p-2 rounded-md transition-colors ${mobileView === 'Map' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
              >
                <MapIcon className="w-5 h-5" />
              </button>
          </div>
        </div>
      </header>

      {/* Mobile Filters */}
      <div className="lg:hidden flex-none bg-slate-900 border-b border-slate-800/50 p-2 flex gap-2 overflow-x-auto no-scrollbar">
          <button
              onClick={() => setActiveTab('Active')}
              className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 ${activeTab === 'Active' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              <Activity className="w-3.5 h-3.5" /> Active
          </button>
          <button
              onClick={() => setActiveTab('History')}
              className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 ${activeTab === 'History' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              <History className="w-3.5 h-3.5" /> History
          </button>
          <div className="w-px h-6 bg-slate-700 shrink-0 self-center mx-1"></div>
          <button
              onClick={() => setFilterMode('All')}
              className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filterMode === 'All' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              All Alerts
          </button>
          <button
              onClick={() => setFilterMode('Assigned')}
              className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filterMode === 'Assigned' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              Assigned to Me
          </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col md:flex-row p-0 md:p-4 gap-4">
          
          {/* LIST VIEW (Left Panel) */}
          <div className={`
            flex-none w-full md:w-[420px] lg:w-[480px] h-full flex flex-col bg-slate-900/80 md:rounded-2xl border-0 md:border border-slate-700 shadow-2xl overflow-hidden
            ${mobileView === 'Map' ? 'hidden md:flex' : 'flex'}
          `}>
            <div className="flex-none p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 backdrop-blur-md z-10">
              <h2 className="font-bold text-white flex items-center gap-2">
                {activeTab === 'Active' ? 'Incoming Alerts' : 'Mission History'}
                <span className="bg-slate-950 text-slate-300 text-xs py-0.5 px-2 rounded-full border border-slate-700 shadow-inner">
                  {displayedAlerts.length}
                </span>
              </h2>
              <Filter className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white transition-colors" />
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 relative no-scrollbar">
              <AnimatePresence mode='popLayout'>
                {displayedAlerts.length > 0 ? (
                  displayedAlerts.map(alert => (
                    <SOSCard 
                      key={alert.id}
                      alert={alert}
                      isActive={activeAlertId === alert.id}
                      onClick={() => setActiveAlertId(alert.id)}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-slate-500 text-sm p-6 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                      <ShieldAlert className="w-8 h-8 opacity-50" />
                    </div>
                    <p>No alerts found for current filters.</p>
                    <p className="text-xs mt-2 text-slate-600">Waiting for incoming SOS signals...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* MAP VIEW (Right Panel) */}
          <div className={`
            flex-1 h-full min-h-0 relative
            ${mobileView === 'List' ? 'hidden md:block' : 'block'}
          `}>
            <RealMapView 
              alerts={displayedAlerts} 
              activeAlertId={activeAlertId} 
              onMarkerClick={(id) => {
                setActiveAlertId(id);
                if (window.innerWidth < 768) {
                  setMobileView('List');
                }
              }} 
            />
          </div>

        </div>
      </main>

    </div>
  );
}
