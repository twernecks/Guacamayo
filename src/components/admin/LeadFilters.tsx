"use client";

import { useState, type FormEvent } from "react";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/domain/admin/leads";
import { validateDateRange } from "@/domain/admin/leads-validation";
import { Field } from "@/components/admin/ui/Field";
import { Button } from "@/components/ui/Button";
import styles from "./LeadFilters.module.css";

export type LeadFilterValues = {
  status?: LeadStatus;
  from?: string;
  to?: string;
};

const STATUS_OPTIONS: LeadStatus[] = [0, 1, 2];

type LeadFiltersProps = {
  value: LeadFilterValues;
  onChange: (next: LeadFilterValues) => void;
};

/** FR-019/FR-020 — blocks an invalid date range client-side before it ever reaches the API. */
export function LeadFilters({ value, onChange }: LeadFiltersProps) {
  const [draft, setDraft] = useState<LeadFilterValues>(value);
  const isValidRange = validateDateRange(draft.from, draft.to);

  function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidRange) return;
    onChange(draft);
  }

  return (
    <form onSubmit={handleApply} className={styles.form}>
      <Field label="Status" htmlFor="lead-filter-status" className={styles.field}>
        <select
          id="lead-filter-status"
          value={draft.status ?? ""}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              status: event.target.value === "" ? undefined : (Number(event.target.value) as LeadStatus),
            }))
          }
        >
          <option value="">Todos</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {LEAD_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="De" htmlFor="lead-filter-from" className={styles.field}>
        <input
          id="lead-filter-from"
          type="date"
          value={draft.from ?? ""}
          onChange={(event) => setDraft((prev) => ({ ...prev, from: event.target.value || undefined }))}
        />
      </Field>
      <Field label="Até" htmlFor="lead-filter-to" className={styles.field}>
        <input
          id="lead-filter-to"
          type="date"
          value={draft.to ?? ""}
          onChange={(event) => setDraft((prev) => ({ ...prev, to: event.target.value || undefined }))}
        />
      </Field>
      {!isValidRange ? (
        <p role="alert" className={styles.error}>
          A data inicial não pode ser posterior à data final.
        </p>
      ) : null}
      <Button type="submit" disabled={!isValidRange}>
        Filtrar
      </Button>
    </form>
  );
}
