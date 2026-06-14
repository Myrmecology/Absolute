# ABSOLUTE
### Interdimensional Operations Hub
## For A VIDEO DEMO PLEASE VISIT THE LINK: https://www.youtube.com/watch?v=5h1mSH4J_dY

A full-featured interactive dashboard built with vanilla HTML, CSS, and JavaScript. ABSOLUTE is a classified mission control interface for interdimensional and temporal operatives — featuring a 3D animated login experience, mission planning with AI-generated dossiers, a financial simulator, and a live social network feed.

---

## Features

### Login Screen
- Full 3D Babylon.js environment with pulsating irregular geometry
- Rotating polyhedra, torus knots, and particle systems
- Mirror floor reflection with post-processing effects
- Custom cursor system with trail particles, ripple effects, and magnetic hover
- Animated boot sequence log
- Warp transition to the dashboard

### Create Trip
- Interdimensional and temporal mission planner
- Animated scroll unfurl reveal sequence
- Mission form with inventory tag system
- Claude API powered mission dossier generation
- Flux Pro via fal.ai hyper-realistic portal image generation
- Risk assessment engine
- Live departure countdown timer
- Mission summary card with unique mission code

### Bank
- Full budget simulator with animated stat cards
- Chart.js bar chart with 6M / 3M / 1M period filters
- Doughnut pie chart with custom neon legend
- Budget category editor with progress bars
- Buy list and avoid list with check / delete functionality
- Transaction log with income and expense tracking
- Live balance updates with animated count transitions

### Media
- Mock interdimensional social network
- Stories bar with animated ring indicators
- Create and broadcast posts to the feed
- Like, comment, and share interactions with particle effects
- Live activity ticker with simulated real-time events
- Trending topics panel with periodic refresh
- Suggested operatives sidebar
- Auto-injected live posts to simulate network activity

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 / CSS3 / JavaScript | Core application |
| Babylon.js | 3D login environment |
| GSAP 3 | Animations and transitions |
| Chart.js | Bank tab data visualization |
| Claude API | Mission dossier and risk assessment |
| Flux Pro — fal.ai | Hyper-realistic portal image generation |
| Google Fonts | Orbitron, Rajdhani, Share Tech Mono |

---

## Project Structure

absolute/
├── index.html                   # Login page
├── dashboard.html               # Main dashboard
├── .env.example                 # Environment variable template
├── .gitignore                   # Security-hardened gitignore
├── config/
│   └── api.js                   # API configuration
├── css/
│   ├── variables.css            # Design token system
│   ├── global.css               # Base reset and utilities
│   ├── login.css                # Login screen styles
│   ├── dashboard.css            # Dashboard layout and tabs
│   ├── cursor.css               # Custom cursor system
│   ├── animations.css           # Keyframes and effects
│   └── tabs/
│       ├── create-trip.css      # Create Trip tab
│       ├── bank.css             # Bank tab
│       └── media.css            # Media tab
├── js/
│   ├── app.js                   # Root application controller
│   ├── login/
│   │   ├── scene.js             # Babylon.js 3D scene
│   │   ├── cursor.js            # Custom cursor system
│   │   └── auth.js              # Login authentication
│   ├── dashboard/
│   │   ├── tabs.js              # Tab navigation
│   │   └── transitions.js       # GSAP transition system
│   └── tabs/
│       ├── create-trip/
│       │   ├── form.js          # Mission form controller
│       │   ├── claude.js        # Claude API integration
│       │   ├── flux.js          # Flux Pro integration
│       │   └── dossier.js       # Dossier orchestrator
│       ├── bank/
│       │   ├── charts.js        # Chart.js integration
│       │   ├── budget.js        # Budget management
│       │   └── lists.js         # Lists and transactions
│       └── media/
│           ├── feed.js          # Social feed controller
│           └── mock-data.js     # Data generators
└── data/
├── mock-feed.json           # Social feed data
└── mock-bank.json           # Bank and budget data

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Myrmecology/Absolute.git
cd absolute
```

### 2. Set up environment variables

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

CLAUDE_API_KEY=your_claude_api_key_here
FAL_API_KEY=your_fal_api_key_here

### 3. Add your API keys to the HTML files

Open `index.html` and `dashboard.html` and locate the following script block near the top of each file:

```html
<script>
  window.__ENV__ = {
    CLAUDE_API_KEY: "",
    FAL_API_KEY: ""
  };
</script>
```

Replace the empty strings with your actual API keys for local development.

> **Security note:** Never commit real API keys to version control. For production deployment, inject these values server-side.

### 4. Serve the project

ABSOLUTE requires a local server to load JSON data files correctly. Use any of the following:

**VS Code Live Server extension** — right-click `index.html` and select Open with Live Server

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx serve .
```

Then open `http://localhost:8000` in your browser.

---

## API Setup

### Claude API
1. Create an account at [console.anthropic.com](https://console.anthropic.com)
2. Generate an API key
3. Add to `window.__ENV__.CLAUDE_API_KEY`

The Claude API powers:
- Mission dossier generation
- Risk assessment analysis

### Flux Pro — fal.ai
1. Create an account at [fal.ai](https://fal.ai)
2. Generate an API key from your dashboard
3. Add to `window.__ENV__.FAL_API_KEY`

Flux Pro powers:
- Hyper-realistic portal destination image generation

> Both APIs have free tiers or pay-per-use billing. The project works without API keys using built-in fallback content.

---

## Usage

### Login
Enter any name to initialize access. The boot sequence will authenticate your agent designation and transition to the dashboard.

### Create Trip
1. Click **Access Mission Scroll** to reveal the authorization scroll
2. Click **Begin Mission Parameters** to open the mission form
3. Fill in your agent details, destination year, reality designation, inventory and mission notes
4. Click **Generate Mission Dossier** to trigger AI generation
5. A portal image, countdown timer, mission dossier, and risk assessment will be generated

### Bank
- View budget overview via bar and pie charts
- Add and remove budget categories
- Manage buy and avoid lists
- Log income and expense transactions

### Media
- Browse the interdimensional social feed
- Like, comment, and share posts
- Broadcast your own transmissions
- Watch the live activity ticker for real-time network events

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | Full |
| Firefox 88+ | Full |
| Safari 14+ | Full |
| Edge 90+ | Full |

Babylon.js WebGL features require a hardware-accelerated browser. CSS Houdini properties (`@property`) are supported in Chromium-based browsers. Firefox and Safari will gracefully fall back on animated elements.

---

## License

MIT License 

---

## Notes

- All social feed content, agent names, realities, and mission data are fictional
- No real personal data is collected or stored
- API keys are never transmitted anywhere except the official Claude and fal.ai endpoints
- The project uses sessionStorage only to persist the agent name during a single browser session

