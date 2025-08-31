# User Management Frontend

A React TypeScript frontend application for the User Management system.

## Features

- User registration and login
- User dashboard and profile management
- JWT-based authentication
- Responsive design
- TypeScript for type safety

## Prerequisites

### For Local Development:
- Node.js (v16 or higher)
- npm or yarn

### For Docker:
- Docker
- Docker Compose

## Installation & Running

### 🐳 Docker (Recommended)

#### Quick Start - Frontend Only
```bash
# Build and run frontend container
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

#### Full Stack (from root/DB directory)
```bash
# Navigate to DB directory and start everything
cd ../DB
docker-compose up --build
```

### 📦 Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the API URL if needed (default: http://localhost:5000/api)

3. Start development server:
```bash
npm start
```

The app will run on [http://localhost:3000](http://localhost:3000).

## 🐳 Docker Configuration

### Build
- **Multi-stage build**: Node.js for building, Nginx for serving
- **Optimized**: Production-ready static files
- **Lightweight**: Alpine-based images

### Services
- **Frontend**: `http://localhost:3000` (Docker) / `http://localhost:3000` (Local)
- **API Proxy**: Nginx proxies `/api` requests to backend

### Environment Variables
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Available Scripts

### Development

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
