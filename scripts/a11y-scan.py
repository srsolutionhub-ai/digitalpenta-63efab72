#!/usr/bin/env python3
"""Accessibility scan (axe-core, WCAG 2.2 AA) on key pages at mobile + desktop.
Usage: python3 scripts/a11y-scan.py [base_url]   (default http://localhost:8080)
Exits 1 when any serious/critical violation is found."""
import asyncio, sys, json
from pathlib import Path
from collections import defaultdict
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
PAGES = ["/", "/contact", "/services/digital-marketing", "/services/ai-solutions", "/seo/london",
         "/locations/mumbai", "/tools", "/tools/seo-audit", "/blog", "/get-proposal", "/pricing-calculator", "/about"]
AXE = (Path(__file__).parent.parent / "node_modules/axe-core/axe.min.js").read_text()

async def main():
    agg = defaultdict(lambda: {"impact": "", "pages": set(), "nodes": 0, "help": "", "sample": ""})
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        for w, h in [(1280, 1800), (390, 844)]:
            ctx = await b.new_context(viewport={"width": w, "height": h}, reduced_motion="reduce")
            pg = await ctx.new_page()
            for u in PAGES:
                await pg.goto(BASE + u, wait_until="networkidle")
                await pg.wait_for_timeout(800)
                await pg.add_script_tag(content=AXE)
                res = await pg.evaluate("""async () => (await axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations
                  .map(v => ({id:v.id, impact:v.impact, help:v.help, n:v.nodes.length, sample:v.nodes[0]?.target?.join(' ')}))""")
                for v in res:
                    a = agg[v["id"]]
                    a["impact"], a["help"] = v["impact"], v["help"]
                    a["pages"].add(f"{u}@{w}")
                    a["nodes"] += v["n"]
                    a["sample"] = a["sample"] or v["sample"]
            await ctx.close()
        await b.close()
    bad = 0
    for k, v in sorted(agg.items(), key=lambda kv: kv[1]["impact"] or ""):
        print(f"[{v['impact']}] {k}: {v['help']} — {v['nodes']} nodes on {len(v['pages'])} views; e.g. {v['sample']}")
        if v["impact"] in ("serious", "critical"):
            bad += 1
    print(f"\n{len(agg)} rule(s) violated, {bad} serious/critical")
    sys.exit(1 if bad else 0)

asyncio.run(main())
