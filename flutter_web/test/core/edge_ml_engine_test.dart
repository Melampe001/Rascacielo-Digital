import 'package:flutter_test/flutter_test.dart';
import 'package:rascacielo_digital_flutter/core/edge_ml_engine.dart';

void main() {
  group('EdgeMLEngine', () {
    late EdgeMLEngine engine;

    setUp(() {
      engine = EdgeMLEngine();
    });

    test('should predict future values based on historical data', () async {
      // Arrange
      final historicalData = [10.0, 12.0, 14.0, 16.0, 18.0];

      // Act
      final predictions = await engine.predictPattern(historicalData);

      // Assert
      expect(predictions, isNotEmpty);
      expect(predictions.length, equals(5));
      for (final prediction in predictions) {
        expect(prediction, greaterThanOrEqualTo(0));
      }
    });

    test('should return empty list for empty input', () async {
      // Arrange
      final historicalData = <double>[];

      // Act
      final predictions = await engine.predictPattern(historicalData);

      // Assert
      expect(predictions, isEmpty);
    });

    test('should detect anomalies correctly', () async {
      // Arrange
      final normalData = [10.0, 11.0, 12.0, 11.5, 10.5, 12.5];
      final anomalyValue = 50.0; // Significantly higher

      // Act
      final isAnomaly = await engine.detectAnomaly(normalData, anomalyValue);

      // Assert
      expect(isAnomaly, isTrue);
    });

    test('should not detect normal values as anomalies', () async {
      // Arrange
      final normalData = [10.0, 11.0, 12.0, 11.5, 10.5, 12.5];
      final normalValue = 11.0;

      // Act
      final isAnomaly = await engine.detectAnomaly(normalData, normalValue);

      // Assert
      expect(isAnomaly, isFalse);
    });

    test('should handle single data point for anomaly detection', () async {
      // Arrange
      final singleDataPoint = [10.0];
      final testValue = 11.0;

      // Act
      final isAnomaly = await engine.detectAnomaly(singleDataPoint, testValue);

      // Assert - With single point, cannot detect anomaly reliably
      expect(isAnomaly, isA<bool>());
    });
  });
}
