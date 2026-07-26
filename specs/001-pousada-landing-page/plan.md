# Implementation Plan: Landing Page da Pousada

**Branch**: `001-pousada-landing-page` | **Date**: 2026-07-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-pousada-landing-page/spec.md`

## Summary

Criar uma landing page institucional, mobile-first e indexável para apresentar quartos,
espaço de eventos, casamentos e relatos aprovados. Casamentos terão o CTA prioritário.
O frontend usará conteúdo tipado localmente e uma camada de repositório substituível por
API futura. O contato combinará links diretos para WhatsApp e um formulário curto de nome,
telefone, tipo de evento/serviço e mensagem, validado no navegador e convertido em uma
mensagem de WhatsApp pré-preenchida; não haverá envio, persistência ou backend nesta feature.

## Technical Context

**Language/Version**: TypeScript 5.x; Node.js 22 LTS

**Primary Dependencies**: Next.js (App Router), React, `next/image`, `next/font`, Vitest,
React Testing Library, Playwright and axe-core integration for automated accessibility checks

**Storage**: Dados estáticos tipados em arquivos locais; nenhuma persistência nesta feature

**Testing**: Vitest + React Testing Library for components and interaction logic; Playwright
for primary conversion, responsive and keyboard journeys; automated accessibility checks

**Target Platform**: Navegadores modernos em dispositivos móveis e desktop; hospedagem
compatível com renderização estática do Next.js

**Project Type**: Aplicação web frontend única

**Performance Goals**: LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1 no caminho principal, medidos
em perfil móvel representativo; primeira ação de contato disponível em até 3 s

**Constraints**: WCAG 2.2 AA; conteúdo indexável; imagens com dimensões reservadas e origem
aprovada; mapa interativo externo carregado somente após consentimento explícito, com
alternativa acessível;
sem contas, pagamentos, reservas transacionais, analytics ou backend nesta feature

**Scale/Scope**: Uma landing page com seções para proposta, quartos, casamentos, eventos,
relatos, localização e contato; conteúdo inicial estático e curado pelo negócio

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

- [x] React com TypeScript estrito terá páginas, seções, UI reutilizável, hooks, tipos e
      repositórios de conteúdo separados.
- [x] Estado permanecerá local; não há necessidade de estado global. O formulário mantém
      estado no componente e não persiste dados.
- [x] Conversão por casamento, comportamento responsivo, WCAG 2.2 AA, metadados e estratégia
      de imagens constam da especificação e dos contratos de interface.
- [x] Orçamento de performance e metas de Core Web Vitals são mensuráveis e fazem parte da
      validação antes da entrega.
- [x] Contratos tipados e estados de conteúdo preservam futura troca para API sem criar
      backend, autenticação ou regras de negócio agora.
- [x] Gates de acessibilidade, SEO/performance e QA frontend são tarefas obrigatórias do
      plano de implementação.

## Project Structure

### Documentation (this feature)

```text
specs/001-pousada-landing-page/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── contact-intent.md
│   └── content-repository.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── sitemap.ts
├── components/
│   ├── ui/
│   ├── sections/
│   └── contact/
├── data/
│   └── pousada-content.ts
├── domain/
│   ├── content.ts
│   └── contact-intent.ts
├── hooks/
├── services/
│   └── content-repository.ts
└── lib/
    └── whatsapp.ts

tests/
├── unit/
├── integration/
└── e2e/

public/
└── images/
    └── pousada/
```

**Structure Decision**: Um único frontend Next.js. `app/` compõe a rota pública; `sections/`
orquestra conteúdo de domínio e `ui/` contém elementos reutilizáveis. Dados de negócio
ficam tipados em `data/` e são acessados por `services/`, criando fronteira para API futura.

## Complexity Tracking

| Decision | Why Needed | Simpler Alternative Rejected Because |
|----------|------------|-------------------------------------|
| Repositório de conteúdo local | Isola dados de UI e prepara futura API | Importar dados diretamente em componentes acoplaria conteúdo e apresentação |
| Formulário que abre WhatsApp | Oferece formulário curto sem backend ou armazenamento | Envio remoto exigiria serviço externo, credenciais e política de dados fora do escopo |
