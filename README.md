# Shift Handover

An offline-first iPad PWA for recording and sharing production-shift handovers.

Built as a single-file static web app — no build step, no backend, no dependencies.

## Features

- **Works offline** after the first load (PWA with service worker)
- **Install to iPad home screen** via Safari → Share → *Add to Home Screen*
- **Auto date** — set to today on every launch
- **Auto shift** — Morning (07:01–19:00) · Night (19:01–07:00)
- **Multi-select working areas** — Bay 1, Bay 2, Bay 3, Cell
- **Machine status table** — Running · Stopped · Maintenance · Idle · Other
- **Incidents / Actions** with *Nothing to Report* toggles
- **Generate Handover Image** — renders a professional PNG report you can save or copy to the clipboard
- **Auto-save** — all fields persisted to `localStorage`

## Project structure

```
handover/
├── index.html          # the whole app (HTML + inline CSS + inline JS)
├── manifest.json       # PWA manifest
├── service-worker.js   # offline cache + update strategy
├── icon-192.png        # home-screen icon
├── icon-512.png        # splash / hi-dpi icon
├── icon-moulds.svg     # source for icon-192
└── icon-assembly.svg   # source for icon-512
```

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). HTTPS is required for the service worker to register.

**GitHub Pages:**
1. Push this folder to a repo.
2. Settings → Pages → Source: `main` branch, `/` (root).
3. Open the published URL on iPad Safari → Share → **Add to Home Screen**.

## Updating the app

The service worker caches everything, so you must signal a new version to trigger a refresh on installed devices.

1. Edit your files.
2. In `service-worker.js`, bump `CACHE_NAME` (e.g. `handover-v2` → `handover-v3`).
3. Commit and push.
4. Launch the PWA on iPad while online — the new service worker installs automatically and the app updates on the next launch. The home-screen icon stays put.

Navigations are served **network-first**, so updated HTML appears on the first launch after a deploy; icons and the manifest are cache-first for speed.

## Local preview

```bash
python3 -m http.server 4173 --directory handover
# open http://localhost:4173
```

Note: service-worker registration works on `localhost` over plain HTTP; any other host needs HTTPS.

## License

MIT — see [LICENSE](LICENSE).
