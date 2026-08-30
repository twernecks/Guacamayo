"use client";

import { useRouter } from "next/navigation";
import { ContentForm } from "@/components/admin/ContentForm";
import { EventSpaceExtraFields } from "@/components/admin/EventSpaceExtraFields";
import { createEventSpace } from "@/services/admin/event-spaces-service";
import type { AdminEventSpaceFields } from "@/domain/admin/event-spaces";
import { CONTACT_INTEREST } from "@/domain/admin/enums";
import { Card } from "@/components/admin/ui/Card";
import pageStyles from "@/app/admin/admin-page.module.css";

const EMPTY_LOCALIZED = { pt: "", en: "", es: "" };

const INITIAL_VALUES: AdminEventSpaceFields = {
  name: EMPTY_LOCALIZED,
  purpose: EMPTY_LOCALIZED,
  contactContext: CONTACT_INTEREST.Event,
  imageIds: [],
  isFeatured: false,
  isPublished: false,
  displayOrder: 0,
};

export default function NewEventSpacePage() {
  const router = useRouter();

  async function handleSubmit(values: AdminEventSpaceFields) {
    await createEventSpace(values);
    router.push("/admin/event-spaces");
  }

  return (
    <main className={pageStyles.page}>
      <h1 className={pageStyles.title}>Novo Espaço de Evento</h1>
      <Card className={pageStyles.formCard}>
        <ContentForm<AdminEventSpaceFields>
          initialValues={INITIAL_VALUES}
          localizedFields={[
            { key: "name", label: "Nome" },
            { key: "purpose", label: "Propósito", multiline: true },
          ]}
          renderExtraFields={(values, setValues) => (
            <EventSpaceExtraFields values={values} setValues={setValues} />
          )}
          onSubmit={handleSubmit}
          submitLabel="Criar Espaço de Evento"
        />
      </Card>
    </main>
  );
}
