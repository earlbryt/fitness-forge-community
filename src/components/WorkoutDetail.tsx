import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from '../lib/supabase';
import { Clock, MapPin, Calendar, Activity, Image } from 'lucide-react';
import WorkoutMap from './WorkoutMap';

interface LocationPoint {
  latitude: number;
  longitude: number;
  recorded_at?: string;
}

interface Workout {
  id: string;
  workout_type: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  distance?: number;
  is_dynamic: boolean;
  is_verified: boolean;
  verification_photo?: string;
}

interface WorkoutDetailProps {
  workoutId: string;
  isOpen: boolean;
  onClose: () => void;
}

const WorkoutDetail: React.FC<WorkoutDetailProps> = ({ 
  workoutId, 
  isOpen, 
  onClose 
}) => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen && workoutId) {
      fetchWorkoutDetails();
    }
  }, [workoutId, isOpen]);
  
  const fetchWorkoutDetails = async () => {
    setLoading(true);
    
    try {
      // Fetch workout details
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .single();
      
      if (workoutError) throw workoutError;
      
      setWorkout(workoutData);
      
      // Fetch location points
      const { data: locationData, error: locationError } = await supabase
        .from('location_points')
        .select('*')
        .eq('workout_id', workoutId)
        .order('recorded_at', { ascending: true });
      
      if (locationError) throw locationError;
      
      setLocationPoints(locationData || []);
    } catch (error) {
      console.error('Error fetching workout details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format duration from seconds to readable format
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

  // Format distance from meters to readable format
  const formatDistance = (meters?: number) => {
    if (!meters) return "N/A";
    
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(2)}km`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {loading ? 'Loading workout details...' : `${workout?.workout_type} Workout`}
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="py-6 text-center text-gray-500">
            Loading workout details...
          </div>
        ) : workout ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="text-brand-primary" size={18} />
                  <span className="font-medium">Activity:</span> {workout.workout_type}
                  {workout.is_verified && (
                    <span className="verified-badge ml-2">Verified</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="text-brand-primary" size={18} />
                  <span className="font-medium">Date:</span> {new Date(workout.start_time).toLocaleDateString()}
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="text-brand-primary" size={18} />
                  <span className="font-medium">Time:</span> {new Date(workout.start_time).toLocaleTimeString()}
                </div>
                
                {workout.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="text-brand-primary" size={18} />
                    <span className="font-medium">Duration:</span> {formatDuration(workout.duration)}
                  </div>
                )}
                
                {workout.is_dynamic && workout.distance && (
                  <div className="flex items-center gap-2">
                    <MapPin className="text-brand-primary" size={18} />
                    <span className="font-medium">Distance:</span> {formatDistance(workout.distance)}
                  </div>
                )}
              </div>
              
              <div>
                {workout.verification_photo && (
                  <div className="mb-3">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Image size={16} />
                      Verification Photo
                    </h3>
                    <img 
                      src={workout.verification_photo} 
                      alt="Workout verification" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {locationPoints.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Workout Route</h3>
                <WorkoutMap 
                  locationPoints={locationPoints}
                  isDynamic={workout.is_dynamic}
                  isActive={false}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            Workout not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutDetail;