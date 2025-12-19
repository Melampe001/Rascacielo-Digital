import 'package:flutter_test/flutter_test.dart';
import 'package:rascacielo_digital_flutter/core/api_client.dart';

void main() {
  group('ApiClient', () {
    late ApiClient client;

    setUp(() {
      client = ApiClient(baseUrl: 'https://test.api.com');
    });

    test('should return mock stats when API fails', () async {
      // Act
      final stats = await client.getStats();

      // Assert
      expect(stats, isA<Map<String, dynamic>>());
      expect(stats['totalBuilds'], isNotNull);
      expect(stats['totalScans'], isNotNull);
      expect(stats['totalDeploys'], isNotNull);
      expect(stats['successRate'], isNotNull);
    });

    test('should return mock analytics when API fails', () async {
      // Act
      final analytics = await client.getAnalytics();

      // Assert
      expect(analytics, isA<Map<String, dynamic>>());
      expect(analytics['buildTimes'], isA<List>());
      expect((analytics['buildTimes'] as List).length, greaterThan(0));
    });

    test('should have agents in stats', () async {
      // Act
      final stats = await client.getStats();

      // Assert
      expect(stats['agents'], isA<Map>());
      expect(stats['agents']['build'], isNotNull);
      expect(stats['agents']['security'], isNotNull);
      expect(stats['agents']['deploy'], isNotNull);
      expect(stats['agents']['orchestrator'], isNotNull);
    });

    test('should have recent activity in stats', () async {
      // Act
      final stats = await client.getStats();

      // Assert
      expect(stats['recentActivity'], isA<List>());
      expect((stats['recentActivity'] as List).length, greaterThan(0));
    });
  });
}
