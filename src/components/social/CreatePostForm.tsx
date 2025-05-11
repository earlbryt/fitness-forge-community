
import React, { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image, Smile, X } from 'lucide-react';
import { NewPostData } from '@/types/social';
import { createPost, uploadPostImage } from '@/services/social';
import { toast } from 'sonner';
import { User } from '@/types/social';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface CreatePostFormProps {
  currentUser: User | null;
  onPostCreated: () => void;
}

export function CreatePostForm({ currentUser, onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large. Maximum size is 5MB.');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }
    
    setSelectedFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + emoji.native + content.substring(end);
      setContent(newContent);
      
      // Focus back on textarea and place cursor after inserted emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.native.length, start + emoji.native.length);
      }, 10);
    } else {
      setContent(content + emoji.native);
    }
    setIsEmojiPickerOpen(false);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please add some content to your post');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let imageUrl = undefined;
      
      // Upload image if selected
      if (selectedFile) {
        imageUrl = await uploadPostImage(selectedFile);
        if (!imageUrl) {
          toast.error('Failed to upload image');
          setIsLoading(false);
          return;
        }
      }
      
      // Create post
      const postData: NewPostData = {
        content: content.trim(),
      };
      
      // Only add image_url if we have one
      if (imageUrl) {
        postData.image_url = imageUrl;
      }
      
      const result = await createPost(postData);
      
      if (result) {
        toast.success('Post created successfully!');
        setContent('');
        setImagePreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onPostCreated();
      } else {
        toast.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('An error occurred while creating your post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <p className="text-center text-gray-500 text-sm">Please sign in to create a post</p>
      </div>
    );
  }

  // Get display name from user object
  const displayName = currentUser.username || currentUser.fullName || 'Anonymous';

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-8 h-8 rounded-full overflow-hidden">
          {currentUser?.avatar_url ? (
            <AvatarImage src={currentUser.avatar_url} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-brand-light text-brand-primary text-xs">
              {currentUser?.initials || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        <Textarea 
          ref={textareaRef}
          placeholder={`Share your workout or fitness journey, ${displayName}...`}
          className="flex-1 rounded-lg border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 min-h-[60px] text-sm resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      {imagePreview && (
        <div className="relative mb-3 pl-11">
          <div className="relative rounded-lg overflow-hidden max-h-48">
            <img src={imagePreview} alt="Image preview" className="object-contain max-h-48 w-auto" />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-7 w-7 rounded-full"
              onClick={removeImage}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center pl-11">
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-brand-primary rounded-lg h-8 w-8 p-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Image size={16} />
          </Button>
          <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500 hover:text-brand-primary rounded-lg h-8 w-8 p-0"
                disabled={isLoading}
                onClick={() => setIsEmojiPickerOpen(true)}
              >
                <Smile size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-lg" align="start" side="top" sideOffset={5}>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
                set="native"
                previewPosition="none"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-end">
          <Button 
            className="rounded-lg h-8 px-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium"
            size="sm"
            onClick={handleSubmit}
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}
