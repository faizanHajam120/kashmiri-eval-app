-- ============================================================
-- FIX: Admin RLS recursion issue
-- Run this in Supabase Dashboard → SQL Editor AFTER the main migration
-- ============================================================
-- Step 1: Create a helper function to check admin status (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid) RETURNS boolean AS $$
SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = user_id
            AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
-- Step 2: Drop the recursive policies
DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
-- Step 3: Replace with a single non-recursive policy
CREATE POLICY "Users read profiles" ON public.profiles FOR
SELECT USING (
        auth.uid() = id
        OR public.is_admin(auth.uid())
    );
-- Step 4: Fix evaluations insert policy too
DROP POLICY IF EXISTS "Admins insert evaluations" ON public.evaluations;
CREATE POLICY "Admins insert evaluations" ON public.evaluations FOR
INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins delete evaluations" ON public.evaluations;
CREATE POLICY "Admins delete evaluations" ON public.evaluations FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
-- Step 5: Fix ratings admin policy
DROP POLICY IF EXISTS "Admins read all ratings" ON public.ratings;
DROP POLICY IF EXISTS "Admins can view all ratings" ON public.ratings;
CREATE POLICY "Admins read all ratings" ON public.ratings FOR
SELECT TO authenticated USING (
        auth.uid() = evaluator_id
        OR public.is_admin(auth.uid())
    );
-- Also drop redundant evaluator select policy (merged above)
DROP POLICY IF EXISTS "Users read own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can view own ratings" ON public.ratings;