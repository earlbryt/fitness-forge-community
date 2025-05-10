import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Activity, MapPin, Play, Square, Eye, Map } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '../lib/supabase';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import WorkoutMap from '../components/WorkoutMap';
import WorkoutSummary from '../components/WorkoutSummary';
import WorkoutStats from '../components/WorkoutStats';
import WorkoutDetail from '../components/WorkoutDetail';
import useWorkoutAuth from '../hooks/useWorkoutAuth';
import BottomSheetMap from '../components/BottomSheetMap';

type WorkoutType = 'Running' | 'Cycling' | 'Yoga' | 'Weightlifting';

interface LocationPoint {
  latitude: number;
  longitude: number;
  recorded_at?: string;
  accuracy?: number;
}

interface Workout {
  id: string;
  workout_type: WorkoutType;
  start_time: string;
  end_time?: string;
  duration?: number;
  distance?: number;
  is_dynamic: boolean;
  is_verified: boolean;
  verification_photo?: string;
}

const Workouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<WorkoutType>('Running');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [completedWorkout, setCompletedWorkout] = useState<Workout | null>(null);
  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);
  const [locationError, setLocationError] = useState<string>('');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>('');
  
  const locationIntervalRef = useRef<number | null>(null);
  const workoutStartTimeRef = useRef<Date | null>(null);

  // Auth hook for user management
  const { getUserId, loading } = useWorkoutAuth();

  // Define which workout types are dynamic (involve movement)
  const isDynamicWorkout = (type: WorkoutType) => ['Running', 'Cycling'].includes(type);

  // Load workouts on component mount and when auth is ready
  useEffect(() => {
    if (!loading) {
      fetchWorkouts();
    }
  }, [loading]);

  // Clean up location tracking on unmount
  useEffect(() => {
    return () => {
      if (locationIntervalRef.current) {
        window.clearInterval(locationIntervalRef.current);
      }
    };
  }, []);

  const fetchWorkouts = async () => {
    try {
      const userId = getUserId();
      console.log('Fetching workouts for user ID:', userId);
      
      // Fetch workouts from Supabase using the current user ID
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      
      console.log('Fetched workouts:', data?.length || 0);
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const startWorkout = async () => {
    // Reset any completed workout
    setCompletedWorkout(null);
    
    // Request location permission with high accuracy
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setPermissionGranted(true);
          setLocationError('');
          
          console.log('Initial location for workout:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          
          // Set initial location
          const initialLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          // Store initial location
          setLocationPoints([initialLocation]);
          
          // Create workout record
          try {
            const isDynamic = isDynamicWorkout(selectedWorkoutType);
            const { data, error } = await supabase
              .from('workouts')
              .insert({
                workout_type: selectedWorkoutType,
                is_dynamic: isDynamic,
                user_id: getUserId() // Use the getUserId function
              })
              .select()
              .single();
              
            if (error) throw error;
            
            if (data) {
              setCurrentWorkout(data);
              
              // Store first location point
              await supabase.from('location_points').insert({
                workout_id: data.id,
                latitude: initialLocation.latitude,
                longitude: initialLocation.longitude
              });
              
              // Start tracking location
              workoutStartTimeRef.current = new Date();
              setIsTracking(true);
              
              // Set up interval for location tracking
              // Use shorter intervals for better accuracy in dynamic workouts
              const trackingFrequency = isDynamic ? 3000 : 15000; // 3s for dynamic, 15s for static
              
              // Clear any existing interval
              if (locationIntervalRef.current) {
                window.clearInterval(locationIntervalRef.current);
              }
              
              locationIntervalRef.current = window.setInterval(() => {
                trackLocation(data.id, isDynamic);
              }, trackingFrequency);
            }
          } catch (error) {
            console.error('Error starting workout:', error);
          }
        },
        (error) => {
          setPermissionGranted(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError('Location permission denied. Please enable location services.');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              setLocationError('Request to get location timed out.');
              break;
            default:
              setLocationError('An unknown error occurred.');
              break;
          }
        },
        {
          enableHighAccuracy: true,  // Request high accuracy location
          timeout: 10000,           // 10 second timeout
          maximumAge: 0             // Always get fresh location
        }
      );
    } else {
      setPermissionGranted(false);
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const fetchLocationName = useCallback(async (latitude: number, longitude: number) => {
    try {
      // Using Google's Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        // Try to get a meaningful location name
        const addressComponents = data.results[0].address_components;
        const neighborhood = addressComponents?.find(
          (component: any) => component.types.includes('neighborhood') || component.types.includes('sublocality')
        );
        const locality = addressComponents?.find(
          (component: any) => component.types.includes('locality')
        );
        
        if (neighborhood) {
          setLocationName(neighborhood.short_name);
        } else if (locality) {
          setLocationName(locality.short_name);
        } else {
          // Fallback to formatted address
          setLocationName(data.results[0].formatted_address.split(',')[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName('');
    }
  }, []);

  const trackLocation = (workoutId: string, isDynamic: boolean) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Get actual device location
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            recorded_at: new Date().toISOString()
          };
          
          // Fetch location name if we don't have one yet
          if (!locationName) {
            fetchLocationName(newLocation.latitude, newLocation.longitude);
          }
          
          // Log the location for debugging
          console.log('Recording actual device location:', {
            lat: newLocation.latitude,
            lng: newLocation.longitude,
            accuracy: position.coords.accuracy
          });
          
          // Update state with device location
          setLocationPoints(prev => [...prev, newLocation]);
          
          // Save to database
          try {
            await supabase.from('location_points').insert({
              workout_id: workoutId,
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
              accuracy: newLocation.accuracy
            });
          } catch (error) {
            console.error('Error saving location point:', error);
          }
        },
        (error) => {
          console.error('Error tracking location:', error);
          setLocationError(`Location tracking error: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  };

  const finishWorkout = async () => {
    if (!currentWorkout || !workoutStartTimeRef.current) return;
    
    // Clear interval
    if (locationIntervalRef.current) {
      window.clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    
    // Calculate duration
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - workoutStartTimeRef.current.getTime()) / 1000);
    
    // Calculate distance for dynamic workouts
    let distance = 0;
    if (isDynamicWorkout(currentWorkout.workout_type) && locationPoints.length > 1) {
      distance = calculateTotalDistance(locationPoints);
    }
    
    // Update workout record
    try {
      const { data, error } = await supabase
        .from('workouts')
        .update({
          end_time: endTime.toISOString(),
          duration: durationSeconds,
          distance: distance
        })
        .eq('id', currentWorkout.id)
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        setCompletedWorkout(data);
      }
      
      setIsTracking(false);
      setCurrentWorkout(null);
      workoutStartTimeRef.current = null;
      
      // Refresh workout list
      fetchWorkouts();
    } catch (error) {
      console.error('Error finishing workout:', error);
    }
  };

  const handlePhotoUploaded = async (photoUrl: string) => {
    if (!completedWorkout) return;
    
    try {
      await supabase
        .from('workouts')
        .update({
          verification_photo: photoUrl,
          is_verified: true
        })
        .eq('id', completedWorkout.id);
      
      // Refresh workout list
      fetchWorkouts();
      
      // Update completed workout state
      setCompletedWorkout({
        ...completedWorkout,
        verification_photo: photoUrl,
        is_verified: true
      });
    } catch (error) {
      console.error('Error updating workout with photo:', error);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (point1: LocationPoint, point2: LocationPoint) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  // Calculate total distance from all points
  const calculateTotalDistance = (points: LocationPoint[]) => {
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += calculateDistance(points[i], points[i+1]);
    }
    return totalDistance;
  };

  // Format duration from seconds to human-readable format
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  // Format distance from meters to human-readable format
  const formatDistance = (meters?: number) => {
    if (!meters) return "N/A";
    
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(2)}km`;
    }
  };

  // Start a new workout, resetting any completed workout
  const startNewWorkout = () => {
    setCompletedWorkout(null);
    setLocationPoints([]);
  };

  // Open workout details
  const openWorkoutDetails = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setIsDetailOpen(true);
  };

  // Close workout details
  const closeWorkoutDetails = () => {
    setIsDetailOpen(false);
  };

  const toggleMap = () => {
    // First open the map if it's closed
    if (!isMapOpen) {
      setIsMapOpen(true);
      
      // Provide haptic feedback on mobile if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Auto-collapse after a delay if not interacted with
      const autoCollapseTimer = setTimeout(() => {
        if (isMapOpen) {
          setIsMapOpen(false);
        }
      }, 60000); // Auto-close after 1 minute of inactivity
      
      // Clean up timer if component unmounts
      return () => clearTimeout(autoCollapseTimer);
    } else {
      // If already open, close it
      setIsMapOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Workouts</h1>
          <p className="text-gray-500">Track and manage your fitness activities</p>
        </div>
      </div>

      {/* Workout Statistics */}
      {workouts.length > 0 && (
        <div className="mb-6">
          <WorkoutStats workouts={workouts} />
        </div>
      )}

      {/* Completed Workout Summary */}
      {completedWorkout && (
        <div className="mb-6">
          <WorkoutSummary
            workoutId={completedWorkout.id}
            workoutType={completedWorkout.workout_type}
            startTime={new Date(completedWorkout.start_time)}
            endTime={completedWorkout.end_time ? new Date(completedWorkout.end_time) : undefined}
            duration={completedWorkout.duration}
            distance={completedWorkout.distance}
            locationPoints={locationPoints}
            isDynamic={completedWorkout.is_dynamic}
            onPhotoUploaded={handlePhotoUploaded}
          />
          
          <div className="mt-4 flex justify-end">
            <Button onClick={startNewWorkout}>Start New Workout</Button>
          </div>
        </div>
      )}

      {/* Workout Tracker - Only show if there's no completed workout displayed */}
      {!completedWorkout && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Track Your Workout</CardTitle>
          </CardHeader>
          <CardContent>
            {locationError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}
            
            {!isTracking ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Select Workout Type
                    </label>
                    <Select
                      value={selectedWorkoutType}
                      onValueChange={(value) => setSelectedWorkoutType(value as WorkoutType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select workout type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Running">Running</SelectItem>
                        <SelectItem value="Cycling">Cycling</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                        <SelectItem value="Weightlifting">Weightlifting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Button 
                    onClick={startWorkout} 
                    className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90"
                  >
                    <Play size={16} />
                    Start Workout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold">Currently tracking:</span>
                    <h3 className="text-lg font-bold">{currentWorkout?.workout_type}</h3>
                    <div className="text-sm text-gray-500">
                      <span>Started at: {new Date(currentWorkout?.start_time || '').toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      onClick={finishWorkout} 
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Square size={16} />
                      Finish Workout
                    </Button>
                  </div>
                </div>
                
                {/* Pulsing Map Button */}
                {isTracking && locationPoints.length > 0 && (
                  <div className="my-4 flex justify-center">
                    <button 
                      onClick={toggleMap}
                      className="relative group flex flex-col items-center justify-center p-4 rounded-lg bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 w-48"
                    >
                      {/* Pulsing rings animation */}
                      <span className="absolute inset-0 rounded-lg bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute inset-0 rounded-lg animate-ping bg-blue-100 opacity-75" style={{ animationDuration: '2s' }}></span>
                      <span className="absolute inset-0 rounded-lg animate-ping bg-blue-200 opacity-50" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}></span>
                      
                      {/* Map icon with statistics */}
                      <div className="relative flex flex-col items-center">
                        <Map size={28} className="text-blue-600 mb-1" />
                        <span className="text-sm font-medium text-gray-700">View Route Map</span>
                        
                        {/* Location name */}
                        {locationName && (
                          <div className="text-xs text-gray-500 mt-1 text-center">
                            <span>{locationName}</span>
                          </div>
                        )}
                        
                        {/* Distance stats */}
                        {isDynamicWorkout(selectedWorkoutType) && locationPoints.length > 1 && (
                          <div className="text-xs font-semibold text-blue-600 mt-1">
                            <span>{formatDistance(calculateTotalDistance(locationPoints))}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Workout History */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Workout History</h2>
        {workouts.length > 0 ? (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <WorkoutItem 
                key={workout.id}
                id={workout.id}
                type={workout.workout_type}
                duration={formatDuration(workout.duration)}
                distance={workout.is_dynamic ? formatDistance(workout.distance) : undefined}
                time={new Date(workout.start_time).toLocaleString()}
                isVerified={workout.is_verified}
                onViewDetails={openWorkoutDetails}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <Activity size={40} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No workouts recorded yet</p>
            <p className="text-sm text-gray-400">Start tracking your first workout to see your history here!</p>
          </div>
        )}
      </div>

      {/* Workout Detail Dialog */}
      {selectedWorkoutId && (
        <WorkoutDetail
          workoutId={selectedWorkoutId}
          isOpen={isDetailOpen}
          onClose={closeWorkoutDetails}
        />
      )}

      {/* Bottom Sheet Map */}
      {isTracking && (
        <BottomSheetMap
          locationPoints={locationPoints}
          isDynamic={isDynamicWorkout(selectedWorkoutType)}
          isActive={isTracking}
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
        />
      )}
    </div>
  );
};

interface WorkoutItemProps {
  id: string;
  type: string;
  duration: string;
  distance?: string;
  time: string;
  isVerified: boolean;
  onViewDetails: (id: string) => void;
}

const WorkoutItem = ({ 
  id,
  type, 
  duration, 
  distance, 
  time, 
  isVerified,
  onViewDetails
}: WorkoutItemProps) => {
  // Format the date/time more clearly
  const formatDateTime = (timeString: string) => {
    const date = new Date(timeString);
    return {
      date: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };
  
  const { date, time: formattedTime } = formatDateTime(time);
  
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        {/* Workout type and badges */}
        <div className="flex items-start gap-3">
          <div className="bg-blue-50 p-3 rounded-full">
            <Activity className="text-blue-600" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{type}</h3>
              {isVerified && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  Verified
                </span>
              )}
            </div>
            
            {/* Stats in a horizontal layout */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{duration}</span>
              </div>
              
              {distance && (
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  <span>{distance}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{date}</span>
              </div>
              
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* View details button */}
        <Button 
          onClick={() => onViewDetails(id)}
          variant="outline" 
          size="sm"
          className="self-start ml-auto"
        >
          <Eye size={16} className="mr-2" />
          View Details
        </Button>
      </div>
    </div>
  );
};

export default Workouts;
