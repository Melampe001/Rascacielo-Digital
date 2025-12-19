import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiClient {
  final String baseUrl;

  ApiClient({required this.baseUrl});

  Future<Map<String, dynamic>> executeAgent({
    required String agent,
    required String action,
    Map<String, dynamic>? params,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/agents/$agent/$action'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(params ?? {}),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('API Error: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network Error: $e');
    }
  }

  Future<Map<String, dynamic>> getStats() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/stats'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        return _getMockStats();
      }
    } catch (e) {
      return _getMockStats();
    }
  }

  Map<String, dynamic> _getMockStats() {
    return {
      'totalBuilds': 156,
      'totalScans': 89,
      'totalDeploys': 134,
      'successRate': 94,
      'agents': {
        'build': 'active',
        'security': 'active',
        'deploy': 'active',
        'orchestrator': 'active',
      },
      'recentActivity': [
        {'type': 'build', 'status': 'success', 'time': '2 min ago'},
        {'type': 'deploy', 'status': 'success', 'time': '5 min ago'},
        {'type': 'security', 'status': 'success', 'time': '12 min ago'},
      ],
    };
  }

  Future<Map<String, dynamic>> getAnalytics() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/analytics'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        return _getMockAnalytics();
      }
    } catch (e) {
      return _getMockAnalytics();
    }
  }

  Map<String, dynamic> _getMockAnalytics() {
    return {
      'buildTimes': [
        45.2,
        42.8,
        48.1,
        44.5,
        46.3,
        43.9,
        47.2,
        45.8,
        44.1,
        46.7
      ],
    };
  }
}
