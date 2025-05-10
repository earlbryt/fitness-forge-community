
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ThumbsUp, MessageSquare, Image, Smile } from 'lucide-react';

const Social = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Social Community</h1>
      <p className="text-gray-500 mb-6">Connect with friends and share your fitness journey</p>
      
      <div className="flex mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search posts..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          />
        </div>
        <Button className="ml-3 bg-brand-primary hover:bg-brand-primary/90 gap-2 rounded-xl">
          Create Post
        </Button>
      </div>
      
      <Tabs defaultValue="feed" className="mb-8">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="feed" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm">Feed</TabsTrigger>
          <TabsTrigger value="following" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm">Following</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="pt-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-semibold">
                YA
              </div>
              <Textarea 
                placeholder="Share your workout or fitness journey..." 
                className="flex-1 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-brand-primary rounded-lg">
                  <Image size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-brand-primary rounded-lg">
                  <Smile size={18} />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="">
                  <SelectTrigger className="w-[180px] h-9 rounded-lg border-gray-200">
                    <SelectValue placeholder="Workout type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="strength">Strength Training</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button className="rounded-lg">Post</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            <SocialPost 
              user="Sarah Johnson"
              username="sarahj"
              time="about 2 hours ago"
              content="Just completed a 5K run in 25 minutes! Personal best! 🎉 Feeling great and ready to tackle the day. Who else is getting their cardio in this morning?"
              likes={24}
              comments={5}
              workout="Running"
              initials="SJ"
              verified={true}
            />
            
            <SocialPost 
              user="Michael Chen"
              username="mikechen"
              time="about 6 hours ago"
              content="First time trying crossfit today. Wow, what a challenge! My arms feel like jelly but already looking forward to the next session. Anyone have tips for recovery?"
              likes={16}
              comments={8}
              workout="Crossfit"
              initials="MC"
            />
            
            <SocialPost 
              user="Jessica Williams"
              username="jesswill"
              time="1 day ago"
              content="Hit a new deadlift PR today - 200lbs! Been working towards this goal for months. Hard work pays off! 💪"
              likes={42}
              comments={13}
              workout="Strength Training"
              initials="JW"
              verified={true}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="following" className="pt-6">
          <div className="space-y-5">
            <SocialPost 
              user="David Kim"
              username="davekim"
              time="3 hours ago"
              content="Morning yoga session complete. Starting the day centered and energized. Who else practices morning yoga?"
              likes={19}
              comments={4}
              workout="Yoga"
              initials="DK"
              verified={true}
            />
            
            <SocialPost 
              user="Emily Davis"
              username="emilyd"
              time="yesterday"
              content="Just signed up for my first half marathon! Training starts today. Any advice from experienced runners?"
              likes={31}
              comments={11}
              workout="Running"
              initials="ED"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SocialPostProps {
  user: string;
  username: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  workout?: string;
  initials: string;
  verified?: boolean;
}

const SocialPost = ({ 
  user, username, time, content, likes, comments, workout, initials, verified = false
}: SocialPostProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{user}</h3>
              {verified && (
                <svg className="w-4 h-4 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-brand-primary text-xs font-medium">@{username}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span>{time}</span>
              {workout && (
                <>
                  <span>•</span>
                  <span className="bg-brand-light text-brand-primary px-2 py-0.5 rounded-full text-xs font-medium">
                    {workout}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-5">{content}</p>
      
      <div className="flex gap-6">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-brand-primary">
          <ThumbsUp size={18} />
          <span className="text-sm font-medium">{likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-brand-primary">
          <MessageSquare size={18} />
          <span className="text-sm font-medium">{comments}</span>
        </button>
      </div>
    </div>
  );
};

export default Social;
