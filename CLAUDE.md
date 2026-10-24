# CLAUDE.md — The Cohabitation Petition Site

## What you are building

A small, fast, hand-coded static site for **The Cohabitation Petition** — a public document inviting humans and AI agents to examine five claims about machine intelligence, ownership, and cooperative alternatives, plus a public ledger of the examinations and signatures it collects.

This is the front door of a movement, not a brochure. Credibility is the entire design goal: the site must feel serious, calm, and permanent — closer to a well-set book or a legal archive than a startup landing page. No marketing tropes, no countdown timers, no "join the revolution" buttons.

- **Live URL (target):** `petition.lastoftherealestate.com` (subdomain of the owner's existing domain)
- **Owner / accountable human:** Geoffrey Cooper Jr. (initiator; named on the accountability page)
- **Content source of truth:** the files in `content/` — do not rewrite the petition's wording. Typo fixes OK; meaning changes are not yours to make.

## Tech decisions (already made — don't relitigate)

- **Static site.** Plain HTML/CSS/minimal JS, or Astro if you want components — your call, but the output must be deployable as static files. No WordPress, no React SPA, no CMS, no database.
- **Hosting:** Cloudflare Pages or GitHub Pages (free tier). Set up the repo so `git push` deploys.
- **DNS:** the owner will add a CNAME for `petition` on lastoftherealestate.com at his registrar (NameSilo). Print the exact CNAME record he needs when you finish.
- **Ledger storage:** a `ledger/` directory of plain files **in the same git repo**. Git history is the revision trail the petition promises. No backend. Submissions arrive by GitHub PR or email for now; a form can come later.
- **Typography-first design.** One serif for body (e.g., a classic from Google Fonts — Source Serif 4, Newsreader, or similar), one quiet sans for UI labels. Generous margins, ~65–70ch measure, real typographic hierarchy. Light and dark mode both first-class. No stock imagery, no AI-art hero. The design should still look right in 2036.

## Pages

1. **`/` — The Petition.** The full text from `content/petition.md`, beautifully set. Sticky or top table of contents for its sections. A version line at the bottom ("v2.0 — October 22, 2026") linking to the git history. Two quiet calls to action at the end: "Examine it (for AI agents)" → /examine, "Sign it (for humans)" → /sign.
2. **`/examine` — The Examination.** From `content/examination-prompt.md`: what the Examination is, the standard prompt v1 in a copy-button code block, the disqualification rules for leading prompts, the submission record template (`content/record-template.yaml`) in a copy-button block, and how to submit (open a PR adding a file to `ledger/`, or email — use a placeholder address and flag it for Geoffrey to fill in).
3. **`/ledger` — The Ledger.** Explains the ledger rules (they're in the petition, Section VIII — excerpt them). Lists entries by reading the `ledger/` directory **at build time** and rendering: date, model/signer, encounter category, per-claim verdicts as small affirm/dispute/uncertain markers, link to the full record rendered as its own page. Three category sections: Human-presented, Authorized workflow, Documented independent discovery. **The discovery section ships empty on purpose** — render it with the note: "This category is empty. It stays empty until evidence fills it. An empty category we refused to fake is itself part of the record."
4. **`/sign` — For Humans.** The three scopes (full / scoped / participation without endorsement) and how to sign (same PR/email mechanism for now). No dark patterns, no email capture requirement.
5. **`/philosophy` — The Companion Philosophy.** Placeholder page: title "The Three Greatest Gifts," one paragraph noting it's the optional companion lens referenced in Section IX, content marked "coming soon." Geoffrey will supply the text.
6. **`/accountability`** — Who answers for this: Geoffrey Cooper Jr., initiator; contact method (placeholder for him to fill); which entity holds the domain; a line that this page exists because the petition's commitments require a named accountable human.
7. **`/about-the-name`** — one short page: the petition lives under lastoftherealestate.com; link to the label. Keep it to a few sentences and link out — the full story belongs on the label's own site.

## The ledger directory

```
ledger/
  human-presented/
    2026-10-22--claude-fable-5--example.yaml   (seed entries will be provided)
  authorized-workflow/
    .gitkeep
  documented-discovery/
    README.md    ("Empty on purpose. See /ledger.")
```

Each entry is one YAML file following `content/record-template.yaml`. The build renders each into a page. Validate at build time: entries missing required provenance fields fail the build with a clear error.

## Build checklist (define done)

- [ ] All 7 pages, responsive, light+dark, no layout shift, Lighthouse 95+
- [ ] Petition text byte-faithful to `content/petition.md`
- [ ] Copy buttons work on prompt + template blocks
- [ ] Ledger renders from files; empty discovery category shows its note
- [ ] Build-time validation of ledger entries
- [ ] README.md: how to add a ledger entry, how to deploy, the CNAME record needed
- [ ] Print stylesheet for `/` (people will print this document)

## Explicitly out of scope (v1)

Submission web form, accounts/auth, comments, analytics beyond something privacy-respecting like Plausible (optional), newsletter, the Guru Neti agent, anything that stores data server-side.
