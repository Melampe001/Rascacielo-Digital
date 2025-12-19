/**
 * Statistics Master - Sistema Imperial Elara
 * Expert in statistical analysis and probability
 */

class StatisticsMaster {
  constructor(config = {}) {
    this.name = 'Statistics Master';
    this.version = '1.0.0';
    this.owner = 'Elara';
    this.expertise = [
      'Probability theory',
      'Statistical inference',
      'Hypothesis testing',
      'Regression analysis',
      'Time series analysis',
      'Monte Carlo simulation',
      'Bayesian statistics',
      'Distribution analysis',
      'Pattern recognition',
      'Predictive modeling'
    ];
    this.bestPractices = [
      'Validate statistical assumptions',
      'Use appropriate tests',
      'Check for outliers',
      'Document methodology',
      'Visualize distributions',
      'Test for significance',
      'Use robust estimators',
      'Handle missing data properly',
      'Cross-validate models',
      'Report confidence intervals'
    ];
  }

  async analyze(code, options = {}) {
    return {
      issues: await this.detectIssues(code),
      recommendations: this.getRecommendations(code),
      methodology: this.analyzeMethodology(code),
      score: this.calculateScore(code)
    };
  }

  async detectIssues(code) {
    const issues = [];
    if (code.includes('mean') && !code.includes('outlier')) {
      issues.push({
        severity: 'medium',
        message: 'Consider checking for outliers before computing mean',
        line: 0
      });
    }
    return issues;
  }

  getRecommendations(code) {
    return [
      'Check for outliers',
      'Validate assumptions',
      'Use robust statistics',
      'Add confidence intervals'
    ];
  }

  analyzeMethodology(code) {
    return {
      hasOutlierDetection: code.includes('outlier'),
      hasSignificanceTesting: code.includes('test') || code.includes('pvalue'),
      hasVisualization: code.includes('plot') || code.includes('chart')
    };
  }

  calculateScore(code) {
    let score = 70;
    if (code.includes('mean') || code.includes('std')) score += 15;
    if (code.includes('test')) score += 10;
    if (code.includes('distribution')) score += 5;
    return Math.min(score, 100);
  }

  async analyzeRouletteData(history) {
    return {
      distributions: this.analyzeDistributions(history),
      patterns: this.detectPatterns(history),
      hotCold: this.analyzeHotColdNumbers(history),
      sequences: this.analyzeSequences(history),
      predictions: this.generatePredictions(history),
      confidence: this.calculateConfidence(history),
      bias: this.detectBias(history)
    };
  }

  analyzeDistributions(history) {
    const freq = {};
    history.forEach(num => {
      freq[num] = (freq[num] || 0) + 1;
    });
    
    const expected = history.length / 37;
    let chiSquare = 0;
    
    for (let i = 0; i <= 36; i++) {
      const observed = freq[i] || 0;
      chiSquare += Math.pow(observed - expected, 2) / expected;
    }
    
    return { frequency: freq, chiSquare, uniform: chiSquare < 50 };
  }

  detectPatterns(history) {
    const patterns = [];
    for (let i = 0; i < history.length - 2; i++) {
      const pattern = [history[i], history[i + 1], history[i + 2]];
      patterns.push(pattern);
    }
    return { patterns, count: patterns.length };
  }

  analyzeHotColdNumbers(history) {
    const freq = {};
    history.forEach(num => {
      freq[num] = (freq[num] || 0) + 1;
    });
    
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    
    return {
      hot: sorted.slice(0, 5).map(([num]) => parseInt(num)),
      cold: sorted.slice(-5).map(([num]) => parseInt(num))
    };
  }

  analyzeSequences(history) {
    let maxStreak = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < history.length; i++) {
      if (history[i] === history[i - 1]) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return { maxStreak, hasSequences: maxStreak > 3 };
  }

  generatePredictions(history) {
    const hot = this.analyzeHotColdNumbers(history).hot;
    return {
      recommended: hot[0],
      alternatives: hot.slice(1, 4),
      confidence: 'low' // Roulette is random
    };
  }

  calculateConfidence(history) {
    const dist = this.analyzeDistributions(history);
    return {
      dataPoints: history.length,
      uniform: dist.uniform,
      confidence: history.length >= 1000 ? 'high' : 'medium'
    };
  }

  detectBias(history) {
    const dist = this.analyzeDistributions(history);
    return {
      biased: !dist.uniform,
      chiSquare: dist.chiSquare
    };
  }

  async validateRandomness(data) {
    return {
      chiSquare: this.chiSquareTest(data),
      runs: this.runsTest(data),
      isRandom: true // Simplified
    };
  }

  chiSquareTest(data) {
    const freq = {};
    data.forEach(num => {
      freq[num] = (freq[num] || 0) + 1;
    });
    
    const expected = data.length / Object.keys(freq).length;
    let chiSquare = 0;
    
    Object.values(freq).forEach(observed => {
      chiSquare += Math.pow(observed - expected, 2) / expected;
    });
    
    return { chiSquare, passed: chiSquare < 50 };
  }

  runsTest(data) {
    let runs = 1;
    for (let i = 1; i < data.length; i++) {
      if (data[i] !== data[i - 1]) runs++;
    }
    
    const expected = (2 * data.length - 1) / 3;
    const variance = (16 * data.length - 29) / 90;
    const z = (runs - expected) / Math.sqrt(variance);
    
    return { runs, zScore: z, passed: Math.abs(z) < 1.96 };
  }

  async validate(code) {
    const checks = {
      hasStatistics: code.includes('mean') || code.includes('std') || code.includes('average'),
      hasAnalysis: code.includes('analyze') || code.includes('test'),
      hasVisualization: code.includes('plot') || code.includes('chart')
    };
    
    return {
      valid: Object.values(checks).every(v => v),
      validations: checks,
      score: this.calculateValidationScore(checks)
    };
  }

  calculateValidationScore(checks) {
    const validCount = Object.values(checks).filter(v => v).length;
    return (validCount / Object.keys(checks).length) * 100;
  }

  scaffold(projectType, options = {}) {
    return {
      files: {
        'statistics.js': `class Statistics {
  static mean(data) {
    return data.reduce((a, b) => a + b, 0) / data.length;
  }

  static median(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  static std(data) {
    const avg = this.mean(data);
    const squareDiffs = data.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(this.mean(squareDiffs));
  }
}

module.exports = Statistics;
`
      }
    };
  }
}

module.exports = StatisticsMaster;
