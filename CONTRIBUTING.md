# Contributing to Eco-Travel Planner

Thank you for your interest in contributing! We're excited to have you help build a more sustainable future. 🌱

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Questions & Help](#questions--help)

---

## Code of Conduct

Please read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) first. By contributing, you agree to uphold these values and treat all community members with respect.

---

## How to Contribute

### 🐛 Fix a Bug
- Check [existing issues](https://github.com/tusharkkp/Ecotravel/issues) first
- Create a branch: `git checkout -b fix/issue-description`
- Write a test (if applicable)
- Commit and push
- Open a PR with description

### ✨ Add a Feature
- Discuss in [GitHub Discussions](https://github.com/tusharkkp/Ecotravel/discussions) first
- Create branch: `git checkout -b feature/feature-name`
- Follow code style guidelines
- Add tests if possible
- Update README if needed
- Open a PR

### 📚 Improve Documentation
- Typos and clarity improvements are always welcome
- Create branch: `git checkout -b docs/description`
- Make changes
- Open a PR

---

## Development Setup

### Prerequisites
- Node.js v14.x or higher
- npm v6 or higher
- Git
- MongoDB (local) or MongoDB Atlas account

### Local Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/Ecotravel.git
cd Ecotravel

# 2. Install dependencies
npm run install-all

# 3. Create server .env
cp server/.env.sample server/.env
# Edit with your MongoDB URI and JWT secret

# 4. Create client .env
echo 'REACT_APP_API_URL=http://localhost:5000' > client/.env

# 5. Start development
npm run dev

# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     Add a new feature
fix:      Fix a bug
docs:     Update documentation
style:    Code style changes
refactor: Code refactoring
perf:     Performance improvements
test:     Add or update tests
chore:    Dependencies, build scripts
ci:       CI/CD configuration
```

### Examples

```bash
git commit -m "feat: Add EcoCoin wallet balance display"
git commit -m "fix: Resolve JWT token validation issue"
git commit -m "docs: Update installation instructions"
```

---

## Pull Request Process

### Before Creating a PR

1. **Sync with main**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Test locally**
   ```bash
   npm run dev
   # Test in browser
   # Check console for errors
   ```

3. **Follow code style**
   - Use existing patterns
   - No console.log in production code
   - Use meaningful variable names

4. **Update documentation**
   - README.md if adding features
   - API docs if changing endpoints

### Creating a PR

1. Push your branch and open a PR with:
   - **Title:** Clear, descriptive
   - **Description:** What changed and why
   - **References:** Link related issues (#123)
   - **Screenshots:** If UI changes

2. **PR Checklist**
   - [ ] Code follows style guidelines
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No breaking changes

---

## Reporting Bugs

### Before Reporting

1. Check [existing issues](https://github.com/tusharkkp/Ecotravel/issues)
2. Search for similar problems
3. Check [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting

### How to Report

Click "[New Issue](https://github.com/tusharkkp/Ecotravel/issues/new)" and include:

- **Description:** Clear, concise description
- **Steps to Reproduce:** Detailed steps
- **Expected Behavior:** What should happen
- **Actual Behavior:** What actually happened
- **Environment:** OS, Browser, Node version
- **Screenshots:** If applicable

---

## Feature Requests

### Areas We're Excited About

- 🧪 Unit & integration test coverage
- 📱 Mobile app (React Native)
- 🤖 Advanced AI chatbot
- 🗺️ More map features
- 🌐 Multi-language support
- ♿ Accessibility enhancements
- 📊 Advanced analytics
- 🔔 Push notifications

### How to Suggest Features

1. Go to [Discussions](https://github.com/tusharkkp/Ecotravel/discussions)
2. Create new discussion under "Feature Requests"
3. Describe the problem, solution, and use cases

---

## Questions & Help

- 📖 **Setup issues?** Check [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 **Found a bug?** Open an [issue](https://github.com/tusharkkp/Ecotravel/issues)
- 💡 **Have an idea?** Start a [discussion](https://github.com/tusharkkp/Ecotravel/discussions)

---

## Code Style Guide

### JavaScript/React

```javascript
// Use const by default
const value = 10;

// Use arrow functions
const handleClick = () => { /* ... */ };

// Use destructuring
const { name, email } = user;

// Use template literals
const message = `Hello, ${name}!`;

// Component naming: PascalCase
const UserProfile = () => { /* ... */ };

// Function naming: camelCase
const calculateEmissions = () => { /* ... */ };

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:5000';
```

---

## Thank You! 🙏

Your contributions make Eco-Travel better. Together, we're building tools for a sustainable future!

**Happy coding! 🌱**
