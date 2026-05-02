# Supabase Authentication System

A complete, production-ready authentication system built with Next.js App Router, Supabase, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

✅ **Email & Password Authentication**
- User registration with email, password, and full name
- Secure password hashing via Supabase
- Email verification support

✅ **User Management**
- Login with email and password
- Logout functionality
- Password reset / forgot password flow
- User profile data persistence

✅ **Protected Routes**
- Dashboard accessible only to authenticated users
- Automatic redirect to login for unauthenticated users
- Redirect authenticated users away from login/register pages

✅ **Security**
- Row Level Security (RLS) policies
- Environment variables for sensitive data
- Service role key kept server-side only
- Secure session management

✅ **UI/UX**
- Responsive design (mobile-first)
- Clean, modern interface with shadcn/ui components
- Loading states and spinners
- Error messages and validation feedback
- Success notifications

✅ **Developer Experience**
- Full TypeScript support
- Type-safe authentication context
- Reusable auth hooks
- Well-organized file structure
- Comprehensive comments

## Project Structure

```
app/
├── contexts/
│   └── auth-context.tsx          # Auth provider and useAuth hook
├── login/
│   └── page.tsx                  # Login page
├── register/
│   └── page.tsx                  # Registration page
├── forgot-password/
│   └── page.tsx                  # Password reset page
├── dashboard/
│   └── page.tsx                  # Protected dashboard
├── layout.tsx                    # Root layout with AuthProvider
├── page.tsx                      # Home page
└── globals.css                   # Global styles

components/
└── ui/
    ├── button.tsx                # Button component
    ├── input.tsx                 # Input component
    ├── card.tsx                  # Card component
    ├── label.tsx                 # Label component
    └── alert.tsx                 # Alert component

lib/
├── supbase/
│   ├── client.ts                 # Browser Supabase client
│   └── server.ts                 # Server Supabase client
├── supabase-types.ts             # TypeScript types
└── utils.ts                      # Utility functions

middleware.ts                      # Next.js middleware for session management

SUPABASE_SETUP.sql                # SQL setup script
.env.local.example                # Environment variables template
```

## Installation

### 1. Clone and Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.local.example .env.local
```

### 2. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key from project settings
3. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database Setup

1. Go to your Supabase project's SQL editor
2. Copy the entire contents of `SUPABASE_SETUP.sql`
3. Paste and run it in the SQL editor
4. This creates the `profiles` table and RLS policies

### 4. Configure Auth Settings (Optional)

In Supabase dashboard → Authentication → Providers:
- Enable Email/Password provider
- Configure email templates as needed
- Set up SMTP for production emails

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your auth system.

## Usage

### Using the Auth Hook

```typescript
import { useAuth } from '@/app/contexts/auth-context';

export function MyComponent() {
  const { user, signIn, signOut, error } = useAuth();

  // Check if user is logged in
  if (user) {
    console.log('Welcome', user.full_name);
  }

  // Sign in
  const handleLogin = async () => {
    try {
      await signIn('user@example.com', 'password');
    } catch (err) {
      console.error(err);
    }
  };

  // Sign out
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### Auth Context API

```typescript
type AuthContextType = {
  user: User | null;                    // Current user or null
  isLoading: boolean;                   // Loading state
  signUp: (email, password, fullName) => Promise<void>
  signIn: (email, password) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email) => Promise<void>
  error: string | null;                 // Error message
  clearError: () => void                // Clear error
};
```

## Available Pages

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Home page with auth info | Public |
| `/login` | User login | Unauthenticated only |
| `/register` | User signup | Unauthenticated only |
| `/forgot-password` | Password reset | Unauthenticated only |
| `/dashboard` | User dashboard | Authenticated only |

## Environment Variables

```env
# Required: Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Required: Your Supabase anon key (safe to expose)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required: Service role key (server-side only, never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Security Considerations

### ✅ What's Protected
- Passwords are hashed by Supabase (bcrypt)
- Service role key is server-side only
- Row Level Security enforces data access
- HTTPS required in production
- Session tokens are HttpOnly

### ⚠️ Best Practices
1. **Never expose service role key** - Keep it server-side only
2. **Use HTTPS** - Essential for auth in production
3. **Validate on server** - Don't rely on client-side validation alone
4. **Rate limit** - Prevent brute force attacks (configure in Supabase)
5. **Email verification** - Enable in production for security
6. **Password policy** - Enforce strong passwords

## Customization

### Styling

The UI uses Tailwind CSS. Modify styles in:
- `app/globals.css` - Global theme colors
- Component files - Individual component styles

### Add OAuth

To add Google/GitHub login:

1. Configure OAuth in Supabase dashboard
2. Add sign-in button:

```typescript
const handleGoogleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
};
```

### Extend User Profile

Add more fields to the profiles table:

```sql
ALTER TABLE profiles ADD COLUMN phone_number TEXT;
ALTER TABLE profiles ADD COLUMN bio TEXT;
```

Update TypeScript types in `lib/supabase-types.ts`:

```typescript
export type User = {
  // ... existing fields
  phone_number?: string;
  bio?: string;
};
```

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists and has correct values
- Restart dev server after updating .env

### "Email already exists"
- Supabase prevents duplicate emails by default
- User must use unique email to register

### RLS policy errors
- Run `SUPABASE_SETUP.sql` again
- Check policies are enabled on profiles table
- Verify user has auth session

### Forgot password link doesn't work
- Configure email redirect URL in Supabase:
  - Email Templates → Forgot password
  - Redirect URL: `https://yourapp.com/auth/reset-password`

## Database Schema

### profiles table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### RLS Policies

- ✅ Users can SELECT their own profile
- ✅ Users can UPDATE their own profile
- ✅ Users can INSERT their own profile
- ❌ Users cannot access other users' profiles

## Performance Tips

1. **Images** - Use Next.js Image component
2. **Code splitting** - Dynamic imports for large components
3. **Caching** - Configure Supabase query caching
4. **Database** - Add indexes to frequently queried columns

## Production Checklist

- [ ] Update `.env.local` with production credentials
- [ ] Enable HTTPS everywhere
- [ ] Enable email verification
- [ ] Set up password reset email template
- [ ] Configure allowed redirect URLs
- [ ] Enable rate limiting
- [ ] Set up analytics/monitoring
- [ ] Test auth flow thoroughly
- [ ] Backup database regularly
- [ ] Review RLS policies

## Support & Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## License

This project is open source and available under the MIT License.
