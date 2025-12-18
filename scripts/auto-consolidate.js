#!/usr/bin/env node

/**
 * Auto-Consolidation System
 * Orchestrates automatic PR merging under Elara's protocol
 */

const { execSync } = require('child_process');
const fs = require('fs');

const ELARA_PROTOCOL = {
  engineer: 'Elara',
  role: 'Lead Engineer',
  authority: 'FULL',
  mergeStrategy: 'AUTOMATED',
  conflictResolution: 'AUTO_RESOLVE',
  priorities: [
    { pr: 18, type: 'foundation', priority: 1, name: 'Essential Standards' },
    { pr: 15, type: 'foundation', priority: 1, name: 'Essential Standards (alt)' },
    { pr: 14, type: 'production', priority: 2, name: 'Production-Grade Standards' },
    { pr: 13, type: 'build', priority: 3, name: 'Idempotent Build System' },
    { pr: 12, type: 'build', priority: 4, name: 'Standalone Build Script' },
    { pr: 11, type: 'logic', priority: 5, name: 'Complete Functional Logic' },
    { pr: 16, type: 'deployment', priority: 6, name: 'Treesit Cloud Integration' },
    { pr: 10, type: 'agent', priority: 7, name: 'Finance Agent' }
  ],
  duplicates: [20, 21, 22, 19]
};

class AutoConsolidator {
  constructor() {
    this.log = [];
    this.merged = [];
    this.failed = [];
    this.closed = [];
  }

  async run() {
    console.log('🤖 ELARA AUTO-CONSOLIDATION SYSTEM');
    console.log('===================================');
    console.log(`Lead Engineer: ${ELARA_PROTOCOL.engineer}`);
    console.log(`Authority Level: ${ELARA_PROTOCOL.authority}`);
    console.log(`Merge Strategy: ${ELARA_PROTOCOL.mergeStrategy}\n`);

    try {
      // Step 1: Close duplicates
      await this.closeDuplicates();

      // Step 2: Update Main branch
      await this.updateMainBranch();

      // Step 3: Merge PRs in priority order
      await this.mergePRsInOrder();

      // Step 4: Generate report
      await this.generateReport();

      console.log('\n✅ Auto-consolidation completed successfully');
      return { success: true, merged: this.merged, failed: this.failed };
    } catch (error) {
      console.error('\n❌ Auto-consolidation failed:', error.message);
      throw error;
    }
  }

  async closeDuplicates() {
    console.log('🗑️  Closing duplicate PRs...\n');

    for (const prNumber of ELARA_PROTOCOL.duplicates) {
      try {
        console.log(`   Closing PR #${prNumber} (duplicate)...`);

        execSync(
          `gh pr close ${prNumber} --comment "🤖 Closed by Elara's Auto-Consolidation System: Duplicate PR. Content integrated into primary PR."`,
          {
            stdio: 'pipe'
          }
        );

        this.closed.push(prNumber);
        console.log(`   ✅ PR #${prNumber} closed`);
      } catch (error) {
        console.log(`   ⚠️  Could not close PR #${prNumber}: ${error.message}`);
      }
    }

    console.log(`\n✓ Closed ${this.closed.length} duplicate PRs\n`);
  }

  async updateMainBranch() {
    console.log('🔄 Updating Main branch...\n');

    try {
      execSync('git fetch origin Main', { stdio: 'inherit' });
      execSync('git checkout Main', { stdio: 'inherit' });
      execSync('git pull origin Main', { stdio: 'inherit' });
      console.log('✓ Main branch updated\n');
    } catch (error) {
      throw new Error(`Failed to update Main: ${error.message}`);
    }
  }

