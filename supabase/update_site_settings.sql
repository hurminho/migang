-- Update site settings (run in Supabase SQL Editor)
-- Use UPSERT so existing rows are updated, not skipped.

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
  ('hero_title', '"We identify spatial issues accurately\nand deliver results built to last."'),
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
