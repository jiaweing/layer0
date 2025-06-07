# Layer0

<div align="center">
  <img src="public/og.png" alt="Layer0 Logo" width="400"/>
  
  ### Modern Full-Stack Social Platform Starter Kit
  
  *A fully self-hostable zero lock in local first cutting-edge social media platform built with the latest web technologies*
  
  [![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Better Auth](https://img.shields.io/badge/Better_Auth-FF6B6B?style=flat&logo=auth0&logoColor=white)](https://better-auth.com/)
  [![Convex](https://img.shields.io/badge/Convex-FF6B35?style=flat&logo=convex&logoColor=white)](https://convex.dev/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 📚 Table of Contents

<details>
<summary>Click to expand</summary>

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
  - [🎯 Core Architecture](#-core-architecture)
  - [🔐 Authentication Layer](#-authentication-layer)
  - [⚡ Real-time Layer](#-real-time-layer)
  - [🗄️ Data Architecture](#️-data-architecture)
- [🚀 Quick Start](#-quick-start)
  - [📋 Prerequisites](#-prerequisites)
  - [🔧 Environment Setup](#-environment-setup)
  - [📦 Installation](#-installation)
  - [🗄️ Database Setup](#️-database-setup)
  - [🏃‍♂️ Running the Application](#️-running-the-application)
- [🎯 Usage Guide](#-usage-guide)
  - [🔐 Authentication Flow](#-authentication-flow)
  - [🌐 API Reference](#-api-reference)
  - [🗺️ Application Routes](#️-application-routes)
  - [🔄 Data Synchronization](#-data-synchronization)
- [📂 Project Structure](#-project-structure)
  - [🧩 Key Components](#-key-components)
- [🛠️ Development](#️-development)
  - [📝 Available Scripts](#-available-scripts)
  - [🔧 Technology Configuration](#-technology-configuration)
  - [🧪 Testing Strategy](#-testing-strategy)
  - [🎨 Styling Guidelines](#-styling-guidelines)
- [⚙️ Configuration Deep Dive](#️-configuration-deep-dive)
  - [🔐 Better Auth Configuration](#-better-auth-configuration)
  - [🔄 Data Synchronization Strategy](#-data-synchronization-strategy)
  - [🗄️ Database Schema Comparison](#️-database-schema-comparison)
- [🚀 Deployment](#-deployment)
  - [📋 Pre-deployment Checklist](#-pre-deployment-checklist)
  - [🌐 Environment Variables](#-environment-variables)
  - [☁️ Deployment Platforms](#️-deployment-platforms)
  - [🔒 Security Considerations](#-security-considerations)
  - [📊 Performance Optimization](#-performance-optimization)
- [🔧 Troubleshooting](#-troubleshooting)
  - [🚨 Common Issues & Solutions](#-common-issues--solutions)
  - [🐛 Debug Mode](#-debug-mode)
  - [📊 Health Checks](#-health-checks)
- [🤝 Contributing](#-contributing)
  - [🔄 Development Workflow](#-development-workflow)
  - [📋 Contribution Guidelines](#-contribution-guidelines)
  - [🎯 Areas for Contribution](#-areas-for-contribution)
  - [🐛 Bug Reports](#-bug-reports)
  - [💡 Feature Requests](#-feature-requests)
- [🎯 Roadmap](#-roadmap)
- [📚 Resources & Learning](#-resources--learning)
- [🌟 Showcase](#-showcase)
- [🙏 Acknowledgments](#-acknowledgments)
- [📄 License](#-license)

</details>

---

## ✨ Features

<table>
  <tr>
    <td>🔐</td>
    <td><strong>Authentication</strong></td>
    <td>Secure email/password auth with Better Auth & MongoDB</td>
  </tr>
  <tr>
    <td>⚡</td>
    <td><strong>Real-time Database</strong></td>
    <td>Live updates with Convex for social interactions</td>
  </tr>
  <tr>
    <td>☁️</td>
    <td><strong>Cloud Storage</strong></td>
    <td>AWS S3 integration for images and file uploads</td>
  </tr>
  <tr>
    <td>🎨</td>
    <td><strong>Modern UI</strong></td>
    <td>Beautiful interface with Tailwind CSS & shadcn/ui</td>
  </tr>
  <tr>
    <td>📱</td>
    <td><strong>Responsive Design</strong></td>
    <td>Mobile-first design that works on all devices</td>
  </tr>
  <tr>
    <td>🌙</td>
    <td><strong>Theme Support</strong></td>
    <td>Dark/Light mode with system preference detection</td>
  </tr>
  <tr>
    <td>🛡️</td>
    <td><strong>Protected Routes</strong></td>
    <td>Secure navigation with authentication guards</td>
  </tr>
  <tr>
    <td>🔄</td>
    <td><strong>Auto Sync</strong></td>
    <td>User profiles automatically synced between MongoDB & Convex</td>
  </tr>
</table>

## 🏗️ Architecture

Layer0 uses a hybrid architecture that combines the best of multiple technologies:

### 🎯 Core Architecture

```mermaid
graph TD
    A[Next.js Frontend] --> B[Better Auth]
    B --> C[MongoDB]
    A --> D[Convex Real-time DB]
    A --> E[AWS S3]
    A --> F[API Routes]
    F --> B
    F --> D

    style A fill:#0070f3,color:#fff
    style B fill:#ff6b6b,color:#fff
    style C fill:#47a248,color:#fff
    style D fill:#ff6b35,color:#fff
    style E fill:#ff9900,color:#fff
```

### 🔐 Authentication Layer

- **Better Auth** handles user authentication and session management
- **MongoDB** stores user credentials, profiles, and session data
- **Auto-sync mechanism** ensures user data is available in Convex for social features

### ⚡ Real-time Layer

- **Convex** powers real-time social features (posts, likes, comments)
- **Optimistic updates** for instant UI feedback
- **Live queries** for real-time data synchronization

### 🗄️ Data Architecture

#### MongoDB Collections

- `users` - Authentication data and user profiles
- `sessions` - Active user sessions and tokens
- `accounts` - OAuth account linking (future)

#### Convex Tables

- `users` - Synced user profiles for social features
- `posts` - User posts with content and metadata
- `likes` - Post likes with user references
- `comments` - Post comments and replies

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+**
- **pnpm** package manager
- **MongoDB** (local installation or MongoDB Atlas)
- **AWS Account** (for S3 storage)
- **Convex Account** (for real-time database)

### 🔧 Environment Setup

Create your environment configuration:

```bash
# Copy the example environment file
cp .env.example .env.local
```

Configure your `.env.local` file:

```env
# Authentication
BETTER_AUTH_SECRET=your-super-secret-key-change-in-production
BETTER_AUTH_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/layer0-auth

# Convex
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url
CONVEX_DEPLOY_KEY=your-convex-deploy-key

# AWS S3 (Optional - for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
```

### 📦 Installation

Install all dependencies with a single command:

```bash
pnpm install
```

### 🗄️ Database Setup

#### MongoDB Setup

```bash
# Option 1: Local MongoDB
# Ensure MongoDB is running on port 27017

# Option 2: MongoDB Atlas
# Update MONGODB_URI in .env.local with your Atlas connection string
```

#### Convex Setup

```bash
# Install Convex CLI globally
npm install -g convex

# Initialize Convex (if not already done)
npx convex dev

# Deploy schema
npx convex deploy
```

### 🏃‍♂️ Running the Application

Start the development server:

```bash
pnpm dev
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **API Routes**: http://localhost:3000/api/\*

## 🎯 Usage Guide

### 🔐 Authentication Flow

1. **Registration**: Navigate to `/auth` and create your account
2. **Login**: Sign in with your credentials
3. **Auto-sync**: Your profile is automatically synced to Convex for social features
4. **Protected Access**: Access all app features after authentication
5. **Session Management**: Secure sessions with automatic renewal

### 🌐 API Reference

#### Authentication Endpoints

- `POST /api/auth/sign-up` - Create new user account
- `POST /api/auth/sign-in` - Authenticate user
- `POST /api/auth/sign-out` - End user session
- `GET /api/auth/session` - Get current session

#### User Management

- `GET /api/me` - Get current user profile
- `POST /api/users/sync` - Sync user to Convex (automatic)
- `PUT /api/users/[authId]/avatar` - Update user avatar

#### File Upload

- `POST /api/upload` - Upload files to S3

### 🗺️ Application Routes

#### Public Routes

- `/` - Landing page
- `/auth` - Sign in/up page

#### Protected Routes

- `/shell` - Main application shell
- `/feed` - Social media feed
- `/settings` - User settings and profile

### 🔄 Data Synchronization

Layer0 implements a sophisticated data sync mechanism:

1. **User Registration/Login** → Stored in MongoDB via Better Auth
2. **Auto-sync Trigger** → AuthProvider detects new user session
3. **Convex Sync** → User profile copied to Convex for social features
4. **Real-time Updates** → All social interactions happen in Convex

```typescript
// Auto-sync implementation in AuthProvider
useEffect(() => {
  if (user && !hasSynced) {
    const syncUser = async () => {
      await fetch("/api/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setHasSynced(true);
    };
    syncUser();
  }
}, [user, hasSynced]);
```

## 📂 Project Structure

```
layer0/
├── 📁 convex/                    # Convex real-time database
│   ├── users.ts                  # User profile management
│   ├── posts.ts                  # Post operations
│   ├── likes.ts                  # Like functionality
│   ├── comments.ts               # Comment system
│   └── schema.ts                 # Database schema
├── 📁 src/
│   ├── 📁 app/                   # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   ├── 📁 api/               # API Routes
│   │   │   ├── 📁 auth/          # Better Auth endpoints
│   │   │   ├── 📁 me/            # User profile API
│   │   │   ├── 📁 upload/        # File upload API
│   │   │   └── 📁 users/         # User management API
│   │   └── 📁 shell/             # Main app shell
│   ├── 📁 components/            # React components
│   │   ├── 📁 auth/              # Authentication components
│   │   ├── 📁 providers/         # Context providers
│   │   ├── 📁 theme/             # Theme management
│   │   └── 📁 ui/                # Reusable UI components
│   ├── 📁 hooks/                 # Custom React hooks
│   ├── 📁 lib/                   # Utility libraries
│   │   ├── auth.ts               # Auth client config
│   │   ├── auth-server.ts        # Auth server config
│   │   ├── convex.tsx            # Convex provider
│   │   └── s3.ts                 # AWS S3 utilities
│   ├── 📁 routes/                # React Router pages
│   └── 📁 types/                 # TypeScript definitions
├── 📄 package.json               # Dependencies & scripts
├── 📄 convex.json                # Convex configuration
├── 📄 tailwind.config.ts         # Tailwind CSS config
└── 📄 tsconfig.json              # TypeScript config
```

### 🧩 Key Components

#### Authentication System

```typescript
// src/lib/auth-server.ts - Server-side auth config
export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  // ... configuration
});

// src/components/providers/auth.tsx - Client-side auth context
export function AuthProvider({ children }) {
  // Handles user session and auto-sync to Convex
}
```

#### Real-time Database

```typescript
// convex/schema.ts - Data structure
export default defineSchema({
  users: defineTable({
    authId: v.string(), // Links to MongoDB user
    name: v.optional(v.string()),
    email: v.string(),
    // ... fields
  }).index("by_auth_id", ["authId"]),
});
```

## 🛠️ Development

### 📝 Available Scripts

```bash
# Development
pnpm dev                    # Start development server with Turbopack
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint

# Type Checking
npx tsc --noEmit           # Check TypeScript without emitting files

# Convex
npx convex dev             # Start Convex development
npx convex deploy          # Deploy to Convex
```

### 🔧 Technology Configuration

#### Better Auth Setup

```typescript
// Customizing authentication behavior
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set true for production
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  // Add social providers, 2FA, etc.
});
```

#### Convex Mutations

```typescript
// Example: Creating a new post
export const createPost = mutation({
  args: {
    content: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Real-time post creation logic
  },
});
```

### 🧪 Testing Strategy

```bash
# Unit Tests (Future)
pnpm test

# Type Safety
npx tsc --noEmit

# Lint Code
pnpm lint
```

### 🎨 Styling Guidelines

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent component design
- **CSS Variables** for theme customization
- **Responsive Design** with mobile-first approach

```css
/* Example: Custom theme variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}
```

## ⚙️ Configuration Deep Dive

### 🔐 Better Auth Configuration

Layer0 uses Better Auth for its robust authentication system with MongoDB integration:

```typescript
// Key features configured:
- Email/Password authentication
- MongoDB adapter for data persistence
- Session management with secure cookies
- CORS support for API communication
- Next.js integration with cookie handling
```

**Why Better Auth + MongoDB?**

- **No Official Convex Auth**: Convex doesn't provide official authentication
- **No Convex Adapter**: Better Auth lacks a Convex adapter
- **Hybrid Approach**: MongoDB handles auth, Convex handles social features
- **Data Sync**: User profiles are synced between systems automatically

### 🔄 Data Synchronization Strategy

```mermaid
sequenceDiagram
    participant U as User
    participant A as Better Auth
    participant M as MongoDB
    participant C as Convex

    U->>A: Sign Up/Login
    A->>M: Store user & session
    A->>U: Return session
    U->>C: Trigger sync via API
    C->>M: Fetch user data
    C->>C: Store in Convex users table
    Note over C: Now available for social features
```

### 🗄️ Database Schema Comparison

#### MongoDB (Authentication)

```typescript
// Better Auth manages these collections:
users: {
  id: string,
  email: string,
  name?: string,
  image?: string,
  emailVerified: boolean,
  createdAt: Date,
  updatedAt: Date
}

sessions: {
  id: string,
  userId: string,
  expiresAt: Date,
  token: string,
  // ... session data
}
```

#### Convex (Social Features)

```typescript
// Synced and optimized for real-time queries:
users: {
  authId: string,        // Links to MongoDB user.id
  email: string,
  name?: string,
  image?: string,
  bio?: string,
  createdAt: number,     // Optimized for sorting
  updatedAt: number
}

posts: {
  content: string,
  authorAuthId: string,  // References MongoDB user.id
  imageUrl?: string,
  createdAt: number,
  likesCount: number,    // Denormalized for performance
  commentsCount: number
}
```

## 🚀 Deployment

### 📋 Pre-deployment Checklist

- [ ] Set strong `BETTER_AUTH_SECRET` in production
- [ ] Configure production MongoDB URI
- [ ] Deploy Convex schema and functions
- [ ] Set up AWS S3 bucket with proper CORS
- [ ] Update CORS origins for production domain

### 🌐 Environment Variables

#### Production Environment (.env.production)

```env
# Authentication (REQUIRED)
BETTER_AUTH_SECRET=your-super-strong-production-secret-min-32-chars
BETTER_AUTH_URL=https://yourdomain.com

# Database (REQUIRED)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/layer0-prod

# Convex (REQUIRED)
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-convex-production-deploy-key

# AWS S3 (OPTIONAL)
AWS_ACCESS_KEY_ID=your-production-access-key
AWS_SECRET_ACCESS_KEY=your-production-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-production-bucket

# Additional
NODE_ENV=production
```

### ☁️ Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

#### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

### 🔒 Security Considerations

1. **Authentication Security**

   - Use strong `BETTER_AUTH_SECRET` (min 32 characters)
   - Enable email verification in production
   - Set secure cookie options

2. **Database Security**

   - Use MongoDB Atlas with IP whitelisting
   - Enable database authentication
   - Regular security updates

3. **API Security**
   - CORS configuration for production domains
   - Rate limiting (consider implementing)
   - Input validation on all endpoints

### 📊 Performance Optimization

- **Next.js**: Built-in optimizations with Turbopack
- **Convex**: Optimistic updates for instant UI feedback
- **Images**: AWS S3 with CDN for fast delivery
- **Caching**: Better Auth session caching enabled

## 🔧 Troubleshooting

### 🚨 Common Issues & Solutions

#### Authentication Issues

```bash
# Issue: "Invalid session" or auth not working
# Solution: Check environment variables
echo $BETTER_AUTH_SECRET    # Should be set
echo $MONGODB_URI          # Should be accessible

# Clear browser cookies and try again
# Check MongoDB connection
```

#### Database Connection Problems

```bash
# MongoDB Connection Test
node -e "
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);
client.connect().then(() => {
  console.log('✅ MongoDB connected');
  client.close();
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});
"
```

#### Convex Sync Issues

```bash
# Check Convex deployment status
npx convex logs

# Redeploy Convex functions
npx convex deploy

# Test sync endpoint
curl -X POST http://localhost:3000/api/users/sync
```

#### File Upload Problems

```bash
# Check AWS credentials
aws sts get-caller-identity

# Test S3 bucket access
aws s3 ls s3://your-bucket-name

# Verify CORS configuration on S3 bucket
```

### 🐛 Debug Mode

Enable detailed logging:

```env
# Add to .env.local
NODE_ENV=development
DEBUG=better-auth:*
CONVEX_DEBUG=true
```

### 📊 Health Checks

```bash
# Check all services
curl http://localhost:3000/api/me          # Auth status
curl http://localhost:3000/api/upload      # Upload service
npx convex logs --help                     # Convex status
```

## 🤝 Contributing

We welcome contributions to Layer0! Here's how you can help:

### 🔄 Development Workflow

1. **Fork & Clone**

   ```bash
   git clone https://github.com/your-username/layer0.git
   cd layer0
   ```

2. **Setup Development Environment**

   ```bash
   pnpm install
   cp .env.example .env.local
   # Configure your environment variables
   ```

3. **Create Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Changes & Test**

   ```bash
   # Run type checking
   npx tsc --noEmit

   # Test your changes
   pnpm dev

   # Test build
   pnpm build
   ```

5. **Commit & Push**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```

6. **Submit Pull Request**
   - Open a PR with a clear description
   - Include screenshots if UI changes
   - Reference any related issues

### 📋 Contribution Guidelines

- **Code Style**: Follow existing patterns and use TypeScript
- **Commits**: Use conventional commit messages (`feat:`, `fix:`, `docs:`, etc.)
- **Testing**: Ensure your changes don't break existing functionality
- **Documentation**: Update README if adding new features

### 🎯 Areas for Contribution

- [ ] **Social Features**: Comments, replies, reactions
- [ ] **Real-time Features**: Live notifications, typing indicators
- [ ] **UI/UX**: Improved responsive design, animations
- [ ] **Security**: Rate limiting, input validation
- [ ] **Performance**: Optimization, caching strategies
- [ ] **Testing**: Unit tests, integration tests
- [ ] **Documentation**: Tutorials, guides, examples

### 🐛 Bug Reports

When reporting bugs, please include:

- Operating system and version
- Node.js and pnpm versions
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

### 💡 Feature Requests

Before suggesting new features:

- Check existing issues and discussions
- Consider if it fits Layer0's scope
- Provide detailed use cases and examples

## 🎯 Roadmap

### 🚀 Current Version (v1.0)
- ✅ Better Auth with MongoDB integration
- ✅ Convex real-time database for social features
- ✅ AWS S3 file upload and storage
- ✅ User profile management and avatar upload
- ✅ Auto-sync between MongoDB and Convex
- ✅ Dark/Light theme support
- ✅ Responsive design with Tailwind CSS

### 📅 Upcoming Features

#### v1.1 - Enhanced Social Features
- [ ] **Post Comments & Replies** - Nested comment system
- [ ] **Real-time Notifications** - Live activity updates
- [ ] **User Following/Followers** - Social connections
- [ ] **Post Sharing** - Share posts with others
- [ ] **Image Galleries** - Multiple images per post

#### v1.2 - Advanced Authentication
- [ ] **OAuth Providers** - Google, GitHub, Twitter login
- [ ] **Two-Factor Authentication** - Enhanced security
- [ ] **Email Verification** - Account verification system
- [ ] **Password Reset** - Secure password recovery
- [ ] **Session Management** - Better session controls

#### v1.3 - Performance & Scaling
- [ ] **Edge Caching** - CDN integration
- [ ] **Image Optimization** - Automatic image processing
- [ ] **Rate Limiting** - API protection
- [ ] **Database Indexing** - Query optimization
- [ ] **Monitoring** - Performance tracking

#### v2.0 - Enterprise Features
- [ ] **Multi-tenancy** - Support for multiple organizations
- [ ] **Advanced Analytics** - User engagement metrics
- [ ] **Content Moderation** - AI-powered content filtering
- [ ] **API Documentation** - Comprehensive API docs
- [ ] **Mobile App** - React Native companion app

### 🎨 Design System Evolution
- [ ] **Component Library** - Standalone design system
- [ ] **Animation System** - Smooth transitions and micro-interactions
- [ ] **Accessibility** - WCAG 2.1 AA compliance
- [ ] **Internationalization** - Multi-language support

## 📚 Resources & Learning

### 📖 Documentation
- [Better Auth Docs](https://better-auth.com/docs) - Authentication system
- [Convex Docs](https://docs.convex.dev/) - Real-time database
- [Next.js Docs](https://nextjs.org/docs) - React framework
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework

### 🎓 Tutorials & Guides
- [Building Real-time Apps with Convex](https://docs.convex.dev/tutorial)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Better Auth Setup Guide](https://better-auth.com/docs/guides)
- [AWS S3 Integration](https://docs.aws.amazon.com/sdk-for-javascript/)

### 🔧 Development Tools
- [VS Code](https://code.visualstudio.com/) - Recommended IDE
- [Convex Dashboard](https://dashboard.convex.dev/) - Database management
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [AWS Console](https://aws.amazon.com/console/) - Cloud services

## 🌟 Showcase

### 🎨 Built with Layer0
*Share your projects built with Layer0! Submit a PR to add your project here.*

### 📸 Screenshots
<div align="center">
  <img src="docs/images/dashboard.png" alt="Dashboard" width="300"/>
  <img src="docs/images/profile.png" alt="Profile" width="300"/>
  <img src="docs/images/mobile.png" alt="Mobile View" width="200"/>
</div>

## 🙏 Acknowledgments

### 🏗️ Foundation
This project builds upon [NexFaster](https://github.com/rudrodip/nexfaster) by [@rds_agi](https://github.com/rudrodip), which provides the innovative foundation for integrating React Router with Next.js for client-side routing.

### 🛠️ Technologies
Special thanks to the teams behind:
- **Next.js** - The React framework for production
- **Better Auth** - Simple, secure authentication
- **Convex** - Real-time backend platform
- **MongoDB** - Document database
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library

### 🎨 Design Inspiration
- [Linear](https://linear.app/) - Clean, modern interface design
- [Twitter/X](https://x.com/) - Social media UX patterns
- [Discord](https://discord.com/) - Real-time messaging UI

---

<div align="center">
  <p>
    <strong>Layer0</strong> - Built with ❤️ for the developer community
  </p>
  <p>
    <a href="https://github.com/layer0/starter-kit">⭐ Star on GitHub</a> •
    <a href="https://github.com/layer0/starter-kit/issues">🐛 Report Bug</a> •
    <a href="https://github.com/layer0/starter-kit/discussions">💬 Discussions</a>
  </p>
</div>

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Layer0

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
