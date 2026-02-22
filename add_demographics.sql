-- ============================================================
-- KASHMIRI EVAL APP — Add Demographics
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================
-- 1. Add new columns to the existing profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS native_language text,
    ADD COLUMN IF NOT EXISTS kashmiri_proficiency text,
    ADD COLUMN IF NOT EXISTS english_proficiency text,
    ADD COLUMN IF NOT EXISTS education_level text,
    ADD COLUMN IF NOT EXISTS age_group text;
-- 2. Update the trigger function to handle the new metadata fields during signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN
INSERT INTO public.profiles (
        id,
        full_name,
        role,
        native_language,
        kashmiri_proficiency,
        english_proficiency,
        education_level,
        age_group
    )
VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'evaluator',
        NULLIF(NEW.raw_user_meta_data->>'native_language', ''),
        NULLIF(
            NEW.raw_user_meta_data->>'kashmiri_proficiency',
            ''
        ),
        NULLIF(
            NEW.raw_user_meta_data->>'english_proficiency',
            ''
        ),
        NULLIF(NEW.raw_user_meta_data->>'education_level', ''),
        NULLIF(NEW.raw_user_meta_data->>'age_group', '')
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;