
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, Activity } from 'lucide-react';

const Workouts = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Workouts</h1>
          <p className="text-gray-500">Track and manage your fitness activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90">
            <span className="hidden sm:inline">Log New</span> Workout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Workout History</h2>
          <div className="space-y-4">
            <WorkoutItem 
              type="Running" 
              duration="45 minutes"
              intensity="High"
              time="Today, 6:30 AM"
              isVerified={true}
            />
            <WorkoutItem 
              type="Yoga" 
              duration="30 minutes"
              intensity="Medium"
              time="Yesterday, 7:00 PM"
              isVerified={true}
            />
            <WorkoutItem 
              type="Strength Training" 
              duration="60 minutes"
              intensity="High"
              time="2 days ago, 5:30 PM"
              isVerified={false}
            />
            <WorkoutItem 
              type="Cycling" 
              duration="40 minutes"
              intensity="Medium"
              time="3 days ago, 6:00 AM"
              isVerified={true}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="verified" className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Verified Workouts</h2>
          <div className="space-y-4">
            <WorkoutItem 
              type="Running" 
              duration="45 minutes"
              intensity="High"
              time="Today, 6:30 AM"
              isVerified={true}
            />
            <WorkoutItem 
              type="Yoga" 
              duration="30 minutes"
              intensity="Medium"
              time="Yesterday, 7:00 PM"
              isVerified={true}
            />
            <WorkoutItem 
              type="Cycling" 
              duration="40 minutes"
              intensity="Medium"
              time="3 days ago, 6:00 AM"
              isVerified={true}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface WorkoutItemProps {
  type: string;
  duration: string;
  intensity: string;
  time: string;
  isVerified: boolean;
}

const WorkoutItem = ({ type, duration, intensity, time, isVerified }: WorkoutItemProps) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Activity className="text-brand-primary" size={24} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{type}</h3>
              {isVerified && (
                <span className="verified-badge">Verified</span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock size={14} className="mr-1" />
              <span className="mr-3">{duration}</span>
              <span className="mr-1">Intensity:</span>
              <span className={`font-medium ${
                intensity === 'High' ? 'text-brand-danger' : 
                intensity === 'Medium' ? 'text-brand-warning' : 'text-brand-success'
              }`}>
                {intensity}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={14} className="mr-1" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
