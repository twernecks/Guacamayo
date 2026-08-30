"use client";

import { useState } from "react";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/domain/admin/leads";
import { ConflictBanner } from "@/components/admin/ConflictBanner";
import { ConflictError } from "@/domain/admin/shared";
import styles from "./LeadStatusControl.module.css";

const ALL_STATUSES: LeadStatus[] = [0, 1, 2];

type LeadStatusControlProps = {
  status: LeadStatus;
  onChangeStatus: (next: LeadStatus) => Promise<void>;
  onReloadAfterConflict: () => void;
};

/**
 * FR-023: free transition between all three statuses at any time (including
 * reopening a "Fechado" lead — spec.md Clarifications 2026-08-25), with the
 * same conflict handling as every other rowVersion-backed write (FR-024).
 */
export function LeadStatusControl({ status, onChangeStatus, onReloadAfterConflict }: LeadStatusControlProps) {
  const [conflict, setConflict] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSelect(next: LeadStatus) {
    if (next === status || isSaving) return;
    setIsSaving(true);
    try {
      await onChangeStatus(next);
      setConflict(false);
    } catch (error) {
      if (error instanceof ConflictError) {
        setConflict(true);
      } else {
        throw error;
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      {conflict ? <ConflictBanner onReload={onReloadAfterConflict} /> : null}
      <fieldset disabled={isSaving} className={styles.fieldset}>
        <legend className={styles.legend}>Status do lead</legend>
        {ALL_STATUSES.map((candidate) => (
          <label key={candidate} className={styles.option}>
            <input
              type="radio"
              name="lead-status"
              checked={status === candidate}
              onChange={() => handleSelect(candidate)}
            />
            {LEAD_STATUS_LABELS[candidate]}
          </label>
        ))}
      </fieldset>
    </div>
  );
}