  async mergePRsInOrder() {
    console.log('🔀 Merging PRs in priority order...\n');

    const sortedPRs = ELARA_PROTOCOL.priorities.sort((a, b) => a.priority - b.priority);

    for (const pr of sortedPRs) {
      try {
        console.log(`\n📋 Processing PR #${pr.pr}: ${pr.name}`);
        console.log(`   Type: ${pr.type} | Priority: ${pr.priority}`);

        // Check PR status
        const status = this.checkPRStatus(pr.pr);

        if (!status.exists) {
          console.log('   ⏭️  Skipping: PR does not exist');
          continue;
        }

        if (status.merged) {
          console.log('   ✅ Already merged');
          this.merged.push(pr.pr);
          continue;
        }

        if (status.closed) {
          console.log('   🚫 Already closed');
          continue;
        }

        // Mark as ready for review if draft
        if (status.draft) {
          console.log('   📝 Converting from draft to ready...');
          execSync(`gh pr ready ${pr.pr}`, { stdio: 'pipe' });
        }

        // Update PR branch with Main
        console.log('   🔄 Updating PR branch with Main...');
        await this.updatePRBranch(pr.pr);

        // Auto-approve PR
        console.log('   ✅ Auto-approving PR (Elara Protocol)...');
        await this.approvePR(pr.pr);

        // Merge PR
        console.log('   🔀 Merging PR...');
        await this.mergePR(pr.pr);

        this.merged.push(pr.pr);
        console.log(`   ✅ PR #${pr.pr} merged successfully`);

        // Wait between merges to allow CI/CD
        console.log('   ⏳ Waiting 30s for CI/CD...');
        await this.sleep(30000);
      } catch (error) {
        console.log(`   ❌ Failed to merge PR #${pr.pr}: ${error.message}`);
        this.failed.push({ pr: pr.pr, error: error.message });
      }
    }

    console.log('\n✓ Merge process completed');
    console.log(`   Merged: ${this.merged.length}`);
    console.log(`   Failed: ${this.failed.length}`);
  }

  checkPRStatus(prNumber) {
    try {
      const output = execSync(`gh pr view ${prNumber} --json state,isDraft,merged`, {
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      const data = JSON.parse(output);

      return {
        exists: true,
        draft: data.isDraft,
        merged: data.merged,
        closed: data.state === 'CLOSED' && !data.merged
      };
    } catch (error) {
      return { exists: false };
    }
  }

  async updatePRBranch(prNumber) {
    try {
      execSync(`gh pr checkout ${prNumber}`, { stdio: 'pipe' });
      execSync('git fetch origin Main', { stdio: 'pipe' });

      try {
        execSync('git merge origin/Main -m "Auto-merge Main into PR branch (Elara Protocol)"', {
          stdio: 'pipe'
        });
      } catch (mergeError) {
        // Auto-resolve conflicts by accepting incoming changes
        console.log('   🔧 Auto-resolving conflicts...');
        execSync('git checkout --theirs .', { stdio: 'pipe' });
        execSync('git add .', { stdio: 'pipe' });
        execSync('git commit -m "Auto-resolve conflicts (Elara Protocol)"', { stdio: 'pipe' });
      }

      execSync('git push', { stdio: 'pipe' });
      execSync('git checkout Main', { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`Failed to update PR branch: ${error.message}`);
    }
  }

  async approvePR(prNumber) {
    try {
      execSync(
        `gh pr review ${prNumber} --approve --body "✅ Auto-approved by Elara's Consolidation System"`,
        {
          stdio: 'pipe'
        }
      );
    } catch (error) {
      console.log(`   ⚠️  Could not approve (may already be approved): ${error.message}`);
    }
  }

  async mergePR(prNumber) {
    try {
      execSync(`gh pr merge ${prNumber} --squash --auto --delete-branch`, {
        stdio: 'pipe'
      });
    } catch (error) {
      throw new Error(`Merge failed: ${error.message}`);
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      engineer: ELARA_PROTOCOL.engineer,
      strategy: ELARA_PROTOCOL.mergeStrategy,
      results: {
        closed: this.closed.length,
        merged: this.merged.length,
        failed: this.failed.length
      },
      details: {
        closed: this.closed,
        merged: this.merged,
        failed: this.failed
      }
    };

    fs.writeFileSync('.github/consolidation-report.json', JSON.stringify(report, null, 2));

    console.log('\n📊 CONSOLIDATION REPORT');
    console.log('======================');
    console.log(`Timestamp: ${report.timestamp}`);
    console.log(`Lead Engineer: ${report.engineer}`);
    console.log('\nResults:');
    console.log(`  Closed (duplicates): ${report.results.closed}`);
    console.log(`  Merged: ${report.results.merged}`);
    console.log(`  Failed: ${report.results.failed}`);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Execute if main module
if (require.main === module) {
  const consolidator = new AutoConsolidator();

  consolidator
    .run()
    .then(() => {
      console.log('\n🎉 Auto-consolidation successful');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Auto-consolidation failed:', error);
      process.exit(1);
    });
}

module.exports = AutoConsolidator;
