import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatePostForm } from '@/components/social/CreatePostForm';
import { SocialPost } from '@/components/social/SocialPost';
import { FindFriendsModal } from '@/components/social/FindFriendsModal';
import { User, Post } from '@/types/social';
import { getCurrentUser, getFeedPosts, getFollowingPosts, getFriendRequestsCount } from '@/services/social';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserPlus, AlertTriangle, PlusCircle } from 'lucide-react';

const Social = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isFindFriendsModalOpen, setIsFindFriendsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendRequestCount, setFriendRequestCount] = useState(0);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get current user
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        // Get feed posts
        const posts = await getFeedPosts();
        setFeedPosts(posts);
        
        try {
          // Get following posts (this might fail if table doesn't exist yet)
          const following = await getFollowingPosts();
          setFollowingPosts(following);
        } catch (followError) {
          console.error('Error fetching following posts:', followError);
        }
        
        // Get friend request count
        const requestCount = await getFriendRequestsCount();
        setFriendRequestCount(requestCount);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError('Failed to load social features. The database might not be set up correctly.');
        toast.error('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAndPosts();
  }, []);
  
  // Refresh friend request count periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      const requestCount = await getFriendRequestsCount();
      setFriendRequestCount(requestCount);
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleRefreshPosts = async () => {
    try {
      setError(null);
      
      // Get feed posts
      const posts = await getFeedPosts();
      setFeedPosts(posts);
      
      try {
        // Get following posts
        const following = await getFollowingPosts();
        setFollowingPosts(following);
      } catch (followError) {
        console.error('Error refreshing following posts:', followError);
      }
      
      // Refresh friend request count
      const requestCount = await getFriendRequestsCount();
      setFriendRequestCount(requestCount);
    } catch (error: any) {
      console.error('Error refreshing posts:', error);
      setError('Failed to refresh posts. There might be a database issue.');
      toast.error('Failed to refresh posts');
    }
  };

  // Use all posts without filtering
  const filteredFeedPosts = feedPosts;
  const filteredFollowingPosts = followingPosts;

  return (
    <div>
      <div className="md:max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Social Community</h1>
        <p className="text-gray-500 mb-4">Connect with friends and share your fitness journey</p>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex mb-4 flex-wrap gap-2 sm:flex-nowrap justify-end">
          <Button 
            className="gap-1 rounded-lg text-sm h-9 px-3 bg-brand-primary hover:bg-brand-primary/90"
            onClick={() => setIsCreatingPost(true)}
          >
            <PlusCircle size={16} />
            Create Post
          </Button>
          <Button 
            className="gap-1 rounded-lg text-sm h-9 px-3 relative"
            variant="outline"
            onClick={() => setIsFindFriendsModalOpen(true)}
          >
            <UserPlus size={16} />
            Find Friends
            {friendRequestCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {friendRequestCount}
              </span>
            )}
          </Button>
        </div>
        
        <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogTitle className="text-lg font-semibold mb-2">Create a Post</DialogTitle>
            <CreatePostForm 
              currentUser={currentUser} 
              onPostCreated={() => {
                setIsCreatingPost(false);
                handleRefreshPosts();
              }} 
            />
          </DialogContent>
        </Dialog>
        
        <Tabs defaultValue="feed" className="mb-8">
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="feed" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm text-sm">Feed</TabsTrigger>
            <TabsTrigger value="following" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm text-sm">Following</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="pt-4">
            {isLoading ? (
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse h-36" />
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse h-36" />
              </div>
            ) : filteredFeedPosts.length === 0 ? (
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-gray-500 mb-3 text-sm">No posts found.</p>
                <Button 
                  onClick={() => setIsCreatingPost(true)}
                  className="gap-1 h-9 px-3 text-sm"
                  size="sm"
                >
                  <PlusCircle size={16} />
                  Create Your First Post
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFeedPosts.map(post => (
                  <SocialPost 
                    key={post.id} 
                    post={post}
                    onPostUpdate={handleRefreshPosts}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="following" className="pt-4">
            {isLoading ? (
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse h-36" />
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse h-36" />
              </div>
            ) : filteredFollowingPosts.length === 0 ? (
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-gray-500 mb-3 text-sm">No posts from people you follow.</p>
                <Button 
                  variant="outline"
                  className="gap-1 h-9 px-3 text-sm"
                  size="sm"
                  onClick={() => setIsFindFriendsModalOpen(true)}
                >
                  <UserPlus size={16} />
                  Find People to Follow
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFollowingPosts.map(post => (
                  <SocialPost 
                    key={post.id} 
                    post={post}
                    onPostUpdate={handleRefreshPosts}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <FindFriendsModal 
          isOpen={isFindFriendsModalOpen} 
          onClose={() => {
            setIsFindFriendsModalOpen(false);
            // Refresh friend request count and posts after closing the modal
            handleRefreshPosts();
          }} 
          currentUser={currentUser} 
        />
      </div>
    </div>
  );
};

export default Social;
