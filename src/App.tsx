import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, useEffect } from "react";
import { lazyRetry } from "@/lib/lazyRetry";
import { AnimatePresence } from "motion/react";
import PageTransition from "@/components/layout/PageTransition";
import Index from "./pages/Index";
import useSmoothScroll from "@/hooks/useSmoothScroll";
// Lazy: pulls useAuth → the Supabase client. Keeping it out of the eager
// graph means marketing pages never download auth/realtime code.
const ProtectedRoute = lazyRetry(() => import("@/components/auth/ProtectedRoute"));
// Analytics + first-party tracking are dynamically imported (see AppShell) so
// they stay out of the main bundle and off the critical rendering path.

// Lazy load non-critical routes
const About = lazyRetry(() => import("./pages/About"));
const Contact = lazyRetry(() => import("./pages/Contact"));
const GetProposal = lazyRetry(() => import("./pages/GetProposal"));
const ServiceCategory = lazyRetry(() => import("./pages/ServiceCategory"));
const SubServicePage = lazyRetry(() => import("./pages/SubServicePage"));
const Portfolio = lazyRetry(() => import("./pages/Portfolio"));
const Blog = lazyRetry(() => import("./pages/Blog"));
const BlogArticle = lazyRetry(() => import("./pages/BlogArticle"));
const IndustryPage = lazyRetry(() => import("./pages/IndustryPage"));
const LocationPage = lazyRetry(() => import("./pages/LocationPage"));
const LocationsHub = lazyRetry(() => import("./pages/LocationsHub"));
const LocationPageAr = lazyRetry(() => import("./pages/LocationPageAr"));

const KeywordLandingPage = lazyRetry(() => import("./pages/KeywordLandingPage"));
const MatrixPage = lazyRetry(() => import("./pages/MatrixPage"));
const HomeAr = lazyRetry(() => import("./pages/HomeAr"));
const Privacy = lazyRetry(() => import("./pages/Privacy"));
const Terms = lazyRetry(() => import("./pages/Terms"));
const NotFound = lazyRetry(() => import("./pages/NotFound"));
const SeoAuditTool = lazyRetry(() => import("./pages/SeoAuditTool"));
const SitemapPage = lazyRetry(() => import("./pages/SitemapPage"));
const Manifesto = lazyRetry(() => import("./pages/Manifesto"));
const Trust = lazyRetry(() => import("./pages/Trust"));
const Roadmap = lazyRetry(() => import("./pages/Roadmap"));
const Resources = lazyRetry(() => import("./pages/Resources"));
const PricingCalculator = lazyRetry(() => import("./pages/PricingCalculator"));
const ToolsIndex = lazyRetry(() => import("./pages/tools/ToolsIndex"));
const GrowthScoreTool = lazyRetry(() => import("./pages/tools/GrowthScoreTool"));
const AdCopyTool = lazyRetry(() => import("./pages/tools/AdCopyTool"));
const MetaTagsTool = lazyRetry(() => import("./pages/tools/MetaTagsTool"));
const BlogOutlineTool = lazyRetry(() => import("./pages/tools/BlogOutlineTool"));
const CompetitorXrayTool = lazyRetry(() => import("./pages/tools/CompetitorXrayTool"));
const RoiPredictorTool = lazyRetry(() => import("./pages/tools/RoiPredictorTool"));

