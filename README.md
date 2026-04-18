# SIT Be

SITBe is the Belgian SAP Inside Track event. This project is the one-page UI5 app that powers our website. Each year is configured by editing a single JSON file — the site picks it up automatically.

## Tech

- OpenUI5 1.136 (Horizon theme)
- UI5 Tooling 4.x (`@ui5/cli`)
- GitHub Pages for hosting

## Develop

```bash
npm install
npm start          # ui5 serve, opens index.html
```

## Build

```bash
npm run build      # outputs to dist/
```

## Deploy

A push to `master` triggers `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to GitHub Pages.

To enable Pages once on a fresh repo: **Settings → Pages → Source = "GitHub Actions"**.

## Editing the event content

All event data lives in [`webapp/services/info.json`](webapp/services/info.json) — a chronologically ordered list of editions. The most recent edition (index 0) is the one displayed on first load; an edition switcher in the hero lets visitors browse past years.

Each edition has the same shape: `date`, optional `subscriptionLink` / `sessionForm`, `announcements`, `sessions`, `location`, `host`, `sponsors`. The `agenda: true` flag toggles the calendar view; otherwise sessions render as cards.
