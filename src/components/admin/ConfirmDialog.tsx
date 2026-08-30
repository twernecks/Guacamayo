"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./ConfirmDialog.module.css";

export type ConfirmDialogVariant = "delete" | "discard";

const COPY: Record<ConfirmDialogVariant, { title: string; body: string; confirmLabel: string }> = {
  // FR-013: deliberately more emphatic than "discard" — deletion is permanent.
  delete: {
    title: "Excluir definitivamente?",
    body: "Esta ação não pode ser desfeita: o item será removido para sempre.",
    confirmLabel: "Excluir",
  },
  // FR-017a: a lighter-weight warning about losing in-progress edits.
  discard: {
    title: "Descartar alterações?",
    body: "Você tem alterações não salvas nesta tela. Se continuar, elas serão perdidas.",
    confirmLabel: "Descartar",
  },
};

type ConfirmDialogProps = {
  open: boolean;
  variant: ConfirmDialogVariant;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, variant, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const copy = COPY[variant];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} onClose={onCancel} aria-label={copy.title} className={styles.dialog}>
      <h2 className={styles.title}>{copy.title}</h2>
      <p className={styles.body}>{copy.body}</p>
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" variant="destructive" onClick={onConfirm}>
          {copy.confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
