import { motion } from "framer-motion";
import DomeGallery from "@/components/ui/dome-gallery";
import AnimatedText from "@/components/AnimatedText";
import {
  badgePop,
  fadeUp,
  lineReveal,
  staggerContainer,
} from "@/lib/animations";

const dummyPhotos = [
  {
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80",
    alt: "Students coding in a workshop",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    alt: "Team collaboration during event",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
    alt: "Speaker session in auditorium",
  },
  {
    src: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=900&q=80",
    alt: "Night hackathon desk setup",
  },
  {
    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
    alt: "Winners with medals",
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    alt: "Group photo at tech event",
  },
];

const Gallery = () => {
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
          <div className="brutal-card p-3 md:p-4 relative overflow-hidden h-[68vh] min-h-[520px]">
            <DomeGallery
              images={dummyPhotos}
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
    </div>
  );
};

export default Gallery;
