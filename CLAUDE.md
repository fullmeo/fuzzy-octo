# 🐙 CLAUDE.md - AI Assistant Guide for Fuzzy-Octo

> **"Your comprehensive guide to understanding and working with the Fuzzy-Octo codebase"**
> Last updated: 2026-03-01

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Technology Stack](#technology-stack)
4. [Development Workflows](#development-workflows)
5. [Coding Conventions](#coding-conventions)
6. [Security Practices](#security-practices)
7. [Testing & Quality](#testing--quality)
8. [Deployment](#deployment)
9. [AI Assistant Guidelines](#ai-assistant-guidelines)
10. [Common Tasks](#common-tasks)

---

## 🎯 Project Overview

**Fuzzy-Octo** is an intelligent AI coding assistant that transforms vague developer ideas into precise code solutions. The project uses the metaphor of an octopus's 8 tentacles to provide exactly 8 different solutions for every coding challenge.

### Core Philosophy
- **Fuzzy Understanding**: Interpret imprecise developer requests
- **8-Solution System**: Always provide exactly 8 diverse solutions
- **Context Awareness**: Learn from project structure and coding style
- **Developer Joy**: Prioritize delightful user experience

### Project Metrics
- **Main Project**: fuzzy-octo (React + TypeScript + Express)
- **Subprojects**: 2 tokenomics games (React + TypeScript)
- **Total Security Fixes**: 186 vulnerabilities eliminated
- **Current Status**: Production-ready, 0 vulnerabilities ✅

---

## 📁 Repository Structure

This is a **monorepo** containing 3 independent React applications:

```
fuzzy-octo/
├── 🐙 Main Project (fuzzy-octo)
│   ├── src/                    # React frontend
│   │   ├── App.tsx            # Main application
│   │   ├── index.tsx          # Entry point
│   │   ├── components/        # React components
│   │   │   └── PinkyOctopus.tsx
│   │   └── styles/            # CSS/styling
│   ├── api/                   # Express backend
│   │   ├── index.js           # Express server
│   │   └── fuzzy_api_system.ts # API logic
│   ├── public/                # Static assets
│   ├── docs/                  # Documentation
│   │   ├── fuzzy_api_complete_docs.md
│   │   ├── fuzzy_onboarding_system.md
│   │   └── AI_MASTERY_ROADMAP.md
│   ├── package.json           # Main dependencies
│   └── tsconfig.json          # TypeScript config
│
├── 🎮 Subproject 1: Animal Crossing Tokenomics
│   └── Fuzzy-Sea-quest/fuzzy-sea-quest/
│       ├── src/               # React app
│       ├── public/
│       └── package.json       # Independent dependencies
│
├── 🌊 Subproject 2: Fuzzy Sea Quest Game
│   └── Fuzzy-Sea-quest/fuzzy-sea-quest-game/
│       ├── src/               # React app
│       ├── public/
│       └── package.json       # Independent dependencies
│
├── 📄 Documentation
│   ├── README.md              # Project overview
│   ├── CLAUDE.md              # This file (AI assistant guide)
│   ├── SECURITY_AUDIT_REPORT.md
│   ├── SECURITY_FIXES_SUMMARY.md
│   ├── SUBPROJECTS_SECURITY_AUDIT.md
│   └── PR_DESCRIPTION.md      # Pull request template
│
└── 🔒 Configuration
    ├── .gitignore
    ├── package.json           # Root package config
    └── tsconfig.json          # Root TypeScript config
```

### Key Characteristics

- **Monorepo Architecture**: One repository, 3 independent projects
- **Shared Dependencies**: Security overrides applied across all projects
- **Independent Builds**: Each project can build/run independently
- **Unified Security**: All projects follow same security standards

---

## 🛠️ Technology Stack

### Main Project (fuzzy-octo)

#### Frontend
```json
{
  "framework": "React 19.1.0",
  "language": "TypeScript 4.9.5",
  "ui_library": "react-scripts 5.0.1",
  "routing": "react-router-dom 7.6.1"
}
```

#### Backend
```json
{
  "runtime": "Node.js",
  "framework": "Express 4.18.2",
  "ai_integration": "OpenAI API 4.103.0",
  "middleware": ["cors 2.8.5", "dotenv 16.5.0"]
}
```

#### Build Tools
- **Create React App** (react-scripts)
- **TypeScript Compiler** (tsc)
- **Webpack** (via react-scripts)

### Subprojects

Both subprojects use:
- **React 18.2.0**
- **TypeScript 4.9.4**
- **react-scripts 5.0.1**
- **react-router-dom** (v5.3.3 for animal-crossing, v6.8.0 for sea-quest)

---

## 🔄 Development Workflows

### 1. Initial Setup

```bash
# Clone repository
git clone https://github.com/fullmeo/fuzzy-octo.git
cd fuzzy-octo

# Install main project dependencies
npm install

# Install subproject dependencies
cd Fuzzy-Sea-quest/fuzzy-sea-quest
npm install

cd ../fuzzy-sea-quest-game
npm install

cd ../..
```

### 2. Running Projects

#### Main Project
```bash
# Development server (frontend)
npm start                    # Runs on http://localhost:3000

# Backend API server
node api/index.js            # Runs on configured port

# Build for production
npm run build

# Run tests
npm test
```

#### Subprojects
```bash
# Animal Crossing Tokenomics
cd Fuzzy-Sea-quest/fuzzy-sea-quest
npm start                    # Runs on http://localhost:3000

# Fuzzy Sea Quest Game
cd Fuzzy-Sea-quest/fuzzy-sea-quest-game
npm start                    # Runs on http://localhost:3000
```

### 3. Git Workflow

#### Branch Naming Convention
```
claude/<descriptive-name>-<session-id>

Examples:
- claude/fix-security-vulnerabilities-abc123
- claude/add-new-feature-xyz789
- claude/analyze-system-status-0121RPWYpArEeFyLEGtWdzwC
```

#### Commit Message Format
```
<type>: <short description>

<detailed description with context>

## Changes
- Change 1
- Change 2

## Impact
- Impact description

## Testing
- Test description
```

**Types:**
- `Security:` - Security fixes
- `Feature:` - New features
- `Fix:` - Bug fixes
- `Docs:` - Documentation
- `Refactor:` - Code refactoring
- `Test:` - Testing changes
- `Chore:` - Maintenance tasks

#### Example Workflow
```bash
# Create new branch
git checkout -b claude/feature-name-session123

# Make changes
# ... edit files ...

# Stage and commit
git add -A
git commit -m "Feature: Add new component

Added PinkyOctopus component with 8-tentacle suggestion system.

## Changes
- Created PinkyOctopus.tsx component
- Added styling and animations
- Integrated with API

## Impact
- Improves user experience
- Adds visual feedback

## Testing
- Manual testing completed
- Component renders correctly"

# Push to remote
git push -u origin claude/feature-name-session123
```

### 4. Security Audit Workflow

**CRITICAL**: Always run security audits after dependency changes.

```bash
# Audit main project
npm audit

# Audit subprojects
cd Fuzzy-Sea-quest/fuzzy-sea-quest
npm audit

cd ../fuzzy-sea-quest-game
npm audit

# Fix vulnerabilities
# 1. Update package.json overrides
# 2. Run npm install
# 3. Verify with npm audit
# 4. Commit changes
```

---

## 📝 Coding Conventions

### TypeScript

#### File Naming
- **Components**: PascalCase (e.g., `PinkyOctopus.tsx`)
- **Utilities**: camelCase (e.g., `apiHelpers.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`)

#### Code Style
```typescript
// ✅ GOOD: Clear component structure
interface PinkyOctopusProps {
  suggestions: string[];
  onSelect: (index: number) => void;
}

export const PinkyOctopus: React.FC<PinkyOctopusProps> = ({
  suggestions,
  onSelect
}) => {
  return (
    <div className="pinky-octopus">
      {suggestions.map((suggestion, index) => (
        <TentacleSuggestion
          key={index}
          suggestion={suggestion}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
};

// ❌ BAD: Unclear types, poor structure
export const PinkyOctopus = (props: any) => {
  return <div>{props.suggestions.map((s, i) => <div>{s}</div>)}</div>;
};
```

#### TypeScript Configuration
```json
{
  "strict": true,                    // Strict type checking
  "esModuleInterop": true,           // ES module compatibility
  "skipLibCheck": true,              // Skip library type checks
  "forceConsistentCasingInFileNames": true  // Enforce naming
}
```

### React Conventions

#### Component Structure
```tsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Component.css';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  // 4. Hooks
  const [state, setState] = useState<string>('');
  const navigate = useNavigate();

  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // 6. Handlers
  const handleClick = () => {
    onAction();
  };

  // 7. Render
  return (
    <div className="component">
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};
```

### API Conventions

#### Express Routes
```javascript
// api/index.js structure
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

app.post('/api/suggestions', async (req, res) => {
  try {
    const { query } = req.body;
    const suggestions = await generateSuggestions(query);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 🔒 Security Practices

### Current Security Status

**✅ All Projects: 0 Vulnerabilities**

The project has undergone comprehensive security auditing and remediation:
- **186 total vulnerabilities fixed** (2 critical, 25 high, 12 moderate, 6 low)
- All dependency security overrides applied
- Continuous monitoring via GitHub Dependabot

### Security Overrides (package.json)

**CRITICAL**: These overrides MUST be maintained in all 3 package.json files:

```json
{
  "overrides": {
    "nth-check": "^2.1.1",
    "postcss": "^8.4.31",
    "webpack-dev-server": "^5.2.1",
    "js-yaml": "^4.1.1",
    "svgo": "^2.8.0",
    "node-forge": "^1.3.2",
    "jsonpath": ">=1.1.1",
    "bfj": "^9.1.2",
    "minimatch": ">=10.2.3",
    "ajv": ">=8.18.0",
    "lodash": ">=4.17.21",
    "qs": ">=6.14.2",
    "react-router": "^7.13.0",
    "webpack": ">=5.104.0",
    "rollup": ">=2.80.0",
    "serialize-javascript": ">=7.0.3"
  }
}
```

### Security Checklist for AI Assistants

When making changes:

- [ ] Run `npm audit` after any dependency changes
- [ ] Verify all 3 projects (main + 2 subprojects) have 0 vulnerabilities
- [ ] Never remove or downgrade security overrides
- [ ] Check for new Dependabot alerts
- [ ] Test builds after security updates
- [ ] Document security changes in commit messages
- [ ] Review SECURITY_AUDIT_REPORT.md for historical context

### Known Security Fixes

#### CVE-2026-27606 (Rollup Path Traversal)
- **Status**: ✅ FIXED
- **Solution**: `rollup: ">=2.80.0"`
- **Impact**: HIGH - Arbitrary file write vulnerability
- **Commit**: e79530d

#### minimatch ReDoS
- **Status**: ✅ FIXED
- **Solution**: `minimatch: ">=10.2.3"`
- **Impact**: HIGH - Denial of Service via regex backtracking
- **Commit**: e79530d

See `SECURITY_FIXES_SUMMARY.md` for complete fix history.

---

## 🧪 Testing & Quality

### Running Tests

```bash
# Main project
npm test

# Subprojects
cd Fuzzy-Sea-quest/fuzzy-sea-quest && npm test
cd Fuzzy-Sea-quest/fuzzy-sea-quest-game && npm test
```

### Test Guidelines

- Write tests for new features
- Maintain test coverage
- Use React Testing Library for component tests
- Mock external API calls
- Test error scenarios

### Build Verification

Before committing:

```bash
# Verify all projects build successfully
npm run build

cd Fuzzy-Sea-quest/fuzzy-sea-quest && npm run build
cd ../fuzzy-sea-quest-game && npm run build
```

---

## 🚀 Deployment

### Production Build

```bash
# Main project
npm run build
# Output: build/

# Subprojects
cd Fuzzy-Sea-quest/fuzzy-sea-quest && npm run build
# Output: build/

cd ../fuzzy-sea-quest-game && npm run build
# Output: build/
```

### Environment Variables

Create `.env` file (never commit):

```env
# OpenAI API
OPENAI_API_KEY=your_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://fuzzy-octo.scorescout.eu
```

### Deployment Targets

- **Web**: Vercel (recommended)
- **API**: Heroku / AWS Lambda
- **CDN**: Cloudflare

---

## 🤖 AI Assistant Guidelines

### How to Work with This Codebase

#### 1. Understanding Project Structure

**ALWAYS** recognize this is a monorepo with 3 independent projects:
- Main project: `/`
- Subproject 1: `/Fuzzy-Sea-quest/fuzzy-sea-quest/`
- Subproject 2: `/Fuzzy-Sea-quest/fuzzy-sea-quest-game/`

**When making dependency changes**, update ALL 3 `package.json` files.

#### 2. Security-First Approach

**CRITICAL REQUIREMENTS:**

```bash
# After ANY dependency change:
1. Update overrides in ALL 3 package.json files
2. Run npm install in ALL 3 projects
3. Run npm audit in ALL 3 projects
4. Verify 0 vulnerabilities in ALL projects
5. Commit with detailed security message
```

**NEVER:**
- Remove or downgrade security overrides
- Skip `npm audit` verification
- Commit with outstanding vulnerabilities
- Make security changes without testing all 3 projects

#### 3. Branch and Commit Strategy

**Branch Naming:**
```
claude/<task-description>-<session-id>
```

**Commit Message Template:**
```
<Type>: <Short summary>

<Detailed description with context>

## Changes
- Specific change 1
- Specific change 2

## Security Impact
- Security considerations

## Verification
- npm audit: 0 vulnerabilities (all projects) ✅
- Build: successful ✅
- Tests: passing ✅
```

#### 4. Code Modification Guidelines

**Before modifying code:**
1. Read existing implementation
2. Understand current patterns
3. Match existing code style
4. Preserve TypeScript types

**After modifying code:**
1. Verify TypeScript compilation
2. Test in development mode
3. Run security audit
4. Build for production

#### 5. Documentation Updates

**When to update docs:**
- New features added → Update README.md
- API changes → Update fuzzy_api_complete_docs.md
- Security fixes → Update SECURITY_FIXES_SUMMARY.md
- Architecture changes → Update this CLAUDE.md

#### 6. Communication Style

**With Users:**
- Be concise and clear
- Use emojis sparingly
- Explain technical decisions
- Provide context for changes
- Ask questions when unclear

**In Commits:**
- Be comprehensive
- Use markdown formatting
- Include verification steps
- Document impact

---

## 🔧 Common Tasks

### Task 1: Fix Security Vulnerability

```bash
# 1. Identify vulnerability
npm audit

# 2. Update package.json overrides in ALL 3 projects
# Add: "package-name": ">=safe-version"

# 3. Install in all projects
npm install
cd Fuzzy-Sea-quest/fuzzy-sea-quest && npm install
cd ../fuzzy-sea-quest-game && npm install

# 4. Verify
npm audit  # Should show 0 vulnerabilities

# 5. Commit
git add -A
git commit -m "Security: Fix CVE-XXXX-XXXXX (Package vulnerability)

Fixed [vulnerability description] across all projects.

## Vulnerabilities Fixed
- Package: <package-name> <old-version> → <new-version>
- Advisory: <CVE-ID>
- Impact: <severity-level>

## Verification
✅ Main project: 0 vulnerabilities
✅ fuzzy-sea-quest: 0 vulnerabilities
✅ fuzzy-sea-quest-game: 0 vulnerabilities"
```

### Task 2: Add New Component

```bash
# 1. Create component file
touch src/components/NewComponent.tsx

# 2. Write component (follow conventions above)

# 3. Add tests
touch src/components/NewComponent.test.tsx

# 4. Import and use

# 5. Verify
npm start  # Test in browser
npm test   # Run tests
npm run build  # Verify build

# 6. Commit
git commit -m "Feature: Add NewComponent

Added NewComponent with [functionality].

## Changes
- Created NewComponent.tsx
- Added tests
- Integrated in [location]"
```

### Task 3: Update Documentation

```bash
# 1. Edit relevant documentation file
# - README.md for project overview
# - CLAUDE.md for AI assistant guide
# - docs/ for detailed documentation

# 2. Commit
git commit -m "Docs: Update [document name]

Updated documentation to reflect [changes].

## Changes
- Updated [section]
- Added [new information]"
```

### Task 4: Create Pull Request

```bash
# 1. Push branch
git push -u origin claude/feature-name-session123

# 2. Use PR_DESCRIPTION.md template

# 3. Fill in:
- Summary of changes
- Testing performed
- Security impact
- Related issues

# 4. Request review
```

---

## 📚 Additional Resources

### Documentation Files

- **README.md** - Project overview and quick start
- **SECURITY_AUDIT_REPORT.md** - Detailed security audit history
- **SECURITY_FIXES_SUMMARY.md** - Summary of all security fixes
- **SUBPROJECTS_SECURITY_AUDIT.md** - Subproject security details
- **PR_DESCRIPTION.md** - Pull request template
- **docs/fuzzy_api_complete_docs.md** - Complete API documentation
- **docs/fuzzy_onboarding_system.md** - Onboarding guide
- **docs/AI_MASTERY_ROADMAP.md** - AI development roadmap

### External Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

## 🎯 Project Goals & Vision

### Short-term (3 months)
- [ ] MVP web interface
- [ ] Basic AI engine with 8-suggestion system
- [ ] VS Code extension prototype
- [ ] User authentication

### Medium-term (6 months)
- [ ] Advanced fuzzy logic
- [ ] Multi-language support
- [ ] Team collaboration features
- [ ] Performance optimization

### Long-term (12+ months)
- [ ] Mobile app
- [ ] JetBrains plugin
- [ ] Enterprise features
- [ ] API marketplace

---

## 🐙 The Fuzzy-Octo Philosophy

**Core Values:**
1. **Fuzzy Thinking** - Embrace imperfect inputs
2. **8-Tentacle Solutions** - Always provide diverse options
3. **Developer Joy** - Prioritize delightful experience
4. **Continuous Learning** - Adapt and improve
5. **Quality Over Quantity** - 8 great > 100 mediocre

**Remember:** Every interaction should feel like discovering something wonderful, just like an octopus solving a puzzle with elegant creativity. 🐙✨

---

## 📝 Changelog

### 2026-03-01
- ✅ Created comprehensive CLAUDE.md
- ✅ Documented all 186 security fixes
- ✅ Added detailed workflow guidelines
- ✅ Established coding conventions
- ✅ Documented monorepo structure

### Previous
- ✅ Fixed CVE-2026-27606 (Rollup path traversal)
- ✅ Fixed 183 dependency vulnerabilities
- ✅ Resolved TypeScript compilation errors
- ✅ Fixed filesystem naming issues

---

<div align="center">

**"In a world of precise requirements, be the fuzzy thinker who discovers unexpected solutions"** 🐙

*This guide is maintained for AI assistants working with the Fuzzy-Octo codebase*

**Version 1.0.0** • Last Updated: 2026-03-01 • Author: Serigne Diagne

</div>
