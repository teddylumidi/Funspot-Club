# Contributing to Funspot Club

We love your input! We want to make contributing to Funspot Club as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Pull Request Process

1. **Update the README.md** with details of changes to the interface, including new environment variables, exposed ports, useful file locations, and container parameters.

2. **Increase the version numbers** in any examples files and the README.md to the new version that this Pull Request would represent.

3. **You may merge the Pull Request** once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Coding Standards

### Code Style
- Use **Prettier** for code formatting
- Follow **ESLint** rules defined in the project
- Use **TypeScript** for all new code
- Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

### Testing
- Write **unit tests** for new functionality
- Ensure **existing tests** continue to pass
- Aim for **high test coverage** on critical paths
- Test **accessibility features** with screen readers

### Documentation
- Update **README.md** for significant changes
- Add **JSDoc comments** for complex functions
- Update **type definitions** as needed

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to make participation in our project and our community a harassment-free experience for everyone.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

## Issue and Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/teddylumidi/Funspot-Club/issues/new); it's that easy!

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please:

1. **Check existing issues** to avoid duplicates
2. **Provide context** about the problem you're trying to solve
3. **Describe the solution** you'd like to see
4. **Consider alternatives** you've considered
5. **Add mockups** or examples if helpful

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples
```
feat(auth): add social login options
fix(dashboard): resolve user data loading issue
docs(readme): update installation instructions
style(components): format code with prettier
```

## Setting Up Development Environment

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Funspot-Club.git
cd Funspot-Club

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Useful Commands
```bash
# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Run all checks (recommended before committing)
npm run lint && npm run test && npm run build
```

## Questions?

Don't hesitate to reach out:

- **GitHub Discussions**: For general questions and community discussion
- **GitHub Issues**: For bug reports and feature requests
- **Email**: maintainers@funspot.club

## Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** graph

Thank you for contributing to Funspot Club! 🛼✨