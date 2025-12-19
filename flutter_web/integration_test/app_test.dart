import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:rascacielo_digital_flutter/main.dart' as app;
import 'package:rascacielo_digital_flutter/features/dashboard/widgets/stat_card.dart';
import 'package:rascacielo_digital_flutter/features/agents/widgets/agent_card.dart';
import 'package:rascacielo_digital_flutter/features/agents/widgets/agent_execution_dialog.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('App Integration Tests', () {
    testWidgets('Dashboard loads correctly', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      expect(find.text('Dashboard'), findsOneWidget);
      expect(find.byType(StatCard), findsWidgets);
    });

    testWidgets('Navigate to Agents page', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      await tester.tap(find.text('Agents'));
      await tester.pumpAndSettle();

      expect(find.text('Agents'), findsOneWidget);
      expect(find.byType(AgentCard), findsWidgets);
    });

    testWidgets('Navigate to Analytics page', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      await tester.tap(find.text('Analytics'));
      await tester.pumpAndSettle();

      expect(find.text('Analytics & ML Predictions'), findsOneWidget);
    });

    testWidgets('Execute agent dialog opens', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      await tester.tap(find.text('Agents'));
      await tester.pumpAndSettle();

      // Find and tap the first Execute button
      await tester.tap(find.text('Execute').first);
      await tester.pumpAndSettle();

      expect(find.byType(AgentExecutionDialog), findsOneWidget);
    });
  });
}
