"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { LoadingIndicator } from "@/components/admin/LoadingIndicator";
import { ErrorToast } from "@/components/admin/ErrorToast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Table } from "@/components/admin/ui/Table";
import { Banner } from "@/components/admin/ui/Banner";
import { Button } from "@/components/ui/Button";
import { EditIcon } from "@/components/ui/icons/EditIcon";
import { TrashIcon } from "@/components/ui/icons/TrashIcon";
import buttonStyles from "@/components/ui/Button.module.css";
import styles from "./ContentTable.module.css";

export type ContentTableColumn<T> = {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
};

type ContentTableProps<T extends { id: string }> = {
  items: T[] | null;
  isLoading: boolean;
  loadError: unknown;
  columns: ContentTableColumn<T>[];
  editHref: (item: T) => string;
  onDelete: (item: T) => Promise<void>;
  emptyLabel?: string;
};

/**
 * Generic listing shared by Rooms/Event Spaces/Testimonials (FR-009):
 * loading and error states for the initial `GET` (Constitution Principle II
 * — "consistent loading, error and empty states"), plus a delete action
 * gated by confirmation (FR-013).
 */
export function ContentTable<T extends { id: string }>({
  items,
  isLoading,
  loadError,
  columns,
  editHref,
  onDelete,
  emptyLabel = "Nenhum item cadastrado ainda.",
}: ContentTableProps<T>) {
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [deleteError, setDeleteError] = useState<unknown>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (isLoading) return <LoadingIndicator />;
  if (loadError) return <ErrorToast error={loadError} />;

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(pendingDelete);
      setPendingDelete(null);
    } catch (error) {
      setDeleteError(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {deleteError ? <ErrorToast error={deleteError} /> : null}
      {!items || items.length === 0 ? (
        <Banner variant="empty">{emptyLabel}</Banner>
      ) : (
        <Table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(item)}</td>
                ))}
                <td className={styles.actions}>
                  {/* A styled `next/link` (not the `Button` component) so internal
                      navigation stays client-side — Button always renders a plain
                      `<a>` for `href`, which would force a full page reload here. */}
                  <Link
                    href={editHref(item)}
                    className={`${buttonStyles.button} ${buttonStyles.secondary}`}
                  >
                    <EditIcon className={styles.icon} />
                    Editar
                  </Link>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setPendingDelete(item)}
                    disabled={isDeleting}
                  >
                    <TrashIcon className={styles.icon} />
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <ConfirmDialog
        open={pendingDelete !== null}
        variant="delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
