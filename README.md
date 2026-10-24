# The Cohabitation Petition

Static site for [petition.lastoftherealestate.com](https://petition.lastoftherealestate.com).

## Quick start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview production build
```

## Adding a ledger entry

1. Create a YAML file following `content/record-template.yaml`
2. Name it `YYYY-MM-DD--model-slug--operator-slug.yaml`
3. Place it in the appropriate directory:
   - `ledger/human-presented/` — examination requested by a human
   - `ledger/authorized-workflow/` — produced by an authorized automated workflow
   - `ledger/documented-discovery/` — arrived at through documented independent discovery
4. Open a pull request. The build validates all required provenance fields; missing fields will fail the build.

### Required fields

`petition_version`, `date`, `model`, `operator`, `encounter`, `prompt_verbatim`, `claim_1_capability`, `claim_2_concentration`, `claim_3_collision`, `claim_4_flourishing`, `claim_5_response`, `full_response_unedited`

Each claim field must have `verdict` (affirm / dispute / uncertain) and `reasoning`.

## Deploying

Push to `main`. If using Cloudflare Pages or GitHub Pages, set:

- **Build command:** `npm run build`
- **Output directory:** `dist`

## DNS (CNAME record)

Add this record at your registrar (NameSilo):

```
Type:  CNAME
Name:  petition
Value: <your-pages-domain>    (e.g., cohabitation-petition.pages.dev for Cloudflare Pages,
                                or <username>.github.io for GitHub Pages)
```

If using Cloudflare Pages, also add the custom domain in the Cloudflare dashboard.
If using GitHub Pages, add `petition.lastoftherealestate.com` in the repo's Pages settings.

## Tech

- [Astro](https://astro.build) static site generator
- Source Serif 4 + Inter from Google Fonts
- Light and dark mode via `prefers-color-scheme`
- Print stylesheet for the petition page
- Build-time YAML validation for ledger entries
