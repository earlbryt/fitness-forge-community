
import React, { useState, useCallback, useEffect } from 'react';
import { MapPin, Locate } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';

// Placeholder component when map is not loaded
const MapPlaceholder = ({ message }: { message: string }) => (
  <div 
    className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center"
    style={{ border: '1px dashed #ccc' }}
  >
    <div className="text-center">
      <MapPin size={24} className="mx-auto mb-2 text-gray-400" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  </div>
);

interface LocationPoint {
  latitude: number;
  longitude: number;
  recorded_at?: string;
  accuracy?: number;
}

interface WorkoutMapProps {
  locationPoints: LocationPoint[];
  isDynamic: boolean;
  isActive: boolean;
}

// In a production app, use environment variables
const API_KEY = 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg'; // Replace with your own API key

const WorkoutMap: React.FC<WorkoutMapProps> = ({ 
  locationPoints, 
  isDynamic, 
  isActive 
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  // Load the Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    id: 'google-map-script'
  });

  // Callback when map is loaded
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Callback when map is unmounted
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Update map center when new location points are added
  useEffect(() => {
    if (map && locationPoints.length > 0 && isActive) {
      // Center the map on the latest location point
      const lastPoint = locationPoints[locationPoints.length - 1];
      map.panTo({ 
        lat: lastPoint.latitude, 
        lng: lastPoint.longitude 
      });
    }
  }, [map, locationPoints, isActive]);

  // Center map on current device location
  const centerOnCurrentLocation = useCallback(() => {
    if (!map) return;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.panTo(currentPos);
      },
      (error) => {
        console.error('Error centering on device position:', error);
      },
      { enableHighAccuracy: true }
    );
  }, [map]);

  // If there are no location points, show a placeholder
  if (locationPoints.length === 0) {
    return <MapPlaceholder message="No location data available" />;
  }

  // If an error occurred loading the map
  if (loadError) {
    return <MapPlaceholder message="Error loading map" />;
  }

  // If the map is not loaded yet
  if (!isLoaded) {
    return <MapPlaceholder message="Loading map..." />;
  }

  // Convert location points for Google Maps
  const center = {
    lat: locationPoints[locationPoints.length - 1].latitude,
    lng: locationPoints[locationPoints.length - 1].longitude
  };

  // Create path for the polyline (for route visualization)
  // Ensure each point is valid for Google Maps
  const path = locationPoints.map(point => ({
    lat: Number(point.latitude),
    lng: Number(point.longitude)
  })).filter(point => 
    !isNaN(point.lat) && 
    !isNaN(point.lng) && 
    point.lat !== null && 
    point.lng !== null
  );

  return (
    <div className="w-full h-64 rounded-md overflow-hidden border border-gray-200 relative">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true
        }}
      >
        {/* Draw the route if there are multiple points and it's a dynamic workout */}
        {isDynamic && path.length > 1 && (
          <Polyline
            path={path}
            options={{
              strokeColor: '#3B82F6',
              strokeOpacity: 0.8,
              strokeWeight: 4
            }}
          />
        )}
        
        {/* Show a marker at the current/last position */}
        <Marker
          position={center}
          title={isActive ? 'Current location' : 'Workout location'}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          }}
        />
        
        {/* If it's the start of the route, mark the starting position too */}
        {isDynamic && locationPoints.length > 1 && (
          <Marker
            position={{ 
              lat: locationPoints[0].latitude, 
              lng: locationPoints[0].longitude 
            }}
            title="Starting point"
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }}
          />
        )}
      </GoogleMap>
      
      {/* Button to center on current location */}
      <Button
        size="sm"
        className="absolute bottom-3 right-3 bg-white text-gray-700 shadow-md hover:bg-gray-100"
        onClick={centerOnCurrentLocation}
      >
        <Locate size={16} className="mr-1" />
        My Location
      </Button>
    </div>
  );
};

export default WorkoutMap;
