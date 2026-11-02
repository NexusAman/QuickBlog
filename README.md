# QuickBlog

QuickBlog is a full-stack blogging platform with a public blog experience and a protected administration dashboard. Administrators can create, publish, manage, and delete blog posts, while readers can browse posts, search by title or category, and leave comments.

## Features

- Public blog listing with category filtering and search
- Individual blog pages with comments
- Admin login protected by JSON Web Tokens
- Admin dashboard with blog and comment statistics
- Create, publish, and delete blog posts
- Image uploads through ImageKit
- Comment moderation and approval
- AI-assisted blog drafting with Groq
- Responsive React interface

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Quill
- React Hot Toast

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens
- Multer
- ImageKit
- Groq SDK

## Project Structure

```text
QuickBlog/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Shared and admin UI components
│   │   ├── context/        # Application state and API configuration
│   │   └── pages/          # Public and admin pages
│   └── vercel.json         # Frontend SPA routing
├── server/                 # Express API
│   ├── config/             # Database and ImageKit configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication and upload middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── vercel.json         # Backend deployment configuration
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB database
- ImageKit account
- Groq API key for AI-assisted blog drafting

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NexusAman/QuickBlog.git
cd QuickBlog
```

### 2. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure environment variables

Create `server/.env` from the provided example:

```bash
cd server
copy .env.example .env
```

Set the following values in `server/.env`:

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection URI. The application uses the `quickblog` database. |
| `ADMIN_EMAIL` | Email used for admin login. |
| `ADMIN_PASSWORD` | Password used for admin login. |
| `JWT_SECRET` | Long, random secret used to sign authentication tokens. |
| `GROQ_API_KEY` | Groq API key used to generate blog drafts in the admin editor. |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key. |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint. |
| `PORT` | Local API port, usually `3000`. |

Create `client/.env` and set the backend URL:

```env
VITE_BASE_URL=http://localhost:3000
```

Never commit `.env` files or real credentials.

### 4. Run the application

Start the backend in one terminal:

```bash
cd server
npm run server
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend is available at `http://localhost:5173`, and the API is available at `http://localhost:3000`.

## Available Scripts

### Client

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

### Server

| Command | Description |
| --- | --- |
| `npm run server` | Start the API with Nodemon |
| `npm start` | Start the API with Node.js |

## API Overview

### Public endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check API availability |
| `GET` | `/api/blog/all` | Get all blogs |
| `GET` | `/api/blog/:blogId` | Get a blog by ID |
| `POST` | `/api/blog/add-comment` | Add a comment |
| `POST` | `/api/blog/comments` | Get comments for a blog |

### Admin endpoints

Admin endpoints require a valid authentication token unless noted otherwise.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/admin/login` | Authenticate an administrator |
| `GET` | `/api/admin/dashboard` | Get dashboard statistics |
| `GET` | `/api/admin/blogs` | Get blogs for administration |
| `GET` | `/api/admin/comments` | Get comments for moderation |
| `POST` | `/api/admin/approve-comment` | Approve a comment |
| `POST` | `/api/admin/delete-comment` | Delete a comment |
| `POST` | `/api/blog/add` | Create a blog with an image upload |
| `POST` | `/api/blog/delete` | Delete a blog |
| `POST` | `/api/blog/toggle-publish` | Toggle blog publication status |
| `POST` | `/api/blog/generate` | Generate an AI-assisted blog draft from a topic |

## Deployment

The project is configured for two Vercel projects:

1. Set the frontend project root directory to `client`.
2. Set the backend project root directory to `server`.
3. Configure the required environment variables in the Vercel dashboard.
4. Set the frontend `VITE_BASE_URL` to the deployed backend URL.

The frontend `vercel.json` provides SPA fallback routing for React Router. The backend `vercel.json` routes API requests to `server.js` through Vercel's Node runtime.

## Security Notes

- Use strong, unique admin credentials in every environment.
- Use a cryptographically random `JWT_SECRET`.
- Keep database and ImageKit credentials private.
- Configure production CORS rules according to the deployed frontend domain.

## License

This project is distributed under the ISC license specified in `server/package.json`.
