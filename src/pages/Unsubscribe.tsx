import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    (async () => {
      if (!token) { setState("error"); return; }
      const { error, data } = await supabase
        .from("newsletter_subscribers")
        .update({ unsubscribed_at: new Date().toISOString(), status: "unsubscribed" as any })
        .eq("unsub_token", token)
        .select("id")
        .maybeSingle();
      if (error || !data) setState("error");
      else setState("ok");
    })();
  }, [token]);

  return (
    <Layout>
      <SEOHead
        title="Unsubscribe — Digital Penta"
        description="Manage your Digital Penta newsletter subscription."
        canonical="https://digitalpenta.com/unsubscribe"
        noindex
      />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-md text-center">
          {state === "loading" && <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />}
          {state === "ok" && (
            <>
              <CheckCircle2 className="w-12 h-12 mx-auto text-primary mb-4" />
              <h1 className="font-display font-bold text-2xl text-foreground">You're unsubscribed.</h1>
              <p className="text-sm text-muted-foreground mt-2">You won't receive further newsletters. Sorry to see you go.</p>
            </>
          )}
          {state === "error" && (
            <>
              <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-4" />
              <h1 className="font-display font-bold text-2xl text-foreground">Link invalid or expired.</h1>
              <p className="text-sm text-muted-foreground mt-2">Please contact support@digitalpenta.com for help.</p>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
