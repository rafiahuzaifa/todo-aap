# Phase 2: Frontend UI/UX Specification

**Status**: READY  
**Framework**: Next.js 16+  
**Styling**: Tailwind CSS  
**State Management**: React Context + Custom Hooks  

---

## 1. Project Structure

### Next.js App Router Structure
```
frontend/
├── app/                          # App Router (Next.js 13+)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home/landing page
│   ├── error.tsx                 # Global error boundary
│   ├── loading.tsx               # Global loading UI
│   │
│   ├── (auth)/                   # Auth routes group
│   │   ├── layout.tsx            # Auth layout
│   │   ├── login/page.tsx        # Login page
│   │   ├── register/page.tsx     # Register page
│   │   └── forgot-password/page.tsx
│   │
│   ├── (dashboard)/              # Protected routes group
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── tasks/page.tsx        # Tasks list
│   │   ├── tasks/[id]/page.tsx   # Task detail
│   │   ├── tasks/[id]/edit/page.tsx
│   │   ├── settings/page.tsx     # User settings
│   │   └── profile/page.tsx      # User profile
│   │
│   └── api/                      # API routes (v1)
│       ├── auth/[...slug]/route.ts
│       └── (future) webhook routes
│
├── components/                   # Reusable components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── LogoutButton.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskFilter.tsx
│   │   └── TaskStats.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   │
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Loading.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Badge.tsx
│   │
│   └── ui/                      # UI library components
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Checkbox.tsx
│       └── TextArea.tsx
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useTasks.ts              # Tasks CRUD hook
│   ├── useApi.ts                # API client hook
│   └── useLocalStorage.ts       # LocalStorage hook
│
├── context/                      # React Context
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
│
├── services/                     # External services
│   ├── api-client.ts            # API client (axios)
│   ├── auth-service.ts          # Auth functions
│   ├── task-service.ts          # Task functions
│   └── storage-service.ts       # LocalStorage wrapper
│
├── types/                        # TypeScript types
│   ├── user.ts
│   ├── task.ts
│   ├── api.ts
│   └── auth.ts
│
├── utils/                        # Utilities
│   ├── formatting.ts            # Date, time formatters
│   ├── validation.ts            # Form validators
│   ├── errors.ts                # Error handlers
│   └── constants.ts             # App constants
│
├── lib/                          # Libraries
│   ├── axios-instance.ts        # Axios config
│   └── tailwind-config.ts
│
├── styles/                       # Global styles
│   ├── globals.css
│   └── tailwind.css
│
├── public/                       # Static assets
│   ├── icons/
│   ├── images/
│   └── favicon.ico
│
├── .env.example
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 2. Page Specifications

### 2.1 Landing Page `/`

**Purpose**: Unauthenticated users entry point

**Components**:
- Header with logo + CTA buttons (Login, Register)
- Hero section: "Evolution of Todo"
- Features showcase: 3 cards
- Testimonials: 2-3 quotes
- Footer with links

**Layout**: Full width, responsive

**Actions**:
- Click "Login" → Redirect to /login
- Click "Register" → Redirect to /register
- Auto-detect if logged in → Redirect to /dashboard

---

### 2.2 Login Page `/login`

**Purpose**: Authenticate existing users

**Components**:
- Logo/branding (left side or top)
- LoginForm with:
  - Email input field
  - Password input field
  - "Remember me" checkbox
  - "Forgot password?" link
  - Submit button
  - OAuth buttons (Google, GitHub - Phase 2b)
- "New user?" → Link to register

**Form Validation**:
- Email: Required, valid format
- Password: Required, min 1 char (backend validates)

**Error Handling**:
- Invalid credentials → Toast error
- Network error → Retry option
- Rate limit → "Too many attempts" message

**Success Flow**:
- Save tokens to localStorage
- Redirect to /dashboard
- Show welcome toast

**Styling**: Centered, card-based, 400px max-width

---

### 2.3 Register Page `/register`

**Purpose**: Create new user accounts

**Components**:
- Logo/branding
- RegisterForm with:
  - Name input field (2-100 chars)
  - Email input field (unique validation)
  - Password input field (strength indicator)
  - Confirm password field
  - Terms checkbox
  - Submit button
  - OAuth buttons (Google, GitHub - Phase 2b)
- "Already registered?" → Link to login

**Form Validation**:
- Name: Required, 2-100 chars
- Email: Required, valid RFC 5322, unique (async check)
- Password: Required, strength >= 3/4
  - Must have: uppercase, number, special char
  - Min 8 characters
- Confirm password: Must match password

**Password Strength Indicator**:
```
Weak:      1 criteria (red)
Fair:      2 criteria (orange)
Good:      3 criteria (yellow)
Strong:    4 criteria (green)
```

**Error Handling**:
- Duplicate email → Show async error
- Weak password → Show requirements
- Network error → Retry option

**Success Flow**:
- Auto-login with received token
- Redirect to /dashboard
- Show welcome toast

**Styling**: Centered, card-based, 450px max-width

---

### 2.4 Dashboard `/dashboard`

**Purpose**: Main application hub

**Layout**: 
- Header (top)
- Sidebar (left)
- Main content (right)
- Footer (bottom)

**Components**:
- TaskStats: Total, Completed, Pending, Overdue
- TaskChart: Completion trend (7 days)
- RecentTasks: 5 most recent tasks
- ActionButtons: Create task, View all

**Widgets**:
- Quick stats boxes (4 columns)
- Chart showing completion trend
- Recent activity list

**Responsive**:
- Desktop: Sidebar always visible
- Tablet: Sidebar collapsible
- Mobile: Sidebar hidden, hamburger menu

---

### 2.5 Tasks List `/tasks`

**Purpose**: View and manage all user tasks

**Layout**: 
- Header with "Tasks" title
- Filter/sort bar
- Task list (table or cards)

**Components**:
- TaskFilter:
  - Status: All, Active, Completed
  - Priority: All, Low, Medium, High
  - Due date: All, Today, This week, Overdue
  - Search: By title/description
- TaskList:
  - Checkbox to mark complete
  - Title + description preview
  - Priority badge (color coded)
  - Due date (relative: "in 2 days")
  - Actions: Edit, Delete, View
- Pagination: 20 items per page

**Actions**:
- Create new task (FAB or button)
- Edit task → Open modal/drawer
- Delete task → Confirm modal
- Mark complete → Toggle checkbox
- Click task → View detail page

**Empty State**:
- "No tasks yet" message
- Create task button
- Illustration

**Sorting Options**:
- Created date (newest first)
- Due date (earliest first)
- Priority (high → low)
- Completion status

---

### 2.6 Task Detail `/tasks/[id]`

**Purpose**: View single task with full details

**Components**:
- Task header: Title + status badge
- Description (full text)
- Metadata:
  - Created: Formatted date
  - Modified: Formatted date
  - Due: Formatted date + countdown
  - Priority: Badge
  - Status: Completed / Pending
- Action buttons:
  - Edit
  - Mark Complete / Incomplete
  - Delete
  - Back to list

**Layout**: 
- Card-based, centered
- 600px max-width on desktop

**Edit Mode** (`/tasks/[id]/edit`):
- Pre-fill form with task data
- Submit button to save
- Cancel button to discard

---

### 2.7 Create/Edit Task Modal

**Purpose**: Form to create or update task

**Components**:
- Title input (required, 1-200 chars)
- Description textarea (optional, 0-2000 chars)
- Priority select:
  - Low
  - Medium (default)
  - High
- Due date picker (datetime)
- Submit button
- Cancel button

**Validation**:
- Title: Required, 1-200 chars
- Description: Max 2000 chars
- Due date: Must be future (can't set past dates)

**Submit Flow**:
- Show loading state
- Disable button while saving
- On success: Close modal, refresh list, show toast
- On error: Show error message

**Styling**: Modal/drawer, responsive

---

### 2.8 Settings Page `/settings`

**Purpose**: User account settings and preferences

**Sections**:
1. **Profile Settings**:
   - Name (editable)
   - Email (read-only with change option)
   - Avatar upload (Phase 2b)
   - Save button

2. **Password & Security**:
   - Current password input
   - New password input
   - Confirm password input
   - Change password button
   - Session management (logout all devices)
   - Login history (last 10)

3. **Preferences**:
   - Theme: Light, Dark, Auto
   - Task notifications: On/Off
   - Email digest: Daily, Weekly, None
   - Language: English, Spanish, French (Phase 2b)

4. **Danger Zone**:
   - Delete account button (red, requires confirmation)

**Styling**: Card-based sections, clear spacing

---

### 2.9 Profile Page `/profile`

**Purpose**: View and edit user profile

**Components**:
- Avatar (circular, 120px)
- Name (editable inline)
- Email (with verification status)
- Bio/about (editable, 200 chars)
- Join date
- Activity stats

**Edit Mode**:
- Name input
- Bio textarea
- Save/Cancel buttons

---

## 3. Component Specifications

### 3.1 Authentication Components

#### LoginForm Component
```typescript
// Props
interface LoginFormProps {
  onSuccess?: () => void;  // Redirect callback
  loading?: boolean;        // Loading state
}

