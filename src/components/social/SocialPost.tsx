import React, { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, MessageSquare, X, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post, Comment as CommentType } from '@/types/social';
import { likePost, unlikePost, getPostComments, addComment } from '@/services/social';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SocialPostProps {
  post: Post;
  onPostUpdate?: () => void;
}

export function SocialPost({ post, onPostUpdate }: SocialPostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  
  const handleLikeToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (isLiked) {
        const success = await unlikePost(post.id);
        if (success) {
          setIsLiked(false);
          setLikesCount(prev => prev - 1);
        } else {
          toast.error('Failed to unlike post');
        }
      } else {
        const success = await likePost(post.id);
        if (success) {
          setIsLiked(true);
          setLikesCount(prev => prev + 1);
        } else {
          toast.error('Failed to like post');
        }
      }
      
      if (onPostUpdate) {
        onPostUpdate();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadComments = async () => {
    if (isLoadingComments) return;
    
    setIsLoadingComments(true);
    
    try {
      const commentsData = await getPostComments(post.id);
      setComments(commentsData);
      setShowComments(true);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoadingComments(false);
    }
  };
  
  const handleToggleComments = async () => {
    if (!showComments) {
      await loadComments();
    } else {
      setShowComments(false);
    }
  };
  
  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmittingComment) return;
    
    setIsSubmittingComment(true);
    
    try {
      const result = await addComment({
        post_id: post.id,
        content: newComment.trim()
      });
      
      if (result) {
        // Reload comments to get the updated list
        await loadComments();
        
        // Update comments count
        setCommentsCount(prev => prev + 1);
        
        // Clear input
        setNewComment('');
        
        if (onPostUpdate) {
          onPostUpdate();
        }
      } else {
        toast.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  // Format the date
  const formattedDate = post.created_at 
    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
    : '';
  
  const user = post.user;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 rounded-full overflow-hidden">
            {user?.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.fullName || 'User'} />
            ) : (
              <AvatarFallback className="bg-brand-light text-brand-primary text-xs">
                {user?.initials || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{user?.fullName || 'Anonymous'}</h3>
              {user?.verified && (
                <svg className="w-3 h-3 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {/* Username tag removed as requested */}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formattedDate}</span>
              {post.workout_type && (
                <>
                  <span>•</span>
                  <span className="bg-brand-light text-brand-primary px-1.5 py-0.5 rounded-full text-xs font-medium">
                    {post.workout_type}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-3 text-sm whitespace-pre-line">{post.content}</p>
      
      {post.image_url && (
        <div className="mb-3 rounded-lg overflow-hidden max-h-96 flex justify-center">
          <img 
            src={post.image_url} 
            alt="Post attachment" 
            className="object-contain max-h-96 cursor-pointer hover:opacity-95 w-auto"
            loading="lazy"
            onClick={() => setIsImageDialogOpen(true)}
          />
          
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogContent className="max-w-4xl w-fit p-1 bg-black/80 border-none">
              <div className="relative w-full h-full">
                <Button
                  variant="ghost" 
                  size="icon"
                  className="absolute top-2 right-2 text-white bg-black/50 z-10 rounded-full w-8 h-8"
                  onClick={() => setIsImageDialogOpen(false)}
                >
                  <X size={16} />
                </Button>
                <img 
                  src={post.image_url} 
                  alt="Post attachment - fullsize" 
                  className="max-h-[80vh] w-auto object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      <div className="flex gap-4 text-sm">
        <button 
          className={`flex items-center gap-1 ${
            isLiked ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary'
          }`}
          onClick={handleLikeToggle}
          disabled={isLoading}
        >
          <ThumbsUp size={16} className={isLiked ? 'fill-brand-primary' : ''} />
          <span className="text-sm font-medium">{likesCount}</span>
        </button>
        <button 
          className={`flex items-center gap-1 ${
            showComments ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary'
          }`}
          onClick={handleToggleComments}
          disabled={isLoadingComments}
        >
          <MessageSquare size={16} className={showComments ? 'fill-brand-primary text-white' : ''} />
          <span className="text-sm font-medium">{commentsCount}</span>
        </button>
      </div>
      
      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {isLoadingComments ? (
            <div className="flex justify-center py-2">
              <div className="animate-pulse text-xs text-gray-400">Loading comments...</div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-2 text-xs text-gray-500">No comments yet. Be the first to comment!</div>
          ) : (
            <div className="space-y-3 mb-3 max-h-64 overflow-y-auto pr-1">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    {comment.user?.avatar_url ? (
                      <AvatarImage src={comment.user.avatar_url} alt={comment.user.fullName || 'User'} />
                    ) : (
                      <AvatarFallback className="bg-brand-light text-brand-primary text-xs">
                        {comment.user?.initials || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-medium text-xs">{comment.user?.fullName || 'Anonymous'}</span>
                      <span className="text-gray-400 text-xs">
                        {comment.created_at 
                          ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
                          : ''}
                      </span>
                    </div>
                    <p className="text-gray-700 text-xs">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2 items-end mt-2">
            <Textarea
              placeholder="Write a comment..."
              className="min-h-[40px] text-sm resize-none py-2 flex-1 bg-gray-50"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              ref={commentInputRef}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isSubmittingComment}
            />
            <Button
              size="sm"
              className="h-9 px-3"
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmittingComment}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 