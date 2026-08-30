"use client";

import { useRouter } from "next/navigation";
import { ContentForm } from "@/components/admin/ContentForm";
import { TestimonialExtraFields } from "@/components/admin/TestimonialExtraFields";
import { createTestimonial } from "@/services/admin/testimonials-service";
import type { AdminTestimonialFields } from "@/domain/admin/testimonials";
import { CONTACT_INTEREST } from "@/domain/admin/enums";
import { Card } from "@/components/admin/ui/Card";
import pageStyles from "@/app/admin/admin-page.module.css";

const EMPTY_LOCALIZED = { pt: "", en: "", es: "" };

const INITIAL_VALUES: AdminTestimonialFields = {
  quote: EMPTY_LOCALIZED,
  attribution: "",
  experienceType: CONTACT_INTEREST.Stay,
  // Plain `yyyy-MM-dd` (API's DateOnly, no time component) — see TestimonialExtraFields.
  approvedAt: new Date().toISOString().slice(0, 10),
  isPublished: false,
};

export default function NewTestimonialPage() {
  const router = useRouter();

  async function handleSubmit(values: AdminTestimonialFields) {
    await createTestimonial(values);
    router.push("/admin/testimonials");
  }

  return (
    <main className={pageStyles.page}>
      <h1 className={pageStyles.title}>Novo Depoimento</h1>
      <Card className={pageStyles.formCard}>
        <ContentForm<AdminTestimonialFields>
          initialValues={INITIAL_VALUES}
          localizedFields={[{ key: "quote", label: "Depoimento", multiline: true }]}
          renderExtraFields={(values, setValues) => (
            <TestimonialExtraFields values={values} setValues={setValues} />
          )}
          onSubmit={handleSubmit}
          submitLabel="Criar Depoimento"
        />
      </Card>
    </main>
  );
}
