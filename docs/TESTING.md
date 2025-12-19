# Testing Documentation

## Overview

This document describes the testing strategy and implementation for the Rascacielo Digital Flutter Web application.

## Test Structure

### Unit Tests

Located in `flutter_web/test/`

Unit tests cover individual components and functions:
- Core services (API Client, WebSocket Client, ML Engine)
- Widget components
- Business logic

**Running unit tests:**
```bash
cd flutter_web
flutter test
```

**Running with coverage:**
```bash
cd flutter_web
flutter test --coverage
```

### Integration Tests

Located in `flutter_web/integration_test/`

Integration tests verify complete user flows:
- Dashboard loading and data display
- Navigation between pages
- Agent execution
- Analytics visualization

**Running integration tests:**
```bash
cd flutter_web
flutter test integration_test/app_test.dart
```

**Running on Chrome:**
```bash
cd flutter_web
flutter test integration_test/app_test.dart -d chrome
```

## Test Coverage

Target coverage: **>80%**

Coverage areas:
- Core services: 90%
- UI widgets: 75%
- Business logic: 85%
- Integration flows: 80%

## Testing Best Practices

### Unit Tests

1. **Isolate dependencies**: Use mocks and stubs
2. **Test one thing**: Each test should verify one behavior
3. **Use descriptive names**: Test names should describe what they test
4. **Follow AAA pattern**: Arrange, Act, Assert

Example:
```dart
test('ApiClient should return stats on successful request', () async {
  // Arrange
  final client = ApiClient(baseUrl: 'https://test.api');
  
  // Act
  final result = await client.getStats();
  
  // Assert
  expect(result, isA<Map<String, dynamic>>());
  expect(result['totalBuilds'], isNotNull);
});
```

### Integration Tests

1. **Test complete flows**: Verify entire user journeys
2. **Use real widgets**: Test with actual UI components
3. **Verify UI state**: Check that UI reflects expected state
4. **Handle async operations**: Use pumpAndSettle for animations

Example:
```dart
testWidgets('User can navigate to Agents page', (tester) async {
  // Arrange
  app.main();
  await tester.pumpAndSettle();
  
  // Act
  await tester.tap(find.text('Agents'));
  await tester.pumpAndSettle();
  
  // Assert
  expect(find.text('Agents'), findsOneWidget);
  expect(find.byType(AgentCard), findsWidgets);
});
```

## Mocking Strategies

### API Client Mocking

```dart
class MockApiClient extends Mock implements ApiClient {}

test('Dashboard shows loading state initially', () {
  final mockApi = MockApiClient();
  when(mockApi.getStats()).thenAnswer(
    (_) async => Future.delayed(Duration(seconds: 1), () => {}),
  );
  // Test implementation
});
```

### WebSocket Mocking

```dart
class MockWebSocketClient extends Mock implements WebSocketClient {}

test('WebSocket receives messages correctly', () {
  final mockWs = MockWebSocketClient();
  final controller = StreamController<Map<String, dynamic>>();
  when(mockWs.messages).thenAnswer((_) => controller.stream);
  // Test implementation
});
```

## Performance Testing

### Load Time Tests

Verify app loads within acceptable time:
```dart
testWidgets('App loads within 3 seconds', (tester) async {
  final startTime = DateTime.now();
  app.main();
  await tester.pumpAndSettle();
  final loadTime = DateTime.now().difference(startTime);
  expect(loadTime.inSeconds, lessThan(3));
});
```

### Animation Tests

Verify smooth animations:
```dart
testWidgets('Navigation animations are smooth', (tester) async {
  app.main();
  await tester.pumpAndSettle();
  
  await tester.tap(find.text('Agents'));
  await tester.pump(); // Start animation
  await tester.pump(Duration(milliseconds: 100)); // Mid animation
  await tester.pumpAndSettle(); // Complete animation
  
  expect(find.text('Agents'), findsOneWidget);
});
```

## CI/CD Integration

Tests are automatically run in CI/CD pipeline:

1. **Lint**: Code style checks
2. **Unit Tests**: All unit tests must pass
3. **Integration Tests**: Critical flows must pass
4. **Coverage**: Must meet 80% threshold

**GitHub Actions workflow:**
```yaml
- name: Run Flutter tests
  run: |
    cd flutter_web
    flutter test --coverage
    
- name: Check coverage
  run: |
    cd flutter_web
    flutter test --coverage
    lcov --summary coverage/lcov.info
```

## Test Data

### Mock Data

Test data is defined in test files:
- Stats data: `test/fixtures/stats.json`
- Analytics data: `test/fixtures/analytics.json`
- Agent data: `test/fixtures/agents.json`

### Test Fixtures

```dart
final mockStats = {
  'totalBuilds': 156,
  'totalScans': 89,
  'totalDeploys': 134,
  'successRate': 94,
};
```

## Debugging Tests

### Running Single Test

```bash
flutter test test/unit/api_client_test.dart
```

### Verbose Output

```bash
flutter test --verbose
```

### Chrome DevTools

```bash
flutter test integration_test/app_test.dart -d chrome --observatory-port=8888
```

## Common Issues

### Test Timeout

If tests timeout, increase timeout:
```dart
testWidgets('Long running test', (tester) async {
  // Test code
}, timeout: Timeout(Duration(minutes: 2)));
```

### Flaky Tests

For flaky tests:
1. Add delays for async operations
2. Use `pumpAndSettle()` instead of `pump()`
3. Increase wait times
4. Check for race conditions

### Widget Not Found

If widget is not found:
1. Use `await tester.pumpAndSettle()`
2. Check widget is in correct state
3. Use `find.byType()` instead of `find.byWidget()`
4. Verify widget tree with `debugDumpApp()`

## Future Enhancements

- [ ] Add visual regression testing
- [ ] Implement E2E tests with Selenium
- [ ] Add performance benchmarking
- [ ] Implement snapshot testing
- [ ] Add accessibility testing
