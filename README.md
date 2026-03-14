🛠️ Development Tools: Changing User Roles

This project includes a hidden debug utility that allows developers to modify user roles (e.g., changing a worker to an admin) via the browser's developer console.

⚠️ Prerequisites

Ensure your .env file has the debug flag enabled:

- NEXT_PUBLIC_DEBUG=true

You must be logged in with the user

How to Change a Role to Admin

Open the Browser Console
- Right-click anywhere on the page and select Inspect.
- Click on the Console tab.

Run the Admin Command
- The DebugTools component exposes a global function called makeAdmin. Type the following command into the  console, replacing the email with the user you want to upgrade:
- makeAdmin("user@example.com");

Verify the Output
- You should see a message in the console: Command executed for: user@example.com.

Refresh and Log In
- Because the role is updated in IndexedDB, you need to refresh the page to see the changes.
- If you were already logged in as that user, Log Out and Log In again to refresh your active session and see the Admin Dashboard.