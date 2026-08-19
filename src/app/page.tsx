import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { PageStateMessage } from "@/components/ui/PageStateMessage";
import { HeroSection } from "@/components/sections/HeroSection";
import { RoomsSection } from "@/components/sections/RoomsSection";
import { WeddingSection } from "@/components/sections/WeddingSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { loadContentState } from "@/services/content-repository";
import type { PousadaContent } from "@/domain/content";

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
        <ContactSection whatsappNumber={content.contact.whatsappNumber} />
      </main>
      <SiteFooter contact={content.contact} />
    </>
  );
}

export default async function Home() {
  const state = await loadContentState();

  switch (state.status) {
    case "error":
      return <PageStateMessage kind="error" message={state.message} />;
    case "empty":
      return <PageStateMessage kind="empty" />;
    case "loading":
      return <PageStateMessage kind="loading" />;
    case "ready":
      return <ReadyPage content={state.content} />;
  }
}
