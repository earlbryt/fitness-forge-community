
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, UserPlus, Check, X, Search } from 'lucide-react';
import { User } from '@/types/social';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface FindFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

interface FriendRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  from_user?: User;
}

export function FindFriendsModal({ isOpen, onClose, currentUser }: FindFriendsModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchUsers();
      fetchFriendRequests();
    }
  }, [isOpen, currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get all users except current user
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUser?.id || '');
      
      if (error) {
        console.error('Error fetching users:', error);
        return;
      }
      
      // Get existing friend connections
      const { data: connections, error: connectionsError } = await supabase
        .from('follows')
        .select('*')
        .or(`follower_id.eq.${currentUser?.id},followed_id.eq.${currentUser?.id}`);
        
      if (connectionsError) {
        console.error('Error fetching connections:', connectionsError);
      }
      
      // Exclude users who are already friends
      const friendIds = new Set();
      connections?.forEach(connection => {
        if (connection.follower_id === currentUser?.id) {
          friendIds.add(connection.followed_id);
        } else {
          friendIds.add(connection.follower_id);
        }
      });
      
      // Get pending friend requests to exclude those too
      const { data: sentRequests, error: requestsError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('from_user_id', currentUser?.id || '')
        .eq('status', 'pending');
        
      if (requestsError) {
        console.error('Error fetching sent requests:', requestsError);
      }
      
      const pendingRequestIds = new Set();
      sentRequests?.forEach(request => {
        pendingRequestIds.add(request.to_user_id);
      });
      
      // Filter out existing friends and those with pending requests
      const formattedUsers = profiles?.filter(profile => 
        !friendIds.has(profile.id) && 
        !pendingRequestIds.has(profile.id)
      ).map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
        username: profile.username,
        verified: profile.verified || false,
        fullName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username || 'Anonymous',
        initials: profile.first_name && profile.last_name 
          ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
          : (profile.username?.[0] || 'A').toUpperCase()
      }));
      
      setUsers(formattedUsers || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      // Get friend requests sent to current user
      const { data: requests, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          from_user:from_user_id(id, first_name, last_name, avatar_url, username, verified)
        `)
        .eq('to_user_id', currentUser?.id || '')
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error fetching friend requests:', error);
        return;
      }
      
      const formattedRequests = requests.map(request => {
        const from = request.from_user as any;
        return {
          ...request,
          from_user: {
            id: from.id,
            first_name: from.first_name,
            last_name: from.last_name,
            avatar_url: from.avatar_url,
            username: from.username,
            verified: from.verified || false,
            fullName: `${from.first_name || ''} ${from.last_name || ''}`.trim() || from.username || 'Anonymous',
            initials: from.first_name && from.last_name 
              ? `${from.first_name[0]}${from.last_name[0]}`.toUpperCase()
              : (from.username?.[0] || 'A').toUpperCase()
          }
        };
      });
      
      setFriendRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const handleSendFriendRequest = async (userId: string) => {
    try {
      // Create a friend request
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          from_user_id: currentUser?.id,
          to_user_id: userId,
          status: 'pending'
        });
      
      if (error) {
        console.error('Error sending friend request:', error);
        toast.error('Failed to send friend request');
        return;
      }
      
      toast.success('Friend request sent');
      
      // Update UI
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    }
  };

  const handleAcceptFriendRequest = async (requestId: string, fromUserId: string) => {
    try {
      // First, update the request status
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);
      
      if (updateError) {
        console.error('Error accepting friend request:', updateError);
        toast.error('Failed to accept friend request');
        return;
      }
      
      // Then create mutual follow relationships
      const { error: followError } = await supabase
        .from('follows')
        .insert([
          {
            follower_id: currentUser?.id,
            followed_id: fromUserId
          },
          {
            follower_id: fromUserId,
            followed_id: currentUser?.id
          }
        ]);
      
      if (followError) {
        console.error('Error creating follow relationship:', followError);
        toast.error('Accepted request but failed to create relationship');
        return;
      }
      
      toast.success('Friend request accepted');
      
      // Update UI
      setFriendRequests(friendRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request');
    }
  };

  const handleRejectFriendRequest = async (requestId: string) => {
    try {
      // Update the request status
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);
      
      if (error) {
        console.error('Error rejecting friend request:', error);
        toast.error('Failed to reject friend request');
        return;
      }
      
      toast.success('Friend request rejected');
      
      // Update UI
      setFriendRequests(friendRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request');
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(searchLower) || 
      user.username?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Find Friends</DialogTitle>
          <DialogDescription>
            Connect with other users or respond to friend requests
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="find" className="flex gap-2 items-center">
              <UserPlus size={16} />
              Find Friends
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex gap-2 items-center">
              <UserCheck size={16} />
              Requests ({friendRequests.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="find" className="mt-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by name or username" 
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No users found matching your search' : 'No new users to connect with'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={user.fullName || 'User'} />
                          ) : (
                            <AvatarFallback>{user.initials}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.fullName}</div>
                          {user.username && (
                            <div className="text-xs text-gray-500">@{user.username}</div>
                          )}
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleSendFriendRequest(user.id)}
                      >
                        <UserPlus size={14} className="mr-1" /> Add Friend
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="requests" className="mt-4">
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                </div>
              ) : friendRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending friend requests
                </div>
              ) : (
                <div className="space-y-3">
                  {friendRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {request.from_user?.avatar_url ? (
                            <AvatarImage src={request.from_user.avatar_url} alt={request.from_user?.fullName || 'User'} />
                          ) : (
                            <AvatarFallback>{request.from_user?.initials}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{request.from_user?.fullName}</div>
                          {request.from_user?.username && (
                            <div className="text-xs text-gray-500">@{request.from_user.username}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="default"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleAcceptFriendRequest(request.id, request.from_user_id)}
                        >
                          <Check size={16} />
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRejectFriendRequest(request.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
