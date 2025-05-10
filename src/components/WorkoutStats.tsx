import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Clock } from 'lucide-react';

interface Workout {
  id: string;
  workout_type: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  distance?: number;
  is_dynamic: boolean;
  is_verified: boolean;
}

interface WorkoutStatsProps {
  workouts: Workout[];
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({ workouts }) => {
  // Calculate total workout time in seconds
  const totalWorkoutTime = workouts.reduce((total, workout) => {
    return total + (workout.duration || 0);
  }, 0);
  
  // Calculate total distance (for dynamic workouts only)
  const totalDistance = workouts.reduce((total, workout) => {
    if (workout.is_dynamic && workout.distance) {
      return total + workout.distance;
    }
    return total;
  }, 0);
  
  // Count workout types
  const workoutTypeCounts: Record<string, number> = {};
  workouts.forEach(workout => {
    workoutTypeCounts[workout.workout_type] = (workoutTypeCounts[workout.workout_type] || 0) + 1;
  });
  
  // Find most frequent workout type
  let mostFrequentType = '';
  let maxCount = 0;
  Object.entries(workoutTypeCounts).forEach(([type, count]) => {
    if (count > maxCount) {
      mostFrequentType = type;
      maxCount = count;
    }
  });
  
  // Format time from seconds to hours and minutes
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };
  
  // Format distance from meters to kilometers
  const formatDistance = (meters: number) => {
    return `${(meters / 1000).toFixed(2)}km`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-brand-primary" size={20} />
              <h3 className="font-medium">Total Workout Time</h3>
            </div>
            <p className="text-2xl font-bold">{formatTime(totalWorkoutTime)}</p>
            <p className="text-sm text-gray-500 mt-1">Across {workouts.length} workouts</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-brand-primary" size={20} />
              <h3 className="font-medium">Total Distance</h3>
            </div>
            <p className="text-2xl font-bold">{formatDistance(totalDistance)}</p>
            <p className="text-sm text-gray-500 mt-1">
              For {workouts.filter(w => w.is_dynamic).length} dynamic workouts
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-brand-primary" size={20} />
              <h3 className="font-medium">Favorite Workout</h3>
            </div>
            <p className="text-2xl font-bold">{mostFrequentType || 'N/A'}</p>
            <p className="text-sm text-gray-500 mt-1">
              {maxCount} times
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutStats; 