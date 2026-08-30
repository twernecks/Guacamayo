# Contrato: Componentes de apresentação do redesenho administrativo

Estes são contratos de **props de componentes de UI** (não contratos de API/rede) — o "contrato"
relevante para uma feature puramente visual, usado pelas telas de `/admin/**` durante as fases de
implementação (US1–US4). Manter essas assinaturas estáveis entre fases evita retrabalho ao estilizar
cada tela subsequente.

## `Button` (extensão) — `src/components/ui/Button.tsx`

Componente já existente, reaproveitado do site público. Único acréscimo: uma variante nova.

```ts
type ButtonVariant = "primary" | "accent" | "secondary" | "destructive"; // "destructive" é novo
```

- `destructive` usa `--color-accent`/`--color-accent-strong` com um peso visual mais forte que
  `secondary`, reservado para ações irreversíveis (excluir Quarto/Espaço/Depoimento).
- Nenhuma outra prop muda; `href`/`type`/demais atributos nativos continuam encaminhados como hoje.

## `Field` — `src/components/admin/ui/Field.tsx` (novo)

Wrapper de rótulo + controle de formulário. Não introduz estado nem validação — puramente visual,
encaminha todos os atributos nativos do controle.

```ts
type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;           // renderiza via FieldError já existente, sem duplicar a lógica de erro
  children: ReactNode;      // o <input>/<textarea>/<select> nativo, já com id={htmlFor}
  className?: string;
};
```

- **Garantia de compatibilidade**: `Field` NUNCA gera o `id` do controle nem o `htmlFor` do
  `<label>` — quem chama continua responsável por isso, exatamente como hoje (`LoginForm`,
  `ContentForm`, extra-fields). Isso preserva 100% das consultas `getByLabelText(...)` da suíte de
  testes existente.

## `Card` — `src/components/admin/ui/Card.tsx` (novo)

Container visual (borda, raio, sombra, padding) usando `--color-surface`/`--color-border`/
`--radius-md`/`--shadow-sm`. Sem lógica; aceita `children` e `className` opcional.

## `Table` — `src/components/admin/ui/Table.tsx` (novo)

Wrapper puramente visual em torno da tabela nativa — usado por `ContentTable`.

```ts
type TableProps = {
  children: ReactNode; // <thead>/<tbody> nativos, passados como estão hoje
  className?: string;
};
```

- **Garantia de compatibilidade**: renderiza `<div className={styles.wrapper}><table className=
  {styles.table}>{children}</table></div>` — a wrapper `div` existe apenas para o
  `overflow-x: auto` de `research.md` Decision 5; `table`/`thead`/`tbody`/`tr`/`th`/`td` continuam
  elementos nativos reais, preservando os roles ARIA implícitos (`table`, `row`, `columnheader`,
  `cell`) usados por `getByRole(...)` nos testes existentes.

## `Banner` — `src/components/admin/ui/Banner.tsx` (novo)

Substitui o `<p>`/texto solto usado hoje por `ErrorToast`, `ConflictBanner` e o estado vazio de
`ContentTable`/listagens de Leads.

```ts
type BannerVariant = "error" | "warning" | "empty" | "info";

type BannerProps = {
  variant: BannerVariant;
  children: ReactNode;
  role?: "alert" | "status"; // quem chama decide, preservando o role="alert" já usado hoje por
                              // ErrorToast/mensagens de erro de formulário
};
```

- **Garantia de compatibilidade**: `Banner` não define `role` por padrão — cada chamador continua
  passando explicitamente o mesmo `role` que já usa hoje (ex.: `ErrorToast` continua com
  `role="alert"`), preservando as consultas `getByText(...)`/`getByRole("alert", ...)` existentes
  e evitando a colisão de `role="alert"` duplicado já documentada em `006-admin-panel-integration`
  (o anunciador de rotas do Next também usa `role="alert"`).
