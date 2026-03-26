"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

export type Testimonial = {
  text: string;
  image: string | null;
  name: string;
  role: string;
};

// Utility function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  // Shuffle testimonials on mount
  const shuffledTestimonials = useMemo(
    () => shuffleArray(props.testimonials),
    [],
  );

  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {shuffledTestimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="relative brutal-border brutal-shadow p-8 md:p-10 bg-background max-w-xs w-full group hover:shadow-none transition-all duration-200 hover:-translate-y-1 hover:translate-x-1"
                  key={i}
                >
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 text-primary/20 text-4xl font-bold">
                    "
                  </div>

                  {/* Text Content */}
                  <p className="font-body text-sm md:text-base text-foreground mb-6 italic relative z-10">
                    {text}
                  </p>

                  {/* Divider */}
                  <div className="w-12 h-1 bg-primary mb-6" />

                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    {image ? (
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">
                        {name}
                      </div>
                      <div className="leading-5 opacity-60 tracking-tight">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
