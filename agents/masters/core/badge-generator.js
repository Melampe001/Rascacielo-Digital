/**
 * Badge Generator - Rascacielo Digital
 * Generates quality badges in multiple formats
 */

class BadgeGenerator {
  constructor(config = {}) {
    this.config = {
      style: config.style || 'for-the-badge',
      ...config
    };
  }

  /**
   * Generate badge in specified format
   * @param {number} score - Score 0-100
   * @param {string} format - Format: markdown|html|svg|json|shields|all
   * @returns {string|Object} Badge in requested format
   */
  generate(score, format = 'markdown') {
    const grade = this.getGrade(score);
    const color = this.getColor(grade);
    const emoji = this.getEmoji(grade);

    const badge = {
      shields: this.generateShields(grade, score, color),
      markdown: this.generateMarkdown(grade, score, color, emoji),
      html: this.generateHTML(grade, score, color, emoji),
      svg: this.generateSVG(grade, score, color),
      json: this.generateJSON(grade, score, color)
    };

    return format === 'all' ? badge : badge[format];
  }

  /**
   * Get grade from score
   * @param {number} score - Score 0-100
   * @returns {string} Grade level
   */
  getGrade(score) {
    if (score >= 95) return 'PLATINUM';
    if (score >= 90) return 'GOLD';
    if (score >= 80) return 'SILVER';
    if (score >= 70) return 'BRONZE';
    return 'PENDING';
  }

  /**
   * Get color for grade
   * @param {string} grade - Grade level
   * @returns {string} Hex color
   */
  getColor(grade) {
    const colors = {
      PLATINUM: '9333ea',
      GOLD: 'fbbf24',
      SILVER: 'd1d5db',
      BRONZE: 'f97316',
      PENDING: '6b7280'
    };
    return colors[grade] || colors.PENDING;
  }

  /**
   * Get emoji for grade
   * @param {string} grade - Grade level
   * @returns {string} Emoji
   */
  getEmoji(grade) {
    const emojis = {
      PLATINUM: '💎',
      GOLD: '🥇',
      SILVER: '🥈',
      BRONZE: '🥉',
      PENDING: '⏳'
    };
    return emojis[grade] || emojis.PENDING;
  }

  /**
   * Generate Shields.io badge URL
   */
  generateShields(grade, score, color) {
    const label = 'Rascacielo';
    const message = `${grade} ${score}%`;
    return `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}?style=${this.config.style}&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMyA3djZjMCA1LjU1IDMuODQgMTAuNzQgOSAxMiA1LjE2LTEuMjYgOS02LjQ1IDktMTJWN2wtOS01eiIvPjwvc3ZnPg==`;
  }

  /**
   * Generate Markdown badge
   */
  generateMarkdown(grade, score, color, emoji) {
    const url = this.generateShields(grade, score, color);
    return `![Rascacielo ${grade} ${emoji}](${url})`;
  }

  /**
   * Generate HTML badge
   */
  generateHTML(grade, score, color, emoji) {
    const url = this.generateShields(grade, score, color);
    return `<img src="${url}" alt="Rascacielo ${grade} ${emoji}" />`;
  }

  /**
   * Generate SVG badge
   */
  generateSVG(grade, score, color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="35">
  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" style="stop-color:#${color};stop-opacity:1" />
    <stop offset="100%" style="stop-color:#${this.darkenColor(color)};stop-opacity:1" />
  </linearGradient>
  <rect width="200" height="35" rx="5" fill="url(#gradient)"/>
  <text x="100" y="22" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">
    🏛️ ${grade} ${score}%
  </text>
</svg>`;
  }

  /**
   * Generate JSON badge data
   */
  generateJSON(grade, score, color) {
    return {
      grade,
      score,
      color: `#${color}`,
      emoji: this.getEmoji(grade),
      timestamp: new Date().toISOString(),
      schemaVersion: 1
    };
  }

  /**
   * Darken a hex color by 20%
   */
  darkenColor(hex) {
    const num = parseInt(hex, 16);
    const r = Math.max(0, (num >> 16) - 51);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - 51);
    const b = Math.max(0, (num & 0x0000FF) - 51);
    return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  /**
   * Generate badge file (save to disk)
   * @param {number} score - Score 0-100
   * @param {string} format - Format
   * @param {string} outputPath - Output file path
   */
  async generateFile(score, format, outputPath) {
    const fs = require('fs');
    const badge = this.generate(score, format);
    
    if (format === 'json') {
      await fs.promises.writeFile(outputPath, JSON.stringify(badge, null, 2));
    } else {
      await fs.promises.writeFile(outputPath, badge);
    }
    
    return outputPath;
  }
}

module.exports = BadgeGenerator;
