import type { AdminTestimonialFields } from "@/domain/admin/testimonials";
import { CONTACT_INTEREST, CONTACT_INTEREST_LABELS } from "@/domain/admin/enums";
import { Field } from "@/components/admin/ui/Field";
import styles from "./TestimonialExtraFields.module.css";

type TestimonialExtraFieldsProps = {
  values: AdminTestimonialFields;
  setValues: (updater: (prev: AdminTestimonialFields) => AdminTestimonialFields) => void;
};

export function TestimonialExtraFields({ values, setValues }: TestimonialExtraFieldsProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Detalhes do depoimento</legend>
      <Field label="Atribuição (nome do hóspede)" htmlFor="testimonial-attribution">
        <input
          id="testimonial-attribution"
          type="text"
          value={values.attribution}
          onChange={(event) => setValues((prev) => ({ ...prev, attribution: event.target.value }))}
        />
      </Field>
      <Field label="Tipo de experiência" htmlFor="testimonial-experience-type">
        <select
          id="testimonial-experience-type"
          value={values.experienceType}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              experienceType: Number(event.target.value) as AdminTestimonialFields["experienceType"],
            }))
          }
        >
          <option value={CONTACT_INTEREST.Stay}>{CONTACT_INTEREST_LABELS[CONTACT_INTEREST.Stay]}</option>
          <option value={CONTACT_INTEREST.Event}>{CONTACT_INTEREST_LABELS[CONTACT_INTEREST.Event]}</option>
          <option value={CONTACT_INTEREST.Wedding}>{CONTACT_INTEREST_LABELS[CONTACT_INTEREST.Wedding]}</option>
        </select>
      </Field>
      <Field label="Data de aprovação" htmlFor="testimonial-approved-at">
        {/* `approvedAt` is a plain `yyyy-MM-dd` (API's DateOnly, no time component) — an
            <input type="date"> already produces exactly that format, so its value is sent
            through unchanged, never converted via `Date`/`toISOString` (which would add a time
            component the API doesn't expect). */}
        <input
          id="testimonial-approved-at"
          type="date"
          value={values.approvedAt}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              approvedAt: event.target.value || prev.approvedAt,
            }))
          }
        />
      </Field>
    </fieldset>
  );
}
