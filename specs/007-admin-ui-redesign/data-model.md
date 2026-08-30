# Data Model: Redesign Visual do Painel Administrativo

**Não aplicável.** Esta feature é exclusivamente de apresentação/estilo visual (ver spec.md
Assumptions e FR-012). Nenhuma entidade de dados, campo, relação ou regra de validação é criada,
alterada ou removida — todos os tipos de domínio (`src/domain/admin/*`) e serviços
(`src/services/admin/*`) definidos pela feature `006-admin-panel-integration` permanecem
inalterados.

Os únicos "modelos" introduzidos por esta feature são contratos de **props de componentes de
apresentação** (não entidades de negócio) — documentados em
[`contracts/admin-ui-components.md`](./contracts/admin-ui-components.md).
