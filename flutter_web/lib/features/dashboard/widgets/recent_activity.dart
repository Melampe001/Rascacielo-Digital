import 'package:flutter/material.dart';

class RecentActivity extends StatelessWidget {
  final List<dynamic> activities;

  const RecentActivity({super.key, required this.activities});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            if (activities.isEmpty)
              const Center(
                child: Text('No recent activity'),
              )
            else
              ...activities.map((activity) {
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    children: [
                      Icon(
                        _getIconForType(activity['type'] as String? ?? ''),
                        color: activity['status'] == 'success'
                            ? Colors.green
                            : Colors.red,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              activity['type']?.toString().toUpperCase() ?? '',
                              style: Theme.of(context).textTheme.bodyLarge,
                            ),
                            Text(
                              activity['time']?.toString() ?? '',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: activity['status'] == 'success'
                              ? Colors.green.withOpacity(0.2)
                              : Colors.red.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          activity['status']?.toString().toUpperCase() ?? '',
                          style: TextStyle(
                            color: activity['status'] == 'success'
                                ? Colors.green
                                : Colors.red,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
          ],
        ),
      ),
    );
  }

  IconData _getIconForType(String type) {
    switch (type.toLowerCase()) {
      case 'build':
        return Icons.build;
      case 'deploy':
        return Icons.cloud_upload;
      case 'security':
        return Icons.security;
      default:
        return Icons.info;
    }
  }
}
