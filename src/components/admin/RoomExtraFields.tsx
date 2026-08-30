import type { AdminRoomFields } from "@/domain/admin/rooms";
import { AMENITY_KEY_LABELS, VISUAL_EMPHASIS, VISUAL_EMPHASIS_LABELS, type AmenityKeyValue } from "@/domain/admin/enums";
import { Field } from "@/components/admin/ui/Field";
import styles from "./RoomExtraFields.module.css";

const AMENITY_OPTIONS = Object.entries(AMENITY_KEY_LABELS).map(([key, label]) => ({
  key: Number(key) as AmenityKeyValue,
  label,
}));

type RoomExtraFieldsProps = {
  values: AdminRoomFields;
  setValues: (updater: (prev: AdminRoomFields) => AdminRoomFields) => void;
};

/** The "type-specific field slot" ContentForm's `renderExtraFields` needs for a Room. */
export function RoomExtraFields({ values, setValues }: RoomExtraFieldsProps) {
  function toggleAmenity(key: AmenityKeyValue) {
    setValues((prev) => ({
      ...prev,
      amenityKeys: prev.amenityKeys.includes(key)
        ? prev.amenityKeys.filter((existing) => existing !== key)
        : [...prev.amenityKeys, key],
    }));
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Comodidades</legend>
      <div className={styles.amenities}>
        {AMENITY_OPTIONS.map((option) => (
          <label key={option.key} className={styles.amenity}>
            <input
              type="checkbox"
              checked={values.amenityKeys.includes(option.key)}
              onChange={() => toggleAmenity(option.key)}
            />
            {option.label}
          </label>
        ))}
      </div>

      <Field label="Destaque visual" htmlFor="room-visual-emphasis">
        <select
          id="room-visual-emphasis"
          value={values.visualEmphasis}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              visualEmphasis: Number(event.target.value) as AdminRoomFields["visualEmphasis"],
            }))
          }
        >
          <option value={VISUAL_EMPHASIS.Standard}>{VISUAL_EMPHASIS_LABELS[VISUAL_EMPHASIS.Standard]}</option>
          <option value={VISUAL_EMPHASIS.Featured}>{VISUAL_EMPHASIS_LABELS[VISUAL_EMPHASIS.Featured]}</option>
        </select>
      </Field>
    </fieldset>
  );
}
