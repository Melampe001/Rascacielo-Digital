# Architecture Documentation

## System Overview

Rascacielo Digital is a full-stack application consisting of:
- **Backend**: Node.js-based agents and API
- **Frontend**: Flutter Web application
- **Infrastructure**: CI/CD pipelines and deployment automation

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Flutter Web Application (WASM)                 │ │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────────────┐   │ │
│  │  │Dashboard │  │  Agents   │  │   Analytics      │   │ │
│  │  │  Page    │  │   Page    │  │   Page + ML      │   │ │
│  │  └──────────┘  └───────────┘  └──────────────────┘   │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │            Core Services                          │ │ │
│  │  │  • API Client   • WebSocket   • ML Engine        │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS + WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Server                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              REST API + WebSocket Server               │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Agent Orchestrator                     │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│  │  │  Build   │ │ Security │ │  Deploy  │ │ Monitor  │ │ │
│  │  │  Agent   │ │  Agent   │ │  Agent   │ │  Agent   │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline (GitHub Actions)           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Lint → Test → Security → Build → Deploy               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (Flutter Web)

**Technology Stack:**
- Flutter 3.0+
- Dart 3.0+
- Material Design 3
- Provider for state management
- fl_chart for visualizations

**Key Components:**
1. **Dashboard**: Real-time monitoring interface
2. **Agents Management**: Execute and monitor agents
3. **Analytics**: ML-powered predictions and insights

**Core Services:**
- **API Client**: HTTP communication with backend
- **WebSocket Client**: Real-time updates
- **Edge ML Engine**: Client-side predictions

### Backend (Node.js)

**Technology Stack:**
- Node.js 18+
- Express.js (implied)
- WebSocket support

**Key Components:**
1. **Build Agent**: Handles compilation and builds
2. **Security Agent**: Performs security scans
3. **Deploy Agent**: Manages deployments
4. **Orchestrator**: Coordinates all agents

### CI/CD Pipeline

**GitHub Actions Workflows:**
1. **Lint Gate**: Code quality checks
2. **Test Gate**: Unit and integration tests
3. **Security Gate**: Vulnerability scanning
4. **Build Gate**: Production builds
5. **Deploy Gate**: Automated deployment

## Data Flow

### Dashboard Load
```
User → Flutter App → API Client → Backend API → Agent Stats
                                                      ↓
Frontend ← JSON Response ← HTTP 200 ← Stats Data ←───┘
```

### Agent Execution
```
User Click → Agent Dialog → API POST /agents/:id/execute
                                           ↓
                                    Backend Agent
                                           ↓
                                    Execute Task
                                           ↓
Frontend ← WebSocket Update ← Real-time Status
```

### ML Analytics
```
User → Analytics Page → API Client → Backend Analytics Data
                                              ↓
                                        Historical Data
                                              ↓
Edge ML Engine (Browser) ← Data Transfer ←───┘
         ↓
    Predictions
         ↓
   Chart Display
```

## Security Architecture

### Authentication & Authorization
- API tokens for backend communication
- CORS headers properly configured
- Secure WebSocket connections (WSS)

### Data Protection
- HTTPS for all communications
- No sensitive data in client-side storage
- API calls authenticated with tokens

### Headers
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Content-Security-Policy: (configured per deployment)
```

## Deployment Architecture

### Frontend Deployment (Vercel)
```
GitHub Push → Vercel Webhook → Build Flutter Web
                                      ↓
                                 Build WASM
                                      ↓
                                 Deploy to CDN
                                      ↓
                               https://app.vercel.app
```

### Backend Deployment
- Containerized with Docker (optional)
- Deployed to cloud provider
- Auto-scaling enabled

## Performance Considerations

### Frontend
- **Initial Load**: < 3s
- **Page Transitions**: < 100ms
- **ML Predictions**: < 50ms (edge computing)

### Backend
- **API Response**: < 500ms
- **WebSocket Latency**: < 100ms
- **Agent Execution**: Variable (monitored)

## Scalability

### Horizontal Scaling
- Frontend: CDN distribution
- Backend: Load balancer + multiple instances
- Database: Replication and sharding

### Vertical Scaling
- Increased compute resources per instance
- Memory optimization
- CPU optimization

## Monitoring & Observability

### Metrics Collected
- Build times
- Success/failure rates
- API response times
- User interactions
- Error rates

### Alerts
- Failed builds
- Security vulnerabilities
- Performance degradation
- Service outages

## Future Enhancements

### Planned Features
- [ ] User authentication and authorization
- [ ] Multi-tenant support
- [ ] Advanced ML models
- [ ] Mobile applications (iOS/Android)
- [ ] Real-time collaboration
- [ ] Plugin system for custom agents

### Infrastructure Improvements
- [ ] Kubernetes deployment
- [ ] Service mesh integration
- [ ] Advanced monitoring with Prometheus
- [ ] Distributed tracing
- [ ] Auto-scaling policies

## Technology Decisions

### Why Flutter Web?
- Single codebase for web, mobile, desktop
- Modern UI with Material Design 3
- High performance with WASM
- Strong typing with Dart
- Active community and ecosystem

### Why Edge ML?
- Zero server overhead
- Sub-100ms predictions
- Privacy-preserving (data stays in browser)
- Reduced bandwidth usage
- Better user experience

### Why Node.js Backend?
- JavaScript ecosystem
- Non-blocking I/O
- Easy integration with CI/CD tools
- Large package ecosystem
- Good performance for I/O operations

## References

- [Flutter Web Documentation](https://flutter.dev/web)
- [Material Design 3](https://m3.material.io/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs)
