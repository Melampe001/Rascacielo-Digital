import 'package:flutter_test/flutter_test.dart';
import 'package:rascacielo_digital_flutter/core/websocket_client.dart';

void main() {
  group('WebSocketClient', () {
    late WebSocketClient client;

    setUp(() {
      client = WebSocketClient();
    });

    tearDown(() {
      client.dispose();
    });

    test('should start disconnected', () {
      // Assert
      expect(client.isConnected, isFalse);
    });

    test('should provide a message stream', () {
      // Assert
      expect(client.messages, isA<Stream<Map<String, dynamic>>>());
    });

    test('should handle disposal correctly', () {
      // Act
      client.dispose();

      // Assert
      expect(client.isConnected, isFalse);
    });
  });
}
