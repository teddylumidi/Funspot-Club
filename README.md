# 🛼 Funspot Club Management System

<div align="center">

![Funspot Club Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

[![Build Status](https://github.com/teddylumidi/Funspot-Club/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/teddylumidi/Funspot-Club/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

**A modern, responsive web application for managing skating club operations, programs, and memberships**

[Demo](https://funspot-club.vercel.app) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

## ✨ Features

### 🎯 Core Functionality
- **User Management** - Multi-role authentication (Admin, Manager, Coach, Parent, Athlete)
- **Program Management** - Create, manage, and book skating programs
- **Dashboard Analytics** - Comprehensive overview of club operations
- **Event Calendar** - Track and manage club events and activities
- **Payment Processing** - Integrated booking and payment system
- **Notification System** - Real-time updates and alerts
- **Waitlist Management** - Automated program capacity management

### 🎨 User Experience
- **Responsive Design** - Mobile-first approach with tablet and desktop optimization
- **Dark/Light Theme** - User-configurable theme preferences
- **Accessibility** - WCAG 2.1 compliant with proper ARIA labels and semantic HTML
- **Progressive Enhancement** - Works across all modern browsers

### 🛠️ Technical Features
- **TypeScript** - Full type safety and enhanced developer experience
- **Modern React** - Latest React 18 features with functional components and hooks
- **Testing Suite** - Comprehensive unit and integration tests with Vitest
- **CI/CD Pipeline** - Automated testing, linting, and deployment
- **Docker Support** - Containerized deployment ready
- **Performance Optimized** - Code splitting, lazy loading, and efficient bundling

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **npm** 9.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/teddylumidi/Funspot-Club.git
   cd Funspot-Club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_APP_NAME=Funspot Club
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 📖 Usage

### Default User Accounts

The application comes with pre-configured demo accounts:

| Role | Email | Name | Features |
|------|-------|------|----------|
| Admin | admin@funspot.com | Alex Ray | Full system access, user management |
| Manager | manager@funspot.com | Brenda Miles | Program management, reporting |
| Coach | coach1@funspot.com | Chris Lee | Program creation, student management |
| Parent | parent1@funspot.com | Eva Green | Child registration, payment tracking |
| Athlete | athlete1@funspot.com | Grace Green | Program booking, schedule viewing |

> **Note:** All demo accounts use the password `password` for demonstration purposes.

### Key Workflows

#### 🏢 For Administrators
1. **User Management** - Create/edit/delete user accounts
2. **System Configuration** - Manage club settings and preferences
3. **Reporting** - Access comprehensive club analytics

#### 👨‍🏫 For Coaches
1. **Program Creation** - Set up new skating programs
2. **Schedule Management** - Manage class schedules and availability
3. **Student Tracking** - Monitor student progress and attendance

#### 👨‍👩‍👧‍👦 For Parents
1. **Child Registration** - Enroll children in programs
2. **Payment Management** - Handle fees and payment history
3. **Communication** - Receive updates and notifications

#### ⛸️ For Athletes
1. **Program Booking** - Register for available classes
2. **Schedule Viewing** - Check upcoming sessions and events
3. **Progress Tracking** - Monitor personal development

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

### Project Structure

```
funspot-club/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── test/             # Test files and setup
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── .github/workflows/    # GitHub Actions CI/CD
├── docker/               # Docker configuration
└── docs/                # Additional documentation
```

### Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 18 | UI framework |
| **Language** | TypeScript | Type safety |
| **Build Tool** | Vite | Fast development and building |
| **Testing** | Vitest + Testing Library | Unit and integration testing |
| **Linting** | ESLint | Code quality |
| **Formatting** | Prettier | Code formatting |
| **Styling** | CSS3 + Custom Properties | Responsive design |
| **CI/CD** | GitHub Actions | Automated deployment |
| **Container** | Docker + Nginx | Production deployment |

### Code Quality Standards

- **ESLint** with React, TypeScript, and accessibility rules
- **Prettier** for consistent code formatting
- **TypeScript** for type safety
- **Vitest** for comprehensive testing
- **Husky** for pre-commit hooks (optional)

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t funspot-club .
```

### Run Container
```bash
docker run -p 80:80 funspot-club
```

### Docker Compose (Development)
```yaml
version: '3.8'
services:
  funspot-club:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
```

## ☁️ Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on git push

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/teddylumidi/Funspot-Club)

### Netlify

1. **Connect repository** to Netlify
2. **Set build command**: `npm run build`
3. **Set publish directory**: `dist`

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/teddylumidi/Funspot-Club)

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Serve the `dist` folder** with any static file server:
   ```bash
   npx serve dist
   ```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run specific test file
npm run test src/components/Dashboard.test.tsx
```

### Testing Strategy
- **Unit Tests** - Component logic and utilities
- **Integration Tests** - User workflows and API interactions
- **Accessibility Tests** - ARIA compliance and keyboard navigation
- **Visual Tests** - Screenshot comparison (future enhancement)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or updates
- `chore:` - Maintenance tasks

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vite Team** - For the lightning-fast build tool
- **TypeScript Team** - For bringing type safety to JavaScript
- **Open Source Community** - For the tools and inspiration

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/teddylumidi/Funspot-Club/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/teddylumidi/Funspot-Club/discussions)
- 📧 **Email**: support@funspot.club
- 📖 **Documentation**: [Wiki](https://github.com/teddylumidi/Funspot-Club/wiki)

## 🗺️ Roadmap

- [ ] **Mobile App** - React Native implementation
- [ ] **Real-time Chat** - WebSocket-based communication
- [ ] **Advanced Analytics** - Enhanced reporting and insights
- [ ] **API Integration** - REST API for third-party integrations
- [ ] **Multi-tenancy** - Support for multiple clubs
- [ ] **Offline Support** - PWA capabilities

---

<div align="center">

**Built with ❤️ for the skating community**

[⬆ Back to top](#-funspot-club-management-system)

</div>
