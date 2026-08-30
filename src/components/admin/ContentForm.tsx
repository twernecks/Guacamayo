"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { LanguageTabs } from "@/components/admin/LanguageTabs";
import { FieldError } from "@/components/admin/FieldError";
import { Field } from "@/components/admin/ui/Field";
import { Banner } from "@/components/admin/ui/Banner";
import { Button } from "@/components/ui/Button";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { describeError } from "@/components/admin/ErrorToast";
import { validateRequiredPerLanguage } from "@/domain/admin/content-validation";
import { ApiError, type LocalizedText } from "@/domain/admin/shared";
import { SUPPORTED_LANGUAGES } from "@/i18n/languages";
import styles from "./ContentForm.module.css";

type LocalizedFieldConfig = {
  key: string;
  label: string;
  multiline?: boolean;
};

/**
 * Shared shape every content type's editable fields extend (id/rowVersion
 * live outside the form). `displayOrder` is optional — Testimonials don't
 * have one (data-model.md § Depoimento administrativo lists only `quote`,
 * `attribution`, `experienceType`, `approvedAt`, `isPublished`).
 */
export type ContentFormValues = {
  isPublished: boolean;
  displayOrder?: number;
  [key: string]: unknown;
};

type ContentFormProps<T extends ContentFormValues> = {
  initialValues: T;
  localizedFields: LocalizedFieldConfig[];
  /** Type-specific fields (amenities, contact context, attribution, ...). */
  renderExtraFields: (values: T, setValues: (updater: (prev: T) => T) => void) => ReactNode;
  onSubmit: (values: T) => Promise<void>;
  submitLabel: string;
};

/**
 * Generic multilingual create/edit form, shared by Rooms, Event Spaces and
 * Testimonials (FR-010/FR-011) — the parts that differ per type (amenities,
 * contact context, attribution/experience type) are supplied by the caller
 * via `renderExtraFields` rather than a config DSL, keeping this shell
 * responsible only for what's genuinely identical across the three: language
 * tabs, publish-validation (FR-012), unsaved-changes protection (FR-017a)
 * and API error mapping (FR-025/FR-026).
 */
export function ContentForm<T extends ContentFormValues>({
  initialValues,
  localizedFields,
  renderExtraFields,
  onSubmit,
  submitLabel,
}: ContentFormProps<T>) {
  const [values, setValuesState] = useState<T>(initialValues);
  const [isDirty, setIsDirty] = useState(false);
  const [publishAttempted, setPublishAttempted] = useState(false);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setValues(updater: (prev: T) => T) {
    setValuesState((prev) => updater(prev));
    setIsDirty(true);
  }

  const missingByField: Record<string, ReturnType<typeof validateRequiredPerLanguage>> = {};
  for (const field of localizedFields) {
    missingByField[field.key] = validateRequiredPerLanguage(values[field.key] as LocalizedText);
  }
  const hasMissingRequiredField = Object.values(missingByField).some((missing) => missing.length > 0);
  // FR-012 only blocks *publishing* — saving as a draft (isPublished: false)
  // is always allowed, including for legacy items with incomplete languages
  // (spec.md Edge Cases).
  const blocksPublish = values.isPublished && hasMissingRequiredField;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPublishAttempted(true);
    if (blocksPublish) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setIsDirty(false);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error);
      } else {
        throw error;
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <UnsavedChangesGuard isDirty={isDirty} />

      {localizedFields.map((field) => (
        <div key={field.key}>
          <LanguageTabs
            id={field.key}
            label={field.label}
            value={values[field.key] as LocalizedText}
            onChange={(next) => setValues((prev) => ({ ...prev, [field.key]: next }))}
            multiline={field.multiline}
            missingLanguages={publishAttempted ? (missingByField[field.key] ?? []) : []}
          />
          {publishAttempted &&
            (missingByField[field.key] ?? []).map((language) => (
              <p role="alert" key={language}>
                {`${field.label} (${language}) é obrigatório para publicar.`}
              </p>
            ))}
          {SUPPORTED_LANGUAGES.map((language) => (
            <FieldError key={language} details={submitError?.details} field={`${field.key}.${language}`} />
          ))}
        </div>
      ))}

      {renderExtraFields(values, setValues)}

      <label className={styles.checkboxRow} htmlFor="content-form-is-published">
        <input
          id="content-form-is-published"
          type="checkbox"
          checked={values.isPublished}
          onChange={(event) => setValues((prev) => ({ ...prev, isPublished: event.target.checked }))}
        />
        Publicado
      </label>

      {values.displayOrder !== undefined ? (
        <Field label="Ordem de exibição" htmlFor="content-form-display-order">
          <input
            id="content-form-display-order"
            type="number"
            value={values.displayOrder}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, displayOrder: Number(event.target.value) }))
            }
          />
        </Field>
      ) : null}

      {publishAttempted && blocksPublish ? (
        <Banner variant="warning" role="alert">
          Preencha os campos obrigatórios em todos os idiomas antes de publicar, ou desmarque
          &quot;Publicado&quot; para salvar como rascunho.
        </Banner>
      ) : null}
      {submitError ? (
        <Banner variant="error" role="alert">
          {describeError(submitError)}
        </Banner>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className={styles.submit}>
        {isSubmitting ? "Salvando…" : submitLabel}
      </Button>
    </form>
  );
}
