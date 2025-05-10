
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Clock, Trash2 } from 'lucide-react';

const Reminders = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Workout Reminders</h1>
      <p className="text-gray-500 mb-6">Set and manage reminders to stay consistent with your workouts</p>
      
      <div className="flex mb-6">
        <Button className="bg-brand-primary hover:bg-brand-primary/90">
          Add New Reminder
        </Button>
      </div>
      
      <Tabs defaultValue="active" className="mb-8">
        <TabsList>
          <TabsTrigger value="active">Active Reminders</TabsTrigger>
          <TabsTrigger value="history">Reminder History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReminderCard 
              title="Morning Run"
              time="6:00 AM"
              days={["Monday", "Wednesday", "Friday"]}
              active={true}
            />
            <ReminderCard 
              title="Strength Training"
              time="5:30 PM"
              days={["Tuesday", "Thursday"]}
              active={true}
            />
            <ReminderCard 
              title="Yoga Session"
              time="7:00 AM"
              days={["Saturday"]}
              active={false}
            />
            <ReminderCard 
              title="Evening Walk"
              time="7:30 PM"
              days={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
              active={true}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="pt-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium text-gray-500">No reminder history yet</h3>
            <p className="text-gray-400 mt-1">Your completed or deleted reminders will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ReminderCardProps {
  title: string;
  time: string;
  days: string[];
  active: boolean;
}

const ReminderCard = ({ title, time, days, active }: ReminderCardProps) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Switch checked={active} />
      </div>
      
      <div className="flex items-center gap-2 mb-4 text-gray-600">
        <Clock size={18} />
        <span>{time}</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {days.map(day => (
          <span key={day} className="text-xs bg-brand-light text-brand-primary px-2 py-1 rounded">
            {day}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button className="flex items-center gap-1 text-brand-danger text-sm">
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
        <Button variant="outline" size="sm">Edit</Button>
      </div>
    </div>
  );
};

export default Reminders;
