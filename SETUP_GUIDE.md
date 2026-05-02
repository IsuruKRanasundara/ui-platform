# Authentication System - Complete Setup Guide

## Quick Start

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Get Supabase Credentials
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Go to Settings → API to find:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY)

### Step 3: Configure Environment Variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Run Database Setup SQL
1. In Supabase Dashboard, go to SQL Editor
2. Click "New Query"
3. Copy entire contents of `SUPABASE_SETUP.sql`
4. Paste into the SQL editor
5. Click "Run"
6. You should see: "Success. No rows returned"

### Step 5: Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 and you should see the auth system home page!

---

## File Structure & Explanation

### Authentication Files

#### `app/contexts/auth-context.tsx`
The heart of the auth system. Provides:
- `AuthProvider` - Wraps your app with auth functionality
- `useAuth()` - Hook to access auth methods and state
- Handles user signup, signin, signout, password reset
- Manages auth state globally

**Key exports:**
```typescript
export const AuthProvider: React.FC<{ children: ReactNode }>
export const useAuth: () => AuthContextType
```

#### `lib/supbase/client.ts`
Browser-side Supabase client. Used in client components.
- Only uses `NEXT_PUBLIC_*` variables (safe to expose)
- Handles user authentication
- Syncs session state

#### `lib/supbase/server.ts`
Server-side Supabase client. Used in server components.
- Uses service role key (SERVER SIDE ONLY)
- For admin operations and data access
- Never expose to frontend

#### `lib/supabase-types.ts`
TypeScript type definitions:
- `User` - User profile type
- `AuthContextType` - Auth context API type

#### `middleware.ts`
Next.js middleware for session management:
- Runs on every request
- Updates session cookies
- Maintains auth state across navigations

### UI Components

#### `components/ui/button.tsx`
Reusable button component with variants:
- `variant`: default, destructive, outline, secondary, ghost, link
- `size`: default, sm, lg, icon
- Example: `<Button variant="destructive" size="lg">Delete</Button>`

#### `components/ui/input.tsx`
Text input component with styling:
- Supports all HTML input types
- Tailwind styled for consistency
- Example: `<Input type="email" placeholder="..." />`

#### `components/ui/card.tsx`
Card container with subcomponents:
- `Card` - Container
- `CardHeader` - Header section
- `CardTitle` - Card title
- `CardDescription` - Subtitle
- `CardContent` - Main content
- `CardFooter` - Bottom section

#### `components/ui/label.tsx`
Form label component using Radix UI:
- Accessible label component
- Works with form inputs
- Example: `<Label htmlFor="email">Email</Label>`

#### `components/ui/alert.tsx`
Alert/notification component with variants:
- `variant`: default, destructive, success
- Components: `Alert`, `AlertTitle`, `AlertDescription`

### Page Routes

#### `app/page.tsx` (Home)
Landing page showing:
- Auth system overview
- Feature highlights
- Links to login/register
- Auto-redirects authenticated users to dashboard

#### `app/login/page.tsx`
Login page with:
- Email and password fields
- Error handling
- Success notification
- Link to signup and forgot password
- Auto-redirect authenticated users to dashboard

#### `app/register/page.tsx`
Registration page with:
- Full name, email, password fields
- Password confirmation
- Validation (password length, matching)
- Error handling
- Link to login page
- Auto-redirect authenticated users to dashboard

#### `app/forgot-password/page.tsx`
Password reset page with:
- Email input for password reset request
- Success message when sent
- Link back to login
- Error handling

#### `app/dashboard/page.tsx` (Protected)
User dashboard showing:
- User profile information
- User ID, email, full name
- Account creation date
- Logout button
- Auto-redirect unauthenticated users to login

### Configuration Files

#### `.env.local` (NOT in repo)
Your local environment variables. **Never commit this!**
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

#### `.env.local.example`
Template for environment variables. Used as reference.

#### `SUPABASE_SETUP.sql`
Database setup script that creates:
- `profiles` table
- Row Level Security policies
- Automatic triggers for user creation
- Indexes for performance

#### `AUTH_SYSTEM_README.md`
Comprehensive documentation

#### `app/globals.css`
Global Tailwind CSS configuration:
- Color theme variables
- CSS variables for UI components
- Responsive design base styles

---

## How It Works

### 1. User Signup Flow
```
User fills form → signUp() called → Supabase creates auth user 
→ Trigger creates profile row → User logged in → Redirect to dashboard
```