// State
- email: string
- password: string
- errors: Record<string, string>
- isLoading: boolean
- showPassword: boolean

// Handlers
- handleEmailChange()
- handlePasswordChange()
- handleTogglePassword()
- handleSubmit() → POST /api/v1/auth/login
- handleForgotPassword() → Navigate to /forgot-password
```

#### ProtectedRoute Component
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

// Logic
- Check if user logged in
- Check if token valid
- If not authenticated → Redirect to /login
- If no permission → Redirect to /dashboard
- Otherwise → Render children
```

### 3.2 Task Components

#### TaskCard Component
```typescript
interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

// Display
- Checkbox (incomplete/complete visual)
- Title (clickable → detail page)
- Description preview (50 chars)
- Priority badge (color: low=gray, medium=blue, high=red)
- Due date (formatted, color if overdue)
- Action buttons (edit, delete)
```

#### TaskList Component
```typescript
interface TaskListProps {
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  isLoading?: boolean;
}

// Display
- TaskCards in grid/list
- Empty state if no tasks
- Loading skeleton while fetching
- Pagination controls
```

### 3.3 Common Components

#### Button Component
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Variants
- Primary: Blue background, white text
- Secondary: Gray background, dark text
- Danger: Red background, white text

// States
- Normal: Full opacity
- Hover: Darker shade
- Disabled: 50% opacity, cursor not-allowed
- Loading: Show spinner, disabled
```

#### Modal Component
```typescript
interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
}

