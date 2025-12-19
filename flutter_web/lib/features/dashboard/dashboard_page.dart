import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/api_client.dart';
import 'widgets/stat_card.dart';
import 'widgets/agent_status_card.dart';
import 'widgets/recent_activity.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  Map<String, dynamic>? _stats;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    final api = context.read<ApiClient>();
    try {
      final result = await api.getStats();
      setState(() {
        _stats = result;
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: _loadStats,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Dashboard',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 24),

            // Stats Grid
            GridView.count(
              shrinkWrap: true,
              crossAxisCount: 4,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 2,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                StatCard(
                  title: 'Total Builds',
                  value: '${_stats?['totalBuilds'] ?? 0}',
                  icon: Icons.build,
                  trend: '+12%',
                ),
                StatCard(
                  title: 'Security Scans',
                  value: '${_stats?['totalScans'] ?? 0}',
                  icon: Icons.security,
                  trend: '+8%',
                ),
                StatCard(
                  title: 'Deployments',
                  value: '${_stats?['totalDeploys'] ?? 0}',
                  icon: Icons.cloud_upload,
                  trend: '+15%',
                ),
                StatCard(
                  title: 'Success Rate',
                  value: '${_stats?['successRate'] ?? 0}%',
                  icon: Icons.check_circle,
                  trend: '+5%',
                ),
              ],
            ),

            const SizedBox(height: 32),

            // Agent Status
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: AgentStatusCard(agents: _stats?['agents'] ?? {}),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: RecentActivity(
                    activities: _stats?['recentActivity'] ?? [],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
