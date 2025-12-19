# Rascacielo Digital - Flutter Web Application

A modern, production-ready Flutter Web application for managing CI/CD pipelines with real-time monitoring, ML-powered analytics, and agent orchestration.

## Features

- 🎨 **Modern UI**: Material Design 3 with dark theme
- 📊 **Real-time Dashboard**: Live statistics and agent status monitoring
- 🤖 **Agent Management**: Execute and monitor specialized agents
- 📈 **ML Analytics**: Edge-based machine learning predictions
- ⚡ **WebSocket Support**: Real-time updates with sub-100ms latency
- 🔒 **Secure**: CORS headers and security best practices
- 📱 **Responsive**: Works on desktop, tablet, and mobile

## Quick Start

### Prerequisites

- Flutter SDK 3.0.0 or higher
- Dart SDK 3.0.0 or higher
- Chrome or any modern browser

### Installation

```bash
cd flutter_web
flutter pub get
```

### Development

```bash
flutter run -d chrome
```

### Building for Production

```bash
flutter build web --release
```

The build output will be in `build/web/`.

### Testing

**Run unit tests:**
```bash
flutter test
```

**Run integration tests:**
```bash
flutter test integration_test/app_test.dart -d chrome
```

**Generate coverage:**
```bash
flutter test --coverage
```

## Project Structure

```
flutter_web/
├── lib/
│   ├── core/                    # Core services
│   │   ├── api_client.dart      # API client for backend communication
│   │   ├── websocket_client.dart # WebSocket client for real-time updates
│   │   └── edge_ml_engine.dart  # ML engine for predictions
│   ├── features/                # Feature modules
│   │   ├── dashboard/           # Dashboard feature
│   │   │   ├── dashboard_page.dart
│   │   │   └── widgets/         # Dashboard widgets
│   │   ├── agents/              # Agents feature
│   │   │   ├── agents_page.dart
│   │   │   └── widgets/         # Agent widgets
│   │   └── analytics/           # Analytics feature
│   │       └── analytics_page.dart
│   └── main.dart                # App entry point
├── integration_test/            # Integration tests
├── test/                        # Unit tests
├── pubspec.yaml                 # Dependencies
├── vercel.json                  # Vercel deployment config
└── README.md                    # This file
```

## Dependencies

- **provider**: State management
- **http**: HTTP client
- **web_socket_channel**: WebSocket support
- **fl_chart**: Charts and data visualization

## Configuration

### Environment Variables

Set the API URL when building:

```bash
flutter build web --dart-define=API_URL=https://api.your-domain.com
```

### Vercel Deployment

1. Connect your repository to Vercel
2. Set the root directory to `flutter_web`
3. Add build command: `flutter build web --release`
4. Deploy!

## Architecture

### Core Services

**ApiClient**: Handles all HTTP requests to the backend API
- Executes agents
- Fetches statistics
- Retrieves analytics data
- Provides fallback mock data

**WebSocketClient**: Manages real-time WebSocket connections
- Auto-reconnection
- Message broadcasting
- Connection state management

**EdgeMLEngine**: Performs ML predictions on the client
- Linear regression for trend analysis
- Anomaly detection
- Pattern recognition
- Zero server overhead

### State Management

Uses Provider for dependency injection and state management:
- Global services (ApiClient, WebSocketClient)
- Per-page state management
- Reactive UI updates

### Features

**Dashboard**: Real-time monitoring
- Statistics cards
- Agent status overview
- Recent activity feed

**Agents**: Agent execution and monitoring
- Execute agents on demand
- Monitor execution progress
- View execution results

**Analytics**: ML-powered insights
- Historical data visualization
- Future predictions
- Trend analysis

## Testing

### Unit Tests

Test individual components in isolation:
- Core services
- Widgets
- Business logic

### Integration Tests

Test complete user flows:
- Navigation
- Data loading
- Agent execution
- Analytics visualization

Target coverage: **>80%**

## Performance

- **Initial Load**: < 3 seconds
- **Page Transitions**: < 100ms
- **API Calls**: < 500ms
- **WebSocket Latency**: < 100ms
- **ML Predictions**: < 50ms

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Check the [User Guide](../docs/USER_GUIDE.md)
- Review [Testing Documentation](../docs/TESTING.md)
- File an issue on GitHub
