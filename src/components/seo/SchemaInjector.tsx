import { useEffect } from "react";

/**
 * Section-scoped JSON-LD injector. Use to attach an additional schema block
 * (ItemList, CollectionPage, etc.) from a section that lives below an existing
 * SEOHead-managed page. Cleans itself up on unmount.
 */
export default function SchemaInjector({
  id,
  schema,
}: {
  id: string;
  schema: Record<string, unknown>;
}) {
  useEffect(() => {
    const sel = `script[data-schema-id="${id}"]`;
    document.head.querySelectorAll(sel).forEach((n) => n.remove());
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.dataset.schemaId = id;
    s.text = JSON.stringify(schema);
    document.head.appendChild(s);
    return () => {
      document.head.querySelectorAll(sel).forEach((n) => n.remove());
    };
  }, [id, JSON.stringify(schema)]);
  return null;
}
