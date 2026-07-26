import type { Testimonial } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { interestLabel } from "@/lib/whatsapp";
import styles from "./TestimonialsSection.module.css";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section id="relatos" aria-labelledby="testimonials-heading" className={styles.section}>
      <Container>
        <Heading as="h2" size="lg" id="testimonials-heading">
          Relatos
        </Heading>

        {testimonials.length === 0 ? (
          <p className={styles.empty}>
            Ainda não há relatos aprovados para exibir. Em breve, compartilharemos experiências de
            hóspedes e convidados.
          </p>
        ) : (
          <ul className={styles.grid}>
            {testimonials.map((testimonial) => (
              <li key={testimonial.id} className={styles.card}>
                <blockquote className={styles.quote}>&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <p className={styles.attribution}>
                  {testimonial.attribution} ·{" "}
                  <span className={styles.experience}>
                    {interestLabel(testimonial.experienceType)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
