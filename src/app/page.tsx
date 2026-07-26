import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { HeroSection } from "@/components/sections/HeroSection";
import { RoomsSection } from "@/components/sections/RoomsSection";
import { WeddingSection } from "@/components/sections/WeddingSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { ContactForm } from "@/components/contact/ContactForm";
import { loadContentState } from "@/services/content-repository";
import type { PousadaContent } from "@/domain/content";
import styles from "./page.module.css";

function ErrorState({ message }: { message: string }) {
  return (
    <main className={styles.stateMessage}>
      <p role="alert">
        Não foi possível carregar o conteúdo da página agora ({message}). Tente novamente mais
        tarde.
      </p>
    </main>
  );
}

function EmptyState() {
  return (
    <main className={styles.stateMessage}>
      <p>Conteúdo em atualização. Volte em breve para conhecer a pousada.</p>
    </main>
  );
}

function LoadingState() {
  return (
    <main className={styles.stateMessage}>
      <p>Carregando conteúdo…</p>
    </main>
  );
}

function ReadyPage({ content }: { content: PousadaContent }) {
  const wedding = content.eventSpaces.find((space) => space.contactContext === "wedding");
  const events = content.eventSpaces.filter((space) => space.contactContext === "event");

  return (
    <>
      <SiteHeader contact={content.contact} />
      <main id="conteudo-principal">
        <HeroSection contact={content.contact} />
        <RoomsSection rooms={content.rooms} />
        <WeddingSection wedding={wedding} contact={content.contact} />
        <EventsSection events={events} contact={content.contact} />
        <TestimonialsSection testimonials={content.testimonials} />
        <LocationSection location={content.location} />
        <section id="contato" aria-labelledby="contact-heading" className={styles.contactSection}>
          <Container>
            <Heading as="h2" size="lg" id="contact-heading">
              Fale conosco
            </Heading>
            <ContactForm whatsappNumber={content.contact.whatsappNumber} defaultInterest="stay" />
          </Container>
        </section>
      </main>
      <SiteFooter contact={content.contact} />
    </>
  );
}

export default async function Home() {
  const state = await loadContentState();

  switch (state.status) {
    case "error":
      return <ErrorState message={state.message} />;
    case "empty":
      return <EmptyState />;
    case "loading":
      return <LoadingState />;
    case "ready":
      return <ReadyPage content={state.content} />;
  }
}
