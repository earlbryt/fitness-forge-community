
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '../lib/supabase';

interface WorkoutPhotoUploadProps {
  workoutId: string;
  onPhotoUploaded: (photoUrl: string) => void;
}

const WorkoutPhotoUpload: React.FC<WorkoutPhotoUploadProps> = ({ 
  workoutId, 
  onPhotoUploaded 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${workoutId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `workout-verification/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('workout-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('workout-photos')
        .getPublicUrl(filePath);

      if (data && data.publicUrl) {
        // Update the workout with the verification photo URL
        const { error: updateError } = await supabase
          .from('workouts')
          .update({ verification_photo: data.publicUrl })
          .eq('id', workoutId);

        if (updateError) throw updateError;

        onPhotoUploaded(data.publicUrl);
        setUploadSuccess(true);
      }
    } catch (error: any) {
      setUploadError(error.message || 'Error uploading photo');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="file"
          id="workout-photo"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label
          htmlFor="workout-photo"
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
            isUploading 
              ? 'bg-gray-100 text-gray-500' 
              : 'bg-brand-primary text-white hover:bg-brand-primary/90'
          }`}
        >
          {isUploading ? (
            <span>Uploading...</span>
          ) : (
            <>
              <Camera size={16} />
              <span>Upload Verification Photo</span>
            </>
          )}
        </label>
      </div>

      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {uploadSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Photo uploaded successfully!</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WorkoutPhotoUpload;
