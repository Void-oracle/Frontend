# VOID - Vocal Oracle of Intelligent Data

<div align="center">

![VOID Logo](public/images/logo.png)

**AI-Powered Sentiment Oracle for Solana Prediction Markets**

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg)](https://fastapi.tiangolo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Quick Start](QUICKSTART.md) • [Documentation](PROJECT_OVERVIEW.md) • [Backend Setup](backend/SETUP.md)

</div>

---

## 🎯 What is VOID?

**VOID** is an innovative AI-powered sentiment oracle that:

- 🧠 **Analyzes social sentiment** using multi-agent AI system
- 🤖 **Detects bots** and distinguishes real influencers from paid shilling
- 📊 **Calculates Divergence Index** between AI analysis and market probabilities
- 💬 **Generates Vocal Summary** — clear summaries of its decisions
- ⚡ **Integrates with Solana** for prediction markets

## ✨ Key Features

### Multi-Agent System

```
┌─────────────────────────────────────────────┐
│          Sentiment Agent                     │
│  • Keyword-based analysis                    │
│  • GPT-4 deep analysis                       │
│  • Key phrases extraction                    │
│  • Momentum calculation                      │
└─────────────────┬───────────────────────────┘
                  │
                  ├──────────────────┐
                  │                  │
┌─────────────────▼──────┐  ┌───────▼──────────┐
│   Bot Detector Agent    │  │   Orchestrator   │
│  • Account analysis     │  │  • Coordinates    │
│  • Pattern detection    │  │  • Calculates     │
│  • Influencer ID        │  │  • Generates      │
└─────────────────────────┘  └──────────────────┘
```

### Divergence Index Formula

```
D = |P_AI - P_Market|

where:
P_AI    = AI probability (0-100%)
P_Market = Market probability (0-100%)
D       = Divergence index
```

## 🚀 Quick Start

### Requirements

- Python 3.11+
- Node.js 18+ (for frontend)
- OpenAI API key
- Tavily API key

### In 5 Minutes

```bash
# 1. Setup Backend
cd backend
# Windows: .\scripts\setup.ps1
# Linux/Mac: ./scripts/setup.sh

# 2. Add API keys to backend/.env
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...

# 3. Start Backend
python run.py
# → http://localhost:8000

# 4. (Optional) Start Frontend
cd ..
npm install
npm run dev
# → http://localhost:3000
```

**Full guide:** [QUICKSTART.md](QUICKSTART.md)

## 📖 Documentation

- 📘 [**Quick Start**](QUICKSTART.md) - Get started in 5 minutes
- 📗 [**Project Overview**](PROJECT_OVERVIEW.md) - Full architecture and technical details
- 📙 [**Backend Setup**](backend/SETUP.md) - Detailed backend installation
- 📕 [**API Documentation**](http://localhost:8000/docs) - Swagger UI (after startup)

## 🎨 Usage Examples

### Python

```python
import requests

response = requests.post(
    'http://localhost:8000/api/v1/oracle/predict',
    json={
        'ticker': 'SOL',
        'query': 'Will Solana reach $300 by February 2026?',
        'time_range_hours': 24
    }
)

result = response.json()
print(f"AI Score: {result['ai_score']}%")
print(f"Market: {result['market_score']}%")
print(f"Divergence: {result['divergence_index']}%")
print(f"Summary: {result['vocal_summary']}")
```

### TypeScript/React

```typescript
const { data } = await fetch('/api/v1/oracle/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ticker: 'SOL',
    query: 'Will Solana reach $300?',
    time_range_hours: 24
  })
}).then(r => r.json());

console.log(`Divergence: ${data.divergence_index}%`);
```

### Curl

```bash
curl -X POST "http://localhost:8000/api/v1/oracle/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "ticker": "SOL",
    "query": "Will Solana reach $300?",
    "time_range_hours": 24
  }'
```

## 📊 API Response Example

```json
{
  "ticker": "SOL",
  "ai_score": 78.5,
  "market_score": 42.0,
  "divergence_index": 36.5,
  "vocal_summary": "Strong bullish sentiment detected across social media with 1,247 posts analyzed. Bot activity is minimal at 12%, with 89 posts from verified influencers. The market appears to be significantly underpricing the probability based on current social sentiment momentum.",
  "confidence": 0.85,
  "data_sources": {
    "twitter_posts": 1247,
    "influencer_posts": 89,
    "bot_ratio": 0.12,
    "total_engagement": 45678,
    "unique_accounts": 892
  },
  "sentiment_analysis": {
    "sentiment_score": {
      "bullish": 0.72,
      "bearish": 0.18,
      "overall": 0.54,
      "confidence": 0.87
    },
    "key_phrases": ["#SOL", "$SOL", "bullish", "moon"],
    "trending_topics": ["solana", "price", "rally"]
  },
  "bot_detection": {
    "bot_probability": 0.12,
    "authentic_ratio": 0.88,
    "top_influencers": [...]
  },
  "timestamp": "2026-01-16T12:00:00Z",
  "processing_time_ms": 2453.67
}
```

## 🏗️ Project Structure

```
Oracle-agent/
├── 📱 Frontend (Next.js + React)
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   └── app/               # Dashboard
│   ├── components/            # React components
│   │   ├── market-card.tsx    # Market card
│   │   └── divergence-hero.tsx
│   └── lib/                   # Utilities
│
├── 🔧 Backend (Python + FastAPI)
│   ├── app/
│   │   ├── agents/            # AI Agents
│   │   │   ├── sentiment_agent.py
│   │   │   ├── bot_detector.py
│   │   │   └── orchestrator.py
│   │   ├── services/          # Services
│   │   │   ├── data_collector.py
│   │   │   ├── solana_service.py
│   │   │   └── divergence.py
│   │   ├── api/               # API Endpoints
│   │   │   └── v1/endpoints/oracle.py
│   │   └── models/            # Pydantic Schemas
│   ├── tests/                 # Tests
│   └── scripts/               # Setup scripts
│
└── 📚 Documentation
    ├── README.md              # This file
    ├── QUICKSTART.md          # Quick start
    ├── PROJECT_OVERVIEW.md    # Full overview
    └── backend/SETUP.md       # Backend setup
```

## 🛠️ Technologies

### Backend

- **Framework**: FastAPI
- **AI/ML**: OpenAI GPT-4, Transformers
- **Blockchain**: Solana, solana-py
- **Data**: Tavily API, Twitter API
- **Database**: MongoDB, Redis
- **Language**: Python 3.11+

### Frontend

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Animation**: Framer Motion

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v --cov=app

# Run specific test
pytest tests/test_agents.py -v

# With coverage report
pytest --cov=app --cov-report=html
```

## 🐳 Docker Deployment

```bash
cd backend
docker-compose up -d
```

Or manual:

```bash
# Build
docker build -t void-backend backend/

# Run
docker run -p 8000:8000 --env-file backend/.env void-backend
```

## 🔐 Security

- ✅ API keys in `.env` (not in code)
- ✅ Rate limiting (100 req/min)
- ✅ CORS configuration
- ✅ Pydantic validation
- ✅ Error handling

## 📈 Performance

- ⚡ Async processing (asyncio)
- 🚀 Redis caching
- 📦 Batch processing
- 🔄 Parallel agent execution
- ⏱️ Average processing: ~2-3 seconds

## 🗺️ Roadmap

- [x] Multi-agent system
- [x] Sentiment analysis with GPT-4
- [x] Bot detection
- [x] Divergence calculator
- [x] FastAPI backend
- [x] Next.js frontend
- [ ] Real Solana smart contract integration
- [ ] WebSocket real-time updates
- [ ] Historical data & backtesting
- [ ] User authentication
- [ ] Advanced analytics dashboard
- [ ] Mobile app

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **OpenAI** - GPT-4 for AI analysis
- **Solana** - Blockchain infrastructure
- **Tavily** - Search & data collection API
- **ai16z** - Inspiration from Eliza Framework
- **Vercel** - Next.js framework

## 💬 Support

- 📧 Email: support@void-oracle.io
- 💬 Discord: [Join our community](#)
- 🐦 Twitter: [@VOIDOracle](#)
- 📖 Docs: [docs.void-oracle.io](#)

---

<div align="center">

**Made with ❤️ for Solana community**

[⬆ Back to top](#void---vocal-oracle-of-intelligent-data)

</div>
