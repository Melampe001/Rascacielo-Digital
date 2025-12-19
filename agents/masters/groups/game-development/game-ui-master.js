/**
 * Game UI Master - Sistema Imperial Elara
 * Expert in game user interfaces and UX
 */

class GameUIMaster {
  constructor(config = {}) {
    this.name = 'Game UI Master';
    this.version = '1.0.0';
    this.owner = 'Elara';
    this.expertise = [
      'HUD design',
      'Menu systems',
      'User feedback',
      'Accessibility',
      'Responsive layouts',
      'Animation & transitions',
      'Input handling',
      'UI optimization',
      'Visual hierarchy',
      'Player communication'
    ];
    this.bestPractices = [
      'Keep HUD minimal and clear',
      'Provide immediate feedback',
      'Use consistent styling',
      'Implement accessibility features',
      'Test on multiple resolutions',
      'Use smooth animations',
      'Handle touch and mouse input',
      'Optimize UI performance',
      'Follow platform guidelines',
      'Add tutorials and tooltips'
    ];
  }

  async analyze(code, options = {}) {
    return {
      issues: await this.detectIssues(code),
      recommendations: this.getRecommendations(code),
      accessibility: this.analyzeAccessibility(code),
      score: this.calculateScore(code)
    };
  }

  async detectIssues(code) {
    const issues = [];
    
    if (!code.includes('aria-') && !code.includes('role=')) {
      issues.push({
        severity: 'medium',
        message: 'Missing ARIA labels for accessibility',
        line: 0
      });
    }
    
    if (code.includes('fixed') && !code.includes('@media')) {
      issues.push({
        severity: 'medium',
        message: 'Fixed sizes without responsive breakpoints',
        line: 0
      });
    }
    
    return issues;
  }

  getRecommendations(code) {
    return [
      'Add ARIA labels for screen readers',
      'Implement keyboard navigation',
      'Use semantic HTML elements',
      'Add loading states for async actions',
      'Implement proper focus management'
    ];
  }

  analyzeAccessibility(code) {
    const features = {
      ariaLabels: code.includes('aria-'),
      semanticHTML: code.includes('<button') || code.includes('<nav'),
      keyboardNav: code.includes('keydown') || code.includes('keypress'),
      focusManagement: code.includes('focus')
    };
    
    const score = (Object.values(features).filter(v => v).length / Object.keys(features).length) * 100;
    
    return {
      features,
      score,
      compliant: score >= 75
    };
  }

  calculateScore(code) {
    let score = 70;
    
    if (code.includes('aria-')) score += 10;
    if (code.includes('@media')) score += 10;
    if (code.includes('transition') || code.includes('animation')) score += 5;
    if (code.includes('onclick') || code.includes('addEventListener')) score += 5;
    
    return Math.min(score, 100);
  }

  async validate(code) {
    const checks = {
      hasInteractivity: code.includes('onclick') || code.includes('addEventListener'),
      isResponsive: code.includes('@media') || code.includes('responsive'),
      hasAccessibility: code.includes('aria-') || code.includes('role='),
      hasFeedback: code.includes('transition') || code.includes('animation')
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
    const templates = {
      'hud': this.scaffoldHUD(options),
      'menu': this.scaffoldMenu(options),
      'modal': this.scaffoldModal(options),
      'inventory': this.scaffoldInventory(options)
    };
    return templates[projectType] || templates['hud'];
  }

  scaffoldHUD(options) {
    return {
      files: {
        'HUD.jsx': `import React from 'react';
import './HUD.css';

const HUD = ({ health, score, ammo }) => {
  return (
    <div className="hud" role="status" aria-live="polite">
      <div className="hud-item" aria-label="Player Health">
        <span className="hud-label">Health:</span>
        <div className="health-bar">
          <div 
            className="health-fill" 
            style={{ width: \`\${health}%\` }}
            aria-valuenow={health}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>
      
      <div className="hud-item" aria-label="Score">
        <span className="hud-label">Score:</span>
        <span className="hud-value">{score}</span>
      </div>
      
      <div className="hud-item" aria-label="Ammunition">
        <span className="hud-label">Ammo:</span>
        <span className="hud-value">{ammo}</span>
      </div>
    </div>
  );
};

export default HUD;
`,
        'HUD.css': `.hud {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 20px;
  font-family: 'Arial', sans-serif;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hud-label {
  font-weight: bold;
  font-size: 14px;
}

.hud-value {
  font-size: 18px;
  color: #FFD700;
}

.health-bar {
  width: 100px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid white;
  border-radius: 10px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background: linear-gradient(to right, #FF0000, #00FF00);
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .hud {
    flex-direction: column;
    gap: 10px;
  }
}
`
      }
    };
  }

  scaffoldMenu(options) {
    return {
      files: {
        'MainMenu.jsx': `import React, { useState } from 'react';
import './MainMenu.css';

const MainMenu = ({ onPlay, onSettings, onQuit }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuItems = [
    { label: 'Play', action: onPlay },
    { label: 'Settings', action: onSettings },
    { label: 'Quit', action: onQuit }
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => Math.min(menuItems.length - 1, prev + 1));
    } else if (e.key === 'Enter') {
      menuItems[selectedIndex].action();
    }
  };

  return (
    <div className="main-menu" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1 className="menu-title">Game Title</h1>
      <nav className="menu-items" role="navigation">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            className={\`menu-button \${index === selectedIndex ? 'selected' : ''}\`}
            onClick={item.action}
            onMouseEnter={() => setSelectedIndex(index)}
            aria-label={item.label}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MainMenu;
`,
        'MainMenu.css': `.main-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.menu-title {
  font-size: 48px;
  color: white;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 4px;
  animation: glow 2s ease-in-out infinite;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-button {
  padding: 15px 60px;
  font-size: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid white;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.menu-button:hover,
.menu-button.selected {
  background: white;
  color: #667eea;
  transform: scale(1.1);
}

@keyframes glow {
  0%, 100% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
  50% { text-shadow: 0 0 30px rgba(255, 255, 255, 0.8); }
}
`
      }
    };
  }

  scaffoldModal(options) {
    return {
      files: {
        'Modal.jsx': `import React, { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
`
      }
    };
  }

  scaffoldInventory(options) {
    return {
      files: {
        'Inventory.jsx': `import React from 'react';
import './Inventory.css';

const Inventory = ({ items, onItemSelect }) => {
  return (
    <div className="inventory" role="grid" aria-label="Inventory">
      <h3>Inventory</h3>
      <div className="inventory-grid">
        {items.map((item, index) => (
          <button
            key={index}
            className="inventory-slot"
            onClick={() => onItemSelect(item)}
            aria-label={\`Item: \${item.name}, Quantity: \${item.quantity}\`}
          >
            {item.icon && <img src={item.icon} alt={item.name} />}
            <span className="item-quantity">{item.quantity}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
`
      }
    };
  }
}

module.exports = GameUIMaster;
