# UI Contract: Media Gallery Lightbox

## Purpose

Definir o comportamento observável da visualização em foco (lightbox/modal) para as fotos de um
quarto, casamento ou espaço de evento, de forma que Quartos, Casamentos e Eventos apresentem o
mesmo comportamento (User Story 2 da spec) sem acoplar essa camada de interação a nenhuma seção
específica.

## Inputs

```ts
type MediaGalleryTriggerProps = {
  images: Media[]; // do item em foco (Room ou EventSpace)
  itemLabel: string; // nome do quarto/espaço, usado como parte do nome acessível do modal
  emptyLabel: string; // mantém o fallback "foto em breve" quando images.length === 0
};
```

Nenhuma prop nova é exigida das seções consumidoras além do que `MediaGallery` já recebe hoje
(`images`, `emptyLabel`, `ariaLabel`); `itemLabel` pode ser derivado do `ariaLabel` já existente.

## Behavior

1. Quando `images.length === 0`, nenhum controle interativo é renderizado; o fallback atual
   ("foto em breve") permanece como está (FR-007).
2. Quando `images.length >= 1`, cada foto exibida na página é um controle ativável (clique ou
   teclado) que abre a visualização em foco começando naquela foto (FR-001).
3. A visualização em foco:
   - Mostra apenas as fotos do item ativado (FR-002).
   - Mostra a posição atual e o total (ex.: "2 de 4") quando houver mais de uma foto (FR-004).
   - Permite avançar/voltar com navegação circular quando houver mais de uma foto (FR-003).
   - Preserva o `alt` de cada foto (FR-006).
   - Pode ser fechada por controle explícito, clique fora ou Esc (FR-005), sempre devolvendo o
     foco ao controle que a abriu (FR-009).
   - É identificada para tecnologia assistiva como uma janela modal, com foco contido enquanto
     aberta (FR-008).
4. Uma foto que falhar ao carregar dentro da visualização em foco usa a mesma alternativa
   compreensível já usada na página, sem quebrar a navegação entre as demais fotos (FR-011).

## Guarantees

- A visualização em foco não introduz nenhuma chamada de rede nova além do carregamento das
  imagens já referenciadas pelo item (nenhuma integração externa).
- A visualização em foco não altera os canais de contato (WhatsApp/formulário) nem sua posição na
  página.
- Quartos, Casamentos e Eventos compartilham exatamente o mesmo componente e comportamento; uma
  correção ou melhoria futura nessa camada se propaga automaticamente para as três seções.
