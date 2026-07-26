# UI Contract: Contact Intent

## Purpose

Definir o comportamento reutilizável de CTAs e formulário de contato sem criar integração
de backend nesta feature.

## Inputs

```ts
type ContactInterest = 'stay' | 'event' | 'wedding';

type ContactIntent = {
  name: string;
  phone: string;
  interest: ContactInterest;
  message?: string;
};
```

## Behavior

1. Um CTA contextual abre o WhatsApp com o interesse correspondente pré-selecionado.
2. O formulário exige nome, telefone e tipo de evento/serviço; mensagem é opcional.
3. Ao enviar campos válidos, a UI gera uma mensagem legível com os valores e abre o
   WhatsApp em nova navegação controlada pelo usuário.
4. Ao encontrar campo inválido, a UI mantém os dados, informa o erro junto ao campo e
   move o foco para o primeiro erro.
5. Se o WhatsApp não puder ser aberto, a UI mantém telefone/e-mail alternativos aprovados
   visíveis e explica como continuar o contato.

## Guarantees

- A UI não envia, persiste, registra analytics ou compartilha os campos com serviço remoto.
- O número de WhatsApp e contatos alternativos são fornecidos por conteúdo aprovado.
- A futura integração remota substitui somente o adaptador de entrega, preservando
  `ContactIntent` e os estados da interface.
