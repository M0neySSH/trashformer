# ♻️ Trashformer

> **Team Bingage's submission for UTU Socio-Hackathon 2025 & Others**

<img width="1502" height="688" alt="Trashformer Landing" src="https://github.com/user-attachments/assets/a88734d2-6c75-43a8-a580-5acdec5d65f6" />

Trashformer is an AI-powered waste management platform that promotes environmental sustainability through cutting-edge technology and community engagement. It helps users analyze waste images, track carbon footprints, earn contribution points, and redeem eco-friendly rewards — empowering individuals and communities to make informed, sustainable decisions.

---

## 🌟 Features

### 🔬 Waste Processing (`/process`)
Upload images of waste for AI-driven analysis. The system classifies waste by composition, calculates recyclability percentage, assigns a sustainability contribution score, and provides actionable disposal/recycling recommendations.

### 🌱 Carbon Tracker (`/carbon-tracker`)
Track the carbon footprint of waste by uploading images. Receive detailed CO₂ equivalent estimates, environmental impact scores, material composition breakdowns (Plastic, Paper, Organic, Metal), processing recommendations (Recycle/Reduce/Reuse), and interesting environmental facts.

### 💬 Ask-To-Answer (`/ask-to-answer`)
An AI-powered Q&A feature where users can upload waste images and/or ask questions. The system provides five concise, actionable suggestions for sustainable waste disposal, repurposing, or recycling.

### 🏆 Leaderboards (`/leaderboards`)
A community-driven leaderboard showcasing top contributors. Filter by weekly, monthly, or all-time rankings to see who's making the biggest environmental impact.

### 🎁 Redeem Rewards (`/redeem`)
Redeem earned contribution points for real-world rewards including:
- **Discounts** – Electricity bill vouchers, pharmacy discounts, and more
- **Products** – Sustainable DIY products and eco-friendly goods
- **Experiences** – Virtual sustainability workshops, community garden passes

### 📖 About (`/about`)
Comprehensive project overview including mission statement, system architecture, hardware cost analysis for the smart bin, data flow diagrams, future scope, and team information.

---

## 🏗️ Architecture

### Frontend
- **Next.js 15** – Server-side rendering, routing, and Turbopack for fast development
- **React 19** – Component-based UI development
- **Tailwind CSS 4** – Utility-first styling with custom eco-themed design tokens
- **shadcn/ui** (Radix UI primitives) – Accessible, composable UI components
- **Framer Motion** – Smooth page transitions and micro-animations
- **Lucide React** – Consistent icon system
- **next-themes** – Light/Dark mode toggle

### AI / Backend
- **Google Gemini 2.5 Flash** – LLM for image analysis and waste classification (via LangChain)
- **LangChain** (`@langchain/google-genai`, `@langchain/core`) – Structured output parsing and prompt management
- **Zod** – Runtime schema validation for AI responses
- **Next.js API routes** – Serverless functions for client-server communication

### Smart Bin Hardware (Future / IoT Integration)
| Component | Purpose | Est. Cost |
|---|---|---|
| ESP32-CAM (w/ 2MP camera) | MCU + WiFi + Camera | ₹250 |
| RFID Reader (13.56 MHz) | Aadhar Card Tap Auth | ₹100 |
| Servo Motor (SG90) | Lid Actuation | ₹80 |
| 18650 Li-ion Battery | Power Storage | ₹200 |
| Solar Panel (3W) | Power Generation | ₹516 |
| Charge Controller (TP4056) | Battery Charging | ₹50 |
| ABS Enclosure | Weatherproof Casing | ₹239 |
| SIM800L GSM Module | Network Connectivity | ₹350 |
| GPS Module | Location Tracking | ₹300 |
| LCD Display (16×2) | User Feedback | ₹100 |
| LEDs, Buzzer, etc. | Status Indication | ₹20 |
| **Total** | | **₹1,905** |

> Estimated bulk cost: **~₹750/unit** at 10,000 units.

---

## 📂 Project Structure

```
Trashformer/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing / Home page
│   ├── layout.tsx              # Root layout with Navbar, Footer, ThemeProvider
│   ├── about/page.tsx          # About page (mission, architecture, team)
│   ├── ask-to-answer/page.tsx  # AI Q&A for waste suggestions
│   ├── carbon-tracker/page.tsx # Carbon footprint analysis
│   ├── leaderboards/page.tsx   # Community leaderboards
│   ├── login/page.tsx          # Login page (Google OAuth mock)
│   ├── process/page.tsx        # Waste processing & classification
│   └── redeem/page.tsx         # Rewards redemption store
├── components/                 # Reusable React components
│   ├── navbar.tsx              # Responsive navigation bar
│   ├── image-upload.tsx        # Drag-and-drop image upload component
│   ├── eco-illustration.tsx    # Animated SVG eco illustration
│   └── ui/                     # shadcn/ui component library
│       ├── button.tsx
│       ├── card.tsx
│       ├── dropdown-menu.tsx
│       ├── tabs.tsx
│       ├── progress.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── dialog.tsx
│       ├── popover.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       └── textarea.tsx
├── lib/                        # Shared utilities and AI logic
│   ├── llm.ts                  # Google Gemini LLM client (LangChain)
│   ├── prompts.ts              # System prompts & Zod schemas for AI agents
│   └── utils.ts                # Utility functions (cn, getImageAsBase64)
├── public/                     # Static assets (images, logos)
├── package.json                # Dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── LICENSE                     # GNU GPL v3.0
```

---

## 🤖 AI Agents

Trashformer uses three specialized AI agents, each powered by **Google Gemini 2.5 Flash** with structured JSON output via Zod schemas:

| Agent | System Identity | Purpose |
|---|---|---|
| **CO2Trackformer** | Carbon Tracker | Analyzes waste images to estimate CO₂ footprint, impact score, material composition, and processing recommendations |
| **A2A** (Ask-To-Answer) | Expert Advisor | Answers user queries about waste disposal with 5 actionable suggestions for recycling/reusing/reducing |
| **Trashformer** | Waste Classifier | Classifies waste, calculates recyclability %, assigns contribution scores, and provides 3 disposal recommendations |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** or **yarn** or **pnpm**
- A **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/FireHead90544/Trashformer.git
cd Trashformer

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_gemini_api_key_here
```

> ⚠️ **Note:** The API key is currently exposed on the client side via `NEXT_PUBLIC_`. For production use, move the LLM invocation to a server-side API route.

### Development

```bash
# Start the development server (with Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start the production server
npm start
```

### Linting

```bash
npm run lint
```

---

## 🔮 Future Scope

- **Government Integration** – Smart city waste management with municipal systems
- **Corporate Sustainability Programs** – Employee engagement and data-driven impact reports
- **Aadhar-Authenticated Waste Deposit Stations** – IoT smart bins with RFID/QR authentication
- **AI-Powered Real-Time Waste Sorting** – On-device classification at deposit stations
- **Predictive Waste Analytics** – Early warning systems for waste hotspots using AI
- **Multilingual & Accessible Hardware Interface** – Inclusive design for all users

---

## 👥 Team Bingage

| Name | Role |
|---|---|
| **Rudransh Joshi** | AI & Backend Engineer |
| **Uttam Tiwari** | System Tester & Validator |
| **Manish Singh Bisht** | Frontend Developer |

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** – see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>🌍 Transform Your Waste. Transform The Planet.</strong><br/>
</p>
