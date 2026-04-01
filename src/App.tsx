import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import GetProposal from "./pages/GetProposal";
import ServiceCategory from "./pages/ServiceCategory";
import SubServicePage from "./pages/SubServicePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/get-proposal" element={<GetProposal />} />
          <Route path="/services/:category" element={<ServiceCategory />} />
          <Route path="/services/:category/:subService" element={<ServiceCategory />} />
          {/* Placeholder routes */}
          <Route path="/portfolio" element={<NotFound />} />
          <Route path="/blog" element={<NotFound />} />
          <Route path="/industries/:industry" element={<NotFound />} />
          <Route path="/locations/:location" element={<NotFound />} />
          <Route path="/privacy" element={<NotFound />} />
          <Route path="/terms" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
