"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentTable, type ContentTableColumn } from "@/components/admin/ContentTable";
import { listRooms, deleteRoom } from "@/services/admin/rooms-service";
import type { AdminRoom } from "@/domain/admin/rooms";
import buttonStyles from "@/components/ui/Button.module.css";
import pageStyles from "@/app/admin/admin-page.module.css";

const COLUMNS: ContentTableColumn<AdminRoom>[] = [
  { key: "name", label: "Nome", render: (room) => room.name.pt },
  { key: "isPublished", label: "Publicado", render: (room) => (room.isPublished ? "Sim" : "Não") },
  { key: "displayOrder", label: "Ordem", render: (room) => room.displayOrder },
];

export default function AdminRoomsListPage() {
  const [rooms, setRooms] = useState<AdminRoom[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    listRooms()
      .then((data) => {
        if (!cancelled) setRooms(data);
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
        <h1 className={pageStyles.title}>Quartos</h1>
        <Link href="/admin/rooms/new" className={`${buttonStyles.button} ${buttonStyles.primary}`}>
          Novo Quarto
        </Link>
      </div>
      <ContentTable
        items={rooms}
        isLoading={isLoading}
        loadError={loadError}
        columns={COLUMNS}
        editHref={(room) => `/admin/rooms/edit?id=${room.id}`}
        onDelete={async (room) => {
          await deleteRoom(room.id);
          setRooms((prev) => (prev ? prev.filter((existing) => existing.id !== room.id) : prev));
        }}
      />
    </main>
  );
}