### 2. User Login Flow
```
User fills form → signIn() called → Supabase verifies password 
→ Session created → Profile loaded → User state updated → Redirect to dashboard
```

### 3. Protected Dashboard
```
User visits /dashboard → Check if user exists → If yes, show dashboard 
→ If no, redirect to /login
```

### 4. Password Reset Flow
```
User requests reset → resetPassword() sends email 
→ User clicks email link → Updates password → Can login with new password
```

---

## Key Components Explained

### Auth Provider (in layout.tsx)
```typescript
<AuthProvider>
  {children}
</AuthProvider>
```
Wraps entire app to make auth available everywhere.

### useAuth Hook
```typescript
const { user, isLoading, signIn, error } = useAuth();
```
Use this in any component to access auth functionality.

### Protected Routes
```typescript
useEffect(() => {
  if (!user && !isLoading) {
    router.push('/login');
  }
}, [user, isLoading]);
```
Redirect unauthenticated users to login.

### Redirect Authenticated Users
```typescript
useEffect(() => {
  if (user && !isLoading) {
    router.push('/dashboard');
  }
}, [user, isLoading]);
```
Prevent authenticated users from accessing login/register pages.

---

## Database Schema

### profiles table
```sql
id          → UUID, primary key, references auth.users
email       → TEXT, required, indexed
full_name   → TEXT, optional
avatar_url  → TEXT, optional
created_at  → TIMESTAMP
updated_at  → TIMESTAMP
```

### Row Level Security Policies
- ✅ User can SELECT their own profile
- ✅ User can UPDATE their own profile
- ✅ User can INSERT their own profile (during signup)
- ❌ User cannot access other profiles

---

## Common Tasks

### Get Current User
```typescript
const { user } = useAuth();
console.log(user?.full_name);
```

### Check if Loading
```typescript
const { isLoading } = useAuth();
if (isLoading) return <div>Loading...</div>;
```

### Handle Errors
```typescript
const { error, clearError } = useAuth();
useEffect(() => {
  if (error) {
    console.error(error);
    // Show error to user
  }
}, [error]);
```

### Sign Out User
```typescript
const { signOut } = useAuth();
const handleLogout = async () => {
  await signOut();
  router.push('/login');
};
```

---

## Customization Examples

### Change Button Colors
In `components/ui/button.tsx`, modify the `variantStyles`:
```typescript
default: 'bg-purple-600 hover:bg-purple-700'
```

### Add New Profile Field
1. Add column to profiles table in Supabase
2. Update `User` type in `lib/supabase-types.ts`
3. Update auth context to fetch/update the field
4. Use in components

### Add Social Login (Google)
```typescript
const handleGoogleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  });
};
```

### Enable Email Verification
In Supabase Settings → Auth:
- Enable email confirmation
- Users must verify email before logging in

---

## Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local` (NOT `.env.local.example`)
- [ ] `.env.local` is in `.gitignore`
- [ ] Using HTTPS in production
- [ ] RLS policies created and tested
- [ ] Email verification enabled in production
- [ ] Rate limiting configured
- [ ] Password policy enforced
- [ ] CORS configured in Supabase
- [ ] Backup strategy in place
- [ ] Monitoring/logging set up

---

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env.local` exists
- Verify variable names match exactly
- Restart dev server: `npm run dev`

### Error: "User already exists"
- Email is already registered
- User must use different email

### Password reset email not received
- Check Supabase email settings
- Verify email address is correct
- Check spam folder
- Ensure redirect URL is set

### Can't sign in after signup
- Verify RLS policies are created
- Check profiles table has correct data
- Clear browser cookies and try again

### TypeScript errors
- Run `npm run build` to check
- Ensure all imports use `@/` path alias
- Check type definitions match database schema

---

## Next Steps

1. **Customize UI**: Update colors and styling in `globals.css`
2. **Add OAuth**: Enable Google/GitHub login in Supabase
3. **Add Profile Fields**: Extend `profiles` table with more data
4. **Set Up Email**: Configure custom email templates
5. **Deploy**: Push to production when ready
6. **Monitor**: Set up analytics and error tracking

---

## Support

For issues or questions:
- Check [Supabase Docs](https://supabase.com/docs)
- Read [Next.js Documentation](https://nextjs.org/docs)
- Review code comments in relevant files

---

**You now have a complete, production-ready authentication system!** 🎉
