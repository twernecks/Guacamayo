"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LeadFilters, type LeadFilterValues } from "@/components/admin/LeadFilters";
import { LoadingIndicator } from "@/components/admin/LoadingIndicator";
import { ErrorToast } from "@/components/admin/ErrorToast";
import { listLeads } from "@/services/admin/leads-service";
import { LEAD_STATUS_LABELS } from "@/domain/admin/leads";
import type { Lead, LeadListResult } from "@/domain/admin/leads";
import { Table } from "@/components/admin/ui/Table";
import { Banner } from "@/components/admin/ui/Banner";
import { Button } from "@/components/ui/Button";
import buttonStyles from "@/components/ui/Button.module.css";
import pageStyles from "@/app/admin/admin-page.module.css";
import styles from "./leads.module.css";

// spec.md Clarifications 2026-08-25 — fixed page size, no selector in this version.
const PAGE_SIZE = 20;

export default function AdminLeadsListPage() {
  const [filters, setFilters] = useState<LeadFilterValues>({});
  const [skip, setSkip] = useState(0);
  const [result, setResult] = useState<LeadListResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);

  const fetchLeads = useCallback(() => {
    listLeads({ ...filters, skip, take: PAGE_SIZE })
      .then((data) => {
        setResult(data);
        setLoadError(null);
      })
      .catch(setLoadError)
      .finally(() => setIsLoading(false));
  }, [filters, skip]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  function handleFilterChange(next: LeadFilterValues) {
    setIsLoading(true);
    setFilters(next);
    setSkip(0);
  }

  function goToPage(nextSkip: number) {
    setIsLoading(true);
    setSkip(nextSkip);
  }

  if (isLoading) return <LoadingIndicator />;
  if (loadError) return <ErrorToast error={loadError} />;

  const items: Lead[] = result?.items ?? [];
  const totalCount = result?.totalCount ?? 0;

  return (
    <main className={pageStyles.page}>
      <h1 className={pageStyles.title}>Leads</h1>
      <LeadFilters value={filters} onChange={handleFilterChange} />
      {items.length === 0 ? (
        <Banner variant="empty">Nenhum lead encontrado.</Banner>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name || "Não informado"}</td>
                <td>{lead.phone || "Não informado"}</td>
                <td>{LEAD_STATUS_LABELS[lead.status]}</td>
                <td>{new Date(lead.createdAt).toLocaleString("pt-BR")}</td>
                <td>
                  {/* A styled `next/link` (not `Button`) keeps this navigation
                      client-side — see the same note in ContentTable.tsx. */}
                  <Link
                    href={`/admin/leads/detail?id=${lead.id}`}
                    className={`${buttonStyles.button} ${buttonStyles.secondary}`}
                  >
                    Ver detalhe
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <div className={styles.pagination}>
        <Button
          type="button"
          variant="secondary"
          disabled={skip === 0}
          onClick={() => goToPage(Math.max(0, skip - PAGE_SIZE))}
        >
          Anterior
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={skip + PAGE_SIZE >= totalCount}
          onClick={() => goToPage(skip + PAGE_SIZE)}
        >
          Próxima
        </Button>
      </div>
    </main>
  );
}
