"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ContentForm } from "@/components/admin/ContentForm";
import { ConflictBanner } from "@/components/admin/ConflictBanner";
import { LoadingIndicator } from "@/components/admin/LoadingIndicator";
import { ErrorToast } from "@/components/admin/ErrorToast";
import { RoomExtraFields } from "@/components/admin/RoomExtraFields";
import { getRoom, updateRoom } from "@/services/admin/rooms-service";
import { ApiError, ConflictError } from "@/domain/admin/shared";
import type { AdminRoom, AdminRoomFields } from "@/domain/admin/rooms";
import { Card } from "@/components/admin/ui/Card";
import pageStyles from "@/app/admin/admin-page.module.css";

function toFields(room: AdminRoom): AdminRoomFields {
  return {
    name: room.name,
    summary: room.summary,
    amenityKeys: room.amenityKeys,
    imageIds: room.imageIds,
    isPublished: room.isPublished,
    visualEmphasis: room.visualEmphasis,
    displayOrder: room.displayOrder,
  };
}

function EditRoomPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [room, setRoom] = useState<AdminRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [conflict, setConflict] = useState(false);

  // No synchronous setState before the promise chain — safe to call
  // directly from the mount effect below. A manual reload (handleReload)
  // resets isLoading/loadError/conflict itself, from the button's event
  // handler, not from an effect.
  const fetchRoom = useCallback(() => {
    if (!id) return;
    getRoom(id)
      .then((data) => {
        setRoom(data);
        setLoadError(null);
      })
      .catch(setLoadError)
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  function handleReload() {
    setIsLoading(true);
    setConflict(false);
    fetchRoom();
  }

  if (!id) {
    return <p role="alert">Link inválido — nenhum item especificado.</p>;
  }
  if (isLoading) return <LoadingIndicator />;
  // FR-008 Edge Case / contracts/content.md: the item may have been deleted
  // by someone else between listing it and opening this link.
  if (loadError instanceof ApiError && loadError.code === "NOT_FOUND") {
    return <p role="alert">Item não encontrado — talvez tenha sido excluído por outra pessoa.</p>;
  }
  if (loadError) return <ErrorToast error={loadError} />;
  if (!room) return null;

  async function handleSubmit(fields: AdminRoomFields) {
    try {
      const updated = await updateRoom(id!, { ...fields, rowVersion: room!.rowVersion });
      setRoom(updated);
    } catch (error) {
      if (error instanceof ConflictError) {
        setConflict(true);
        return;
      }
      throw error;
    }
  }

  return (
    <main className={pageStyles.page}>
      <h1 className={pageStyles.title}>Editar Quarto</h1>
      {conflict ? <ConflictBanner onReload={handleReload} /> : null}
      <Card className={pageStyles.formCard}>
        <ContentForm<AdminRoomFields>
          key={room.rowVersion}
          initialValues={toFields(room)}
          localizedFields={[
            { key: "name", label: "Nome" },
            { key: "summary", label: "Resumo", multiline: true },
          ]}
          renderExtraFields={(values, setValues) => (
            <RoomExtraFields values={values} setValues={setValues} />
          )}
          onSubmit={handleSubmit}
          submitLabel="Salvar alterações"
        />
      </Card>
    </main>
  );
}

export default function EditRoomPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <EditRoomPageContent />
    </Suspense>
  );
}
