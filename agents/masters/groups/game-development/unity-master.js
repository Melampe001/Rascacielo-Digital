/**
 * Unity Master - Sistema Imperial Elara
 * Expert in Unity game development
 */

class UnityMaster {
  constructor(config = {}) {
    this.name = 'Unity Master';
    this.version = '1.0.0';
    this.owner = 'Elara';
    this.expertise = [
      'Unity C# scripting',
      'Game objects & components',
      'Physics & collision',
      'Animation systems',
      'UI/UX for games',
      'Prefab management',
      'Scene management',
      'Asset optimization',
      'Performance profiling',
      'Build pipelines'
    ];
    this.bestPractices = [
      'Use object pooling for performance',
      'Implement singleton pattern wisely',
      'Use coroutines for async operations',
      'Optimize draw calls',
      'Use scriptable objects for data',
      'Implement proper state management',
      'Use Unity events for decoupling',
      'Profile regularly',
      'Follow naming conventions',
      'Document complex systems'
    ];
  }

  async analyze(code, options = {}) {
    return {
      issues: await this.detectIssues(code),
      recommendations: this.getRecommendations(code),
      performance: this.analyzePerformance(code),
      score: this.calculateScore(code)
    };
  }

  async detectIssues(code) {
    const issues = [];
    
    if (code.includes('FindObjectOfType') && code.includes('Update')) {
      issues.push({
        severity: 'high',
        message: 'FindObjectOfType in Update() causes performance issues',
        line: 0
      });
    }
    
    if (code.includes('Instantiate') && !code.includes('Pool')) {
      issues.push({
        severity: 'medium',
        message: 'Consider using object pooling for frequently instantiated objects',
        line: 0
      });
    }
    
    return issues;
  }

  getRecommendations(code) {
    return [
      'Use object pooling for bullets/enemies',
      'Cache component references',
      'Use layers and tags efficiently',
      'Implement LOD system for complex scenes'
    ];
  }

  analyzePerformance(code) {
    const optimizations = [];
    
    if (code.includes('GetComponent') && code.includes('Update')) {
      optimizations.push('Cache GetComponent calls');
    }
    
    return { optimizations, impact: optimizations.length * 10 };
  }

  calculateScore(code) {
    let score = 70;
    if (code.includes('MonoBehaviour')) score += 10;
    if (code.includes('Awake') || code.includes('Start')) score += 5;
    if (!code.includes('FindObjectOfType') || !code.includes('Update')) score += 10;
    if (code.includes('ObjectPool')) score += 5;
    return Math.min(score, 100);
  }

  async validate(code) {
    const checks = {
      properStructure: code.includes('MonoBehaviour'),
      noPerformanceIssues: !code.includes('FindObjectOfType') || !code.includes('Update'),
      properLifecycle: code.includes('Awake') || code.includes('Start')
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
      'player-controller': this.scaffoldPlayerController(options),
      'game-manager': this.scaffoldGameManager(options),
      'object-pool': this.scaffoldObjectPool(options)
    };
    return templates[projectType] || templates['player-controller'];
  }

  scaffoldPlayerController(options) {
    return {
      files: {
        'PlayerController.cs': `using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [SerializeField] private float moveSpeed = 5f;
    private Rigidbody2D rb;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        float moveX = Input.GetAxis("Horizontal");
        float moveY = Input.GetAxis("Vertical");
        Vector2 movement = new Vector2(moveX, moveY) * moveSpeed;
        rb.velocity = movement;
    }
}
`
      }
    };
  }

  scaffoldGameManager(options) {
    return {
      files: {
        'GameManager.cs': `using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
}
`
      }
    };
  }

  scaffoldObjectPool(options) {
    return {
      files: {
        'ObjectPool.cs': `using System.Collections.Generic;
using UnityEngine;

public class ObjectPool : MonoBehaviour
{
    [SerializeField] private GameObject prefab;
    [SerializeField] private int poolSize = 10;
    private Queue<GameObject> pool = new Queue<GameObject>();

    void Start()
    {
        for (int i = 0; i < poolSize; i++)
        {
            GameObject obj = Instantiate(prefab);
            obj.SetActive(false);
            pool.Enqueue(obj);
        }
    }

    public GameObject Get()
    {
        if (pool.Count > 0)
        {
            GameObject obj = pool.Dequeue();
            obj.SetActive(true);
            return obj;
        }
        return Instantiate(prefab);
    }

    public void Return(GameObject obj)
    {
        obj.SetActive(false);
        pool.Enqueue(obj);
    }
}
`
      }
    };
  }
}

module.exports = UnityMaster;
