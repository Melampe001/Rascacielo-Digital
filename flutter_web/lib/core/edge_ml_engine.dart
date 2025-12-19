import 'dart:math';

class EdgeMLEngine {
  // Simple linear regression for build time prediction
  Future<List<double>> predictPattern(List<double> historicalData) async {
    if (historicalData.isEmpty) {
      return [];
    }

    // Simple moving average with trend
    final predictions = <double>[];
    const predictionCount = 5;

    // Calculate trend
    final trend = _calculateTrend(historicalData);
    final lastValue = historicalData.last;

    for (var i = 0; i < predictionCount; i++) {
      final predicted = lastValue + (trend * (i + 1));
      // Add some variance for realism
      final variance = Random().nextDouble() * 2 - 1;
      predictions.add(max(0, predicted + variance));
    }

    return predictions;
  }

  double _calculateTrend(List<double> data) {
    if (data.length < 2) return 0.0;

    double sumX = 0;
    double sumY = 0;
    double sumXY = 0;
    double sumX2 = 0;
    final n = data.length;

    for (var i = 0; i < n; i++) {
      sumX += i;
      sumY += data[i];
      sumXY += i * data[i];
      sumX2 += i * i;
    }

    final slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  // Pattern recognition for anomaly detection
  Future<bool> detectAnomaly(List<double> data, double newValue) async {
    if (data.isEmpty) return false;

    final mean = data.reduce((a, b) => a + b) / data.length;
    final variance = data.map((x) => pow(x - mean, 2)).reduce((a, b) => a + b) / data.length;
    final stdDev = sqrt(variance);

    // Flag if value is more than 2 standard deviations from mean
    return (newValue - mean).abs() > 2 * stdDev;
  }
}
