"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormValues,
} from "@/lib/validation/schemas";
import type { SiteSettings } from "@/types/site-settings";

interface SettingsFormProps {
  settings: SiteSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues: settings,
  });

  const onSubmit = async (values: SiteSettingsFormValues) => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      toast.error("저장 실패");
      return;
    }

    toast.success("설정이 저장되었습니다.");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="home">홈페이지</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="footer">푸터</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>업체명</Label>
              <Input {...form.register("companyName")} />
            </div>
            <div className="space-y-2">
              <Label>영문 업체명</Label>
              <Input {...form.register("companyNameEn")} />
            </div>
            <div className="space-y-2">
              <Label>대표자명</Label>
              <Input {...form.register("representative")} />
            </div>
            <div className="space-y-2">
              <Label>사업자번호</Label>
              <Input {...form.register("businessNumber")} />
            </div>
            <div className="space-y-2">
              <Label>전화번호</Label>
              <Input {...form.register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>이메일</Label>
              <Input {...form.register("email")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>주소</Label>
              <Input {...form.register("address")} />
            </div>
            <div className="space-y-2">
              <Label>네이버 블로그 URL</Label>
              <Input {...form.register("naverBlogUrl")} />
            </div>
            <div className="space-y-2">
              <Label>시공 가능 지역</Label>
              <Input {...form.register("serviceAreas")} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="home" className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>메인 제목</Label>
            <Textarea rows={3} {...form.register("heroTitle")} />
          </div>
          <div className="space-y-2">
            <Label>메인 소개</Label>
            <Input {...form.register("heroSubtitle")} />
          </div>
          <div className="space-y-2">
            <Label>대표 이미지 경로</Label>
            <Input {...form.register("heroImage")} />
          </div>
          <div className="space-y-2">
            <Label>업체 소개</Label>
            <Textarea rows={4} {...form.register("aboutText")} />
          </div>
          <div className="space-y-2">
            <Label>서비스 항목 (쉼표 구분)</Label>
            <Input
              defaultValue={settings.services.join(", ")}
              onChange={(e) =>
                form.setValue(
                  "services",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                )
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="seo" className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>사이트 제목</Label>
            <Input {...form.register("siteTitle")} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} {...form.register("siteDescription")} />
          </div>
          <div className="space-y-2">
            <Label>OG 이미지</Label>
            <Input {...form.register("ogImage")} />
          </div>
          <div className="space-y-2">
            <Label>Google Analytics ID</Label>
            <Input {...form.register("gaId")} placeholder="G-XXXXXXXX" />
          </div>
          <div className="space-y-2">
            <Label>Microsoft Clarity ID</Label>
            <Input {...form.register("clarityId")} />
          </div>
        </TabsContent>

        <TabsContent value="footer" className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>저작권 문구</Label>
            <Input {...form.register("footerCopyright")} />
          </div>
          <div className="space-y-2">
            <Label>사업자 정보</Label>
            <Input {...form.register("footerBusinessInfo")} />
          </div>
          <div className="space-y-2">
            <Label>개인정보처리방침 (Markdown)</Label>
            <Textarea rows={10} {...form.register("privacyPolicy")} />
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>인사말</Label>
            <Textarea rows={5} {...form.register("aboutContent.greeting")} />
          </div>
          <div className="space-y-2">
            <Label>주요 서비스</Label>
            <Textarea rows={3} {...form.register("aboutContent.services")} />
          </div>
          <div className="space-y-2">
            <Label>경력</Label>
            <Input {...form.register("aboutContent.experience")} />
          </div>
          <div className="space-y-2">
            <Label>시공 지역</Label>
            <Input {...form.register("aboutContent.areas")} />
          </div>
          <div className="space-y-2">
            <Label>자격/면허</Label>
            <Input {...form.register("aboutContent.licenses")} />
          </div>
          <div className="space-y-2">
            <Label>작업 원칙</Label>
            <Textarea rows={3} {...form.register("aboutContent.principles")} />
          </div>
        </TabsContent>
      </Tabs>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        저장
      </Button>
    </form>
  );
}
