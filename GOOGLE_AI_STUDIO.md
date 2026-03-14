# AI Assistant Context
Used Google ai studio to architect the frontend system using:
- Next.js App Router for routing.
- Tailwind css.
- IndexedDB for large-scale client-side data storage.
- TanStack Query for server-state management.
- TanStack Virtual for high-performance rendering of 1000s of tasks.
- Zod + React Hook Form for type-safe forms.

## Key Prompts Used:
- "Create a virtualized list for worker tasks to handle 1000s of items."
- "How to manage role-based authentication and route protection."
- "Design a unified slide-over UI for task creation and submission."
- "Refactor these modal dialogs into reusable and generalized components."
- "Design the data service logic for a dashboard that shows different stats for 'admin' and 'worker' roles."
- "Implement business logic to prevent task submissions if allow_multiple_submissions is false or if the total submissions_count has been reached."
- "Replace the native browser prompt() and confirm() dialogs with custom React modals for user input and confirmation."
- "Create a ProtectedRoute component to prevent unauthenticated users from accessing any dashboard route."
- "Combine the Task Composer and Task Management screens into a single, unified UI using a slide-over panel for creating and editing tasks."
- "Build a data table for task management using TanStack Table that supports sorting, filtering, row selection, and bulk updates."
- "Configure a TanStack Virtualized List to efficiently render a worker task feed, ensuring smooth scrolling and high performance for thousands of items."
- "Update the user management table to hide the currently logged-in admin from the list."
- "Create a dynamic submission form that changes its input fields based on the task_type."

## Component Logic & Explanations
- "Explain useQuery and useMutation from TanStack Query in simple terms, as if I were a beginner."
- "Explain how the useEffect and reset functions in react-hook-form work together to handle both 'create' and 'edit' modes in a single form."
- "Explain what useReactTable is doing and what the get...Model() functions are for."
