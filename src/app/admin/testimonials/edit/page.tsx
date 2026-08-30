"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ContentForm } from "@/components/admin/ContentForm";
import { ConflictBanner } from "@/components/admin/ConflictBanner";
import { LoadingIndicator } from "@/components/admin/LoadingIndicator";
import { ErrorToast } from "@/components/admin/ErrorToast";
import { TestimonialExtraFields } from "@/components/admin/TestimonialExtraFields";
import { getTestimonial, updateTestimonial } from "@/services/admin/testimonials-service";
import { ApiError, ConflictError } from "@/domain/admin/shared";
import type { AdminTestimonial, AdminTestimonialFields } from "@/domain/admin/testimonials";
import { Card } from "@/components/admin/ui/Card";
import pageStyles from "@/app/admin/admin-page.module.css";

function toFields(item: AdminTestimonial): AdminTestimonialFields {
  return {
    quote: item.quote,
    attribution: item.attribution,
    experienceType: item.experienceType,
    approvedAt: item.approvedAt,
    isPublished: item.isPublished,
  };
}

function EditTestimonialPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [item, setItem] = useState<AdminTestimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [conflict, setConflict] = useState(false);

  const fetchItem = useCallback(() => {
    if (!id) return;
    getTestimonial(id)
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

  async function handleSubmit(fields: AdminTestimonialFields) {
    try {
      const updated = await updateTestimonial(id!, { ...fields, rowVersion: item!.rowVersion });
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
      <h1 className={pageStyles.title}>Editar Depoimento</h1>
      {conflict ? <ConflictBanner onReload={handleReload} /> : null}
      <Card className={pageStyles.formCard}>
        <ContentForm<AdminTestimonialFields>
          key={item.rowVersion}
          initialValues={toFields(item)}
          localizedFields={[{ key: "quote", label: "Depoimento", multiline: true }]}
          renderExtraFields={(values, setValues) => (
            <TestimonialExtraFields values={values} setValues={setValues} />
          )}
          onSubmit={handleSubmit}
          submitLabel="Salvar alterações"
        />
      </Card>
    </main>
  );
}

export default function EditTestimonialPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <EditTestimonialPageContent />
    </Suspense>
  );
}
