# PM-AJAY AI Voice Assistant & Skilling Portal
### Ministry of Social Justice and Empowerment (MoSJE) · Smart India Hackathon (SIH) 2026 · Problem ID: 26097

AI-driven multilingual voice assistant for livelihood mapping and NSQF-aligned skilling recommendations for Scheduled Caste (SC) communities under the Grant-in-Aid (GIA) component of PM-AJAY.

---

## 🚀 Key Features & Multi-Channel Deployment

1. **Channel 1: Village Kiosk / Web Audio Assistant**
   - Natural voice conversation in 8 regional languages & dialects (Hindi, Bhojpuri, Punjabi, Marathi, Bengali, Tamil, Telugu, English).
   - In-browser microphone recording with real-time waveform and Web Audio capture.
   - Pydantic-matched `BeneficiaryProfile` extraction (occupation, aspirational interest, education level, mobility, skill gaps).
   - Instant recommendation of NSQF certified vocational courses with up to **₹50,000 capital subsidies** and toolkit grants.
   - Neural text-to-speech audio feedback.

2. **Channel 2: 1800-PM-AJAY Toll-Free IVR Phone Simulator**
   - Built specifically for rural feature-phone / keypad users without smartphones or internet access.
   - Interactive 12-key DTMF dialer with realistic audio tones.
   - Step-by-step spoken voice guidance through language selection, sector choice, and eligibility vetting.
   - Automated simulated SMS dispatch delivering center details and subsidy vouchers.

3. **Channel 3: WhatsApp Community Voice-Note Bot**
   - Designed for Gram Panchayats, Anganwadi workers, and village youth.
   - Replicates authentic WhatsApp voice note interface with playable audio waveform bubbles.
   - Immediate audio reply + downloadable scheme syllabus and subsidy brochure.

4. **Channel 4: District Perspective Plans & Financial Consultant Roadmap**
   - Directly tackles SIH Problem Statement Issues 1 & 2 (*"Lack of proper road map and planning of perspective plans"* & *"Identification of trained financial consultants"*).
   - Dossiers for high-priority districts (Gorakhpur, Solapur, Hoshiarpur, Gaya, Malda) with census SC population metrics, GIA budget allocations (₹12 - ₹25 Cr), accredited training centers, and named Lead Financial Consultants with direct helpline extensions.

5. **Channel 5: Printable Beneficiary Enrollment Pass**
   - Instant printable/downloadable official pass with candidate profile, allotted NSQF trade, capital subsidy entitlement, and QR code verification for District Social Welfare Offices (DSWO).

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: Next.js / React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Express 4.x running in Node/TypeScript (`server.ts` & `server/expressApp.ts`).
- **AI & NLP**: Google Gemini API (`@google/genai` with `gemini-3.8-flash` reasoning, `gemini-3.5-transcribe` STT, `gemini-3.8-flash-lite-tts` neural speech).
- **Hosting Targets**: Ready for **Vercel** (`vercel.json` + `api/index.ts`) or Node full-stack (`npm start`).

---

## 📦 Deployment to Vercel

This repository is pre-configured for one-click Vercel deployment:

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of PM-AJAY AI Voice Assistant"
   git push origin main
   ```

2. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) and select your repository.
   - Framework Preset: **Vite** or **Other**.
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configure Environment Variables in Vercel:**
   - Add `GEMINI_API_KEY`: Your Google Gemini API Key from Google AI Studio.

4. **Deploy!**
   - Vercel automatically routes `/api/*` to `api/index.ts` using the provided `vercel.json` configuration and serves the frontend as high-speed static assets.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure .env file
cp .env.example .env
# Ensure GEMINI_API_KEY is set in .env

# 3. Start development server (serves frontend + Express API middleware)
npm run dev

# 4. Or build and run production Express server on port 3000
npm run build
npm start
```

---

## 📄 API Endpoints

- `POST /api/chat`: Accepts audio file/blob or JSON text; returns transcript, profile, recommendations, and synthesized audio. Compatible with `pm_ajay_voice-backend` API.
- `POST /api/voice/process`: Direct voice transcription and NSQF mapping.
- `GET /api/trades`: Search and filter 14+ NSQF certified trades with PM-AJAY subsidies.
- `GET /api/districts`: District perspective plans with GIA budgets and financial consultants.
- `POST /api/ivr/call`: State machine for toll-free feature-phone IVR simulation.
- `POST /api/whatsapp/message`: Webhook simulator for WhatsApp voice note interactions.
- `GET /api/stats`: MoSJE national welfare metrics.
