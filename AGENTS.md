# Architecture rules

- Keep voice Lottie rendering in one lazy-loaded component so global page loading remains lightweight.
- Keep city editorial batches separate from the shared location renderer; only registry cities with editorial records become public routes, preventing empty city pages.
- Represent remote city coverage as Service areaServed rather than fictional LocalBusiness branches; agency identity and verified HQ remain sitewide.
- Share homepage FAQ records between the accordion and route schema so answers cannot drift; keep route-specific FAQ markup out of the static sitewide head.