import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { createChallenge, searchUsers } from '@/services/social';
import { toast } from 'sonner';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { User, NewChallengeData } from '@/types/social';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreateChallengeFormProps {
  onChallengeCreated: () => void;
  onCancel: () => void;
}

export function CreateChallengeForm({ onChallengeCreated, onCancel }: CreateChallengeFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [challengeType, setChallengeType] = useState<'distance' | 'completion'>('distance');
  const [isSearching, setIsSearching] = useState(false);
  
  // Set default end date to 7 days from today
  React.useEffect(() => {
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 7);
    setEndDate(defaultEndDate);
  }, []);

  const handleUserSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const users = await searchUsers(query);
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !startDate || !endDate || !selectedUser) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await createChallenge({
        title,
        description,
        challenge_type: challengeType,
        target_distance: challengeType === 'distance' ? parseFloat(distance) : undefined,
        distance_unit: challengeType === 'distance' ? distanceUnit : undefined,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        opponent_id: selectedUser.id
      });
      
      if (success) {
        toast.success('Challenge created successfully!');
        onChallengeCreated();
      } else {
        toast.error('Failed to create challenge');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error('An error occurred while creating the challenge');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Create a Challenge</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="challenge-title">Challenge Title</Label>
          <Input
            id="challenge-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="5K Race, Weekly Distance Challenge, etc."
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="challenge-description">Description (Optional)</Label>
          <Textarea
            id="challenge-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your challenge..."
            disabled={isLoading}
            className="resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Challenge Type</Label>
          <Select 
            value={challengeType} 
            onValueChange={(value: 'distance' | 'completion') => setChallengeType(value)} 
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Distance Challenge</SelectItem>
              <SelectItem value="completion">Completion Challenge</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {challengeType === 'distance' && (
          <div className="flex gap-2 items-center">
            <div className="space-y-2 flex-1">
              <Label htmlFor="challenge-distance">Target Distance</Label>
              <Input
                id="challenge-distance"
                type="number"
                min="0.1"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="5"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2 w-24">
              <Label htmlFor="distance-unit">Unit</Label>
              <Select 
                value={distanceUnit} 
                onValueChange={(value: 'km' | 'mi') => setDistanceUnit(value)} 
                disabled={isLoading}
              >
                <SelectTrigger id="distance-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">km</SelectItem>
                  <SelectItem value="mi">miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Opponent</Label>
          <div className="relative">
            {selectedUser ? (
              <div className="flex items-center justify-between border p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    {selectedUser.avatar_url ? (
                      <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.fullName || selectedUser.username || 'User'} />
                    ) : (
                      <AvatarFallback>{selectedUser.initials || 'U'}</AvatarFallback>
                    )}
                  </Avatar>
                  <span>{selectedUser.username || selectedUser.fullName}</span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedUser(null)}
                  disabled={isLoading}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    disabled={isLoading}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Select an opponent</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search users..." 
                      value={searchQuery}
                      onValueChange={handleUserSearch}
                    />
                    <CommandList>
                      {isSearching ? (
                        <div className="py-6 text-center text-sm">
                          <div className="animate-pulse">Searching...</div>
                        </div>
                      ) : searchResults.length === 0 ? (
                        <CommandEmpty>
                          {searchQuery.length > 0 ? 'No users found' : 'Type to search users'}
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {searchResults.map((user) => (
                            <CommandItem
                              key={user.id}
                              onSelect={() => handleUserSelect(user)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Avatar className="h-6 w-6">
                                {user.avatar_url ? (
                                  <AvatarImage src={user.avatar_url} alt={user.fullName || user.username || 'User'} />
                                ) : (
                                  <AvatarFallback>{user.initials || 'U'}</AvatarFallback>
                                )}
                              </Avatar>
                              <span>{user.username || user.fullName}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !selectedUser}>
            {isLoading ? 'Creating...' : 'Create Challenge'}
          </Button>
        </div>
      </form>
    </div>
  );
}
