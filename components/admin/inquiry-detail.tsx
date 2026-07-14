"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { InquiryWithRelations } from "@/types/database";
import { formatDate } from "@/lib/utils/index";

interface InquiryDetailProps {
  inquiry: InquiryWithRelations;
}

export function InquiryDetail({ inquiry: initial }: InquiryDetailProps) {
  const [inquiry, setInquiry] = useState(initial);
  const [memo, setMemo] = useState(inquiry.admin_memo ?? "");

  const updateInquiry = async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      toast.error("업데이트 실패");
      return;
    }
    const updated = await res.json();
    setInquiry((prev) => ({ ...prev, ...updated }));
    toast.success("저장되었습니다.");
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(inquiry.phone);
    toast.success("연락처가 복사되었습니다.");
  };

  return (
    <div className="space-y-6 rounded-md border bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{inquiry.name}</h2>
          <p className="text-sm text-muted">{formatDate(inquiry.created_at)}</p>
        </div>
        <Badge>{inquiry.status}</Badge>
      </div>

      <dl className="grid gap-3 text-sm">
        <div className="flex gap-4">
          <dt className="w-24 text-muted">연락처</dt>
          <dd className="flex items-center gap-2">
            {inquiry.phone}
            <Button variant="ghost" size="sm" onClick={copyPhone}>
              복사
            </Button>
          </dd>
        </div>
        {inquiry.email && (
          <div className="flex gap-4">
            <dt className="w-24 text-muted">이메일</dt>
            <dd>{inquiry.email}</dd>
          </div>
        )}
        {inquiry.address && (
          <div className="flex gap-4">
            <dt className="w-24 text-muted">주소</dt>
            <dd>{inquiry.address}</dd>
          </div>
        )}
        {inquiry.category?.name && (
          <div className="flex gap-4">
            <dt className="w-24 text-muted">공사 유형</dt>
            <dd>{inquiry.category.name}</dd>
          </div>
        )}
        {inquiry.desired_date && (
          <div className="flex gap-4">
            <dt className="w-24 text-muted">예상 시기</dt>
            <dd>{inquiry.desired_date}</dd>
          </div>
        )}
      </dl>

      <div>
        <Label>문의 내용</Label>
        <p className="mt-2 whitespace-pre-wrap text-sm">{inquiry.message}</p>
      </div>

      {inquiry.inquiry_attachments && inquiry.inquiry_attachments.length > 0 && (
        <div>
          <Label>첨부 파일</Label>
          <ul className="mt-2 space-y-1 text-sm">
            {inquiry.inquiry_attachments.map((att) => (
              <li key={att.id}>
                <a
                  href={`/api/admin/inquiries/${inquiry.id}/attachments/${att.id}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {att.original_filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <Label>상태</Label>
        <Select
          value={inquiry.status}
          onValueChange={(v) => updateInquiry({ status: v, is_read: true })}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">new</SelectItem>
            <SelectItem value="contacted">contacted</SelectItem>
            <SelectItem value="quoted">quoted</SelectItem>
            <SelectItem value="completed">completed</SelectItem>
            <SelectItem value="closed">closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>관리자 메모</Label>
        <Textarea rows={4} value={memo} onChange={(e) => setMemo(e.target.value)} />
        <Button
          size="sm"
          onClick={() => updateInquiry({ admin_memo: memo, is_read: true })}
        >
          메모 저장
        </Button>
      </div>

      <Button
        variant="destructive"
        size="sm"
        onClick={async () => {
          if (!confirm("삭제하시겠습니까?")) return;
          const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            toast.success("삭제되었습니다.");
            window.location.href = "/admin/inquiries";
          }
        }}
      >
        삭제
      </Button>
    </div>
  );
}