// Display
- Overlay with backdrop
- Centered modal
- Header with title + close button
- Body (children)
- Footer with buttons
```

#### Toast Component
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;  // Auto-dismiss after ms
  onClose?: () => void;
}

// Display
- Position: Top-right
- Auto-dismiss after 4 seconds
- Stacking support (multiple toasts)
- Icon + message
- Close button
```

---

## 4. State Management

### 4.1 Authentication Context

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshToken: () => Promise<void>;
}

// Provider
<AuthProvider>
  <App />
</AuthProvider>

// Usage in component
const { user, isAuthenticated, login } = useAuth();
```

### 4.2 useAuth Hook

```typescript
function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  
  return context;
}
```

### 4.3 useTasks Hook

```typescript
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchTasks = async (filters?: TaskFilters) => {
    // GET /api/v1/tasks?status=pending&priority=high
  };
  
  const createTask = async (data: CreateTaskData) => {
    // POST /api/v1/tasks
  };
  
  const updateTask = async (id: string, data: UpdateTaskData) => {
    // PATCH /api/v1/tasks/{id}
  };
  
  const deleteTask = async (id: string) => {
    // DELETE /api/v1/tasks/{id}
  };
  
  const completeTask = async (id: string) => {
    // PATCH /api/v1/tasks/{id} { completed: true }
  };
  
  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask
  };
}
```

---

## 5. Styling & Design System

### 5.1 Color Palette

**Primary**: `#3B82F6` (Blue)  
**Secondary**: `#10B981` (Green)  
**Danger**: `#EF4444` (Red)  
**Warning**: `#F59E0B` (Amber)  
**Success**: `#10B981` (Green)  
**Dark**: `#1F2937` (Gray-800)  
**Light**: `#F3F4F6` (Gray-100)  

### 5.2 Typography

**Font**: Inter or system font stack

**Sizes**:
- `h1`: 32px, weight 700
- `h2`: 24px, weight 700
- `h3`: 20px, weight 600
- `body`: 14px-16px, weight 400
- `small`: 12px, weight 400
- `label`: 12px, weight 500

### 5.3 Spacing

**Scale**: 4px base unit

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### 5.4 Shadows

- `sm`: `0 1px 2px rgba(0,0,0,0.05)`
- `md`: `0 4px 6px rgba(0,0,0,0.1)`
- `lg`: `0 10px 15px rgba(0,0,0,0.15)`

### 5.5 Border Radius

- `sm`: 4px
- `md`: 8px
- `lg`: 12px
- `full`: 9999px

