"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { CarouselControls } from "@/components/ui/CarouselControls";
import { interestLabel } from "@/lib/whatsapp";
import styles from "./TestimonialsSection.module.css";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const total = testimonials.length;

  // Tracks which card is centered in view as the visitor swipes, so the
  // position indicator ("N de M") stays in sync with free-form scrolling,
  // not just with the prev/next buttons.
  useEffect(() => {
    if (total <= 1) {
      return;
    }

    const cards = cardRefs.current.filter((card): card is HTMLLIElement => card !== null);
    if (cards.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) {
          return;
        }
        const index = cardRefs.current.indexOf(mostVisible.target as HTMLLIElement);
        if (index !== -1) {
          setActiveIndex(index);
        }
      },
      { root: cards[0]!.parentElement, threshold: [0.6] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [total]);

  function scrollToIndex(index: number) {
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function goPrevious() {
    const nextIndex = Math.max(activeIndex - 1, 0);
    setActiveIndex(nextIndex);
    scrollToIndex(nextIndex);
  }

  function goNext() {
    const nextIndex = Math.min(activeIndex + 1, total - 1);
    setActiveIndex(nextIndex);
    scrollToIndex(nextIndex);
  }

  return (
    <section id="relatos" aria-labelledby="testimonials-heading" className={styles.section}>
      <Container>
        <Heading as="h2" size="lg" id="testimonials-heading">
          Relatos
        </Heading>

        {total === 0 ? (
          <p className={styles.empty}>
            Ainda não há relatos aprovados para exibir. Em breve, compartilharemos experiências de
            hóspedes e convidados.
          </p>
        ) : (
          <CarouselControls
            activeIndex={activeIndex}
            total={total}
            onPrevious={goPrevious}
            onNext={goNext}
            previousLabel="Relato anterior"
            nextLabel="Próximo relato"
            rowClassName={styles.carouselRow}
            positionClassName={styles.position}
          >
            <ul className={styles.grid} tabIndex={total > 1 ? 0 : -1} aria-label="Lista de relatos">
              {testimonials.map((testimonial, index) => (
                <li
                  key={testimonial.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={styles.card}
                >
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
          </CarouselControls>
        )}
      </Container>
    </section>
  );
}
