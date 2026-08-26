<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MaliDougoukolo - Registre Foncier

Frontend + backend app for local cadastral registry management with PostgreSQL and Prisma.

## Prerequisites

- Node.js 18+ / npm
- PostgreSQL installed locally
- Optional: pgAdmin for database GUI

## Setup

1. Open the project folder:
   ```bash
   cd /home/it-guy/projetFoncier/MaliDougoukolo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create or update `.env` with your local database URL:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/DB-FONCIERE?schema=public"
   GEMINI_API_KEY="MY_GEMINI_API_KEY"
   APP_URL="http://localhost:3000"
   SUPER_ADMIN_ID="admin"
   SUPER_ADMIN_EMAIL="admin@registre.ml"
   SUPER_ADMIN_NAME="Mamadou SANGARE"
   SUPER_ADMIN_PASSWORD="admin123"
   AGENT_USER_ID="agent"
   AGENT_USER_EMAIL="agent@registre.ml"
   AGENT_USER_NAME="Paul TOGOLA"
   AGENT_USER_PASSWORD="agent123"
   ```

4. Start local PostgreSQL and create the database if needed:
   ```bash
   sudo systemctl enable --now postgresql
   sudo -u postgres createdb "DB-FONCIERE"
   ```

5. Verify PostgreSQL is listening on the expected port:
   ```bash
   ss -ltnp | grep ':5433 '
   ```

## Prisma / Database

1. Push the Prisma schema to the database:
   ```bash
   npx prisma db push
   ```

2. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

3. Seed the default users:
   ```bash
   npm run db:seed
   ```

## Run the app

Start the development server:
```bash
npm run dev
```

Then open the app in your browser at:
```text
http://localhost:3000
```

The backend API is available at:
```text
http://localhost:5000/api/health
```

## Default login credentials

- Admin:
  - ID: `admin`
  - Name: `Mamadou SANGARE`
  - Email: `admin@registre.ml`
  - Password: `admin123`

- Agent:
  - ID: `agent`
  - Name: `Paul TOGOLA`
  - Email: `agent@registre.ml`
  - Password: `agent123`

## pgAdmin (Optional)

If you want to inspect the database in a GUI, connect pgAdmin to:
- Host: `localhost`
- Port: `5433`
- Username: `postgres`
- Password: `postgres`
- Database: `DB-FONCIERE`

## Notes

- The project uses local PostgreSQL on port `5433`.
- If you change the database port or name, update `.env` and rerun `npx prisma db push`.
- If you need to rebuild the backend for production, use:
  ```bash
  npm run build
  ```
