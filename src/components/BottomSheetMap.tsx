import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, Circle } from '@react-google-maps/api';
import { X, ChevronUp, ChevronDown, MapPin, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Placeholder component when map is not loaded
const MapPlaceholder = ({ message }: { message: string }) => (
  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
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
}

interface BottomSheetMapProps {
  locationPoints: LocationPoint[];
  isDynamic: boolean;
  isActive: boolean;
  isOpen: boolean;
  onClose: () => void;
}

// Use a free API key with HTTP referrer restrictions
// In a production app, you would use environment variables
const API_KEY = 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg'; // Google Maps demo API key

// Current position marker with animation
const PulsingLocationMarker: React.FC<{
  position: google.maps.LatLngLiteral;
  isActive: boolean;
}> = ({ position, isActive }) => {
  const [radius, setRadius] = useState(10);
  
  // Pulsing animation for the active location
  useEffect(() => {
    if (!isActive) return;
    
    let growing = true;
    const minRadius = 10;
    const maxRadius = 25;
    const animationSpeed = 0.5;
    
    const intervalId = setInterval(() => {
      setRadius(current => {
        if (growing) {
          const newRadius = current + animationSpeed;
          if (newRadius >= maxRadius) {
            growing = false;
            return maxRadius;
          }
          return newRadius;
        } else {
          const newRadius = current - animationSpeed;
          if (newRadius <= minRadius) {
            growing = true;
            return minRadius;
          }
          return newRadius;
        }
      });
    }, 16); // ~60fps
    
    return () => clearInterval(intervalId);
  }, [isActive]);
  
  return (
    <>
      {/* Pulsing circle background */}
      <Circle
        center={position}
        radius={radius}
        options={{
          strokeColor: '#3B82F6',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#3B82F6',
          fillOpacity: 0.35,
        }}
      />
      
      {/* Main position marker */}
      <Marker
        position={position}
        title="Current location"
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        }}
      />
    </>
  );
};

const BottomSheetMap: React.FC<BottomSheetMapProps> = ({
  locationPoints,
  isDynamic,
  isActive,
  isOpen,
  onClose
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  // Load the Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    id: 'google-map-script',
  });

  // Callback when map is loaded
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Smooth out map movements and give it a more fluid feel
    map.setOptions({
      gestureHandling: 'greedy',
      zoomControl: true,
      clickableIcons: false,
      disableDefaultUI: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });
  }, []);

  // Callback when map is unmounted
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Update map center when new location points are added
  useEffect(() => {
    if (map && locationPoints.length > 0 && isActive) {
      // Get the latest location point
      const lastPoint = locationPoints[locationPoints.length - 1];
      const newCenter = {
        lat: lastPoint.latitude,
        lng: lastPoint.longitude,
      };
      
      // Smoothly animate to the new position instead of jumping
      map.panTo(newCenter);
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

  // If there are no location points
  if (locationPoints.length === 0) {
    return null;
  }

  // Convert location points for Google Maps
  const center = locationPoints.length > 0
    ? {
        lat: locationPoints[locationPoints.length - 1].latitude,
        lng: locationPoints[locationPoints.length - 1].longitude,
      }
    : { lat: 0, lng: 0 };

  // Create path for the polyline (for route visualization)
  const path = locationPoints.map(point => ({
    lat: point.latitude,
    lng: point.longitude,
  }));

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundColor: '#fff',
        transition: 'all 0.3s ease',
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
      }}
    >
      {/* Header with title and close button */}
      <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200 bg-white">
        <h3 className="font-medium text-lg">
          {isDynamic ? 'Workout Route' : 'Workout Location'}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 rounded-full p-0 flex items-center justify-center"
          onClick={onClose}
          aria-label="Close map"
        >
          <X size={20} />
        </Button>
      </div>

      {/* Map container */}
      <div className="w-full flex-grow relative">
        {loadError ? (
          <MapPlaceholder message="Error loading map" />
        ) : !isLoaded ? (
          <MapPlaceholder message="Loading map..." />
        ) : (
          <>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={16}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: true,
                scrollwheel: true,
                rotateControl: false,
                scaleControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                tilt: 0,
                styles: [
                  {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                  },
                  {
                    featureType: 'transit',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                  }
                ]
              }}
            >
              {/* Draw the route trail if there are multiple points and it's a dynamic workout */}
              {isDynamic && locationPoints.length > 1 && (
                <Polyline
                  path={path}
                  options={{
                    strokeColor: '#3B82F6',
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                    strokeJoin: 'round',
                    geodesic: true,
                  }}
                />
              )}

              {/* Animated current position marker */}
              <PulsingLocationMarker
                position={center}
                isActive={isActive}
              />

              {/* Starting point marker */}
              {isDynamic && locationPoints.length > 1 && (
                <Marker
                  position={{
                    lat: locationPoints[0].latitude,
                    lng: locationPoints[0].longitude,
                  }}
                  title="Starting point"
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                  }}
                />
              )}
            </GoogleMap>
            
            {/* Button to center on current location */}
            <Button
              size="sm"
              className="absolute bottom-4 right-4 bg-white text-gray-700 shadow-md hover:bg-gray-100 z-10 rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
              onClick={centerOnCurrentLocation}
            >
              <Locate size={16} className="mr-2" />
              Center on Me
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default BottomSheetMap;
