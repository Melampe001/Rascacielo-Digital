# 🏛️ Rascacielo Digital - User Guide

## Quick Start

### Accessing the Application

Visit the deployed application at your Vercel URL: `https://your-app.vercel.app`

## Features Overview

### Dashboard

The dashboard provides real-time statistics about your CI/CD pipeline:

- **Total Builds**: Number of builds executed
- **Security Scans**: Number of security scans performed
- **Deployments**: Total deployments completed
- **Success Rate**: Overall success rate percentage

#### Agent Status

Monitor the status of all agents in real-time:
- BUILD - Build agent status
- SECURITY - Security agent status
- DEPLOY - Deploy agent status
- ORCHESTRATOR - Orchestrator agent status

#### Recent Activity

View the latest activity from all agents with timestamps and status indicators.

### Agents

Execute agents manually and monitor their execution:

1. Navigate to the "Agents" tab using the navigation rail
2. Click on the desired agent card
3. Click "Execute" button
4. Monitor execution progress in the dialog
5. View execution results

Available agents:
- **Build Agent**: Handles build processes
- **Security Agent**: Performs security scans
- **Deploy Agent**: Manages deployments
- **Orchestrator**: Coordinates all agents

### Analytics

View ML-powered predictions and analytics:

- **Build Time Trends**: Historical build times displayed as a blue line chart
- **Performance Predictions**: ML-generated predictions shown as an orange dashed line
- **Pattern Recognition**: Automatically detects trends and anomalies

The analytics page uses Edge ML computing to generate predictions locally in your browser, ensuring:
- Zero server processing overhead
- Sub-100ms prediction latency
- Privacy-preserving analytics

## Real-Time Features

### WebSocket Connection

The application maintains a WebSocket connection for real-time updates:
- Live agent status updates
- Real-time build notifications
- Instant deployment alerts
- Automatic reconnection on network issues

### Responsive Design

The application is fully responsive and works across:
- Desktop browsers
- Tablets
- Mobile devices (landscape mode recommended)

## Keyboard Shortcuts

- `Ctrl + R` / `Cmd + R`: Refresh dashboard
- `Esc`: Close dialogs

## Performance

- **Initial Load**: < 3 seconds
- **Page Transitions**: < 100ms
- **API Response**: < 500ms
- **WebSocket Latency**: < 100ms

## Troubleshooting

### Dashboard Not Loading

If the dashboard fails to load:
1. Check your internet connection
2. Verify the API URL is configured correctly
3. Check browser console for errors
4. Try refreshing the page

### Agent Execution Fails

If an agent fails to execute:
1. Verify the agent is active (check Agent Status card)
2. Check if the API is reachable
3. Review error message in the notification
4. Try executing the agent again

### Analytics Not Showing

If analytics data doesn't appear:
1. Ensure there is historical build data
2. Check browser console for ML engine errors
3. Verify WebAssembly is enabled in your browser
4. Try refreshing the page

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Security

- All data is transmitted over HTTPS
- API tokens are stored securely
- No sensitive data is logged
- CORS headers are properly configured

## Getting Help

For issues or questions:
1. Check this guide
2. Review the API documentation
3. Contact support
4. File an issue on GitHub

## Updates

The application automatically checks for updates and will notify you when a new version is available.
