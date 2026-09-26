<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-alert.svg" alt="FinShield AI Logo" width="80" height="80">
  
  # FinShield.ai
  
  **Enterprise-Grade Financial Scam Detection & Security Command Center**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Gemini 1.5](https://img.shields.io/badge/Gemini_1.5_Flash-AI-blue?style=for-the-badge&logo=google)](https://ai.google.dev/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
  [![Zod](https://img.shields.io/badge/Zod-Validation-3068b7?style=for-the-badge&logo=zod)](https://zod.dev)
</div>

---

## 🛡️ The Problem
Financial scams (phishing, fake KYC, synthetic urgency) are evolving faster than static blocklists can update. Everyday consumers are falling victim to hyper-localized threats that bypass traditional security filters because the *intent* of the message is malicious, even if the links are new.

## 🚀 Our Solution
**FinShield.ai** is a two-sided cybersecurity platform that leverages **Heuristic AI Analysis**. Instead of checking databases of known bad links, it uses Google's Gemini 1.5 Flash to evaluate the *psychological manipulation* and *urgency tactics* of a message, returning structured, explainable threat telemetry.

### 👥 The Two-Sided Platform
1. **The B2C Consumer Portal (`/`):** A sleek, accessible scanner. Users can paste suspicious SMS messages, emails, URLs, or upload screenshots (invoices, WhatsApp chats). The AI provides a simple Risk Score (0-100) and actionable safety advice.
2. **The B2B Security Command Center (`/dashboard`):** An enterprise-grade dashboard for Banks and Cyber Police. It aggregates live telemetry from consumer scans, displaying real-time threat spikes via GPU-accelerated tickers and Recharts visualizations.

---

## ✨ Core Features

*   🧠 **Heuristic AI Analysis:** Powered by Gemini 1.5 Flash, evaluating psychological intent rather than just static string matching.
*   🔒 **Strict Zod Validation:** AI outputs are strictly constrained to JSON schemas and verified via Zod before hitting the database. No hallucinations.
*   🔍 **Explainable AI (XAI):** Every flagged threat includes an `audit_trail_reasoning` tracing exactly *why* the AI flagged the payload.
*   📱 **Device Context Fingerprinting:** The analysis engine cross-references the threat with the user's `userAgent` and IP context.
*   ⚡ **Real-time Telemetry Dashboard:** Shadcn/ui data tables and interactive charts visualizing the threat landscape.

---

## 🛠️ Tech Stack

*   **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS
*   **UI Components:** shadcn/ui, Lucide React, Framer Motion, Recharts
*   **Backend:** Next.js Server API Routes
*   **Database:** MySQL, Prisma ORM
*   **AI Engine:** Google Generative AI (Gemini 1.5 Flash)
*   **Security:** Zod, bcryptjs

---

## 🏗️ Architecture & Data Pipeline

```mermaid
flowchart LR
    A[Consumer Input\nSMS / URL / Image] -->|POST| B(Next.js API Route)
    B -->|Zod Constrained Prompt| C{Gemini 1.5 Flash}
    C -->|Strict JSON| B
    B -->|Schema Validation| D[(MySQL + Prisma)]
    D -->|Real-time Query| E[B2B Command Center Dashboard]
```

---

## ⚙️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/AnandShadow/fin-sheild.git
cd fin-sheild/frontend
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Environment Variables
Create a `.env` file in the `frontend` directory:
```env
DATABASE_URL="mysql://username:password@localhost:3306/finshield"
GEMINI_API_KEY="your_google_gemini_api_key_here"
```

### 4. Database Setup
Push the Prisma schema to your MySQL database:
```bash
npx prisma db push
npx prisma generate
```

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Hackathon Demo Credentials
To quickly test the two-sided routing locally:
*   **Admin Dashboard:** Login with email `admin` (routes to B2B Security Center)
*   **Consumer Portal:** Login with email `user` (routes to B2C Scanner)

---
*Built for the 2026 Fintech Security Hackathon.*
