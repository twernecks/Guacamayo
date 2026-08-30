"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentTable, type ContentTableColumn } from "@/components/admin/ContentTable";
import { listTestimonials, deleteTestimonial } from "@/services/admin/testimonials-service";
import type { AdminTestimonial } from "@/domain/admin/testimonials";
import buttonStyles from "@/components/ui/Button.module.css";
import pageStyles from "@/app/admin/admin-page.module.css";

const COLUMNS: ContentTableColumn<AdminTestimonial>[] = [
  { key: "attribution", label: "Atribuição", render: (item) => item.attribution },
  { key: "quote", label: "Depoimento", render: (item) => item.quote.pt },
  { key: "isPublished", label: "Publicado", render: (item) => (item.isPublished ? "Sim" : "Não") },
];

export default function AdminTestimonialsListPage() {
  const [items, setItems] = useState<AdminTestimonial[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    listTestimonials()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className={pageStyles.page}>
      <div className={pageStyles.header}>
        <h1 className={pageStyles.title}>Depoimentos</h1>
        <Link
          href="/admin/testimonials/new"
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
        >
          Novo Depoimento
        </Link>
      </div>
      <ContentTable
        items={items}
        isLoading={isLoading}
        loadError={loadError}
        columns={COLUMNS}
        editHref={(item) => `/admin/testimonials/edit?id=${item.id}`}
        onDelete={async (item) => {
          await deleteTestimonial(item.id);
          setItems((prev) => (prev ? prev.filter((existing) => existing.id !== item.id) : prev));
        }}
      />
    </main>
  );
}
