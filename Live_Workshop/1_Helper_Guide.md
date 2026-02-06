# Day 2: React Workshop Helper Guide 🎓

This guide outlines exactly what to do and say during your 2.5-hour React session.

---

### Phase 0: The Big Bang (0:00 – 0:15)
*   **Action**: Open a terminal in this folder and create the project from scratch.
*   **Commands**:
    ```bash
    npm create vite@latest studyportal -- --template react
    cd studyportal
    npm install
    npm run dev
    ```
*   **Key Concept**: Explain Vite (the build tool) and why we use the React template.

### Phase 1: Theory & Core Concepts (0:15 – 0:45)
*   **Action**: Present your slides.
*   **Key Points**: Components, Props, State, Virtual DOM.
*   **Transition**: "Now, let's stop talking and start building. First, we need to handle multi-page navigation."

---

### Phase 2: Router & The "Wow" Moment (0:45 – 1:15)
1.  **Install Router**:
    ```bash
    npm install react-router-dom
    ```
2.  **Setup App.jsx**: Wrap everything in `<BrowserRouter>` and define your `<Routes>`. Explain that this is how we make a Single Page App (SPA).
3.  **The Fix (Library)**: Run the library install command:
    ```bash
    npm install github:PriyanshusinghPanda/gdgUiLib
    ```
4.  **Refresh**: Show the Navbar working with `NavLink`. **This is your first "Wow" moment.**

---

### Phase 3: Hands-on — Components & Props (1:15 – 1:45)
1.  **Home Page**: Open `src/pages/Home.jsx`. 
    - Explain how the `Hero` component receives data through **Props** (`title`, `subtitle`).
2.  **About Page**: Open `src/pages/About.jsx`.
    - **Live Coding Challenge**: Build the `FeatureCard` component together. 
    - Show how to **Map** the `gdgPillars` array into multiple cards. This teaches the "Data → UI" flow.

---

### Phase 4: State Sandbox (1:45 – 2:15)
1.  **Modular Coding**: Explain that we move logic to the `src/components` folder to keep things clean.
2.  **The Sandbox**: Open `src/pages/Concepts.jsx`.
3.  **State Demos**: Build the 3 most important ones live:
    - **Counter**: Basic `useState`.
    - **TextInput**: Controlled components (binding state to input).
    - **LightSwitch**: Boolean logic and conditional styling.

---

### Phase 5: Recap & Teaser (2:15 – 2:30)
*   **Show Completion**: Show them the full, polished product they've built (you can run the `day2-complete` project from your other folder to show the exact goal).
*   **Day 3 Teaser**: "Tomorrow, we make this portal 'Smart' by integrating Google's Gemini AI to generate quizzes automatically. Don't miss it!"

---

### Instructor Tips 💡
-   **Cheat Sheet**: If you forget component syntax, check the `README.md` inside your `gdgUiLib` repository.
-   **The Answer Key**: If you get stuck during live coding, refer to the code in the `day2-complete` project you saved earlier.
-   **Student Path**: Encourage students to build *their own* small components in the `components` folder for things like social links or footer items.
