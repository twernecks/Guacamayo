"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ContentForm } from "@/components/admin/ContentForm";
import { ConflictBanner } from "@/components/admin/ConflictBanner";
import { LoadingIndicator } from "@/components/admin/LoadingIndicator";
import { ErrorToast } from "@/components/admin/ErrorToast";
import { EventSpaceExtraFields } from "@/components/admin/EventSpaceExtraFields";
import { getEventSpace, updateEventSpace } from "@/services/admin/event-spaces-service";
import { ApiError, ConflictError } from "@/domain/admin/shared";
import type { AdminEventSpace, AdminEventSpaceFields } from "@/domain/admin/event-spaces";
import { Card } from "@/components/admin/ui/Card";
import pageStyles from "@/app/admin/admin-page.module.css";

function toFields(item: AdminEventSpace): AdminEventSpaceFields {
  return {
    name: item.name,
    purpose: item.purpose,
    contactContext: item.contactContext,
    imageIds: item.imageIds,
    isFeatured: item.isFeatured,
    isPublished: item.isPublished,
    displayOrder: item.displayOrder,
  };
}

function EditEventSpacePageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [item, setItem] = useState<AdminEventSpace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [conflict, setConflict] = useState(false);

  const fetchItem = useCallback(() => {
    if (!id) return;
    getEventSpace(id)
      .then((data) => {
        setItem(data);
        setLoadError(null);
      })
      .catch(setLoadError)
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  function handleReload() {
    setIsLoading(true);
    setConflict(false);
    fetchItem();
  }

  if (!id) {
    return <p role="alert">Link inválido — nenhum item especificado.</p>;
  }
  if (isLoading) return <LoadingIndicator />;
  if (loadError instanceof ApiError && loadError.code === "NOT_FOUND") {
    return <p role="alert">Item não encontrado — talvez tenha sido excluído por outra pessoa.</p>;
  }
  if (loadError) return <ErrorToast error={loadError} />;
  if (!item) return null;

  async function handleSubmit(fields: AdminEventSpaceFields) {
    try {
      const updated = await updateEventSpace(id!, { ...fields, rowVersion: item!.rowVersion });
      setItem(updated);
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
      <h1 className={pageStyles.title}>Editar Espaço de Evento</h1>
      {conflict ? <ConflictBanner onReload={handleReload} /> : null}
      <Card className={pageStyles.formCard}>
        <ContentForm<AdminEventSpaceFields>
          key={item.rowVersion}
          initialValues={toFields(item)}
          localizedFields={[
            { key: "name", label: "Nome" },
            { key: "purpose", label: "Propósito", multiline: true },
          ]}
          renderExtraFields={(values, setValues) => (
            <EventSpaceExtraFields values={values} setValues={setValues} />
          )}
          onSubmit={handleSubmit}
          submitLabel="Salvar alterações"
        />
      </Card>
    </main>
  );
}

export default function EditEventSpacePage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <EditEventSpacePageContent />
    </Suspense>
  );
}
