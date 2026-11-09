# How a Google knowledge panel actually gets created

**Read this first.** You cannot generate a knowledge panel with code. There is no
API, no form, no markup tag, no paid option, and no "submit entity" button. Google
builds panels automatically — and only when it is *confident* about who someone is,
based mostly on sources **other than your own website**.

Everything on your site is already as strong as it can be. What is missing is
off-site. This playbook is the missing part, ordered by impact.

---

## Where you actually stand today

I checked what Google can currently see about you. This is the honest scorecard:

| Signal | Status |
| --- | --- |
| Own website with full `Person` schema | ✅ strong |
| LINKUP website + Google Play app | ✅ exists |
| LinkedIn, X, Instagram, YouTube, Telegram | ✅ exist |
| **Independent press coverage** | ❌ **none found** |
| **Wikidata entity** | ❌ does not exist |
| **Crunchbase person profile** | ❌ does not exist |
| **Consistent name across properties** | ❌ **conflicting** — see Fix 1 |

Only one of those is something a developer can fix. The rest is publishing and
outreach. That is the real reason there is no panel yet.

---

## FIX 1 — The Play Store name mismatch (do this today)

Your LINKUP listing on Google Play says, under *About the developer*:

> **Tatenda Paul Gaadzikwa**

while the app page, the privacy policy and this website all say **Tanaka Gaadzikwa**.

To Google's Knowledge Graph these look like **two different people**, and a
conflicting name is one of the fastest ways to guarantee *no* panel: the algorithm
cannot confirm which person the entity refers to, so it renders nothing.

**Action:** Play Console → Settings → Developer account → Developer name → set it to
`Tanaka Gaadzikwa` (or `Tanaka Gaadzikwa / LINKUP`). Keep the legal name on the
payment profile if it must stay — that field is not public.

This single change is worth more than any code I could write.

---

## FIX 2 — Your home address is public (do this today)

The same Google Play listing publishes:

> 490 Westwood, Kambuzuma Harare Zimbabwe

That is a residential address, on a page that Google indexes and that will be
attached to your name forever. You are 15. Remove it from the developer profile and
replace it with nothing, or with `Harare, Zimbabwe`. A knowledge panel shows
personal facts prominently; the less accurate personal detail that is public, the
safer the outcome.

While you are there: consider showing only your birth **year** publicly rather than
the exact date. A panel will display whatever is publicly corroborated.

---

## FIX 3 — Get 3–5 independent articles (this is the unlock)

This is the thing that actually causes panels. One article on your own site counts
for nothing. **One article in a publication you do not control counts for
everything.**

Aim for 3–5 mentions that:

- spell the name exactly `Tanaka Gaadzikwa`
- describe the same role: `founder and CEO of LINKUP`
- appear on sites Google already trusts
- link to `https://www.tanakagaadzikwa.com/`

Realistic targets, easiest first — full list and email templates in
[`press-pitch.md`](./press-pitch.md):

1. **Techzim** (Harare) — covers exactly this kind of story
2. **263Chat** (Harare)
3. **TechCabal** (Lagos, pan-African, high authority)
4. **Disrupt Africa** / **WeeTracker**
5. **Rest of World** (global, loves a "built from Zimbabwe" story)

Three of these landing = a genuine knowledge-panel candidate.

---

## FIX 4 — Create the Wikidata item (after Fix 3, not before)

Google licenses enormous amounts of its Knowledge Graph from **Wikidata**, and a
Wikidata item with a couple of solid references is the single strongest technical
entity signal that exists. Yours does not exist yet.

⚠️ **Timing matters more than anything else here.** Wikidata has a notability
policy: an item needs *serious public documentation* from independent sources.
Self-published pages (your site, your own store listing) do not count. If you
create the item today it will very likely be **deleted**, and a deleted item is
harder to get approved later.

**So:** collect 2–3 press articles first, then create it.

When you're ready, the paste-ready file is
[`wikidata-quickstatements.txt`](./wikidata-quickstatements.txt) — it creates the
item, all the statements and the references in about 30 seconds.

---

## FIX 5 — Crunchbase, and the consistency pass

A Crunchbase **person** profile plus an **organization** profile for LINKUP is the
other database Google leans on for founders.

Then publish the *identical* bio everywhere. Identical wording is what lets Google
merge your profiles into one person. Copy it from
[`official-bio.md`](./official-bio.md) — do not rewrite it per profile.

Consistency checklist — all of these must match:

- [ ] `Tanaka Gaadzikwa` — same spelling everywhere, no "Tatenda", no "Tanaka Prince"
      as the display name (keep the full name in the bio, not the display name)
- [ ] Role string: `Founder & CEO, LINKUP`
- [ ] Location: `Harare, Zimbabwe`
- [ ] Website: `https://www.tanakagaadzikwa.com/`
- [ ] Same profile photo
- [ ] Same 2-sentence bio
- [ ] Every profile links **back** to your website (this closes the `sameAs` loop)

Profiles to align: Google Play developer page · LinkedIn · X · Instagram · YouTube ·
Telegram · Crunchbase · Wikidata · GitHub · Product Hunt · any event listings.

---

## FIX 6 — Once Wikidata exists, add it to the site

Open `src/data/siteConfig.js` and fill in `EXTRA_PROFILES`:

```js
export const EXTRA_PROFILES = {
  wikidata:   'https://www.wikidata.org/wiki/Q000000000',
  crunchbase: 'https://www.crunchbase.com/person/tanaka-gaadzikwa',
  wikipedia:  '',   // leave empty until an article exists
};
```

Empty strings are skipped automatically, so the schema never points at a dead URL.
Rebuild and the new `sameAs` links (with `@id` alignment) land in every page's
JSON-LD.

---

## What to expect, honestly

| Stage | Time |
| --- | --- |
| Fix Play Store name + address | same day |
| First article lands | weeks of pitching |
| Third article lands | 1–3 months |
| Wikidata item survives | immediately after that |
| Google notices and renders a panel | **2–6 months** after the sources exist |

Nobody can compress the last row. People sell "knowledge panel services"; what they
actually do is create a Wikidata item and a Crunchbase page — which you now have
ready to do yourself for free.

**You will know it's working before the panel appears:** Google will start
suggesting *"Tanaka Gaadzikwa"* as a search completion, and `site:tanakagaadzikwa.com`
plus a direct name search will return a *People also search for* row. That is the
entity forming. The panel follows.

---

## One honest note

A knowledge panel is permanent, public and controlled by Google — you cannot edit
what it shows, only influence it through what gets published. It will surface your
age, your town and your work to anyone who searches. That is usually the goal. Just
make sure it's a deliberate one, and that whoever looks after you knows the plan —
especially before any interview where a journalist asks for an address.
