"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  inquiryFormSchema,
  type InquiryFormValues,
  MAX_FILES,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from "@/lib/validation/schemas";
import type { Category } from "@/types/database";

interface ContactFormProps {
  categories: Category[];
}

export function ContactForm({ categories }: ContactFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      category_id: "",
      desired_date: "",
      message: "",
      consent: undefined,
      website: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length + files.length > MAX_FILES) {
      toast.error(`최대 ${MAX_FILES}개까지 첨부할 수 있습니다.`);
      return;
    }
    for (const file of selected) {
      if (!ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number])) {
        toast.error("jpg, png, webp, pdf 파일만 업로드할 수 있습니다.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("파일 크기는 10MB 이하여야 합니다.");
        return;
      }
    }
    setFiles((prev) => [...prev, ...selected].slice(0, MAX_FILES));
  };

  const onSubmit = async (values: InquiryFormValues) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "consent") {
          formData.append("consent", "true");
        } else if (value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/inquiries", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "문의 접수에 실패했습니다.");
      }

      setSuccess(true);
      form.reset();
      setFiles([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "문의 접수에 실패했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="py-8">
        <p className="text-sm">문의가 접수되었습니다.</p>
        <p className="mt-2 text-sm text-muted">
          빠른 시일 내에 연락드리겠습니다.
        </p>
        <button
          type="button"
          className="text-link mt-6"
          onClick={() => setSuccess(false)}
        >
          추가 문의하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        {...form.register("website")}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">이름 *</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">연락처 *</Label>
          <Input id="phone" placeholder="010-1234-5678" {...form.register("phone")} />
          {form.formState.errors.phone && (
            <p className="text-xs text-red-600">{form.formState.errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" {...form.register("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category_id">공사 유형</Label>
          <Select
            value={form.watch("category_id") || undefined}
            onValueChange={(v) => form.setValue("category_id", v ?? undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="선택" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">공사 주소</Label>
          <Input id="address" {...form.register("address")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desired_date">예상 공사 시기</Label>
          <Input id="desired_date" placeholder="예: 2026년 3월" {...form.register("desired_date")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">문의 내용 *</Label>
        <Textarea id="message" rows={6} {...form.register("message")} />
        {form.formState.errors.message && (
          <p className="text-xs text-red-600">{form.formState.errors.message.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="files">사진 첨부 (최대 5개, 10MB 이하)</Label>
        <Input
          id="files"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleFileChange}
        />
        {files.length > 0 && (
          <ul className="text-xs text-muted">
            {files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={form.watch("consent") === true}
          onCheckedChange={(checked) =>
            form.setValue("consent", checked === true ? true : (undefined as unknown as true))
          }
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed font-normal">
          개인정보 수집 및 이용에 동의합니다. (필수)
        </Label>
      </div>
      {form.formState.errors.consent && (
        <p className="text-xs text-red-600">{form.formState.errors.consent.message}</p>
      )}

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "접수 중..." : "문의 접수"}
      </Button>
    </form>
  );
}
