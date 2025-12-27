# Conference Session Planner

A Next.js application for browsing conference sessions and managing a personal agenda.

## How to Run the Project

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

3.  **Run tests:**
    ```bash
    npm run test
    ```

4.  **Build for production:**
    ```bash
    npm run build
    npm run start
    ```

## Architecture Decisions

### Data Loading
-   **Source:** Session data is currently stored in a local JSON file (`data/sessions.json`).
-   **Implementation:** The data is imported directly into the pages/components. In a real-world scenario, this would likely be replaced by a fetch call to an API or a database query.

### Client vs. Server Components
-   **`app/page.tsx` (Server Component):** The main landing page is a Server Component. It loads the initial session data on the server, providing better initial page load performance and SEO.
-   **`components/session-filters.tsx` (Client Component):** This component requires `"use client"` because it manages the interactive state of the filters (search text, track selection, time slots) and communicates updates to the parent list.
-   **`app/agenda/page.tsx` (Client Component):** The agenda page is a Client Component because it relies heavily on the `useAgenda` hook, which interacts with `localStorage` to persist the user's saved sessions. Since `localStorage` is a browser-only API, this page must run on the client.

### State Management
-   **Agenda Context:** A React Context (`AgendaContext`) is used to manage the global state of the user's selected sessions.
-   **Persistence:** The `usePersistentState` hook syncs the agenda state with the browser's `localStorage`, allowing the user's selection to persist across page reloads.

## Trade-offs & Shortcuts

-   **No Backend/Database:** To keep the project self-contained and easy to run, I opted for a static JSON file instead of setting up a full database (like PostgreSQL) or a headless CMS. This means data is read-only and cannot be updated dynamically without a code deployment.
-   **Client-Side Filtering:** Filtering logic is performed entirely on the client. For the current dataset size, this is performant and provides instant feedback. However, for a conference with thousands of sessions, this should be moved to the server (using URL search params) to reduce the JS bundle size and improve performance.
-   **Local Storage Persistence:** User data (the agenda) is stored in `localStorage`. This is a quick way to add persistence without authentication, but it means data is tied to a specific browser/device and will be lost if the cache is cleared.

## Future Improvements

With more time, I would implement the following:

1.  **Backend Integration:** Replace the JSON file with a real database (e.g., Vercel Postgres) and create API routes to fetch and filter sessions.
2.  **User Authentication:** Add authentication (e.g., NextAuth.js) to allow users to log in and save their agenda to the database, enabling cross-device synchronization.
3.  **URL-Based Filtering:** Refactor the filtering system to store state in the URL query parameters. This would make filtered views shareable and improve the user experience.
4.  **End-to-End Testing:** Add Playwright or Cypress tests to ensure critical flows (like adding a session to the agenda) work as expected in a real browser environment.
5.  **Performance Optimization:** Implement virtualization for the session list if the number of sessions grows significantly.
