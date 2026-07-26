# UI Contract: Content Repository

## Purpose

Separar a página de fontes de conteúdo para que dados estáticos curados possam migrar para
API ou CMS futuro sem alterar contratos dos componentes.

## Interface

```ts
type PousadaContent = {
  rooms: Room[];
  eventSpaces: EventSpace[];
  testimonials: Testimonial[];
  contact: {
    whatsappNumber: string;
    phone?: string;
    email?: string;
    address: string;
  };
  location: {
    address: string;
    mapEmbedUrl: string;
    fallbackMapUrl: string;
  };
};

interface ContentRepository {
  getContent(): Promise<PousadaContent>;
}
```

## Behavior

- A implementação inicial lê conteúdo local tipado e retorna o mesmo formato assíncrono da
  futura fonte remota.
- Componentes consumidores representam carregamento, erro e vazio de forma explícita.
- Relatos sem aprovação, imagens sem texto alternativo ou conteúdo comercial incompleto
  não são retornados como conteúdo publicável.
- A URL de incorporação do mapa só é usada após a ação explícita "Carregar mapa". Antes
  disso, a UI exibe o endereço textual, o aviso de privacidade e o link alternativo.
