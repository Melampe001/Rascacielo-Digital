import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/api_client.dart';

class AgentExecutionDialog extends StatefulWidget {
  final String agentId;

  const AgentExecutionDialog({super.key, required this.agentId});

  @override
  State<AgentExecutionDialog> createState() => _AgentExecutionDialogState();
}

class _AgentExecutionDialogState extends State<AgentExecutionDialog> {
  bool _executing = false;
  String _status = 'Ready to execute';

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Execute ${widget.agentId} Agent'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (_executing)
            const CircularProgressIndicator()
          else
            const Icon(Icons.smart_toy, size: 64),
          const SizedBox(height: 16),
          Text(_status),
        ],
      ),
      actions: [
        TextButton(
          onPressed: _executing ? null : () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _executing ? null : _executeAgent,
          child: const Text('Execute'),
        ),
      ],
    );
  }

  Future<void> _executeAgent() async {
    setState(() {
      _executing = true;
      _status = 'Executing agent...';
    });

    final api = context.read<ApiClient>();
    try {
      final result = await api.executeAgent(
        agent: widget.agentId,
        action: 'execute',
      );

      setState(() {
        _executing = false;
        _status = 'Execution completed successfully';
      });

      await Future.delayed(const Duration(seconds: 1));

      if (mounted) {
        Navigator.of(context).pop({
          'success': true,
          'status': 'completed',
          'result': result,
        });
      }
    } catch (e) {
      setState(() {
        _executing = false;
        _status = 'Error: $e';
      });

      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        Navigator.of(context).pop({
          'success': false,
          'status': 'failed',
          'error': e.toString(),
        });
      }
    }
  }
}
