
# BookWise Harmony Library Management System

A comprehensive library management system for tracking books, managing users, and handling book issues/returns.

## Technical Stack

- **TypeScript** - Main programming language for type-safe development across the application
- **React** - Frontend framework used for building the user interface
- **Vite** - Build tool and development server for fast development and optimized production builds
- **Supabase** - Backend platform providing:
  - Database storage for books, users, and issue records
  - Row Level Security (RLS) for data protection
  - Authentication and user management
  - File storage for book covers and user avatars
- **Tailwind CSS** - Utility-first CSS framework for styling components
- **shadcn/ui** - Component library providing pre-built UI components like:
  - Forms and input fields
  - Cards and layouts
  - Toasts for notifications
  - Modals and dialogs
- **React Query** - Data synchronization and caching library for managing server state
- **React Router** - Handles client-side routing
- **Recharts** - Library used for statistical visualizations in the dashboard
- **UUID** - Generation of unique identifiers for books and users

## Project Structure

```
src/
├── components/
│   ├── books/        # Book-related components
│   ├── layout/       # Layout components
│   ├── ui/           # Reusable UI components
│   └── users/        # User management components
├── integrations/
│   └── supabase/     # Supabase client and type definitions
├── lib/
│   ├── types.ts      # TypeScript type definitions
│   └── utils.ts      # Utility functions
└── pages/            # Route components
```

## Database Schema

### Tables

1. **profiles**
   - Stores user information
   - Fields: id, name, email, role, avatar_url, etc.
   - Role-specific fields for students, teachers, and librarians

2. **books**
   - Stores book information
   - Fields: id, title, author, isbn, category, copies, etc.

3. **book_issues**
   - Tracks book lending records
   - Fields: id, book_id, user_id, issue_date, return_date, status

## Features

- User registration and management (students, teachers, librarians)
- Book catalog management
- Book issue and return system
- Dashboard with statistics
- Search functionality for books and users
- Image upload for book covers and user avatars

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Required Environment Variables

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## TypeScript Configuration

The project uses strict TypeScript configuration with:
- Strict null checks
- Strict property initialization
- No implicit any
- Exact optional property types

## Component Library Usage

The project extensively uses shadcn/ui components. All components are located in `src/components/ui/` and are styled using Tailwind CSS utility classes.

## State Management

- React Query for server state management
- Local state managed with React's useState and useContext where appropriate
- Supabase realtime subscriptions for live updates

## API Integration

All database operations are handled through Supabase client:
- Direct database queries using Supabase's PostgreSQL interface
- Row Level Security (RLS) policies for data protection
- File storage for handling book covers and user avatars

## Testing

To run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request
