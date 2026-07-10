import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import PageTransition from "@/components/layout/PageTransition";
import Index from "./pages/Index";
import PremiumCursor from "@/components/ui/premium-cursor";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { initAnalytics, trackPageView } from "@/lib/analytics";

// Lazy load non-critical routes
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const GetProposal = lazy(() => import("./pages/GetProposal"));
const ServiceCategory = lazy(() => import("./pages/ServiceCategory"));
const SubServicePage = lazy(() => import("./pages/SubServicePage"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const IndustryPage = lazy(() => import("./pages/IndustryPage"));
const LocationPage = lazy(() => import("./pages/LocationPage"));
const LocationPageAr = lazy(() => import("./pages/LocationPageAr"));
const KeywordLandingPage = lazy(() => import("./pages/KeywordLandingPage"));
const MatrixPage = lazy(() => import("./pages/MatrixPage"));
const HomeAr = lazy(() => import("./pages/HomeAr"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SeoAuditTool = lazy(() => import("./pages/SeoAuditTool"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const Manifesto = lazy(() => import("./pages/Manifesto"));
const Trust = lazy(() => import("./pages/Trust"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Resources = lazy(() => import("./pages/Resources"));
const PricingCalculator = lazy(() => import("./pages/PricingCalculator"));
const ToolsIndex = lazy(() => import("./pages/tools/ToolsIndex"));
const GrowthScoreTool = lazy(() => import("./pages/tools/GrowthScoreTool"));
const AdCopyTool = lazy(() => import("./pages/tools/AdCopyTool"));
const MetaTagsTool = lazy(() => import("./pages/tools/MetaTagsTool"));
const BlogOutlineTool = lazy(() => import("./pages/tools/BlogOutlineTool"));
const CompetitorXrayTool = lazy(() => import("./pages/tools/CompetitorXrayTool"));
const RoiPredictorTool = lazy(() => import("./pages/tools/RoiPredictorTool"));

// Auth pages
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const InviteAccept = lazy(() => import("./pages/auth/InviteAccept"));

// Dashboard pages
const AdminLayout = lazy(() => import("./pages/dashboard/admin/AdminLayout"));
const DashboardHome = lazy(() => import("./pages/dashboard/admin/DashboardHome"));
const Leads = lazy(() => import("./pages/dashboard/admin/Leads"));
const Billing = lazy(() => import("./pages/dashboard/admin/Billing"));
const BlogManager = lazy(() => import("./pages/dashboard/admin/BlogManager"));
const SettingsPage = lazy(() => import("./pages/dashboard/admin/SettingsPage"));
const AdminAudits = lazy(() => import("./pages/dashboard/admin/Audits"));
const AuditDetail = lazy(() => import("./pages/dashboard/admin/AuditDetail"));
const WhatsAppHub = lazy(() => import("./pages/dashboard/admin/WhatsAppHub"));
const WhatsAppSetup = lazy(() => import("./pages/dashboard/admin/WhatsAppSetup"));
const CrmPipeline = lazy(() => import("./pages/dashboard/admin/CrmPipeline"));
const Quotations = lazy(() => import("./pages/dashboard/admin/Quotations"));
const Invoices = lazy(() => import("./pages/dashboard/admin/Invoices"));
const Projects = lazy(() => import("./pages/dashboard/admin/Projects"));
const TimeTracking = lazy(() => import("./pages/dashboard/admin/TimeTracking"));
const Bookings = lazy(() => import("./pages/dashboard/admin/Bookings"));
const ToolRuns = lazy(() => import("./pages/dashboard/admin/ToolRuns"));
const FunnelAnalytics = lazy(() => import("./pages/dashboard/admin/FunnelAnalytics"));
const SeoRankTracker = lazy(() => import("./pages/dashboard/admin/SeoRankTracker"));
const VoiceStudio = lazy(() => import("./pages/dashboard/admin/VoiceStudio"));
const EmailLog = lazy(() => import("./pages/dashboard/admin/EmailLog"));
const NewsletterComposer = lazy(() => import("./pages/dashboard/admin/NewsletterComposer"));
const DataRequest = lazy(() => import("./pages/DataRequest"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const CookiePreferenceModal = lazy(() => import("./components/compliance/CookiePreferenceModal"));


const ClientLayout = lazy(() => import("./pages/dashboard/client/ClientLayout"));
const ClientHome = lazy(() => import("./pages/dashboard/client/ClientHome"));
const ClientInvoices = lazy(() => import("./pages/dashboard/client/ClientInvoices"));
const ClientSupport = lazy(() => import("./pages/dashboard/client/ClientSupport"));
const ClientFiles = lazy(() => import("./pages/dashboard/client/ClientFiles"));
const ClientKnowledge = lazy(() => import("./pages/dashboard/client/ClientKnowledge"));

const BookACall = lazy(() => import("./pages/BookACall"));
const ProposalBuilder = lazy(() => import("./pages/ProposalBuilder"));
const CommandPalette = lazy(() => import("./components/ui/CommandPalette"));
const PentaAiChat = lazy(() => import("./components/ai/PentaAiChat"));

const queryClient = new QueryClient();

const ADMIN_ROLES = ["super_admin", "account_manager", "finance", "content_writer", "seo_specialist"];
const CLIENT_ROLES = ["client"];

import BrandedLoader from "@/components/ui/branded-loader";

function PageLoader() {
  return <BrandedLoader />;
}

function AnimatedRoutes() {
  const location = useLocation();

  // SPA route-change page_view event — keeps GA4 in sync per locale.
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            {/* Public routes */}
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
            <Route path="/ar" element={<HomeAr />} />
            <Route path="/ar/locations/:location" element={<LocationPageAr />} />
            <Route path="/lp/:keyword" element={<KeywordLandingPage />} />
            <Route path="/seo/:city" element={<MatrixPage />} />
            <Route path="/seo/:city/:intent" element={<MatrixPage />} />
            <Route path="/ppc/:city" element={<MatrixPage />} />
            <Route path="/ppc/:city/:intent" element={<MatrixPage />} />
            <Route path="/social-media/:city" element={<MatrixPage />} />
            <Route path="/social-media/:city/:intent" element={<MatrixPage />} />
            <Route path="/web-development/:city" element={<MatrixPage />} />
            <Route path="/web-development/:city/:intent" element={<MatrixPage />} />
            <Route path="/ai-solutions/:city" element={<MatrixPage />} />
            <Route path="/ai-solutions/:city/:intent" element={<MatrixPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/trust" element={<Trust />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/pricing-calculator" element={<PricingCalculator />} />
            <Route path="/tools" element={<ToolsIndex />} />
            <Route path="/tools/seo-audit" element={<SeoAuditTool />} />
            <Route path="/tools/growth-score" element={<GrowthScoreTool />} />
            <Route path="/tools/ad-copy" element={<AdCopyTool />} />
            <Route path="/tools/meta-tags" element={<MetaTagsTool />} />
            <Route path="/tools/blog-outline" element={<BlogOutlineTool />} />
            <Route path="/tools/competitor-xray" element={<CompetitorXrayTool />} />
            <Route path="/tools/roi-predictor" element={<RoiPredictorTool />} />
            <Route path="/book-a-call" element={<BookACall />} />
            <Route path="/proposal-builder" element={<ProposalBuilder />} />
            <Route path="/data-request" element={<DataRequest />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />


            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/invite-accept" element={<InviteAccept />} />

            {/* Admin dashboard */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="leads" element={<Leads />} />
              <Route path="billing" element={<Billing />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="audits" element={<AdminAudits />} />
              <Route path="audits/:id" element={<AuditDetail />} />
              <Route path="whatsapp" element={<WhatsAppHub />} />
              <Route path="whatsapp/setup" element={<WhatsAppSetup />} />
              <Route path="crm" element={<CrmPipeline />} />
              <Route path="quotations" element={<Quotations />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="projects" element={<Projects />} />
              <Route path="time" element={<TimeTracking />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="tool-runs" element={<ToolRuns />} />
              <Route path="funnel" element={<FunnelAnalytics />} />
              <Route path="seo-ranks" element={<SeoRankTracker />} />
            </Route>

            {/* Client dashboard */}
            <Route
              path="/dashboard/client"
              element={
                <ProtectedRoute allowedRoles={CLIENT_ROLES}>
                  <ClientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ClientHome />} />
              <Route path="invoices" element={<ClientInvoices />} />
              <Route path="support" element={<ClientSupport />} />
              <Route path="files" element={<ClientFiles />} />
              <Route path="knowledge" element={<ClientKnowledge />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

function AppShell() {
  useSmoothScroll();
  // Auto-attach GA4-compatible click / submit / scroll trackers once.
  useEffect(() => {
    initAnalytics();
  }, []);
  return (
    <>
      <PremiumCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        <Suspense fallback={null}>
          <CookiePreferenceModal />
        </Suspense>
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
        <Suspense fallback={null}>
          <PentaAiChat />
        </Suspense>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppShell />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
