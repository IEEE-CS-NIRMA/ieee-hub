import React from "react";
import { cn } from "@/lib/utils";
import ieeeLogo from "@/assets/ieee-logo.svg";

function LoaderThree({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-background",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Spinning border ring */}
        <div
          className="absolute h-32 w-32 animate-spin rounded-full border-[3px] border-transparent border-t-primary border-r-primary/40"
          style={{ animationDuration: "1.2s" }}
        />

        {/* IEEE Logo */}
        <img src={ieeeLogo} alt="IEEE Logo" className="relative h-24 w-24" />
      </div>
    </div>
  );
}

export { LoaderThree };
