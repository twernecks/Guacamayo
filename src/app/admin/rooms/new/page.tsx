"use client";

import { useRouter } from "next/navigation";
import { ContentForm } from "@/components/admin/ContentForm";
import { RoomExtraFields } from "@/components/admin/RoomExtraFields";
import { createRoom } from "@/services/admin/rooms-service";
import type { AdminRoomFields } from "@/domain/admin/rooms";
import { VISUAL_EMPHASIS } from "@/domain/admin/enums";
import { Card } from "@/components/admin/ui/Card";
import pageStyles from "@/app/admin/admin-page.module.css";

const EMPTY_LOCALIZED = { pt: "", en: "", es: "" };

const INITIAL_VALUES: AdminRoomFields = {
  name: EMPTY_LOCALIZED,
  summary: EMPTY_LOCALIZED,
  amenityKeys: [],
  imageIds: [],
  isPublished: false,
  visualEmphasis: VISUAL_EMPHASIS.Standard,
  displayOrder: 0,
};

export default function NewRoomPage() {
  const router = useRouter();

  async function handleSubmit(values: AdminRoomFields) {
    await createRoom(values);
    router.push("/admin/rooms");
  }

  return (
    <main className={pageStyles.page}>
      <h1 className={pageStyles.title}>Novo Quarto</h1>
      <Card className={pageStyles.formCard}>
        <ContentForm<AdminRoomFields>
          initialValues={INITIAL_VALUES}
          localizedFields={[
            { key: "name", label: "Nome" },
            { key: "summary", label: "Resumo", multiline: true },
          ]}
          renderExtraFields={(values, setValues) => (
            <RoomExtraFields values={values} setValues={setValues} />
          )}
          onSubmit={handleSubmit}
          submitLabel="Criar Quarto"
        />
      </Card>
    </main>
  );
}
