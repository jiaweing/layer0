# Layer 0 - Modern Full-Stack Social Platform

A modern full-stack social media platform with Better Auth integration, Convex real-time database, AWS S3 file storage, featuring a Hono backend and Next.js frontend with React Router.

> Built on top of [NexFaster](https://github.com/rudrodip/nexfaster) - A minimal template showcasing React Router integration within Next.js for client-side routing. Special thanks to [@rds_agi](https://github.com/rudrodip) for the innovative Next.js + React Router navigation foundation.

## Features

- ✅ **Better Auth** with email/password authentication
- ✅ **MongoDB** database integration for user management
- ✅ **Convex** real-time database for posts, comments, and likes
- ✅ **AWS S3** file storage for images and avatars
- ✅ **Hono** backend with TypeScript
- ✅ **Next.js** frontend with React Router (CSR only)
- ✅ **Tailwind CSS** for styling
- ✅ **Dark/Light theme** support
- ✅ **Protected routes** and authentication context
- ✅ **Session management** with secure cookies
- ✅ **Real-time social features** (posts, likes, comments)
- ✅ **Image upload** with S3 integration
- ✅ **Avatar management** with cropping functionality

## Architecture

### Backend (Port 3001)

- **Hono** Node.js server
- **Better Auth** with MongoDB adapter for user authentication
- **User management** and profile API routes
- **AWS S3** integration for legacy file operations
- **CORS** enabled for frontend communication

### Frontend (Port 3000)

- **Next.js** with React Router (client-side only)
- **Better Auth React** integration for authentication
- **Convex React** for real-time data operations
- **AWS S3** direct upload from client
- **Tailwind CSS** with shadcn/ui components
- **Context-based auth state management**

### Database & Storage

- **MongoDB**: User profiles and authentication data
- **Convex**: Posts, comments, likes, and social interactions
- **AWS S3**: Image storage (avatars, post images)

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas)
- pnpm package manager

### 1. Environment Setup

**Backend (.env):**

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
BETTER_AUTH_SECRET=your-secret-key-change-this-in-production-layer0-auth-2024
BETTER_AUTH_URL=http://localhost:3001
MONGODB_URI=mongodb://localhost:27017/layer0-auth
PORT=3001
```

### 2. Install Dependencies

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

### 3. Start MongoDB

Ensure MongoDB is running locally on port 27017, or update the MONGODB_URI in your .env file.

### 4. Start Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
pnpm dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
pnpm dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Auth Endpoints**: http://localhost:3001/api/auth/\*

## Usage

### Authentication Flow

1. **Sign Up**: Navigate to `/auth` and create a new account
2. **Sign In**: Use your credentials to authenticate
3. **Dashboard**: Access protected routes after authentication
4. **Sign Out**: Use the sign out button in the navigation

### API Endpoints

- `GET/POST /api/auth/**` - Better Auth endpoints
- `GET /api/me` - Get current user session (protected)
- `GET /` - Health check

### Frontend Routes

- `/` - Public home page
- `/auth` - Authentication page (sign in/up)
- `/dashboard` - Protected dashboard (requires auth)
- `/docs` - Documentation
- `/examples` - Examples

## Project Structure

```
backend/
├── src/
│   ├── index.ts          # Main server file
│   └── lib/
│       └── auth.ts       # Better Auth configuration
├── .env                  # Environment variables
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── auth/         # Auth components
│   │   ├── providers/    # React context providers
│   │   └── ui/           # UI components
│   ├── lib/
│   │   └── auth.ts       # Auth client configuration
│   ├── pages/            # Page components
│   └── frontend/
│       └── app.tsx       # Main app with routing
└── package.json
```

## Development

### Backend Development

```bash
cd backend
pnpm dev          # Start with hot reload
pnpm build        # Build for production
pnpm start        # Start production build
```

### Frontend Development

```bash
cd frontend
pnpm dev          # Start with hot reload
pnpm build        # Build for production
pnpm start        # Start production build
```

### Type Checking

```bash
# Backend
cd backend && npx tsc --noEmit

# Frontend
cd frontend && npx tsc --noEmit
```

## Better Auth Configuration

The auth system is configured with:

- **Email/Password authentication**
- **MongoDB storage** via mongodbAdapter
- **Session management** with secure cookies
- **CORS support** for cross-origin requests
- **TypeScript support** with proper type inference
- **Client-side rendering** with "use client" directives for Next.js compatibility

### Customization

To add more auth features, edit:

- `backend/src/lib/auth.ts` - Server auth config
- `frontend/src/lib/auth.ts` - Client auth config
- `frontend/src/components/providers/auth.tsx` - Auth context

**Important**: When adding new React components that use hooks, make sure to add the `"use client"` directive at the top of the file for Next.js compatibility.

## Deployment

### Environment Variables

Ensure these are set in production:

**Backend:**

- `BETTER_AUTH_SECRET` - Strong secret key
- `BETTER_AUTH_URL` - Your production backend URL
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 3001)

**Frontend:**
Update the `baseURL` in `frontend/src/lib/auth.ts` to point to your production backend.

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure MongoDB is running and accessible
2. **CORS Errors**: Check that frontend URL is in `trustedOrigins`
3. **Auth Errors**: Verify `BETTER_AUTH_SECRET` is set and consistent
4. **Port Conflicts**: Ensure ports 3000 and 3001 are available

### Debug Mode

Set `NODE_ENV=development` for additional logging and error details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Acknowledgments

This project builds upon [NexFaster](https://github.com/rudrodip/nexfaster) by [@rds_agi](https://github.com/rudrodip), which provides the innovative foundation for integrating React Router with Next.js for client-side routing. The original NexFaster template demonstrates how to achieve pure client-side navigation within a Next.js application.

## License

MIT License - see LICENSE file for details.
