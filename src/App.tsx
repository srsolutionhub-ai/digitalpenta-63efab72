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
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import IndustryPage from "./pages/IndustryPage";
import LocationPage from "./pages/LocationPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
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
          <Route path="/services/:category/:subService" element={<SubServicePage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/industries/:industry" element={<IndustryPage />} />
          <Route path="/locations/:location" element={<LocationPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
