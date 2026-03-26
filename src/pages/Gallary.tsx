import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import DomeGallery from "@/components/ui/dome-gallery";
import AnimatedText from "@/components/AnimatedText";
import {
  badgePop,
  fadeUp,
  lineReveal,
  staggerContainer,
} from "@/lib/animations";
import {
  fallbackGalleryItems,
  fetchPublishedGalleryItems,
} from "@/lib/content/gallery";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import {
  fetchTestimonials,
  fallbackTestimonials,
} from "@/lib/content/testimonials";

const Gallery = () => {
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["gallery-items"],
    queryFn: fetchPublishedGalleryItems,
    placeholderData: {
      items: fallbackGalleryItems,
      source: "fallback" as const,
    },
  });

  const { data: testimonialsData, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    placeholderData: {
      items: fallbackTestimonials,
      source: "fallback" as const,
    },
  });

  const galleryItems = data?.items ?? fallbackGalleryItems;

  // Distribute testimonials evenly across 3 columns
  const testimonials = testimonialsData?.items ?? [];
  const itemsPerColumn = Math.ceil(testimonials.length / 3);
  const col1 = testimonials.slice(0, itemsPerColumn);
  const col2 = testimonials.slice(itemsPerColumn, itemsPerColumn * 2);
  const col3 = testimonials.slice(itemsPerColumn * 2);
  const photos = galleryItems.map((item) => ({
    src: item.imageUrl,
    alt: item.altText,
  }));

  return (
    <div className="min-h-screen">
      <section className="py-20 md:py-28 px-4 border-b-[3px] border-foreground overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={badgePop}
              custom={0}
              className="inline-block brutal-border bg-primary px-4 py-2 mb-6"
            >
              <span className="font-heading font-extrabold text-primary-foreground text-sm uppercase tracking-widest">
                Gallery
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <AnimatedText
                text="Event Gallery"
                el="h1"
                className="text-5xl md:text-7xl font-heading font-extrabold leading-[0.9] mb-4"
                delay={0.1}
              />
            </div>

            <motion.div
              className="line-accent w-20 mb-6 mt-2"
              variants={lineReveal}
              custom={0}
            />

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-xl font-body text-muted-foreground max-w-2xl"
            >
              Moments from workshops, hackathons, talks, and competitions
              captured in our dome-style showcase.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-16 px-4">
        <div className="container mx-auto">
          {!isLoading && !isPlaceholderData && data?.source === "fallback" && (
            <div className="brutal-border bg-secondary text-secondary-foreground px-4 py-3 mb-8 font-heading font-bold text-xs uppercase tracking-wide inline-flex">
              Demo data active. Connect Supabase to manage gallery items
              dynamically.
            </div>
          )}

          {isLoading && photos.length === 0 && (
            <div className="mb-8 font-heading font-bold uppercase tracking-wide text-sm text-muted-foreground">
              Loading gallery...
            </div>
          )}

          {!isLoading && photos.length === 0 && (
            <div className="brutal-border bg-background px-4 py-3 mb-8 font-body text-muted-foreground">
              No gallery images found yet.
            </div>
          )}

          <div className="brutal-card p-3 md:p-4 relative overflow-hidden h-[68vh] min-h-[520px]">
            <DomeGallery
              images={photos}
              fit={0.8}
              minRadius={750}
              maxVerticalRotationDeg={8}
              segments={34}
              dragDampening={2.8}
              grayscale
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-4 border-t-[3px] border-foreground relative">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={badgePop}
              custom={0}
              className="inline-block brutal-border bg-primary px-4 py-2 mb-6"
            >
              <span className="font-heading font-extrabold text-primary-foreground text-sm uppercase tracking-widest">
                Community Voices
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <AnimatedText
                text="Member Testimonials"
                el="h2"
                className="text-5xl md:text-7xl font-heading font-extrabold leading-[0.9] mb-4"
                delay={0.1}
              />
            </div>

            <motion.div
              className="line-accent w-20 mb-6 mt-2"
              variants={lineReveal}
              custom={0}
            />

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-xl font-body text-muted-foreground max-w-2xl"
            >
              Hear from our community members about their experiences, growth,
              and impact within IEEE Computer Society.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-4 relative">
        <div className="container mx-auto">
          {testimonialsLoading && !testimonialsData?.items.length && (
            <div className="brutal-border bg-secondary text-secondary-foreground px-6 py-4 text-center font-heading font-bold text-sm uppercase tracking-wide">
              Loading testimonials...
            </div>
          )}

          {!testimonialsLoading && testimonialsData?.items.length === 0 && (
            <div className="brutal-border bg-secondary text-secondary-foreground px-6 py-4 text-center font-heading font-bold text-sm uppercase tracking-wide">
              No testimonials yet. Check back soon!
            </div>
          )}

          {testimonialsData && testimonialsData.items.length > 0 && (
            <div className="flex justify-center gap-6 w-full [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
              <TestimonialsColumn testimonials={col1} duration={15} />
              {col2.length > 0 && (
                <TestimonialsColumn
                  testimonials={col2}
                  className="hidden md:flex"
                  duration={19}
                />
              )}
              {col3.length > 0 && (
                <TestimonialsColumn
                  testimonials={col3}
                  className="hidden lg:flex"
                  duration={17}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
