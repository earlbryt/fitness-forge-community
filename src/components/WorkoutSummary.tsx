import React from 'react';
import { Clock, MapPin, Activity, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkoutMap from './WorkoutMap';
import WorkoutPhotoUpload from './WorkoutPhotoUpload';

interface LocationPoint {
  latitude: number;
  longitude: number;
  recorded_at?: string;
}

interface WorkoutSummaryProps {
  workoutId: string;
  workoutType: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  distance?: number;
  locationPoints: LocationPoint[];
  isDynamic: boolean;
  onPhotoUploaded: (photoUrl: string) => void;
}

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  workoutId,
  workoutType,
  startTime,
  endTime,
  duration,
  distance,
  locationPoints,
  isDynamic,
  onPhotoUploaded
}) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Workout Summary: {workoutType}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="text-brand-primary" size={18} />
              <span className="font-medium">Activity:</span> {workoutType}
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="text-brand-primary" size={18} />
              <span className="font-medium">Start Time:</span> {startTime.toLocaleString()}
            </div>
            
            {endTime && (
              <div className="flex items-center gap-2">
                <Clock className="text-brand-primary" size={18} />
                <span className="font-medium">End Time:</span> {endTime.toLocaleString()}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Clock className="text-brand-primary" size={18} />
              <span className="font-medium">Duration:</span> {formatDuration(duration)}
            </div>
            
            {isDynamic && distance && (
              <div className="flex items-center gap-2">
                <MapPin className="text-brand-primary" size={18} />
                <span className="font-medium">Distance:</span> {formatDistance(distance)}
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <WorkoutMap 
              locationPoints={locationPoints} 
              isDynamic={isDynamic} 
              isActive={false}
            />
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Verify Your Workout</h3>
              <WorkoutPhotoUpload 
                workoutId={workoutId}
                onPhotoUploaded={onPhotoUploaded}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutSummary; 