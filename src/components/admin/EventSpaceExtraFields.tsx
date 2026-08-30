import type { AdminEventSpaceFields } from "@/domain/admin/event-spaces";
import { CONTACT_INTEREST, CONTACT_INTEREST_LABELS } from "@/domain/admin/enums";
import { Field } from "@/components/admin/ui/Field";
import styles from "./EventSpaceExtraFields.module.css";

type EventSpaceExtraFieldsProps = {
  values: AdminEventSpaceFields;
  setValues: (updater: (prev: AdminEventSpaceFields) => AdminEventSpaceFields) => void;
};

export function EventSpaceExtraFields({ values, setValues }: EventSpaceExtraFieldsProps) {
  return (
    <div className={styles.wrapper}>
      <Field label="Contexto de contato" htmlFor="event-space-contact-context">
        {/* Stay (0) is a valid ContactInterest value but never used for an Event Space — only
            Event/Wedding are offered here. */}
        <select
          id="event-space-contact-context"
          value={values.contactContext}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              contactContext: Number(event.target.value) as AdminEventSpaceFields["contactContext"],
            }))
          }
        >
          <option value={CONTACT_INTEREST.Event}>{CONTACT_INTEREST_LABELS[CONTACT_INTEREST.Event]}</option>
          <option value={CONTACT_INTEREST.Wedding}>{CONTACT_INTEREST_LABELS[CONTACT_INTEREST.Wedding]}</option>
        </select>
      </Field>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={values.isFeatured}
          onChange={(event) => setValues((prev) => ({ ...prev, isFeatured: event.target.checked }))}
        />
        Em destaque
      </label>
    </div>
  );
}
