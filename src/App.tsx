import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import LogoLoader from "@/components/LogoLoader";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import BoardMembers from "./pages/BoardMembers";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const TRACE_DURATION_MS = 1900;
const REVEAL_DURATION_MS = 2000;
const REVEAL_UNMOUNT_BUFFER_MS = 0;

const App = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [loaderPhase, setLoaderPhase] = useState<"tracing" | "revealing">(
    "tracing",
  );

  useEffect(() => {
    const revealTimer = setTimeout(
      () => setLoaderPhase("revealing"),
      TRACE_DURATION_MS,
    );
    const hideTimer = setTimeout(
      () => setShowLoader(false),
      TRACE_DURATION_MS + REVEAL_DURATION_MS + REVEAL_UNMOUNT_BUFFER_MS,
    );

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CustomCursor />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/Gallery" element={<Gallery />} />
                  <Route path="/board" element={<BoardMembers />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
          {showLoader && <LogoLoader phase={loaderPhase} />}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
