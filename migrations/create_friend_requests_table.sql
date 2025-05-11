
-- Create the friend_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.friend_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Prevent duplicate requests between the same users
    CONSTRAINT unique_friend_request UNIQUE (from_user_id, to_user_id)
);

-- Add RLS policies to friend_requests table
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting a friend request
CREATE POLICY insert_friend_request ON public.friend_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = from_user_id);

-- Create policy to view sent and received friend requests
CREATE POLICY view_friend_requests ON public.friend_requests
    FOR SELECT
    TO authenticated
    USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Create policy to allow a user to accept or reject their own requests
CREATE POLICY update_received_request ON public.friend_requests
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = to_user_id)
    WITH CHECK (auth.uid() = to_user_id);

-- Create policy to allow a user to delete a request they initiated
CREATE POLICY delete_own_request ON public.friend_requests
    FOR DELETE
    TO authenticated
    USING (auth.uid() = from_user_id);

-- Create an index for faster lookups
CREATE INDEX idx_friend_requests_to_user_id ON public.friend_requests(to_user_id);
CREATE INDEX idx_friend_requests_from_user_id ON public.friend_requests(from_user_id);
CREATE INDEX idx_friend_requests_status ON public.friend_requests(status);
