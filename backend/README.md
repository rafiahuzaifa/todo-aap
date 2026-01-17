# Backend

Backend implementation for Evolution of Todo project.

## Structure

```
backend/
 ├─ phase-1-console/        # Phase 1: CLI Backend
 ├─ phase-2-web/            # Phase 2: API Server
 ├─ phase-3-chatbot/        # Phase 3: Chatbot Service
 ├─ phase-4-kubernetes/     # Phase 4: Containerized Services
 ├─ phase-5-cloud/          # Phase 5: Cloud Services
 └─ shared/                 # Shared utilities and types
```

## Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Phase 1:** Console CLI
- **Phase 2+:** Express.js API Server
- **Database:** (Phase 2+)
  - SQLite (Phase 1-2)
  - PostgreSQL (Phase 3+)
- **Authentication:** JWT (Phase 2+)
- **AI Integration:** OpenAI/Anthropic APIs (Phase 3+)

## Development

Each phase has independent development but shares common utilities in `shared/`.

### Phase 1: Console
- Command-line interface
- Local file-based storage
- No external dependencies

### Phase 2: Web
- RESTful API
- Database integration
- User authentication

### Phase 3: Chatbot
- WebSocket support
- LLM integration
- Async task processing

### Phase 4: Kubernetes
- Microservices architecture
- Health checks
- Service discovery

### Phase 5: Cloud
- Serverless functions
- Managed databases
- CDN integration

## Getting Started

```bash
# Install dependencies (when Phase 1 is ready)
npm install

# Run Phase 1 (Console)
npm run phase1

# Run Phase 2 (Web)
npm run phase2
```

## Code Generation

All code is generated from specifications in the `specs/` folder using Spec-Kit Plus.

---

**Status:** Ready for Phase 1 implementation  
**Last Updated:** January 17, 2026
