"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ConflictBanner } from "@/components/admin/ConflictBanner";
import { LoadingIndicator } from "@/components/admin/LoadingIndicator";
import { ErrorToast } from "@/components/admin/ErrorToast";
import { UnsavedChangesGuard } from "@/components/admin/UnsavedChangesGuard";
import { getSiteSettings, updateSiteSettings } from "@/services/admin/site-settings-service";
import { ConflictError } from "@/domain/admin/shared";
import type { AdminSiteSettings, AdminSiteSettingsFields } from "@/domain/admin/site-settings";
import { Field } from "@/components/admin/ui/Field";
import { Card } from "@/components/admin/ui/Card";
import { Button } from "@/components/ui/Button";
import pageStyles from "@/app/admin/admin-page.module.css";
import formStyles from "@/components/admin/ContentForm.module.css";

function toFields(settings: AdminSiteSettings): AdminSiteSettingsFields {
  return {
    whatsappNumber: settings.whatsappNumber,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    latitude: settings.latitude,
    longitude: settings.longitude,
    mapEmbedUrl: settings.mapEmbedUrl,
    streetViewEmbedUrl: settings.streetViewEmbedUrl,
    fallbackMapUrl: settings.fallbackMapUrl,
    heroMediaId: settings.heroMediaId,
  };
}

// FR-015/FR-016: a single, flat record (confirmed live against the real API,
// 2026-08-26 — not nested under contact/location as first guessed) — this
// page never renders a create or delete action, only view + edit.
export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<AdminSiteSettings | null>(null);
  const [fields, setFields] = useState<AdminSiteSettingsFields | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [conflict, setConflict] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSettings = useCallback(() => {
    getSiteSettings()
      .then((data) => {
        setSettings(data);
        setFields(toFields(data));
        setLoadError(null);
        setIsDirty(false);
      })
      .catch(setLoadError)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  function handleReload() {
    setIsLoading(true);
    setConflict(false);
    fetchSettings();
  }

  function updateFields(updater: (prev: AdminSiteSettingsFields) => AdminSiteSettingsFields) {
    setFields((prev) => (prev ? updater(prev) : prev));
    setIsDirty(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fields || !settings) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const updated = await updateSiteSettings({ ...fields, rowVersion: settings.rowVersion });
      setSettings(updated);
      setFields(toFields(updated));
      setIsDirty(false);
    } catch (error) {
      if (error instanceof ConflictError) {
        setConflict(true);
      } else {
        setSubmitError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingIndicator />;
  if (loadError) return <ErrorToast error={loadError} />;
  if (!fields) return null;

  return (
    <main className={pageStyles.page}>
      <h1 className={pageStyles.title}>Configurações do Site</h1>
      <UnsavedChangesGuard isDirty={isDirty} />
      {conflict ? <ConflictBanner onReload={handleReload} /> : null}
      <Card className={pageStyles.formCard}>
        <form onSubmit={handleSubmit} className={formStyles.form}>
          <Field label="WhatsApp" htmlFor="site-settings-whatsapp">
            <input
              id="site-settings-whatsapp"
              value={fields.whatsappNumber}
              onChange={(event) => updateFields((prev) => ({ ...prev, whatsappNumber: event.target.value }))}
            />
          </Field>
          <Field label="Telefone" htmlFor="site-settings-phone">
            <input
              id="site-settings-phone"
              value={fields.phone ?? ""}
              onChange={(event) =>
                updateFields((prev) => ({ ...prev, phone: event.target.value || null }))
              }
            />
          </Field>
          <Field label="Email" htmlFor="site-settings-email">
            <input
              id="site-settings-email"
              type="email"
              value={fields.email ?? ""}
              onChange={(event) =>
                updateFields((prev) => ({ ...prev, email: event.target.value || null }))
              }
            />
          </Field>
          <Field label="Endereço" htmlFor="site-settings-address">
            <input
              id="site-settings-address"
              value={fields.address}
              onChange={(event) => updateFields((prev) => ({ ...prev, address: event.target.value }))}
            />
          </Field>
          <Field label="Latitude" htmlFor="site-settings-lat">
            <input
              id="site-settings-lat"
              type="number"
              step="any"
              value={fields.latitude}
              onChange={(event) =>
                updateFields((prev) => ({ ...prev, latitude: Number(event.target.value) }))
              }
            />
          </Field>
          <Field label="Longitude" htmlFor="site-settings-lng">
            <input
              id="site-settings-lng"
              type="number"
              step="any"
              value={fields.longitude}
              onChange={(event) =>
                updateFields((prev) => ({ ...prev, longitude: Number(event.target.value) }))
              }
            />
          </Field>
          <Field label="URL do mapa incorporado" htmlFor="site-settings-map-embed">
            <input
              id="site-settings-map-embed"
              value={fields.mapEmbedUrl}
              onChange={(event) => updateFields((prev) => ({ ...prev, mapEmbedUrl: event.target.value }))}
            />
          </Field>
          <Field label="URL do Street View" htmlFor="site-settings-street-view">
            <input
              id="site-settings-street-view"
              value={fields.streetViewEmbedUrl ?? ""}
              onChange={(event) =>
                updateFields((prev) => ({ ...prev, streetViewEmbedUrl: event.target.value || null }))
              }
            />
          </Field>
          <Field label="URL do mapa alternativo" htmlFor="site-settings-fallback-map">
            <input
              id="site-settings-fallback-map"
              value={fields.fallbackMapUrl}
              onChange={(event) =>
                updateFields((prev) => ({ ...prev, fallbackMapUrl: event.target.value }))
              }
            />
          </Field>
          <Field label="ID da mídia de destaque" htmlFor="site-settings-hero-media-id">
            <input
              id="site-settings-hero-media-id"
              value={fields.heroMediaId ?? ""}
              onChange={(event) =>
                updateFields((prev) => ({ ...prev, heroMediaId: event.target.value || null }))
              }
            />
          </Field>

          {submitError ? <ErrorToast error={submitError} /> : null}
          <Button type="submit" disabled={isSubmitting} className={formStyles.submit}>
            {isSubmitting ? "Salvando…" : "Salvar alterações"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
