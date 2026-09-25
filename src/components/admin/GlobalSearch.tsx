import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Users, Building2, Receipt, FileText } from "lucide-react";

const db = supabase as any;

function useDebounced<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query, 250);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const { data, isFetching } = useQuery({
    queryKey: ["global-search", debounced],
    queryFn: async () => {
      const term = debounced.trim();
      if (term.length < 2) {
        return { leads: [], accounts: [], invoices: [], quotations: [] };
      }
      const like = `%${term}%`;
      const [leadsRes, accountsRes, invoicesRes, quotationsRes] = await Promise.all([
        db
          .from("leads")
          .select("id, name, email, company")
          .or(`name.ilike.${like},email.ilike.${like},company.ilike.${like}`)
          .limit(5),
        db
          .from("accounts")
          .select("id, name, primary_contact_email")
          .ilike("name", like)
          .limit(5),
        db
          .from("invoices")
          .select("id, invoice_number, client_name")
          .or(`invoice_number.ilike.${like},client_name.ilike.${like}`)
          .limit(5),
        db
          .from("quotations")
          .select("id, quote_number, client_name")
          .or(`quote_number.ilike.${like},client_name.ilike.${like}`)
          .limit(5),
      ]);
      return {
        leads: leadsRes.data ?? [],
        accounts: accountsRes.data ?? [],
        invoices: invoicesRes.data ?? [],
        quotations: quotationsRes.data ?? [],
      };
    },
    enabled: open,
  });

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const hasResults =
    (data?.leads?.length ?? 0) +
      (data?.accounts?.length ?? 0) +
      (data?.invoices?.length ?? 0) +
      (data?.quotations?.length ?? 0) >
    0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search leads, accounts, invoices, quotations…" value={query} onValueChange={setQuery} />
      <CommandList>
        {query.trim().length < 2 ? (
          <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
        ) : isFetching ? (
          <CommandEmpty>Searching…</CommandEmpty>
        ) : !hasResults ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : null}

        {(data?.leads?.length ?? 0) > 0 && (
          <CommandGroup heading="Leads">
            {data!.leads.map((l: any) => (
              <CommandItem
                key={l.id}
                value={`lead-${l.id}-${l.name}-${l.email}`}
                onSelect={() => l.email && go(`/dashboard/admin/contacts/${encodeURIComponent(l.email)}`)}
              >
                <Users className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{l.name || l.email}</span>
                  <span className="text-xs text-muted-foreground">{l.company || l.email}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {(data?.accounts?.length ?? 0) > 0 && (
          <CommandGroup heading="Accounts">
            {data!.accounts.map((a: any) => (
              <CommandItem key={a.id} value={`account-${a.id}-${a.name}`} onSelect={() => go("/dashboard/admin/crm")}>
                <Building2 className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{a.name}</span>
                  {a.primary_contact_email && <span className="text-xs text-muted-foreground">{a.primary_contact_email}</span>}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {(data?.invoices?.length ?? 0) > 0 && (
          <CommandGroup heading="Invoices">
            {data!.invoices.map((i: any) => (
              <CommandItem
                key={i.id}
                value={`invoice-${i.id}-${i.invoice_number}-${i.client_name}`}
                onSelect={() => go("/dashboard/admin/invoices")}
              >
                <Receipt className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{i.invoice_number}</span>
                  <span className="text-xs text-muted-foreground">{i.client_name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {(data?.quotations?.length ?? 0) > 0 && (
          <CommandGroup heading="Quotations">
            {data!.quotations.map((q: any) => (
              <CommandItem
                key={q.id}
                value={`quote-${q.id}-${q.quote_number}-${q.client_name}`}
                onSelect={() => go("/dashboard/admin/quotations")}
              >
                <FileText className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{q.quote_number}</span>
                  <span className="text-xs text-muted-foreground">{q.client_name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
