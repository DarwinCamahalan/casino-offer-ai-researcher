# 🎰 Casino Offer AI Researcher

> An intelligent AI-powered research system for discovering casino information and promotional offers across US regulated markets (NJ, MI, PA, WV).

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![GPT-4o](https://img.shields.io/badge/Powered%20by-GPT--4o-412991?logo=openai)](https://openai.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

---

## Screenshots

<div align="center">
  <table>
    <tr>
      <td width="33%">
        <img width="1140" height="1480" alt="Dashboard Analytics" src="https://github.com/user-attachments/assets/04302703-695e-41c3-94d9-e21ffb6ac5cd" />
      </td>
      <td width="33%">
        <img width="1140" height="966" alt="Research Configuration" src="https://github.com/user-attachments/assets/be946bd9-d3ff-48ac-b77d-0e8ae3a82650" />
      </td>
      <td width="33%">
        <img width="1140" height="835" alt="Research Progress" src="https://github.com/user-attachments/assets/e508d66c-eea7-4963-a172-49d939393d82" />
      </td>
    </tr>
    <tr>
      <td width="33%">
        <img width="567" height="307" alt="Results Section Navigation" src="https://github.com/user-attachments/assets/6a2c79a2-0776-4f16-a450-dcad91baa931" />
      </td>
      <td width="33%">
        <img width="567" height="307" alt="Export Options" src="https://github.com/user-attachments/assets/53c64b3b-6af8-41f1-b187-e6b5150399fe" />
      </td>
      <td width="33%">
        <img width="1140" height="735" alt="Results Display" src="https://github.com/user-attachments/assets/5537c9ef-40b2-45f9-b6a3-d508cfeb0ac8" />
      </td>
    </tr>
  </table>
</div>


---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#-project-structure)
- [User Interface](#-user-interface)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [How It Works](#-how-it-works)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Deployment](#-deployment)
- [Recent Updates](#-recent-updates)
- [Limitations & Considerations](#-limitations--considerations)

---

## 🌟 Overview

Casino Offer AI Researcher is an intelligent research tool that helps identify gaps in casino coverage and find better promotional offers using AI-powered research. Instead of traditional web scraping, it leverages GPT-4o to intelligently analyze publicly available information from official sources.

### What It Does

1. **Casino Discovery**: Identifies licensed/operational casinos in NJ, MI, PA, and WV using AI research
2. **Promotional Research**: Discovers current casino promotional offers for both existing and new casinos
3. **Smart Comparison**: Compares discovered offers with existing database AND all historical research data
4. **Clean Reporting**: Presents findings in an easy-to-review, actionable format with section navigation

### Project Context

This is a proof-of-concept demonstrating effective AI integration for intelligent research and analysis, focusing on:
- AI-first approach (not traditional web scraping)
- Working with publicly accessible information
- Clean code architecture and maintainability
- Practical considerations (costs, rate limits, accuracy)

---

## ✨ Key Features

### 🔍 **Smart Casino Discovery**
- AI-powered identification of licensed casinos
- Prioritizes official state gaming commission sources
- Compares against existing Xano database
- Flags casinos NOT currently tracked
- Provides website URLs, license numbers, operational status

### 🎁 **Promotional Offer Intelligence**
- Researches current CASINO promotions (excludes sports betting)
- Extracts: bonus amounts, match percentages, wagering requirements, promo codes
- Works for both existing and newly discovered casinos
- Identifies genuinely superior offers

### 📊 **Intelligent Comparisons**
- Side-by-side comparison of current vs. discovered offers
- **Enhanced**: Now compares against BOTH Xano database AND all historical research
- Highlights better bonuses, improved terms, lower wagering
- Confidence scores for reliability assessment
- Shows alternative offers when uncertain

### 💻 **Modern Dashboard**
- Real-time research progress tracking with accurate completion estimates
- Interactive analytics with charts and trends
- Cumulative statistics across all research sessions
- **Export**: Download results as JSON or CSV
- **Section Navigation**: Quick jump to Missing Casinos, New Offers, or Comparisons
- **Latest Badge**: Visual indicator for most recent research results
- Dark/light theme support

### ⚡ **Advanced Capabilities**
- **Duplicate Prevention**: Tracks researched casinos to avoid rediscovery
- **Batch Processing**: Handles multiple states/casinos with rate limiting
- **Historical Tracking**: Complete research history with timestamp tracking
- **Smart Search**: Debounced database search with instant filtering
- **Data Persistence**: localStorage for results, history, and exclusions

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [Next.js 14.2](https://nextjs.org) (App Router)
- **Language**: [TypeScript 5.4](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com) + Custom Components
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Charts**: [Apache ECharts](https://echarts.apache.org)
- **Icons**: [Lucide React](https://lucide.dev)

### Backend
- **Runtime**: [Node.js 18+](https://nodejs.org)
- **API Routes**: Next.js API Routes (serverless)
- **AI Service**: [OpenAI GPT-4o](https://openai.com)
- **Database**: [Xano](https://xano.io) (existing offers API)

### State Management
- **Global State**: [Zustand](https://zustand-demo.pmnd.rs)
- **Data Persistence**: localStorage (browser-based)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript strict mode
- **Code Formatting**: Prettier (via ESLint)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.0 or higher ([Download](https://nodejs.org))
- **npm**: Version 9.0 or higher (comes with Node.js)
- **Git**: For cloning the repository
- **OpenAI API Key**: [Get one here](https://platform.openai.com/api-keys)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/DarwinCamahalan/casino-offer-ai-researcher.git
cd casino-offer-ai-researcher
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys (see [Environment Variables](#environment-variables) section below).

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenAI API Configuration
# Required: Your OpenAI API key for GPT-4o
# Get your key at: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Xano API Configuration
# Required: Base URL for the Xano API (existing offers database)
# Default provided below
XANO_API_BASE_URL=https://xhks-nxia-vlqr.n7c.xano.io/api:1ZwRS-f0

# Optional: Node Environment
NODE_ENV=development
```

#### Environment Variable Details

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key for GPT-4o access | `sk-proj-abc123...` |
| `XANO_API_BASE_URL` | ✅ Yes | Xano API base URL for existing offers | `https://xhks-nxia-vlqr.n7c.xano.io/api:1ZwRS-f0` |
| `NODE_ENV` | ⬜ Optional | Environment mode | `development` or `production` |

#### Getting API Keys

**OpenAI API Key:**
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key and add to `.env.local`

**Xano API:**
- Already provided in the project requirements
- No authentication required for this endpoint

---

## 🎨 User Interface

### Dashboard (Homepage)
- **Quick Stats Panel**: Shows States Covered, Active Offers, and Total Casinos with "Latest" indicator
- **Interactive Analytics**: ECharts visualizations for research trends
- **Theme Toggle**: Switch between light and dark modes
- **Responsive Sidebar**: Collapsible navigation for mobile devices

### Research Page
- **State Selection**: Multi-select checkboxes for NJ, MI, PA, WV
- **Real-time Progress**: 
  - 4-stage progress tracker (Discovering → Researching → Comparing → Finalizing)
  - Accurate percentage completion (0% → 98%)
  - Live time estimates based on actual progress
  - Current operation indicator
- **Smart Loading**: Prevents premature completion display

### Results Page
- **Section Navigation**: Sticky navigation bar with quick jump buttons
  - 🏢 Missing Casinos
  - 🎁 New Offers  
  - 📈 Comparisons
- **Export Options**: 
  - Download as CSV (for spreadsheets)
  - Download as JSON (for data processing)
- **Status Indicator**: "Latest" badge for current results, timestamp for historical
- **Gradient Design**: Purple-to-blue gradient matching project theme

### Database Page
- **Live Search**: Debounced search with instant filtering (300ms delay)
- **Offer Cards**: Clean 2-column grid layout
- **Casino Details**: Name, bonus info, wagering requirements, promo codes
- **State Badges**: Color-coded state indicators

### History Page
- **Timeline View**: All past research sessions with timestamps
- **Quick Access**: Click any session to view detailed results
- **Session Info**: Shows discovery counts for each research run

### Features Across All Pages
- **Smooth Animations**: Framer Motion transitions
- **Frosted Glass Effects**: Modern backdrop blur styling
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Keyboard navigation and screen reader support

---

## 📁 Project Structure

```
casino-offer-ai-researcher/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Homepage (Dashboard/Analytics)
│   ├── _components/             # Shared components
│   │   ├── DashboardStats.tsx   # Analytics dashboard with charts
│   │   ├── Footer.tsx           # Footer component
│   │   ├── ResearchForm.tsx     # Research configuration form
│   │   ├── ResearchLoading.tsx  # Progress tracking component
│   │   ├── ResearchResults.tsx  # Results display component
│   │   └── Sidebar.tsx          # Navigation sidebar
│   ├── analytics/               # Analytics page
│   │   └── page.tsx
│   ├── api/                     # API Routes (Backend)
│   │   ├── ai/
│   │   │   └── research/
│   │   │       └── route.ts     # Main AI research endpoint
│   │   ├── offers/
│   │   │   └── existing/
│   │   │       └── route.ts     # Fetch existing offers from Xano
│   │   └── scheduler/
│   │       └── config/
│   │           └── route.ts     # Scheduler configuration endpoint
│   ├── research/                # Research execution page
│   │   └── page.tsx
│   └── results/                 # Results display page
│       └── page.tsx
├── components/                   # Reusable UI Components
│   ├── index.ts
│   ├── ResearchResults.tsx      # Exported results component
│   └── ui/                      # shadcn/ui components
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── label.tsx
│       └── separator.tsx
├── lib/                         # Core Business Logic
│   ├── index.ts
│   ├── utils.ts                 # Utility functions
│   ├── providers/               # React Context Providers
│   │   ├── react-query-provider.tsx
│   │   └── theme-provider.tsx
│   ├── services/                # Service Layer (API integrations)
│   │   ├── aiResearchService.ts      # OpenAI GPT-4o integration
│   │   ├── comparisonService.ts      # Offer comparison logic
│   │   ├── schedulerService.ts       # Scheduling utilities
│   │   └── xanoService.ts            # Xano API integration
│   └── store/                   # State Management
│       └── research-store.ts    # Zustand store for research state
├── public/                      # Static Assets
│   └── (images, fonts, etc.)
├── styles/                      # Global Styles
│   └── globals.css              # Tailwind + custom styles
├── types/                       # TypeScript Type Definitions
│   ├── index.ts                 # Central type exports
│   ├── api/
│   │   └── responses.ts         # API response types
│   └── casino/
│       ├── casino.ts            # Casino types
│       ├── offer.ts             # Offer types
│       └── states.ts            # US state types & constants
├── .env.local                   # Environment variables (create this)
├── .env.example                 # Environment template
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── components.json             # shadcn/ui configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies & scripts
├── postcss.config.js           # PostCSS configuration
├── README.md                   # This file
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── vercel.json                 # Vercel deployment config
```

### Key Directories Explained

#### `/app` - Next.js App Router
- **Layout & Pages**: Server and client components
- **API Routes**: Backend serverless functions
- **Component Organization**: Page-specific components in `_components`

#### `/lib` - Business Logic
- **Services**: External API integrations (OpenAI, Xano)
- **Providers**: React context providers for theme, queries
- **Store**: Zustand state management
- **Utils**: Helper functions (cn, formatters, validators)

#### `/types` - Type Safety
- **Centralized Types**: All TypeScript interfaces and types
- **API Types**: Request/response shapes
- **Domain Types**: Casino, Offer, State models

#### `/components` - UI Components
- **shadcn/ui**: Radix UI-based components
- **Custom Components**: Reusable UI elements

---

## 📡 API Documentation

### External APIs

#### 1. Xano API (Existing Offers Database)

**Endpoint**: `https://xhks-nxia-vlqr.n7c.xano.io/api:1ZwRS-f0/activeSUB`

**Method**: `GET`

**Description**: Retrieves existing promotional offers from the Xano database.

**Response Structure**:
```typescript
interface XanoOffer {
  id: number
  casino_name?: string
  state?: string
  offer_title?: string
  offer_description?: string
  bonus_amount?: string
  match_percentage?: string
  wagering_requirements?: string
  promo_code?: string
  [key: string]: any
}
```

**Usage**:
```typescript
import { fetchExistingOffers } from '@/lib/services/xanoService'

const offers = await fetchExistingOffers()
```

#### 2. OpenAI API (GPT-4o)

**Endpoint**: `https://api.openai.com/v1/chat/completions`

**Model**: `gpt-4o`

**Description**: AI-powered research for casino discovery and promotional offers.

**Usage**:
```typescript
import { discoverCasinosInState, researchCasinoOffers } from '@/lib/services/aiResearchService'

// Discover casinos
const casinos = await discoverCasinosInState('NJ', excludedWebsites)

// Research offers
const offers = await researchCasinoOffers(casinoName, state, website)
```

### Internal API Routes

#### 1. Research Endpoint

**URL**: `/api/ai/research`

**Method**: `POST`

**Description**: Main endpoint for executing AI-powered research.

**Request Body**:
```typescript
{
  states: ['NJ', 'MI', 'PA', 'WV'],           // States to research
  include_casino_discovery?: boolean,          // Default: true
  include_offer_research?: boolean,            // Default: true
  exclude_casino_websites?: string[]           // Websites to exclude
}
```

**Response**:
```typescript
{
  success: boolean,
  data?: {
    timestamp: string,
    missing_casinos: {
      NJ: Casino[],
      MI: Casino[],
      PA: Casino[],
      WV: Casino[]
    },
    offer_comparisons: OfferComparison[],
    new_offers: PromotionalOffer[],
    limitations: string[],
    execution_time_ms: number,
    api_calls_made: number
  },
  error?: {
    error: string,
    message: string
  }
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/ai/research \
  -H "Content-Type: application/json" \
  -d '{
    "states": ["NJ"],
    "include_casino_discovery": true,
    "include_offer_research": true
  }'
```

#### 2. Existing Offers Endpoint

**URL**: `/api/offers/existing`

**Method**: `GET`

**Description**: Fetches existing offers from Xano (proxied through Next.js).

**Response**:
```typescript
{
  success: boolean,
  data?: PromotionalOffer[],
  error?: string
}
```

#### 3. Scheduler Configuration

**URL**: `/api/scheduler/config`

**Method**: `GET`, `POST`

**Description**: Configure automated research scheduling.

**GET Response**:
```typescript
{
  enabled: boolean,
  schedule: string,  // Cron expression
  states: string[],
  options: {
    include_casino_discovery: boolean,
    include_offer_research: boolean
  }
}
```

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  (Next.js App Router - React Components + Tailwind CSS)     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Backend)                      │
│               /api/ai/research (Main Endpoint)               │
└─────┬──────────────────────────────────────────────────┬────┘
      │                                                    │
      ▼                                                    ▼
┌──────────────────────┐                        ┌──────────────────┐
│  Service Layer       │                        │  Service Layer   │
│  aiResearchService   │                        │  xanoService     │
│  comparisonService   │                        │  (Data Fetch)    │
└──────┬───────────────┘                        └────────┬─────────┘
       │                                                  │
       ▼                                                  ▼
┌──────────────────────┐                        ┌──────────────────┐
│  OpenAI GPT-4o API   │                        │  Xano Database   │
│  (AI Research)       │                        │  (Existing Data) │
└──────────────────────┘                        └──────────────────┘
```

### Data Flow

1. **User Input** → Research Form (states, options)
2. **API Request** → `/api/ai/research` endpoint
3. **Data Fetching** → Xano API (existing offers)
4. **AI Research** → OpenAI GPT-4o (casino discovery, offer research)
5. **Comparison** → Compare discovered vs. existing data
6. **Response** → Structured results with analytics
7. **Display** → Results page with charts and cards
8. **Persistence** → localStorage (history, exclusions)

### Service Layer Architecture

```typescript
// lib/services/aiResearchService.ts
- discoverCasinosInState(state, excludeWebsites)
  → Calls OpenAI GPT-4o with research prompts
  → Returns: Casino[] with license info, websites

- researchCasinoOffers(casinoName, state, website)
  → Calls OpenAI GPT-4o with offer research prompts
  → Returns: PromotionalOffer[] with bonus details

- batchResearchOffers(casinos, concurrency)
  → Batch processes multiple casinos
  → Implements rate limiting (3 concurrent, 1s delay)

// lib/services/comparisonService.ts
- findMissingCasinos(discovered, existing)
  → Compares casino lists
  → Returns: Casino[] not in existing database

- compareOffers(discovered, existing)
  → Analyzes offer differences
  → Returns: OfferComparison[] with better/new flags

// lib/services/xanoService.ts
- fetchExistingOffers()
  → Fetches from Xano API
  → Returns: XanoOffer[]

- normalizeXanoOffers(xanoOffers)
  → Transforms Xano format to standard format
  → Returns: PromotionalOffer[]
```

---

## 🔄 How It Works

### Research Process (Step by Step)

#### Step 1: User Configuration
```
User selects:
- States to research (NJ, MI, PA, WV)
- Research options:
  ✓ Include Casino Discovery
  ✓ Include Offer Research
```

#### Step 2: Data Preparation
```typescript
1. Fetch existing offers from Xano API
2. Extract existing casinos from offers
3. Load excluded casino websites (duplicate prevention)
4. Prepare AI research request
```

#### Step 3: Casino Discovery (if enabled)
```typescript
For each selected state:
  1. AI researches licensed casinos
     - Uses official gaming commission sources
     - Extracts: name, website, license, status
  2. Filter out excluded casinos
  3. Compare with existing database
  4. Identify missing casinos
```

**AI Prompt Example**:
```
You are a research assistant specializing in US gaming regulations.

Task: Find ALL licensed and operational online casinos in New Jersey (NJ).

Research Requirements:
1. Focus on CASINO gaming licenses only (NOT sports betting)
2. Use official sources: New Jersey Division of Gaming Enforcement
3. Only include casinos with REAL, ACCESSIBLE websites
4. EXCLUDE these casinos (already researched):
   - https://borgataonline.com
   - https://goldennuggetcasino.com

Output Format: Return ONLY valid JSON array...
```

#### Step 4: Promotional Research (if enabled)
```typescript
For each casino (existing + newly discovered):
  1. AI researches current promotions
     - Welcome bonuses, deposit bonuses, free spins
     - Excludes sports betting promotions
  2. Extracts offer details:
     - Bonus amount, match %, wagering, promo code
  3. Stores with source URL and verification date
```

#### Step 5: Comparison & Analysis
```typescript
1. Compare discovered offers with existing offers
   - Match by casino name + state
   - Analyze: bonus amounts, match %, wagering
2. Identify better offers:
   - Higher bonus amounts → "Better"
   - Higher match percentages → "Better"
   - Lower wagering requirements → "Better"
3. Calculate confidence scores
4. Generate difference notes
```

#### Step 6: Results Compilation
```typescript
Results = {
  missing_casinos: { NJ: [...], MI: [...], PA: [...], WV: [...] },
  offer_comparisons: [
    {
      casino: "Borgata Online Casino",
      state: "NJ",
      current_offer: "Your existing offer",
      discovered_offer: "Better offer found",
      is_better: true,
      confidence_score: 90
    }
  ],
  new_offers: [...],
  limitations: [...],
  execution_time_ms: 45000,
  api_calls_made: 12
}
```

#### Step 7: Display & Persistence
```typescript
1. Show results on /results page
2. Save to localStorage:
   - research_results (latest)
   - research_history (all sessions)
   - researched_casinos (exclusion list)
3. Update dashboard analytics
4. Enable JSON export
```

### Rate Limiting Strategy

```typescript
// Batch processing with concurrency control
const concurrency = 3  // Max 3 simultaneous API calls

for (let i = 0; i < casinos.length; i += concurrency) {
  const batch = casinos.slice(i, i + concurrency)
  
  // Process batch in parallel
  await Promise.all(batch.map(casino => 
    researchCasinoOffers(casino.name, casino.state, casino.website)
  ))
  
  // Delay between batches
  if (i + concurrency < casinos.length) {
    await delay(1000)  // 1 second pause
  }
}
```

**Benefits**:
- Prevents OpenAI rate limit errors
- Reduces API costs
- Maintains reasonable execution time
- Allows progress tracking

---

## 📖 Usage Guide

### Running Your First Research

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Navigate to Research page**
   - Visit `http://localhost:3000/research`
   - Or click "New Research" from sidebar

3. **Configure your research**
   - Select states (e.g., New Jersey, Michigan, Pennsylvania)
   - Enable "Discover Missing Casinos"
   - Enable "Research Promotional Offers"
   - Click "Start AI Research"

4. **Monitor progress**
   - Watch real-time progress tracking with 4 stages:
     - 🔍 **Discovering Casinos** - Finding licensed casinos per state
     - 🎰 **Researching Offers** - Gathering promotional details
     - 📊 **Comparing Results** - Analyzing against database + history
     - ✅ **Finalizing** - Preparing results
   - Progress reaches 98% with accurate time estimates
   - Shows current operation and estimated completion time

5. **Review results**
   - Automatically redirected to `/results`
   - **"Latest" badge** indicates you're viewing most recent research
   - Use **Section Navigation** bar to jump between:
     - 🏢 Missing Casinos
     - 🎁 New Offers
     - 📈 Comparisons

6. **Export data**
   - **CSV**: Download as spreadsheet (includes all categories)
   - **JSON**: Download for programmatic processing
   - Both buttons available in section navigation bar

### Understanding Results

#### Missing Casinos Section
```
Shows casinos NOT in your Xano database:
- Casino name
- State with color-coded badge
- Website URL (clickable)
- License number (if available)
- Operational status
- Source of information
```

#### Offer Comparisons Section
```
Side-by-side comparison (checks database + historical research):
- Your Offer: What's in Xano database OR previous research
- Discovered Offer: What AI found this session
- Badge: "Better Offer" if discovered is superior
- Difference Notes: Detailed explanation of improvements
- Confidence Score: Reliability (0-100%)
```

#### New Promotional Offers Section
```
All discovered offers:
- Offer title and description
- Casino name and state
- Bonus amount (e.g., $1000)
- Match percentage (e.g., 100%)
- Wagering requirements
- Promo code
- Website link
- Verification date
```

### Dashboard Analytics

Navigate to homepage (`/`) to see:
- **Quick Stats** (Sidebar): Shows "Latest" badge with:
  - States Covered
  - Active Offers
  - Total Casinos
- **Total Unique Casinos**: Cumulative across all sessions
- **Total Offers Found**: Sum of all discovered offers
- **Research Sessions**: Count of completed research runs
- **Cumulative Growth Chart**: Per-session vs. cumulative totals
- **State Distribution**: Casinos and offers by state
- **Offer Type Breakdown**: Pie chart of promotional categories

### Database Page

Access via "View Database" button in results page:
- **Search**: Type to filter offers instantly (300ms debounce)
- **Offer Cards**: Clean 2-column layout with:
  - Casino name
  - Bonus details
  - Wagering requirements
  - Promo codes
  - State badges
- Smooth animations with Framer Motion

### History Page

View all past research sessions:
- Click "History" in sidebar
- See timeline of all research runs
- Each entry shows:
  - Timestamp
  - States researched
  - Discovery counts
- Click any session to view full results

### Managing Researched Casinos

**Duplicate Prevention**:
- System tracks all researched casino websites
- Future research excludes these casinos
- Prevents wasting API calls on rediscovery

**Reset All Data**:
1. Go to `/research` page
2. Scroll to bottom (if exclusion count > 0)
3. Click "Reset All" button
4. Confirm in modal
5. Clears: researched casinos, history, analytics

---

## 👨‍💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type Checking
npx tsc --noEmit     # Check TypeScript types
```

### Adding New Features

#### Add a New AI Research Function

1. **Create function in service**
   ```typescript
   // lib/services/aiResearchService.ts
   export async function researchNewFeature(param: string) {
     const response = await openai.chat.completions.create({
       model: 'gpt-4o',
       messages: [/* prompts */],
       temperature: 0.3
     })
     // Process and return
   }
   ```

2. **Add to API route**
   ```typescript
   // app/api/ai/research/route.ts
   const newData = await researchNewFeature(param)
   ```

3. **Update types**
   ```typescript
   // types/api/responses.ts
   export interface ResearchResult {
     // Add new field
     new_feature_data?: NewFeatureType[]
   }
   ```

4. **Display in UI**
   ```tsx
   // app/_components/ResearchResults.tsx
   {results.new_feature_data && (
     <Card>/* Display */</Card>
   )}
   ```

### Code Quality Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Comments**: JSDoc for functions, inline for complex logic
- **File Structure**: One component per file, index.ts for exports
- **Error Handling**: Try-catch blocks with proper error messages
- **Logging**: console.log for development, remove in production

---

## 🆕 Recent Updates

### Version 2.0 - Enhanced Research & UI (October 2025)

#### Research Improvements
- **Historical Comparison**: Offer comparisons now check against BOTH Xano database AND all previous research data
- **Accurate Progress**: Research loading now reaches 98% with precise time estimates
- **Step Timing**: Improved duration calculations for each research phase

#### UI/UX Enhancements
- **Section Navigation**: Added sticky quick-jump navigation bar with gradient styling
  - Quick access to Missing Casinos, New Offers, and Comparisons sections
  - Smooth scroll animation with offset for fixed headers
- **Export Formats**: 
  - CSV export for spreadsheet analysis
  - JSON export for programmatic processing
- **Latest Indicators**: Green "Latest" badges on:
  - Sidebar Quick Stats
  - Results page header (replacing date/time for current results)
- **Visual Improvements**:
  - Gradient background on section jumper (purple-to-blue theme)
  - Frosted glass effects with backdrop blur
  - Consolidated action buttons in navigation bar

#### Performance Optimizations
- **Search Debouncing**: Database search now uses 300ms debounce to prevent lag
- **Animation Fixes**: Removed staggered delays that caused duplicate results display
- **Grid Layout**: Changed database cards from 3 to 2 columns for better readability

#### Navigation Updates
- Removed database link from sidebar
- Added database access button in results page
- Improved routing between pages
- Better breadcrumb navigation

#### Code Quality
- Added comprehensive TypeScript types for all features
- Improved component modularity
- Better state management with React hooks
- Enhanced error handling and loading states

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - Add `OPENAI_API_KEY`
   - Add `XANO_API_BASE_URL`

4. **Deploy**
   - Vercel automatically builds and deploys
   - Get live URL (e.g., `https://your-project.vercel.app`)

### Deploy Elsewhere

**Build for production**:
```bash
npm run build
npm run start
```

**Environment Requirements**:
- Node.js 18+ runtime
- Environment variables set
- Port 3000 available (or configure with `PORT` env var)

### Scheduled Research (Optional)

**Using Vercel Cron**:

1. Add to `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/ai/research",
       "schedule": "0 9 * * *"  // Daily at 9 AM
     }]
   }
   ```

2. Configure default research parameters in API route

**Using External Cron**:
```bash
# Crontab example (daily at 9 AM)
0 9 * * * curl -X POST https://your-app.vercel.app/api/ai/research \
  -H "Content-Type: application/json" \
  -d '{"states":["NJ","MI","PA","WV"]}'
```

---

## ⚠️ Limitations & Considerations

### AI Research Limitations

**Accuracy**:
- ✓ AI provides intelligent analysis but may hallucinate
- ✓ Not all casinos or offers may be found
- ✓ License numbers may not always be accurate
- ✓ Promotional details change frequently

**Completeness**:
- ✓ Depends on publicly available information
- ✓ Some casinos may have limited online presence
- ✓ Official sources may not list all operational casinos

**Timeliness**:
- ✓ Promotions change rapidly (daily/weekly)
- ✓ AI knowledge cutoff may affect recent changes
- ✓ Regular research recommended for up-to-date data

### Technical Limitations

**Rate Limits**:
- OpenAI: ~3 requests/second (GPT-4o)
- Implemented: 3 concurrent max, 1s delay between batches
- Large research sessions may take 2-5 minutes

**Costs**:
- GPT-4o: ~$0.005/request (varies by token usage)
- Average research session: $0.10-0.50
- Daily scheduled research: ~$3-15/month

**Storage**:
- localStorage: ~5-10 MB limit (browser-dependent)
- 100+ research sessions storable
- No backend database (data resets on clear)

**Browser-Based**:
- Data not synced across devices
- Clears if browser cache cleared
- No user authentication/multi-user support

### Recommendations

**For Production Use**:
1. Add backend database (PostgreSQL, MongoDB)
2. Implement user authentication
3. Add offer change notifications (email/webhook)
4. Implement fuzzy casino name matching
5. Add manual data verification workflow
6. Create admin dashboard for data management
7. Add API rate limiting and caching
8. Implement error tracking (Sentry, LogRocket)

**For Better Accuracy**:
1. Cross-reference multiple AI sources
2. Add human verification step for critical data
3. Maintain casino alias mapping
4. Implement confidence thresholds
5. Add manual override functionality

---

## 📞 Support & Contact

**Issues**: [GitHub Issues](https://github.com/DarwinCamahalan/casino-offer-ai-researcher/issues)
**Documentation**: This README
**Developer**: Darwin Camahalan

---

## 📄 License

This project was created as part of a developer trial project. All rights reserved.