// Auth pages
const Login = lazyRetry(() => import("./pages/auth/Login"));
const Signup = lazyRetry(() => import("./pages/auth/Signup"));
const ForgotPassword = lazyRetry(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazyRetry(() => import("./pages/auth/ResetPassword"));
const InviteAccept = lazyRetry(() => import("./pages/auth/InviteAccept"));

// Dashboard pages
const AdminLayout = lazyRetry(() => import("./pages/dashboard/admin/AdminLayout"));
const DashboardHome = lazyRetry(() => import("./pages/dashboard/admin/DashboardHome"));
const Leads = lazyRetry(() => import("./pages/dashboard/admin/Leads"));
const Contacts = lazyRetry(() => import("./pages/dashboard/admin/Contacts"));
const Companies = lazyRetry(() => import("./pages/dashboard/admin/Companies"));
const ContactDetail = lazyRetry(() => import("./pages/dashboard/admin/ContactDetail"));
const CrmTasks = lazyRetry(() => import("./pages/dashboard/admin/Tasks"));
const Integrations = lazyRetry(() => import("./pages/dashboard/admin/Integrations"));
const WhatsAppBot = lazyRetry(() => import("./pages/dashboard/admin/WhatsAppBot"));
const EmailSequences = lazyRetry(() => import("./pages/dashboard/admin/EmailSequences"));
const TeamRoles = lazyRetry(() => import("./pages/dashboard/admin/TeamRoles"));
const WhatsAppTemplates = lazyRetry(() => import("./pages/dashboard/admin/WhatsAppTemplates"));
const WhatsAppBroadcasts = lazyRetry(() => import("./pages/dashboard/admin/WhatsAppBroadcasts"));
const AudienceAnalytics = lazyRetry(() => import("./pages/dashboard/admin/AudienceAnalytics"));
const ClientDeliverables = lazyRetry(() => import("./pages/dashboard/admin/ClientDeliverables"));
const ClientProjects = lazyRetry(() => import("./pages/dashboard/client/ClientProjects"));
const ClientApprovals = lazyRetry(() => import("./pages/dashboard/client/ClientApprovals"));
const ClientReports = lazyRetry(() => import("./pages/dashboard/client/ClientReports"));
const Billing = lazyRetry(() => import("./pages/dashboard/admin/Billing"));
const BlogManager = lazyRetry(() => import("./pages/dashboard/admin/BlogManager"));
const SettingsPage = lazyRetry(() => import("./pages/dashboard/admin/SettingsPage"));
const AdminAudits = lazyRetry(() => import("./pages/dashboard/admin/Audits"));
const AuditDetail = lazyRetry(() => import("./pages/dashboard/admin/AuditDetail"));
const WhatsAppHub = lazyRetry(() => import("./pages/dashboard/admin/WhatsAppHub"));
const WhatsAppAnalytics = lazyRetry(() => import("./pages/dashboard/admin/WhatsAppAnalytics"));
const WhatsAppSetup = lazyRetry(() => import("./pages/dashboard/admin/WhatsAppSetup"));
const CrmPipeline = lazyRetry(() => import("./pages/dashboard/admin/CrmPipeline"));
const Quotations = lazyRetry(() => import("./pages/dashboard/admin/Quotations"));
const Invoices = lazyRetry(() => import("./pages/dashboard/admin/Invoices"));
const Projects = lazyRetry(() => import("./pages/dashboard/admin/Projects"));
const TimeTracking = lazyRetry(() => import("./pages/dashboard/admin/TimeTracking"));
const Bookings = lazyRetry(() => import("./pages/dashboard/admin/Bookings"));
const ToolRuns = lazyRetry(() => import("./pages/dashboard/admin/ToolRuns"));
const FunnelAnalytics = lazyRetry(() => import("./pages/dashboard/admin/FunnelAnalytics"));
const SeoRankTracker = lazyRetry(() => import("./pages/dashboard/admin/SeoRankTracker"));
const VoiceStudio = lazyRetry(() => import("./pages/dashboard/admin/VoiceStudio"));
const EmailLog = lazyRetry(() => import("./pages/dashboard/admin/EmailLog"));
const NewsletterComposer = lazyRetry(() => import("./pages/dashboard/admin/NewsletterComposer"));
const DataRequest = lazyRetry(() => import("./pages/DataRequest"));
const Unsubscribe = lazyRetry(() => import("./pages/Unsubscribe"));
const CookiePreferenceModal = lazyRetry(() => import("./components/compliance/CookiePreferenceModal"));


const ClientLayout = lazyRetry(() => import("./pages/dashboard/client/ClientLayout"));
const ClientHome = lazyRetry(() => import("./pages/dashboard/client/ClientHome"));
const ClientInvoices = lazyRetry(() => import("./pages/dashboard/client/ClientInvoices"));
const ClientSupport = lazyRetry(() => import("./pages/dashboard/client/ClientSupport"));
const ClientFiles = lazyRetry(() => import("./pages/dashboard/client/ClientFiles"));
const ClientKnowledge = lazyRetry(() => import("./pages/dashboard/client/ClientKnowledge"));
const ClientQuotations = lazyRetry(() => import("./pages/dashboard/client/ClientQuotations"));
const ClientProfile = lazyRetry(() => import("./pages/dashboard/client/ClientProfile"));

const BookACall = lazyRetry(() => import("./pages/BookACall"));
const ProposalBuilder = lazyRetry(() => import("./pages/ProposalBuilder"));
const CommandPalette = lazyRetry(() => import("./components/ui/CommandPalette"));
const PentaAiChat = lazyRetry(() => import("./components/ai/PentaAiChat"));

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
    import("@/lib/analytics").then((m) => m.trackPageView(location.pathname));
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
            <Route path="/locations" element={<LocationsHub />} />
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


            {/* Auth routes (canonical short paths) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/invite-accept" element={<InviteAccept />} />

            {/* Legacy /auth/* aliases kept for old emails/bookmarks */}
            <Route path="/auth/login" element={<Navigate to="/login" replace />} />
            <Route path="/auth/signup" element={<Navigate to="/signup" replace />} />
            <Route path="/auth/forgot-password" element={<Navigate to="/forgot-password" replace />} />
            <Route path="/auth/reset-password" element={<Navigate to={{ pathname: "/reset-password", search: window.location.search, hash: window.location.hash }} replace />} />

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
              <Route path="contacts" element={<Contacts />} />
              <Route path="companies" element={<Companies />} />
              <Route path="contacts/:email" element={<ContactDetail />} />
              <Route path="tasks" element={<CrmTasks />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="whatsapp/bot" element={<WhatsAppBot />} />
              <Route path="whatsapp/templates" element={<WhatsAppTemplates />} />
              <Route path="whatsapp/broadcasts" element={<WhatsAppBroadcasts />} />
              <Route path="sequences" element={<EmailSequences />} />
              <Route path="team" element={<TeamRoles />} />
              <Route path="audience" element={<AudienceAnalytics />} />
              <Route path="deliverables" element={<ClientDeliverables />} />
              <Route path="billing" element={<Billing />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="audits" element={<AdminAudits />} />
              <Route path="audits/:id" element={<AuditDetail />} />
              <Route path="whatsapp" element={<WhatsAppHub />} />
              <Route path="whatsapp/setup" element={<WhatsAppSetup />} />
              <Route path="whatsapp/analytics" element={<WhatsAppAnalytics />} />
              <Route path="crm" element={<CrmPipeline />} />
              <Route path="quotations" element={<Quotations />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="projects" element={<Projects />} />
              <Route path="time" element={<TimeTracking />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="tool-runs" element={<ToolRuns />} />
              <Route path="funnel" element={<FunnelAnalytics />} />
              <Route path="seo-ranks" element={<SeoRankTracker />} />
              <Route path="voice-studio" element={<VoiceStudio />} />
              <Route path="email-log" element={<EmailLog />} />
              <Route path="newsletter" element={<NewsletterComposer />} />
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
              <Route path="projects" element={<ClientProjects />} />
              <Route path="approvals" element={<ClientApprovals />} />
              <Route path="reports" element={<ClientReports />} />
              <Route path="support" element={<ClientSupport />} />
              <Route path="files" element={<ClientFiles />} />
              <Route path="knowledge" element={<ClientKnowledge />} />
              <Route path="quotations" element={<ClientQuotations />} />
              <Route path="profile" element={<ClientProfile />} />
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
  // Auto-attach GA4-compatible click / submit / scroll trackers once,
  // plus the consent-gated first-party audience pipeline. Both are loaded on
  // idle so they never compete with first paint.
  useEffect(() => {
    const w = window as any;
    const run = () => {
      import("@/lib/analytics").then((m) => m.initAnalytics());
      import("@/lib/visitorTracking").then((m) => m.initVisitorTracking());
    };
    const handle =
      typeof w.requestIdleCallback === "function"
        ? w.requestIdleCallback(run, { timeout: 3000 })
        : w.setTimeout(run, 1500);
    return () => {
      if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, []);
  return (
    <>
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
        <Suspense fallback={null}>
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
