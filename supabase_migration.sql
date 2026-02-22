-- ============================================================
-- KASHMIRI EVAL APP — Database Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================
-- 1. Profiles
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text NOT NULL DEFAULT '',
    role text NOT NULL DEFAULT 'evaluator' CHECK (role IN ('evaluator', 'admin')),
    created_at timestamptz NOT NULL DEFAULT now()
);
-- 2. Evaluations (translation pairs)
CREATE TABLE public.evaluations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_kashmiri text NOT NULL,
    reference_english text NOT NULL,
    system_a_translation text NOT NULL,
    system_b_translation text NOT NULL,
    system_a_identity text NOT NULL DEFAULT 'unknown',
    system_b_identity text NOT NULL DEFAULT 'unknown',
    created_at timestamptz NOT NULL DEFAULT now()
);
-- 3. Ratings (evaluator responses)
CREATE TABLE public.ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id uuid NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
    evaluator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    system_a_adequacy smallint NOT NULL CHECK (
        system_a_adequacy BETWEEN 1 AND 5
    ),
    system_a_fluency smallint NOT NULL CHECK (
        system_a_fluency BETWEEN 1 AND 5
    ),
    system_b_adequacy smallint NOT NULL CHECK (
        system_b_adequacy BETWEEN 1 AND 5
    ),
    system_b_fluency smallint NOT NULL CHECK (
        system_b_fluency BETWEEN 1 AND 5
    ),
    preference text NOT NULL CHECK (preference IN ('A', 'B', 'Tie')),
    time_spent_seconds int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(evaluation_id, evaluator_id)
);
-- 4. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN
INSERT INTO public.profiles (id, full_name, role)
VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'evaluator'
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- 5. RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
-- Profiles
CREATE POLICY "Users read own profile" ON public.profiles FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON public.profiles FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Evaluations
CREATE POLICY "Auth users read evaluations" ON public.evaluations FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert evaluations" ON public.evaluations FOR
INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins delete evaluations" ON public.evaluations FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- Ratings
CREATE POLICY "Users insert own ratings" ON public.ratings FOR
INSERT TO authenticated WITH CHECK (auth.uid() = evaluator_id);
CREATE POLICY "Users read own ratings" ON public.ratings FOR
SELECT TO authenticated USING (auth.uid() = evaluator_id);
CREATE POLICY "Users update own ratings" ON public.ratings FOR
UPDATE TO authenticated USING (auth.uid() = evaluator_id);
CREATE POLICY "Admins read all ratings" ON public.ratings FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );