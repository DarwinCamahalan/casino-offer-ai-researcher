# 🎰 Casino Offer AI Researcher# 🎰 Casino Offer AI Researcher



An intelligent AI research assistant that identifies missing casinos and better promotional offers across **New Jersey (NJ), Michigan (MI), Pennsylvania (PA), and West Virginia (WV)** using GPT-4 and official regulatory sources.An intelligent AI research assistant that identifies missing casinos and better promotional offers across **New Jersey (NJ), Michigan (MI), Pennsylvania (PA), and West Virginia (WV)** using GPT-4 and official regulatory sources.



![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)## 🎯 Overview

![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)

![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)This Next.js full-stack application uses OpenAI's GPT-4 to:

![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?logo=openai)

1. **Discover Missing Casinos** - Find licensed/operational casinos not yet tracked in your database

## 🎯 Overview2. **Research Promotional Offers** - Identify current casino promotions and bonuses

3. **Compare Offers** - Analyze discovered offers vs. existing offers to find better deals

This Next.js full-stack application uses OpenAI's GPT-4 to:4. **Generate Reports** - Produce clean, structured JSON reports for easy integration



1. **Discover Missing Casinos** - Find licensed/operational casinos not yet tracked in your database**Key Features:**

2. **Research Promotional Offers** - Identify current casino promotions and bonuses- ✨ AI-powered research (no traditional web scraping)

3. **Compare Offers** - Analyze discovered offers vs. existing offers to find better deals- 🏛️ Prioritizes official sources (state gaming commissions)

4. **Generate Reports** - Produce clean, structured JSON reports for easy integration- 🎯 Casino-only focus (excludes sports betting)

- ⚡ Fast, efficient API-based architecture

**Key Features:**- 📊 Beautiful, responsive dashboard UI

- ✨ AI-powered research (no traditional web scraping)- ⏰ Optional scheduled/cron job execution

- 🏛️ Prioritizes official sources (state gaming commissions)

- 🎯 Casino-only focus (excludes sports betting)---

- ⚡ Fast, efficient API-based architecture

- 📊 Beautiful, responsive dashboard UI with shadcn/ui## 📋 Table of Contents

- 🔄 React Query for data fetching

