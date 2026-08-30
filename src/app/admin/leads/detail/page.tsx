"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingIndicator } from "@/components/admin/LoadingIndicator";
import { ErrorToast } from "@/components/admin/ErrorToast";
import { LeadStatusControl } from "@/components/admin/LeadStatusControl";
import { getLead, updateLeadStatus } from "@/services/admin/leads-service";
import { ApiError } from "@/domain/admin/shared";
import { LEAD_INTEREST_LABELS, type LeadDetail, type LeadStatus } from "@/domain/admin/leads";
import { Card } from "@/components/admin/ui/Card";
import { Banner } from "@/components/admin/ui/Banner";
import pageStyles from "@/app/admin/admin-page.module.css";
import styles from "./detail.module.css";

function LeadDetailPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);

  const fetchLead = useCallback(() => {
    if (!id) return;
    getLead(id)
      .then((data) => {
        setLead(data);
        setLoadError(null);
      })
      .catch(setLoadError)
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  function handleReload() {
    setIsLoading(true);
    fetchLead();
  }

  if (!id) {
    return <p role="alert">Link inválido — nenhum lead especificado.</p>;
  }
  if (isLoading) return <LoadingIndicator />;
  // contracts/leads.md — 404 NOT_FOUND: the lead no longer exists.
  if (loadError instanceof ApiError && loadError.code === "NOT_FOUND") {
    return <p role="alert">Lead não encontrado.</p>;
  }
  if (loadError) return <ErrorToast error={loadError} />;
  if (!lead) return null;

  async function handleChangeStatus(next: LeadStatus) {
    const updated = await updateLeadStatus(id!, next, lead!.rowVersion);
    setLead((prev) => (prev ? { ...prev, status: updated.status, rowVersion: updated.rowVersion } : prev));
  }

  return (
    <main className={pageStyles.page}>
      <h1 className={pageStyles.title}>Detalhe do Lead</h1>
      <Card className={styles.card}>
        <dl className={styles.details}>
          <dt>Nome</dt>
          {/* FR-021: "não informado" instead of a silent blank when the field is missing.
              The API's Name/Phone are non-nullable strings, but an unexpectedly empty one
              still falls back here — `||`, not `??`, on purpose. */}
          <dd>{lead.name || "Não informado"}</dd>
          <dt>Telefone</dt>
          <dd>{lead.phone || "Não informado"}</dd>
          <dt>Interesse</dt>
          <dd>{LEAD_INTEREST_LABELS[lead.interest]}</dd>
          <dt>Mensagem</dt>
          <dd>{lead.message ?? "Não informado"}</dd>
        </dl>

        <LeadStatusControl
          status={lead.status}
          onChangeStatus={handleChangeStatus}
          onReloadAfterConflict={handleReload}
        />

        <section>
          <h2 className={styles.conversationTitle}>Histórico da conversa</h2>
          {lead.messages.length === 0 ? (
            // FR-022: an empty conversation is a normal state, never an error.
            <Banner variant="empty">Nenhuma mensagem — a conversa de origem não existe mais.</Banner>
          ) : (
            <ul className={styles.messages}>
              {lead.messages.map((message, index) => (
                <li key={`${message.timestamp}-${index}`} className={styles.message}>
                  <span className={styles.messageDirection}>
                    {message.direction === 0 ? "Lead" : "Bot"}:{" "}
                  </span>
                  {message.body}
                </li>
              ))}
            </ul>
          )}
        </section>
      </Card>
    </main>
  );
}

export default function LeadDetailPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <LeadDetailPageContent />
    </Suspense>
  );
}
