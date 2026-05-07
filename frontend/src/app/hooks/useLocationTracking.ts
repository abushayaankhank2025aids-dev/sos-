import { useEffect, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds

/**
 * Custom hook for real-time rescuer location tracking
 * Starts tracking when enabled and stops when disabled or component unmounts
 */
export function useLocationTracking(rescuerId: string | null | undefined, rescuerName: string | null | undefined, enabled: boolean = true) {
  const watchIdRef = useRef<number | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const currentLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!enabled || !rescuerId) {
      console.log('🔴 Location tracking disabled or no rescuerId');
      return;
    }

    console.log(`✅ Starting location tracking for rescuer: ${rescuerId} (${rescuerName || 'Unknown'})`);

    // Step 1: Request geolocation permission and start watching position
    if (!navigator.geolocation) {
      console.error('❌ Geolocation API not supported by this browser');
      return;
    }

    // Start watching the user's position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        currentLocationRef.current = { latitude, longitude };
        console.log(`📍 Got location: ${latitude}, ${longitude}`);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error('❌ Location permission denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            console.error('❌ Location information is unavailable');
            break;
          case error.TIMEOUT:
            console.error('❌ Location request timed out');
            break;
          default:
            console.error('❌ Unknown geolocation error:', error.message);
        }
      },
      {
        enableHighAccuracy: false, // Use balanced accuracy to save battery
        maximumAge: 0, // Don't use cached position
        timeout: 10000, // 10 second timeout
      }
    );

    // Step 2: Set up interval to send location to backend every 5 seconds
    intervalIdRef.current = setInterval(async () => {
      if (!currentLocationRef.current) {
        console.log('⏳ Waiting for initial location...');
        return;
      }

      const { latitude, longitude } = currentLocationRef.current;

      try {
        const response = await fetch(`${API_BASE_URL}/rescuer-location`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rescuerId,
            rescuerName: rescuerName || 'Unknown Rescuer',
            latitude,
            longitude,
            status: 'ONLINE',
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Failed to send location to backend:', errorData);
          return;
        }

        const data = await response.json();
        console.log(`✅ Location sent successfully: ${rescuerId} at (${latitude}, ${longitude})`);
      } catch (error) {
        console.error('❌ Error sending location to backend:', error);
      }
    }, LOCATION_UPDATE_INTERVAL);

    // Cleanup function
    return () => {
      console.log('🛑 Stopping location tracking');

      // Clear the watch
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      // Clear the interval
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [rescuerId, enabled]);
}
