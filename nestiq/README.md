# NestIQ — AI Real Estate Sales Assistant

NestIQ is a production-ready AI sales assistant that connects to **WhatsApp Business API**, powered by **Claude AI**, to automatically qualify real estate leads, book property inspections, and notify agents — all via WhatsApp.

---

## Architecture

```
nestiq/
├── src/              ← Marketing website (React + Vite + TypeScript)
├── backend/          ← API server (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── routes/        webhook.ts · leads.ts · appointments.ts
│   │   ├── services/      aiService · whatsappService · calendarService · leadService · emailService
│   │   ├── middleware/    webhookVerify.ts
│   │   └── index.ts
│   └── supabase/migrations/001_initial_schema.sql
└── dashboard/        ← Agent dashboard (React + Vite + TypeScript)
```

---

## Prerequisites

- Node.js 18+
- A **Meta Business** account (free) — [developers.facebook.com](https://developers.facebook.com)
- A **Supabase** account (free) — [supabase.com](https://supabase.com)
- An **Anthropic** API key — [console.anthropic.com](https://console.anthropic.com)
- A **Google Cloud** project with Calendar API enabled
- A Gmail account with App Password enabled (for SMTP)
- **ngrok** (for local webhook testing) or a public server URL

---

## Step 1 — Meta WhatsApp Cloud API Setup

### 1a. Create a Meta App

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps)
2. Click **Create App** → Select **Business** → fill in app name (e.g. "NestIQ")
3. Under **Add products to your app**, click **Set up** on **WhatsApp**

### 1b. Get Your Credentials

1. In the left sidebar, go to **WhatsApp → API Setup**
2. Note your **Phone Number ID** (e.g. `123456789012345`) → set as `META_PHONE_NUMBER_ID`
3. Click **Generate access token** (valid 24h for testing — for production, use a **System User** permanent token):
   - Go to **Business Settings → Users → System Users → Add**
   - Assign `WhatsApp Business Account` asset with `Full Control`
   - Click **Generate New Token** → select all WhatsApp scopes → copy it → set as `META_WHATSAPP_TOKEN`
4. Go to **App Settings → Basic** → copy **App Secret** → set as `META_APP_SECRET`

### 1c. Configure the Webhook

1. In **WhatsApp → Configuration**, under **Webhook**:
2. Click **Edit** and set:
   - **Callback URL**: `https://yourdomain.com/api/webhook/whatsapp`  
     *(For local dev: `https://xxxx.ngrok.io/api/webhook/whatsapp`)*
   - **Verify Token**: `nestiq_webhook_secret_2024` (or your `META_WEBHOOK_VERIFY_TOKEN`)
3. Click **Verify and Save**
4. Under **Webhook Fields**, click **Subscribe** next to **messages**

---

## Step 2 — Supabase Setup

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Go to **Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`
3. Go to **SQL Editor → New query**, paste the contents of `backend/supabase/migrations/001_initial_schema.sql`, and click **Run**

---

## Step 3 — Google Calendar OAuth2 Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable **Google Calendar API**
3. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `https://developers.google.com/oauthplayground`
4. Copy **Client ID** → `GOOGLE_CLIENT_ID`, **Client Secret** → `GOOGLE_CLIENT_SECRET`
5. Get a Refresh Token:
   - Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
   - Click the gear icon (⚙) → check **Use your own OAuth credentials** → enter your Client ID & Secret
   - In Step 1, paste `https://www.googleapis.com/auth/calendar` → **Authorize APIs**
   - Sign in with your Google account → click **Exchange authorization code for tokens**
   - Copy **Refresh token** → `GOOGLE_REFRESH_TOKEN`

---

## Step 4 — Environment Setup

```bash
cd backend
cp .env.example .env
```

Fill in all values in `backend/.env`:

```env
META_WHATSAPP_TOKEN=your_permanent_token
META_PHONE_NUMBER_ID=your_phone_number_id
META_WEBHOOK_VERIFY_TOKEN=nestiq_webhook_secret_2024
META_APP_SECRET=your_app_secret

ANTHROPIC_API_KEY=sk-ant-...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=1//...

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_app_password
AGENT_EMAIL=agent@youragency.com

AGENCY_NAME=Your Agency Name
AGENT_NAME=Your Name
PORT=3001
```

> **Gmail App Password**: Go to [myaccount.google.com/security](https://myaccount.google.com/security) → 2-Step Verification → App passwords → Generate one for "Mail"

---

## Step 5 — Install & Run

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend starts on `http://localhost:3001`

### Marketing Website (Frontend)

```bash
cd ..   # back to nestiq/
npm install
npm run dev
```

Opens at `http://localhost:5173`

### Agent Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Opens at `http://localhost:5174`

---

## Step 6 — Local Webhook Testing with ngrok

```bash
# Install ngrok: https://ngrok.com/download
ngrok http 3001
```

Copy the HTTPS forwarding URL (e.g. `https://abc123.ngrok.io`) and use it as your webhook callback URL in Meta Developer Console.

---

## Step 7 — Test the System

1. Open WhatsApp and send a message to your registered WhatsApp Business number
2. Watch the backend terminal — you should see the webhook received and AI response generated
3. Open the dashboard at `http://localhost:5174` — the new lead appears in **Leads**
4. Reply to messages — the AI qualifies the lead automatically
5. When lead is qualified, check your `AGENT_EMAIL` for the notification email
6. When buyer says they want to book — the AI books it and it appears in **Appointments**

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/webhook/whatsapp` | Meta webhook verification |
| `POST` | `/api/webhook/whatsapp` | Incoming WhatsApp messages |
| `GET` | `/api/leads` | List all leads (paginated) |
| `POST` | `/api/leads` | Create demo request (from marketing form) |
| `GET` | `/api/leads/analytics` | Dashboard analytics |
| `GET` | `/api/leads/:id` | Lead detail + conversation history |
| `PATCH` | `/api/leads/:id` | Update lead (status, notes, etc.) |
| `POST` | `/api/leads/:id/message` | Send manual WhatsApp message |
| `GET` | `/api/appointments` | List all appointments |
| `PATCH` | `/api/appointments/:id/cancel` | Cancel appointment |

---

## Production Deployment

### Option A — Railway (recommended, free tier available)

```bash
# Deploy backend
railway init
railway up
railway domain  # get your public URL
```

### Option B — Render / Fly.io / VPS

1. Build the backend: `npm run build`
2. Set all environment variables on your platform
3. Run: `node dist/index.js`
4. Update your Meta webhook URL to the production domain

### Option C — Docker

```bash
docker-compose up --build
```

---

## Security Notes

- `META_APP_SECRET` is used to verify every incoming webhook with HMAC-SHA256 — never skip this in production
- Use a **System User** permanent token (not a 24h token) in production
- Enable Supabase RLS policies appropriate to your security model
- The backend rate-limits API requests to 200/15min per IP

---

## Support

Built with: Claude 3.5 Sonnet · WhatsApp Cloud API · Supabase · Google Calendar · Nodemailer
