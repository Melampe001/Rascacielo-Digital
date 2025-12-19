import 'package:flutter/material.dart';
import 'widgets/agent_card.dart';
import 'widgets/agent_execution_dialog.dart';

class AgentsPage extends StatelessWidget {
  const AgentsPage({super.key});

  static const agents = [
    {'name': 'Build Agent', 'id': 'build', 'icon': Icons.build},
    {'name': 'Security Agent', 'id': 'security', 'icon': Icons.security},
    {'name': 'Deploy Agent', 'id': 'deploy', 'icon': Icons.cloud_upload},
    {'name': 'Orchestrator', 'id': 'orchestrator', 'icon': Icons.account_tree},
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Agents',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 24),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                maxCrossAxisExtent: 300,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 1.2,
              ),
              itemCount: agents.length,
              itemBuilder: (context, index) {
                final agent = agents[index];
                return AgentCard(
                  name: agent['name'] as String,
                  icon: agent['icon'] as IconData,
                  onExecute: () => _executeAgent(context, agent['id'] as String),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _executeAgent(BuildContext context, String agentId) async {
    final result = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (context) => AgentExecutionDialog(agentId: agentId),
    );

    if (result != null && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Agent executed: ${result['status']}'),
          backgroundColor: result['success'] ? Colors.green : Colors.red,
        ),
      );
    }
  }
}
