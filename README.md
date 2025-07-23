TabTempo

Description

TabTempo is a proof‑of‑concept tool that captures browser tab metadata at regular intervals via a Chrome extension, streams the data in real time through a SignalR hub hosted in an ASP.NET Core API, persists events into a PostgreSQL database, and displays live updates in a minimal React viewer.

Repository Structure

/tabtempo
├── extension/       # Chrome extension source (Manifest V3 + service worker)
├── api/             # ASP.NET Core Web API with SignalR hub and EF Core persistence
├── infra/           # Docker Compose setup for PostgreSQL
└── viewer/          # Vite + React viewer for live event streams

Prerequisites

.NET SDK 7.0+
Node.js 20+ and pnpm globally
Docker Desktop

Setup & Development

1. Clone the repository

git clone https://github.com/naufal1muhammad/tabtempo.git
cd tabtempo

2. Start the database (Infra)

cd infra
docker compose up -d

3. Run the API

cd ../api/tabtempo-api
# Trust and generate dev certificate (once)
dotnet dev-certs https --trust
# Restore and run
dotnet restore
dotnet run

API will listen on https://localhost:5001 by default.

4. Load the Chrome Extension

Open chrome://extensions/ in Chrome.

Enable Developer mode.

Click Load unpacked and select the extension/ folder.

5. Run the React Viewer

cd ../viewer
pnpm install
pnpm dev

Open the printed Vite URL (e.g. http://localhost:5173) to see live tab events.

Formatting & Linting

EditorConfig: root settings in .editorconfig.

ESLint & Prettier: configured in viewer/.eslintrc.json and viewer/.prettierrc.

Cleaning & Reset

To clear all captured events:

cd infra
docker compose exec db psql -U tabtempo -d tabtempo_dev -c "TRUNCATE TABLE events;"

To stop the database:

docker compose down

Contributing

Feel free to open issues or submit PRs for improvements to the PoC flow, error handling, or UI enhancements.