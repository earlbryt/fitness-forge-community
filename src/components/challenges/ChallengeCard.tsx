
import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, Flag, CheckCircle, X, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Challenge, ChallengeStatus } from '@/types/social';
import { acceptChallenge, declineChallenge } from '@/services/social';
import { toast } from 'sonner';

interface ChallengeCardProps {
  challenge: Challenge;
  currentUserId: string;
  onChallengeUpdated: () => void;
}

export function ChallengeCard({ challenge, currentUserId, onChallengeUpdated }: ChallengeCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine if the current user is the creator or opponent
  const isCreator = challenge.creator_id === currentUserId;
  const opponent = isCreator ? challenge.opponent : challenge.creator;
  
  // Calculate days left in the challenge
  const now = new Date();
  const endDate = new Date(challenge.end_date);
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  
  const startDate = new Date(challenge.start_date);
  const hasStarted = now >= startDate;
  const hasEnded = now >= endDate;
  
  // Calculate progress based on dates
  const totalDuration = new Date(challenge.end_date).getTime() - new Date(challenge.start_date).getTime();
  const elapsedDuration = Math.min(now.getTime() - new Date(challenge.start_date).getTime(), totalDuration);
  const progress = totalDuration > 0 ? Math.min(100, Math.round((elapsedDuration / totalDuration) * 100)) : 0;
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const handleAccept = async () => {
    setIsLoading(true);
    
    try {
      const success = await acceptChallenge(challenge.id);
      
      if (success) {
        toast.success("Challenge accepted!");
        onChallengeUpdated();
      } else {
        toast.error("Failed to accept challenge");
      }
    } catch (error) {
      console.error('Error accepting challenge:', error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDecline = async () => {
    setIsLoading(true);
    
    try {
      const success = await declineChallenge(challenge.id);
      
      if (success) {
        toast.success("Challenge declined");
        onChallengeUpdated();
      } else {
        toast.error("Failed to decline challenge");
      }
    } catch (error) {
      console.error('Error declining challenge:', error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStatusBadge = () => {
    switch (challenge.status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>;
      case 'active':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Completed</span>;
      case 'declined':
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Declined</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className={`bg-white p-5 rounded-lg border shadow-sm ${
      challenge.status === 'completed' ? 'border-brand-success/20' : 'border-gray-100'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {renderStatusBadge()}
        </div>
        {challenge.winner_id && (
          <div className="flex items-center gap-1 text-brand-success text-sm">
            <Trophy className="h-4 w-4" />
            <span>Winner: {challenge.winner_id === currentUserId ? 'You' : opponent?.username || 'Opponent'}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-1">{challenge.title}</h3>
      
      {challenge.description && (
        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
      )}
      
      {challenge.challenge_type === 'distance' && challenge.target_distance && (
        <div className="flex items-center gap-1 mb-3 text-sm">
          <Flag className="h-4 w-4 text-gray-500" />
          <span>Target: {challenge.target_distance} {challenge.distance_unit}</span>
        </div>
      )}
      
      <div className="flex items-center gap-1 mb-3 text-sm">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span>
          {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            {challenge.creator.avatar_url ? (
              <AvatarImage src={challenge.creator.avatar_url} alt={challenge.creator.username || 'Creator'} />
            ) : (
              <AvatarFallback>{challenge.creator.initials || 'C'}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium">
            {isCreator ? 'You' : challenge.creator.username || 'Creator'}
          </span>
        </div>
        
        <div className="text-sm text-gray-500 font-medium">VS</div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {!isCreator ? 'You' : challenge.opponent.username || 'Opponent'}
          </span>
          <Avatar className="h-7 w-7">
            {challenge.opponent.avatar_url ? (
              <AvatarImage src={challenge.opponent.avatar_url} alt={challenge.opponent.username || 'Opponent'} />
            ) : (
              <AvatarFallback>{challenge.opponent.initials || 'O'}</AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          {!hasEnded && <span>{daysLeft} days left</span>}
        </div>
        <Progress 
          value={progress} 
          className="h-2" 
          indicatorClassName={challenge.status === 'completed' ? 'bg-brand-success' : 'bg-brand-primary'} 
        />
      </div>
      
      {challenge.status === 'pending' && !isCreator && (
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDecline}
            disabled={isLoading}
            className="flex-1"
          >
            <X className="mr-1 h-4 w-4" />
            Decline
          </Button>
          <Button 
            size="sm"
            onClick={handleAccept}
            disabled={isLoading}
            className="flex-1"
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Accept
          </Button>
        </div>
      )}
      
      {challenge.status === 'active' && (
        <div className="mt-4">
          <Button 
            size="sm" 
            className="w-full"
            variant="outline"
          >
            View Details
          </Button>
        </div>
      )}
    </div>
  );
}
