-- Create admin_users table to track who has admin access
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin_users
CREATE POLICY "Admins can view admin_users" 
ON public.admin_users 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users au WHERE au.user_id = auth.uid()
));

-- Add deposits/withdrawals tracking columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_deposited INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_withdrawn INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Create transactions table for tracking deposits/withdrawals
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'admin_grant', 'admin_item_grant')),
  amount INTEGER,
  item_id TEXT,
  item_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_id UUID
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions" 
ON public.transactions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true
));

-- Admins can insert transactions
CREATE POLICY "Admins can insert transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true
));

-- Create view for admin to see all players
CREATE VIEW public.admin_players_view
WITH (security_invoker=on) AS
SELECT 
  p.id,
  p.user_id,
  p.username,
  p.balance,
  p.total_deposited,
  p.total_withdrawn,
  p.country,
  p.is_admin,
  p.created_at,
  (SELECT COUNT(*) FROM public.inventory i WHERE i.user_id = p.user_id) as item_count
FROM public.profiles p;

-- Allow admins to update any profile (for giving coins)
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true)
);

-- Allow admins to insert items for any user
CREATE POLICY "Admins can insert any inventory" 
ON public.inventory 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true)
);

-- Set the first admin user (Albiza) - this will be done after they sign up
-- INSERT INTO public.admin_users (user_id, username) SELECT user_id, username FROM public.profiles WHERE username = 'Albiza' LIMIT 1;
-- UPDATE public.profiles SET is_admin = true WHERE username = 'Albiza';