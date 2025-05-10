
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageSquare } from 'lucide-react';

const TipsAndTricks = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Tips & Tricks</h1>
      <p className="text-gray-500 mb-6">Share and discover fitness advice from the community</p>
      
      <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3">Share Your Tip</h2>
        <Textarea 
          placeholder="Share a workout tip, nutrition advice, or recovery strategy..." 
          className="mb-3 min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            Post Tip
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Tips</TabsTrigger>
          <TabsTrigger value="top">Top Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-6 space-y-6">
          <TipCard 
            user="Sarah Johnson"
            username="sarahj"
            time="about 2 hours ago"
            content="For better running form, focus on landing midfoot rather than on your heels. This reduces impact and helps prevent injuries. I've been doing this for a month and my knee pain is gone!"
            likes={24}
            comments={5}
            isTopTip={true}
            initials="SJ"
          />
          
          <TipCard 
            user="Michael Chen"
            username="mikechen"
            time="about 5 hours ago"
            content="Try drinking beetroot juice 2-3 hours before your workout. Studies show it can improve endurance and performance by increasing nitric oxide production."
            likes={18}
            comments={3}
            initials="MC"
          />
          
          <TipCard 
            user="Jessica Williams"
            username="jesswill"
            time="1 day ago"
            content="Don't forget to include proper recovery! I schedule 2 full rest days per week and have seen better progress than when I was training 7 days straight."
            likes={32}
            comments={7}
            isTopTip={true}
            initials="JW"
          />
        </TabsContent>
        
        <TabsContent value="top" className="pt-6 space-y-6">
          <TipCard 
            user="Jessica Williams"
            username="jesswill"
            time="1 day ago"
            content="Don't forget to include proper recovery! I schedule 2 full rest days per week and have seen better progress than when I was training 7 days straight."
            likes={32}
            comments={7}
            isTopTip={true}
            initials="JW"
          />
          
          <TipCard 
            user="Sarah Johnson"
            username="sarahj"
            time="about 2 hours ago"
            content="For better running form, focus on landing midfoot rather than on your heels. This reduces impact and helps prevent injuries. I've been doing this for a month and my knee pain is gone!"
            likes={24}
            comments={5}
            isTopTip={true}
            initials="SJ"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TipCardProps {
  user: string;
  username: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  isTopTip?: boolean;
  initials: string;
}

const TipCard = ({ 
  user, username, time, content, likes, comments, isTopTip = false, initials 
}: TipCardProps) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{user}</h3>
              <span className="text-brand-primary text-xs">@{username}</span>
            </div>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
        
        {isTopTip && (
          <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs font-medium rounded">
            Top Tip
          </span>
        )}
      </div>
      
      <p className="text-gray-700 mb-4">{content}</p>
      
      <div className="flex gap-4">
        <button className="flex items-center gap-1 text-gray-500 hover:text-brand-primary">
          <ThumbsUp size={18} />
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-brand-primary">
          <MessageSquare size={18} />
          <span>{comments}</span>
        </button>
      </div>
    </div>
  );
};

export default TipsAndTricks;
