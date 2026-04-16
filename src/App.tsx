import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { AnimatePresence } from "motion/react";
import PageTransition from "@/components/layout/PageTransition";
import Index from "./pages/Index";
import CustomCursor from "@/components/ui/custom-cursor";
import useSmoothScroll from "@/hooks/useSmoothScroll";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Auth pages
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

// Dashboard pages
const AdminLayout = lazy(() => import("./pages/dashboard/admin/AdminLayout"));
const DashboardHome = lazy(() => import("./pages/dashboard/admin/DashboardHome"));
const Leads = lazy(() => import("./pages/dashboard/admin/Leads"));
const Billing = lazy(() => import("./pages/dashboard/admin/Billing"));
const BlogManager = lazy(() => import("./pages/dashboard/admin/BlogManager"));
const SettingsPage = lazy(() => import("./pages/dashboard/admin/SettingsPage"));

const ClientLayout = lazy(() => import("./pages/dashboard/client/ClientLayout"));
const ClientHome = lazy(() => import("./pages/dashboard/client/ClientHome"));
const ClientInvoices = lazy(() => import("./pages/dashboard/client/ClientInvoices"));
const ClientSupport = lazy(() => import("./pages/dashboard/client/ClientSupport"));

const queryClient = new QueryClient();

const ADMIN_ROLES = ["super_admin", "account_manager", "finance", "content_writer", "seo_specialist"];
const CLIENT_ROLES = ["client"];

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

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
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />

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
  return (
    <>
      <CustomCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
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
