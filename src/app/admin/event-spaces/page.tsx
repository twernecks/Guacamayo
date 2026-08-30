"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentTable, type ContentTableColumn } from "@/components/admin/ContentTable";
import { listEventSpaces, deleteEventSpace } from "@/services/admin/event-spaces-service";
import type { AdminEventSpace } from "@/domain/admin/event-spaces";
import buttonStyles from "@/components/ui/Button.module.css";
import pageStyles from "@/app/admin/admin-page.module.css";

const COLUMNS: ContentTableColumn<AdminEventSpace>[] = [
  { key: "name", label: "Nome", render: (item) => item.name.pt },
  { key: "isPublished", label: "Publicado", render: (item) => (item.isPublished ? "Sim" : "Não") },
  { key: "displayOrder", label: "Ordem", render: (item) => item.displayOrder },
];

export default function AdminEventSpacesListPage() {
  const [items, setItems] = useState<AdminEventSpace[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    listEventSpaces()
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
        <h1 className={pageStyles.title}>Espaços de Evento</h1>
        <Link
          href="/admin/event-spaces/new"
          className={`${buttonStyles.button} ${buttonStyles.primary}`}
        >
          Novo Espaço de Evento
        </Link>
      </div>
      <ContentTable
        items={items}
        isLoading={isLoading}
        loadError={loadError}
        columns={COLUMNS}
        editHref={(item) => `/admin/event-spaces/edit?id=${item.id}`}
        onDelete={async (item) => {
          await deleteEventSpace(item.id);
          setItems((prev) => (prev ? prev.filter((existing) => existing.id !== item.id) : prev));
        }}
      />
    </main>
  );
}
