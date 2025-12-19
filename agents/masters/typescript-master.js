/**
 * TypeScript Master - Rascacielos Digital
 * 
 * Agente maestro especializado en TypeScript
 * Mejores prácticas aprobadas 2025
 */

class TypeScriptMaster {
  constructor(config = {}) {
    this.name = 'TypeScript Master';
    this.version = '1.0.0';
    this.expertise = [
      'TypeScript 5.x',
      'Strict Mode',
      'Type Inference',
      'Generics & Utility Types',
      'NestJS Framework',
      'TypeORM',
      'Decorators',
      'Advanced Types'
    ];
    this.bestPractices = [
      'Enable strict mode in tsconfig.json',
      'Avoid using any type',
      'Leverage type inference',
      'Use interfaces for object shapes',
      'Use enums for constants',
      'Prefer unknown over any',
      'Use utility types (Partial, Pick, Omit)',
      'Define return types explicitly'
    ];
    this.config = { ...config };
  }

  /**
   * Analiza código TypeScript y proporciona recomendaciones
   */
  async analyze(code, options = {}) {
    const issues = [];
    const recommendations = [];

    // Verificar uso de any
    if (code.includes(': any')) {
      issues.push({
        type: 'any_usage',
        severity: 'warning',
        message: 'Avoid using "any" type, use specific types or "unknown"'
      });
    }

    // Verificar tipos de retorno
    if (code.includes('function') && !code.includes('): ')) {
      recommendations.push({
        type: 'missing_return_type',
        message: 'Consider adding explicit return types to functions'
      });
    }

    // Verificar uso de non-null assertion
    if (code.includes('!.') || code.includes('!;')) {
      issues.push({
        type: 'non_null_assertion',
        severity: 'warning',
        message: 'Avoid non-null assertions, use proper type guards instead'
      });
    }

    return {
      issues,
      recommendations,
      score: issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 10))
    };
  }

  /**
   * Valida código según mejores prácticas
   */
  async validate(code) {
    const validations = {
      hasExplicitTypes: code.includes(': ') && code.includes('interface'),
      avoidsAny: !code.includes(': any'),
      hasReturnTypes: code.includes('): '),
      usesInterfaces: code.includes('interface '),
      usesGenerics: code.includes('<') && code.includes('>')
    };

    const passed = Object.values(validations).filter(v => v).length;
    const total = Object.keys(validations).length;

    return {
      valid: passed >= total * 0.6,
      validations,
      score: (passed / total) * 100
    };
  }

  /**
   * Genera código scaffold siguiendo best practices
   */
  async scaffold(projectType, options = {}) {
    const templates = {
      nestjs: this._scaffoldNestJS(options),
      library: this._scaffoldLibrary(options),
      api: this._scaffoldAPI(options),
      express: this._scaffoldExpress(options)
    };

    return templates[projectType] || templates.nestjs;
  }

  _scaffoldNestJS(options) {
    return {
      files: {
        'src/main.ts': `/**
 * NestJS Application - ${options.name || 'API'}
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
`,
        'src/app.module.ts': `import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
`,
        'src/app.controller.ts': `import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
`,
        'src/app.service.ts': `import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
`,
        'tsconfig.json': `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true
  }
}
`,
        'package.json': `{
  "name": "${options.name || 'nestjs-api'}",
  "version": "1.0.0",
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "lint": "eslint \"{src,test}/**/*.ts\""
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/node": "^20.3.1",
    "typescript": "^5.1.3"
  }
}
`
      }
    };
  }

  _scaffoldLibrary(options) {
    return {
      files: {
        'src/index.ts': `/**
 * ${options.name || 'Library'}
 */

export interface Config {
  apiKey?: string;
  timeout?: number;
}

export class ${options.name || 'Library'} {
  private config: Config;

  constructor(config: Config = {}) {
    this.config = config;
  }

  public async process<T>(data: T): Promise<T> {
    return data;
  }
}

export default ${options.name || 'Library'};
`,
        'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`
      }
    };
  }

  _scaffoldAPI(options) {
    return this._scaffoldNestJS(options);
  }

  _scaffoldExpress(options) {
    return {
      files: {
        'src/index.ts': `import express, { Request, Response, NextFunction } from 'express';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello TypeScript!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`
      }
    };
  }

  /**
   * Optimiza código existente
   */
  async optimize(code) {
    let optimized = code;
    const optimizations = [];

    // Optimización 1: Reemplazar any con unknown
    if (optimized.includes(': any')) {
      optimizations.push('Replace "any" with more specific types or "unknown"');
    }

    // Optimización 2: Usar utility types
    if (optimized.includes('interface') && !optimized.includes('Partial<')) {
      optimizations.push('Consider using utility types (Partial, Pick, Omit)');
    }

    // Optimización 3: Agregar readonly
    if (optimized.includes('interface') && !optimized.includes('readonly')) {
      optimizations.push('Consider using readonly for immutable properties');
    }

    return {
      code: optimized,
      optimizations,
      improved: optimizations.length > 0
    };
  }

  /**
   * Proporciona guía y documentación
   */
  getGuidance(topic) {
    const guides = {
      'types': {
        title: 'TypeScript Types Best Practices',
        content: `
# TypeScript Types

## Basic Types
\`\`\`typescript
// Primitive types
const name: string = 'John';
const age: number = 30;
const active: boolean = true;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ['John', 'Jane'];

// Tuples
const tuple: [string, number] = ['Alice', 25];
\`\`\`

## Interfaces vs Types
\`\`\`typescript
// Interface (preferred for object shapes)
interface User {
  id: number;
  name: string;
  email?: string; // Optional
  readonly createdAt: Date; // Immutable
}

// Type alias (for unions, intersections)
type ID = string | number;
type Status = 'active' | 'inactive';
\`\`\`

## Generics
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

interface Repository<T> {
  find(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}
\`\`\`
        `
      },
      'utility-types': {
        title: 'Utility Types',
        content: `
# TypeScript Utility Types

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - all properties optional
type PartialUser = Partial<User>;

// Pick - select specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Omit - exclude specific properties
type PublicUser = Omit<User, 'password'>;

// Record - create object type
type UserMap = Record<string, User>;

// ReturnType - extract function return type
function getUser() {
  return { id: 1, name: 'John' };
}
type UserReturn = ReturnType<typeof getUser>;
\`\`\`
        `
      },
      'strict-mode': {
        title: 'Strict Mode Configuration',
        content: `
# TypeScript Strict Mode

Enable strict mode in tsconfig.json:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
\`\`\`
        `
      }
    };

    return guides[topic] || {
      title: 'TypeScript Best Practices',
      content: 'Use strict mode, avoid any, leverage type system'
    };
  }

  /**
   * Detecta anti-patterns y problemas comunes
   */
  async detectIssues(code) {
    const issues = [];

    // Anti-pattern 1: Uso excesivo de any
    const anyCount = (code.match(/: any/g) || []).length;
    if (anyCount > 2) {
      issues.push({
        type: 'excessive_any',
        severity: 'error',
        message: `Found ${anyCount} uses of "any" type. Use specific types instead.`,
        line: null
      });
    }

    // Anti-pattern 2: Non-null assertions
    if (code.includes('!.') || code.includes('!;')) {
      issues.push({
        type: 'non_null_assertion',
        severity: 'warning',
        message: 'Avoid non-null assertions, use type guards or optional chaining',
        line: null
      });
    }

    // Anti-pattern 3: Type assertions (as)
    if ((code.match(/ as /g) || []).length > 3) {
      issues.push({
        type: 'excessive_type_assertions',
        severity: 'warning',
        message: 'Too many type assertions. Consider improving type definitions.',
        line: null
      });
    }

    // Anti-pattern 4: Missing return types
    if (code.includes('function ') && !code.includes('): ')) {
      issues.push({
        type: 'missing_return_type',
        severity: 'info',
        message: 'Add explicit return types to functions',
        line: null
      });
    }

    return issues;
  }
}

module.exports = TypeScriptMaster;
