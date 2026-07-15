-- Seed data for development
-- Run after migration and after creating admin user in Supabase Dashboard

-- Categories
INSERT INTO public.categories (name, slug, description, sort_order, is_active) VALUES
  ('Project', 'project', 'Architecture and construction projects', 1, true),
  ('Interior', 'interior', 'Interior design and finishing', 2, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = NOW();

-- Sample projects (using placeholder paths)
DO $$
DECLARE
  cat_project UUID;
  cat_interior UUID;
  proj_id UUID;
BEGIN
  SELECT id INTO cat_project FROM public.categories WHERE slug = 'project';
  SELECT id INTO cat_interior FROM public.categories WHERE slug = 'interior';

  -- Project 1
  INSERT INTO public.projects (title, slug, summary, description, category_id, cover_image_path, location, project_year, duration_text, work_scope, status, is_featured, sort_order, published_at)
  VALUES (
    '강남 아파트 리모델링',
    'gangnam-apartment-remodeling',
    '20평 아파트 전체 리모델링',
    '노후된 20평 아파트를 거실 확장과 주방 개방형 구조로 리모델링했습니다. 자연 채광을 최대한 활용하고, 수납 공간을 효율적으로 재배치했습니다.',
    cat_project,
    '/placeholders/project-1.svg',
    '서울 강남구',
    2025,
    '6주',
    '전체 리모델링, 주방, 욕실',
    'published', TRUE, 1, NOW()
  ) RETURNING id INTO proj_id;

  INSERT INTO public.project_images (project_id, storage_path, alt_text, image_type, sort_order) VALUES
    (proj_id, '/placeholders/project-1.svg', '거실 전경', 'gallery', 1),
    (proj_id, '/placeholders/project-2.svg', '주방', 'gallery', 2);

  -- Project 2
  INSERT INTO public.projects (title, slug, summary, description, category_id, cover_image_path, location, project_year, duration_text, work_scope, status, is_featured, sort_order, published_at)
  VALUES (
    '성수동 카페 인테리어',
    'seongsu-cafe-interior',
    '30평 카페 공간 인테리어',
    '성수동 로컬 카페의 브랜드 아이덴티티를 반영한 인테리어 시공. 목재와 콘크리트를 조화롭게 사용했습니다.',
    cat_interior,
    '/placeholders/project-2.svg',
    '서울 성동구',
    2025,
    '4주',
    '인테리어, 전기, 조명',
    'published', TRUE, 2, NOW()
  ) RETURNING id INTO proj_id;

  INSERT INTO public.project_images (project_id, storage_path, alt_text, image_type, sort_order) VALUES
    (proj_id, '/placeholders/project-2.svg', '카페 내부', 'gallery', 1);

  -- Project 3
  INSERT INTO public.projects (title, slug, summary, description, category_id, cover_image_path, location, project_year, duration_text, work_scope, status, is_featured, sort_order, published_at)
  VALUES (
    '판교 오피스 리뉴얼',
    'pangyo-office-renewal',
    '50평 사무실 리뉴얼',
    'IT 스타트업 사무실의 업무 효율을 높이는 오픈형 레이아웃으로 리뉴얼했습니다.',
    cat_project,
    '/placeholders/project-3.svg',
    '경기 성남시',
    2024,
    '5주',
    '사무실 인테리어, 회의실',
    'published', TRUE, 3, NOW()
  ) RETURNING id INTO proj_id;

  -- Project 4
  INSERT INTO public.projects (title, slug, summary, description, category_id, cover_image_path, location, project_year, duration_text, work_scope, status, is_featured, sort_order, published_at)
  VALUES (
    '일산 단독주택 리모델링',
    'ilsan-house-remodeling',
    '단독주택 1·2층 리모델링',
    '가족 구성원 증가에 맞춰 2층 확장 및 내부 공간 재구성을 진행했습니다.',
    cat_project,
    '/placeholders/project-4.svg',
    '경기 고양시',
    2024,
    '10주',
    '구조 보강, 내부 마감',
    'published', TRUE, 4, NOW()
  ) RETURNING id INTO proj_id;

  -- Project 5
  INSERT INTO public.projects (title, slug, summary, description, category_id, cover_image_path, location, project_year, duration_text, work_scope, status, is_featured, sort_order, published_at)
  VALUES (
    '마포 상가 방수공사',
    'mapo-waterproofing',
    '상가 옥상 및 외벽 방수',
    '누수 피해가 있던 상가 건물의 옥상 방수와 외벽 보수를 완료했습니다.',
    cat_project,
    '/placeholders/project-5.svg',
    '서울 마포구',
    2024,
    '2주',
    '옥상 방수, 외벽 보수',
    'published', FALSE, 5, NOW()
  ) RETURNING id INTO proj_id;

  -- Project 6
  INSERT INTO public.projects (title, slug, summary, description, category_id, cover_image_path, location, project_year, duration_text, work_scope, status, is_featured, sort_order, published_at)
  VALUES (
    '용산 주택 인테리어',
    'yongsan-house-interior',
    '25평 주택 인테리어',
    '미니멀한 톤의 주거 공간 인테리어. 원목 마감과 화이트 톤을 조화시켰습니다.',
    cat_project,
    '/placeholders/project-6.svg',
    '서울 용산구',
    2024,
    '5주',
    '인테리어, 바닥, 도장',
    'published', TRUE, 5, NOW()
  ) RETURNING id INTO proj_id;

  -- Project 7
  INSERT INTO public.projects (title, slug, summary, description, category_id, cover_image_path, location, project_year, duration_text, work_scope, status, is_featured, sort_order, published_at)
  VALUES (
    '분당 레스토랑 인테리어',
    'bundang-restaurant-interior',
    '40평 레스토랑 인테리어',
    '오픈 키친과 다이닝 공간을 분리하면서도 연결감을 유지한 상업공간 시공.',
    cat_interior,
    '/placeholders/project-7.svg',
    '경기 성남시',
    2023,
    '6주',
    '상업 인테리어, 주방 설비',
    'published', FALSE, 7, NOW()
  ) RETURNING id INTO proj_id;

  -- Project 8
  INSERT INTO public.projects (title, slug, summary, description, category_id, cover_image_path, location, project_year, duration_text, work_scope, status, is_featured, sort_order, published_at)
  VALUES (
    '송파 아파트 욕실 리모델링',
    'songpa-bathroom-remodeling',
    '욕실 및 세탁실 리모델링',
    '노후 욕실 타일 교체, 방수 재시공, 세탁실 확장을 진행했습니다.',
    cat_project,
    '/placeholders/project-8.svg',
    '서울 송파구',
    2023,
    '3주',
    '욕실, 방수, 타일',
    'published', FALSE, 8, NOW()
  ) RETURNING id INTO proj_id;

  -- Draft project
  INSERT INTO public.projects (title, slug, summary, category_id, cover_image_path, location, status, is_featured, sort_order)
  VALUES (
    '임시저장 프로젝트',
    'draft-project',
    '작성 중인 프로젝트',
    cat_project,
    '/placeholders/project-1.svg',
    '서울',
    'draft', FALSE, 99
  );
END $$;

-- Default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('company_name', '"미강건축"'),
  ('company_name_en', '"MIGANG ARCHITECTS"'),
  ('representative', '"최윤환"'),
  ('business_number', '"219-03-78423"'),
  ('phone', '"010-6786-1204"'),
  ('email', '"qkstmwja@naver.com"'),
  ('address', '"대구광역시 달성군 옥포읍 본리로 20길 18-3, 1동"'),
  ('kakao_url', '"https://pf.kakao.com/_example"'),
  ('naver_blog_url', '"https://m.blog.naver.com/PostList.naver?blogId=jwcbsmg&tab=1"'),
  ('service_areas', '"서울, 경기, 대구"'),
  ('hero_title', '"We identify spatial issues accurately and deliver results built to last."'),
  ('hero_subtitle', '"Architecture · Interior · Remodeling"'),
  ('hero_image', '"/heroimage-1.jpeg"'),
  ('about_text', '"Migang Architects specializes in design and construction for residential and commercial spaces."'),
  ('strengths', '["Accurate estimates and schedule management based on site conditions", "Consistent quality control from material selection to finishing", "Construction with full responsibility through after-service completion"]'),
  ('services', '["건축", "인테리어", "리모델링", "방수공사", "상업공간", "주거공간"]'),
  ('process_steps', '["Consultation", "Site Visit", "Estimate", "Contract", "Construction", "Final Inspection"]'),
  ('site_title', '"미강건축 | 건축·인테리어·리모델링"'),
  ('site_description', '"미강건축은 건축, 인테리어, 리모델링 전문 업체입니다."'),
  ('og_image', '"/placeholders/og.svg"'),
  ('footer_copyright', '"© 2026 미강건축. All rights reserved."'),
  ('footer_business_info', '"미강건축 | 대표 최윤환 | 사업자등록번호 219-03-78423"'),
  ('about_content', '{"greeting": "안녕하세요, 미강건축 대표 최윤환입니다.", "services": "주거 및 상업공간의 설계·시공", "experience": "50년 경력", "areas": "서울, 경기, 대구", "licenses": "건축사사무소 등록", "principles": "정확한 현장 파악, 투명한 견적"}')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- To create admin: After creating user in Supabase Auth Dashboard, run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';
