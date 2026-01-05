# Bookshelf Dashboard

A full-stack book management application built with React, NestJS, GraphQL, and Auth0 authentication. This project demonstrates modern web development practices including TypeScript, GraphQL APIs, and secure authentication.

## 🚀 Features

- **Authentication & Authorization**: Secure sign up and sign in using Auth0
- **Book Management**: Full CRUD operations for managing books
  - View all books in a table
  - Create new books
  - Edit existing books
  - Delete books
- **Protected API**: All GraphQL endpoints require authentication
- **Modern UI**: Built with Chakra UI v3 with a dark theme
- **Type Safety**: Full TypeScript support across frontend and backend

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Chakra UI v3** - Component library
- **Apollo Client** - GraphQL client
- **Auth0 React SDK** - Authentication
- **React Icons** - Icon library

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **GraphQL** - API layer (Apollo Server)
- **TypeORM** - ORM for database operations
- **SQLite** - Database
- **Auth0 JWT** - Token verification (jsonwebtoken, jwks-rsa)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Auth0 Account** (free tier is sufficient)

## 📁 Project Structure

```
bookshelf/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Auth0 authentication guard
│   │   ├── books/          # Book module (entity, service, resolver, DTOs)
│   │   ├── app.module.ts   # Root application module
│   │   └── main.ts         # Application entry point
│   ├── database.sqlite     # SQLite database file (gitignored)
│   └── package.json
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── graphql/        # GraphQL queries and mutations
│   │   ├── lib/            # Apollo Client configuration
│   │   └── main.tsx        # Application entry point
│   └── package.json
│
└── README.md              # This file
```

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bookshelf
```

### 2. Auth0 Configuration

1. Create a free account at [Auth0](https://auth0.com/)
2. Create a new Application (Single Page Application)
3. Create a new API with:
   - **Identifier**: `https://bookshelf-api` (or your preferred identifier)
   - **Signing Algorithm**: RS256
4. Configure the Application:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_AUDIENCE=https://bookshelf-api
FRONTEND_URL=http://localhost:5173
PORT=3000
```

**Note**: Replace `your-auth0-domain` with your actual Auth0 domain.

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://bookshelf-api
VITE_GRAPHQL_URL=http://localhost:3000/graphql
```

**Note**:
- Replace `your-auth0-domain` with your actual Auth0 domain
- Replace `your-auth0-client-id` with your Auth0 Application Client ID
- Ensure the `AUDIENCE` matches exactly between frontend, backend, and Auth0 API settings

## 🚀 Running the Application

### Development Mode

1. **Start the Backend** (from `backend/` directory):
   ```bash
   npm run start:dev
   ```
   The GraphQL API will be available at `http://localhost:3000/graphql`

2. **Start the Frontend** (from `frontend/` directory):
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Access the Application**:
   - Open `http://localhost:5173` in your browser
   - Click "Login" to authenticate with Auth0
   - Once authenticated, you can manage your books

### Production Build

**Backend**:
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend**:
```bash
cd frontend
npm run build
npm run preview
```

## 📝 Environment Variables

### Backend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH0_DOMAIN` | Your Auth0 domain | `dev-xxxxx.auth0.com` |
| `AUTH0_AUDIENCE` | Auth0 API identifier | `https://bookshelf-api` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `PORT` | Backend server port | `3000` |

### Frontend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AUTH0_DOMAIN` | Your Auth0 domain | `dev-xxxxx.auth0.com` |
| `VITE_AUTH0_CLIENT_ID` | Auth0 Application Client ID | `xxxxxxxxxxxxx` |
| `VITE_AUTH0_AUDIENCE` | Auth0 API identifier | `https://bookshelf-api` |
| `VITE_GRAPHQL_URL` | GraphQL API endpoint | `http://localhost:3000/graphql` |

**Important**: The `AUTH0_AUDIENCE` must match exactly across:
- Frontend `.env` file
- Backend `.env` file
- Auth0 API settings

## 🔌 GraphQL API

### Queries

**Get All Books**:
```graphql
query {
  books {
    id
    name
    description
  }
}
```

**Get Single Book**:
```graphql
query {
  book(id: 1) {
    id
    name
    description
  }
}
```

### Mutations

**Create Book**:
```graphql
mutation {
  createBook(createBookInput: {
    name: "Book Name"
    description: "Book Description"
  }) {
    id
    name
    description
  }
}
```

**Update Book**:
```graphql
mutation {
  updateBook(updateBookInput: {
    id: 1
    name: "Updated Name"
    description: "Updated Description"
  }) {
    id
    name
    description
  }
}
```

**Delete Book**:
```graphql
mutation {
  removeBook(id: 1)
}
```

**Note**: All queries and mutations require authentication. Include the JWT token in the `Authorization` header:
```
Authorization: Bearer <your-access-token>
```

## 🚢 Deployment

### Backend Deployment (Render/Fly.io)

1. **Render**:
   - Connect your repository
   - Set build command: `cd backend && npm install && npm run build`
   - Set start command: `cd backend && npm run start:prod`
   - Add environment variables in Render dashboard

2. **Fly.io**:
   - Install Fly CLI: `npm install -g @fly/cli`
   - Run `fly launch` in the backend directory
   - Configure environment variables

### Frontend Deployment (Netlify/Vercel)

1. **Netlify**:
   - Connect your repository
   - Set build command: `cd frontend && npm install && npm run build`
   - Set publish directory: `frontend/dist`
   - Add environment variables (prefixed with `VITE_`)

2. **Vercel**:
   - Connect your repository
   - Set root directory to `frontend`
   - Add environment variables

**Important**: Update Auth0 Application settings with production URLs:
- **Allowed Callback URLs**: Add your production frontend URL
- **Allowed Logout URLs**: Add your production frontend URL
- **Allowed Web Origins**: Add your production frontend URL

Update environment variables in both frontend and backend with production URLs.

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Tests
Currently, frontend tests are not configured. You can add testing libraries like Vitest or React Testing Library.

## 📝 Code Quality

This project follows:
- **Conventional Commits** specification
- **TypeScript** strict mode
- **ESLint** for code linting
- **Prettier** for code formatting

## 🤝 Contributing

1. Follow conventional commit messages
2. Ensure TypeScript types are correct
3. Test your changes locally
4. Update documentation as needed

## 📄 License

This project is created for a coding assessment.

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid or expired token"**:
   - Ensure `AUTH0_AUDIENCE` matches exactly in all three places (frontend, backend, Auth0)
   - Check that the token is being sent in the Authorization header

2. **CORS Errors**:
   - Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
   - Check that CORS is enabled in `backend/src/main.ts`

3. **Database Issues**:
   - Ensure `database.sqlite` file exists (created automatically on first run)
   - Check file permissions

4. **Auth0 Redirect Issues**:
   - Verify callback URLs in Auth0 dashboard match your application URL
   - Check that `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` are correct

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Auth0 Documentation](https://auth0.com/docs)
- [Chakra UI Documentation](https://chakra-ui.com/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)

---

Built with ❤️ using React, NestJS, and GraphQL