---

## 6. Responsive Design

### Breakpoints

```typescript
- mobile: 0px-639px
- tablet: 640px-1023px
- desktop: 1024px+
```

### Mobile-First Approach
- Start with mobile layout
- Progressive enhancement with media queries
- Touch-friendly: Min 44px tap targets

### Layout Adjustments

**Mobile** (< 640px):
- Single column layout
- Sidebar hidden (hamburger menu)
- Full-width modals
- Stacked buttons

**Tablet** (640px - 1023px):
- Sidebar collapsible
- 2-column task grid
- Medium modals (80vw)
- Side-by-side buttons

**Desktop** (> 1024px):
- Sidebar always visible
- 3-4 column task grid
- Centered modals (600px)
- Horizontal button layout

---

## 7. Form Validation

### Client-Side Validation

```typescript
const validateEmail = (email: string): string | null => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "Invalid email format";
};

const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "Min 8 characters";
  if (!/[A-Z]/.test(password)) return "Need uppercase";
  if (!/[0-9]/.test(password)) return "Need number";
  if (!/[!@#$%^&*]/.test(password)) return "Need special char";
  return null;
};

const validateTaskTitle = (title: string): string | null => {
  if (!title?.trim()) return "Title required";
  if (title.length > 200) return "Max 200 characters";
  return null;
};
```

### Real-Time Validation
- Validate on blur (fields)
- Validate on submit (form)
- Show error messages inline
- Show success states

---

## 8. Error Handling

### API Error Responses

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;          // error_code
    message: string;       // Human readable
    details?: Record<string, unknown>;
  };
}
```

### Error Display

- **400 Bad Request**: Show field-level error
- **401 Unauthorized**: Redirect to login
- **403 Forbidden**: Show permission denied
- **404 Not Found**: Show item not found
- **429 Too Many Requests**: Show rate limit message
- **500 Server Error**: Show generic error + retry

### Toast Notifications
```typescript
// Success
showToast("Task created", "success");

// Error
showToast("Failed to delete task", "error");

// Info
showToast("Refreshing tasks...", "info");
```

---

## 9. Accessibility (a11y)

### WCAG 2.1 AA Compliance

**Keyboard Navigation**:
- Tab through all interactive elements
- Enter to activate buttons
- Escape to close modals
- Focus visible on all elements

**Screen Readers**:
- Semantic HTML (`<button>`, `<form>`, `<nav>`)
- ARIA labels for icons
- Form labels associated with inputs
- Role attributes where needed

**Color Contrast**:
- Min 4.5:1 ratio for text
- Min 3:1 ratio for UI components

**Alternative Text**:
- Images have alt text
- Icons have aria-label

---

## 10. Performance Optimization

### Code Splitting
- Lazy load dashboard components
- Lazy load task detail page
- Route-based splitting

### Image Optimization
- Use `next/image` component
- Responsive images (srcSet)
- Lazy loading for offscreen images

### Caching Strategy
- Cache API responses (5 min)
- Cache user preferences (1 hour)
- Service worker (Phase 2b)

### Bundle Size
- Target: < 150KB gzip
- Monitor with `npm run analyze`

---

## 11. Testing Strategy

### Unit Tests (Jest)
```typescript
// components/__tests__/Button.test.tsx
describe("Button Component", () => {
  test("renders with children", () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText("Click me")).toBeInTheDocument();
  });
  
  test("calls onClick when clicked", () => {
    const onClick = jest.fn();
    const { getByText } = render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(getByText("Click"));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Integration Tests (Cypress/Playwright)
```typescript
// e2e/auth.spec.ts
describe("Authentication Flow", () => {
  test("user can register and login", () => {
    cy.visit("/register");
    cy.get('[data-testid="email"]').type("test@example.com");
    cy.get('[data-testid="password"]').type("SecurePass123!");
    cy.get('[data-testid="submit"]').click();
    cy.url().should("include", "/dashboard");
  });
});
```

---

## 12. Browser Support

- Chrome: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Edge: Latest 2 versions
- Mobile: iOS Safari 12+, Chrome Android

---

## 13. Deployment

### Build Optimization
```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
npm run type-check  # TypeScript check
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_AUTH_URL=https://auth.example.com
NEXT_PUBLIC_ENV=production
```

### Vercel Deployment
- Push to main → Auto-deploy
- Preview branches
- Analytics tracking
