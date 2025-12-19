import 'package:flutter/material.dart';

class AgentCard extends StatelessWidget {
  final String name;
  final IconData icon;
  final VoidCallback onExecute;

  const AgentCard({
    super.key,
    required this.name,
    required this.icon,
    required this.onExecute,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onExecute,
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 64),
              const SizedBox(height: 16),
              Text(
                name,
                style: Theme.of(context).textTheme.titleLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              ElevatedButton.icon(
                onPressed: onExecute,
                icon: const Icon(Icons.play_arrow),
                label: const Text('Execute'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
