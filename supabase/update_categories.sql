-- Replace categories with Project and Interior only

-- Deactivate old categories
UPDATE public.categories
SET is_active = false, updated_at = NOW()
WHERE slug NOT IN ('project', 'interior');

-- Upsert new categories
INSERT INTO public.categories (name, slug, description, sort_order, is_active) VALUES
  ('Project', 'project', 'Architecture and construction projects', 1, true),
  ('Interior', 'interior', 'Interior design and finishing', 2, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = NOW();

-- Reassign existing projects: interior-related titles → Interior, others → Project
UPDATE public.projects
SET category_id = (SELECT id FROM public.categories WHERE slug = 'interior')
WHERE category_id IN (SELECT id FROM public.categories WHERE is_active = false)
  AND (
    title ILIKE '%인테리어%'
    OR title ILIKE '%interior%'
    OR slug ILIKE '%interior%'
  );

UPDATE public.projects
SET category_id = (SELECT id FROM public.categories WHERE slug = 'project')
WHERE category_id IN (SELECT id FROM public.categories WHERE is_active = false)
   OR category_id IS NULL;