- 💾 Zustand for state management- [Tech Stack](#-tech-stack)

- [Project Structure](#-project-structure)

---- [Prerequisites](#-prerequisites)

- [Installation](#-installation)

## 🛠️ Tech Stack- [Configuration](#-configuration)

- [Running the Application](#-running-the-application)

- **Framework:** Next.js 14 (App Router)- [API Documentation](#-api-documentation)

- **Language:** TypeScript 5.4- [Usage Guide](#-usage-guide)

- **AI Model:** OpenAI GPT-4 (gpt-4o)- [Scheduling](#-scheduling)

- **Styling:** Tailwind CSS + shadcn/ui- [Architecture](#-architecture)

- **UI Components:** Radix UI primitives- [Evaluation Criteria](#-evaluation-criteria)

- **State Management:** Zustand- [Limitations](#-limitations)

- **Data Fetching:** React Query (@tanstack/react-query)

- **Icons:** Lucide React---

- **API Integration:** Xano API

- **Deployment:** Vercel## 🛠️ Tech Stack



---- **Framework:** Next.js 14 (Full Stack)

- **Language:** TypeScript

## 📋 Prerequisites- **AI Model:** OpenAI GPT-4 (gpt-4o)

- **Styling:** Tailwind CSS

Before you begin, ensure you have the following installed:- **API Calls:** Axios

- **Scheduling:** node-cron

- **Node.js** 18.x or higher- **Data Source:** Xano API

- **npm** or **yarn**

- **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/api-keys)---



---## 📁 Project Structure



## 🚀 Installation```

casino-offer-ai-researcher/

1. **Clone the repository**├── pages/

│   ├── api/

```bash│   │   ├── ai/

git clone https://github.com/DarwinCamahalan/casino-offer-ai-researcher.git│   │   │   └── research.ts        # Main AI research endpoint

cd casino-offer-ai-researcher│   │   ├── offers/

```│   │   │   └── existing.ts        # Fetch existing offers

│   │   └── scheduler/

2. **Install dependencies**│   │       └── config.ts          # Scheduler configuration

│   ├── _app.tsx                   # Next.js app wrapper

```bash│   └── index.tsx                  # Main dashboard page

npm install├── components/

```│   ├── ResearchForm.tsx           # Research configuration form

│   └── ResearchResults.tsx        # Results display component

3. **Set up environment variables**├── services/

│   ├── aiResearchService.ts       # AI research logic

Create a `.env.local` file in the root directory:│   ├── xanoService.ts             # Xano API integration

│   ├── comparisonService.ts       # Offer comparison logic

```bash│   └── schedulerService.ts        # Cron job scheduler

cp .env.example .env.local├── types/

```│   └── index.ts                   # TypeScript type definitions

├── styles/

Add your OpenAI API key:│   └── globals.css                # Global styles

├── .env.example                   # Environment variables template

```env├── package.json

OPENAI_API_KEY=your-openai-api-key-here├── tsconfig.json

```├── tailwind.config.js

└── next.config.js

---```



## ▶️ Running the Application---



### Development Mode## ✅ Prerequisites



```bash- **Node.js** >= 18.0.0

npm run dev- **npm** or **yarn**

```- **OpenAI API Key** (with GPT-4 access)

- Internet connection (for AI research)

The application will be available at [http://localhost:3000](http://localhost:3000)

---

### Production Build

## 📦 Installation

```bash

npm run build### 1. Clone the Repository

npm start

``````bash

git clone <your-repo-url>

### Type Checkingcd casino-offer-ai-researcher

```

```bash

npm run type-check### 2. Install Dependencies

```

```bash

### Lintingnpm install

```

```bash

npm run lint### 3. Set Up Environment Variables

```

Create a `.env` file in the root directory:

---

```bash

## 📖 Usage Guidecp .env.example .env

```

1. **Start the Application**

   - Navigate to `http://localhost:3000`Edit `.env` and add your OpenAI API key:

   - You'll see the main dashboard

```env

2. **Select States**OPENAI_API_KEY=sk-your-openai-api-key-here

   - Check the states you want to research (NJ, MI, PA, WV)XANO_API_URL=https://xhks-nxia-vlqr.n7c.xano.io/api:1ZwRS-f0/activeSUB

   - At least one state must be selectedNODE_ENV=development

```

3. **Start Research**

   - Click the "Start Research" button---

   - The AI will begin researching casinos and offers

## ⚙️ Configuration

4. **View Results**

   - Results will display on the dedicated results page### OpenAI API Key

   - See missing casinos, better offers, and new casino offers

   - Review confidence scores and detailed comparisonsGet your API key from [OpenAI Platform](https://platform.openai.com/api-keys).



---**Important:** Ensure your account has access to **GPT-4** (specifically `gpt-4o` model).



## 🏗️ Project Structure### Xano API



```The application fetches existing offers from:

casino-offer-ai-researcher/```

├── app/                      # Next.js 14 App Routerhttps://xhks-nxia-vlqr.n7c.xano.io/api:1ZwRS-f0/activeSUB

│   ├── api/                  # API routes```

│   │   └── ai/

│   │       └── research/     # AI research endpointIf you need to change this, update the `XANO_API_URL` in your `.env` file.

│   ├── results/              # Results page

│   ├── layout.tsx            # Root layout---

│   └── page.tsx              # Main dashboard

├── components/               # React components## 🚀 Running the Application

│   ├── ui/                   # shadcn/ui components

│   ├── Footer.tsx            # Footer component### Development Mode

│   ├── ResearchForm.tsx      # Research form

│   └── ResearchResults.tsx   # Results display```bash

├── lib/                      # Utilities and servicesnpm run dev

│   ├── providers/            # React providers```

│   ├── services/             # Business logic

│   │   ├── aiService.ts      # OpenAI integrationThe application will be available at: **http://localhost:3000**

│   │   ├── comparisonService.ts

│   │   └── xanoService.ts    # Xano API integration### Production Build

│   ├── store/                # Zustand stores

│   └── utils.ts              # Helper functions```bash

├── types/                    # TypeScript typesnpm run build

├── public/                   # Static assetsnpm start

└── styles/                   # Global styles```

```

### Type Checking

---

```bash

## 🔌 API Documentationnpm run type-check

```

### POST /api/ai/research

---

Research casinos and offers for specified states.

## 📡 API Documentation

**Request Body:**

```json### 1. **POST /api/ai/research**

{

  "states": ["NJ", "MI", "PA", "WV"]Main endpoint for AI-powered research.

}

```**Request Body:**

```json

**Response:**{

```json  "states": ["NJ", "MI", "PA", "WV"],

{  "include_casino_discovery": true,

  "missing_casinos": {  "include_offer_research": true,

    "NJ": [...],  "force_refresh": false

    "MI": [...]}

  },```

  "offer_comparisons": [...],

  "new_offers": [...],**Response:**

  "limitations": [...],```json

  "timestamp": "2025-10-17T...",{

  "execution_time_ms": 15420,  "success": true,

  "api_calls_made": 8  "data": {

}    "timestamp": "2024-10-17T12:00:00.000Z",

```    "missing_casinos": {

      "NJ": [

---        {

          "name": "Golden Palace Casino",

## 🚢 Deployment          "state": "NJ",

          "is_operational": true,

### Vercel (Recommended)          "website": "https://goldenpalace.com"

        }

1. Push your code to GitHub      ],

2. Import project in [Vercel](https://vercel.com)      "MI": [],

3. Add environment variables in Vercel dashboard      "PA": [],

4. Deploy!      "WV": []

    },

```bash    "offer_comparisons": [

vercel      {

```        "casino": "Borgata Online Casino",

        "state": "NJ",

### Environment Variables for Production        "current_offer": "$50 free play + 100% up to $1000",

        "discovered_offer": "$100 free play + 100% up to $1200",

Set these in your Vercel dashboard or hosting platform:        "is_better": true,

        "is_new": false,

- `OPENAI_API_KEY` - Your OpenAI API key        "difference_notes": "Higher bonus amount: $100 vs $50",

        "confidence_score": 90

---      }

    ],

## ⚠️ Limitations    "new_offers": [],

    "limitations": [

- AI-generated data may not be 100% accurate      "Promotional offers change frequently and should be verified regularly"

- Requires active OpenAI API access    ],

- Rate limits apply based on your OpenAI plan    "execution_time_ms": 45000,

- Real-time casino data depends on public availability    "api_calls_made": 12

- Some casinos may not have publicly listed offers  }

}

---```



## 📝 License### 2. **GET /api/offers/existing**



MIT License - See LICENSE file for detailsFetch existing offers from Xano API.



---**Response:**

```json

## 👨‍💻 Developer{

  "success": true,

**Darwin Camahalan**  "data": {

    "offers": [...],

- 📧 Email: [camahalandarwin@gmail.com](mailto:camahalandarwin@gmail.com)    "casinos": [...]

- 📱 Phone: +63 9754270609  }

- 💼 LinkedIn: [linkedin.com/in/darwincamahalan](https://www.linkedin.com/in/darwincamahalan/)}

- 🐙 GitHub: [github.com/DarwinCamahalan](https://github.com/DarwinCamahalan)```



---### 3. **POST /api/scheduler/config**



## 🙏 AcknowledgmentsConfigure scheduled research.



- OpenAI for GPT-4 API**Request Body:**

- Vercel for Next.js and hosting```json

- shadcn/ui for beautiful components{

- Radix UI for accessible primitives  "enabled": true,

  "cron_expression": "0 9 * * *",

---  "include_casino_discovery": true,

  "include_offer_research": true

**Built with ❤️ by Darwin Camahalan**}

```

### 4. **GET /api/scheduler/config**

Check scheduler status.

### 5. **DELETE /api/scheduler/config**

Stop scheduled research.

---

## 🎮 Usage Guide

### Web Dashboard

1. **Open the Application**
   Navigate to `http://localhost:3000`

2. **Configure Research**
   - Select states to research (NJ, MI, PA, WV)
   - Choose options:
     - ✅ Discover Missing Casinos
     - ✅ Research Promotional Offers

3. **Start Research**
   Click "🚀 Start AI Research"

4. **View Results**
   - Missing casinos by state
   - Better promotional offers
   - New casino offers
   - Limitations and notes

### Programmatic Usage

```typescript
// Make a direct API call
const response = await fetch('/api/ai/research', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    states: ['NJ', 'PA'],
    include_casino_discovery: true,
    include_offer_research: true,
  })
});

const result = await response.json();
console.log(result.data);
```

---

## ⏰ Scheduling

### Enable Scheduled Research

Configure the scheduler to run research periodically:

```typescript
// Example: Daily at 9 AM
POST /api/scheduler/config
{
  "enabled": true,
  "cron_expression": "0 9 * * *",
  "include_casino_discovery": true,
  "include_offer_research": true
}
```

### Cron Expression Examples

- `0 9 * * *` - Daily at 9:00 AM
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 1` - Every Monday at midnight
- `*/30 * * * *` - Every 30 minutes

### Check Scheduler Status

```bash
GET /api/scheduler/config
```

### Stop Scheduler

```bash
DELETE /api/scheduler/config
```

---

## 🏗️ Architecture

### Research Flow

1. **Fetch Existing Data** - Get current offers from Xano API
2. **AI Discovery** - Use GPT-4 to discover casinos via official sources
3. **Offer Research** - GPT-4 researches promotional offers for each casino
4. **Comparison** - Compare discovered data with existing data
5. **Report Generation** - Generate structured JSON report

### AI Prompting Strategy

- **Casino Discovery:** Queries state gaming commission websites
- **Offer Research:** Searches official casino websites for promotions
- **Temperature:** 0.3 (lower = more factual)
- **Output Format:** Structured JSON for easy parsing

### Rate Limiting

- Implements delays between API calls (1 second)
- Batches offer research (3 concurrent requests)
- Respects OpenAI rate limits

---

## 🎓 Evaluation Criteria

This project demonstrates:

1. **Problem-Solving & Reasoning**
   - Intelligent AI prompt engineering
   - Multi-step research orchestration
   - Smart comparison algorithms

2. **Effective AI Integration**
   - GPT-4 for web research (no scraping)
   - Structured output parsing
   - Context-aware prompts

3. **Clean, Structured Output**
   - Type-safe TypeScript
   - Well-documented JSON responses
   - Human-readable reports

4. **Practical Performance**
   - Rate limit handling
   - Error recovery
   - Execution time tracking

5. **Readable & Maintainable Code**
   - Modular service layer
   - Clear separation of concerns
   - Comprehensive documentation

---

## ⚠️ Limitations

1. **Data Accuracy**
   - AI research depends on publicly available information
   - Promotional offers change frequently
   - Some casinos may have incomplete data

2. **Rate Limits**
   - OpenAI API rate limits apply
   - Research time scales with number of states/casinos
   - Typical execution: 1-3 minutes for all 4 states

3. **Cost Considerations**
   - GPT-4 API calls have associated costs
   - Recommend monitoring OpenAI usage

4. **Verification Required**
   - Always verify critical information from official sources
   - Use AI results as research starting points

---

## 🤝 Contributing

This is an evaluation project. For questions or suggestions, please reach out to the project maintainer.

---

## 📄 License

This project is created for evaluation purposes.

---

## 🔗 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Xano API](https://xhks-nxia-vlqr.n7c.xano.io/api:1ZwRS-f0/activeSUB)

**State Gaming Commissions:**
- [NJ Division of Gaming Enforcement](https://www.nj.gov/oag/ge/)
- [Michigan Gaming Control Board](https://www.michigan.gov/mgcb)
- [Pennsylvania Gaming Control Board](https://gamingcontrolboard.pa.gov/)
- [West Virginia Lottery Commission](https://www.wvlottery.com/)

---

**Built with ❤️ using Next.js, TypeScript, and OpenAI GPT-4**
An AI Reseacher that seaches relevant Casino Offers
