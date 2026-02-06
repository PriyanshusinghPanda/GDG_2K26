# Day 2 Workshop: Implementation Checklist ✅

Follow these steps live with your students to build the project from absolute scratch.

### 0. The Birth (Project Creation)
Create the folder and clean the slate:
```bash
npm create vite@latest studyportal -- --template react
cd studyportal
npm install
```

### 1. Navigation (React Router)
Install and configure routing:
```bash
npm install react-router-dom
```
- [ ] In `main.jsx` (or `App.jsx`), wrap the app in `<BrowserRouter>`.
- [ ] Define `<Routes>` and `<Route>` for Home, About, and Concepts.

### 2. The "Power up" (Library Install)
Run this command to get our premium UI library:
```bash
npm install github:PriyanshusinghPanda/gdgUiLib
```
- [ ] Import library CSS in `App.jsx` or `main.jsx`: `import 'gdg-ui/src/styles.css';`
- [ ] Replace plain `nav` with the library `<Navbar brand="STUDYPORTAL">`.

### 3. Components & Props Intro (Home.jsx)
- [ ] Build a `Hero` component.
- [ ] Pass `title` and `subtitle` as **Props**.
- [ ] Use the library `<Button>` for the CTA.

### 4. Mapping & Reusable Components (About.jsx)
- [ ] Create a `FeatureCard` component.
- [ ] Pass it `emoji`, `title`, and `description`.
- [ ] Use `gdgPillars.map()` to render everything neatly.

### 5. State Sandbox (Concepts.jsx)
- [ ] Wrap your demos in the library's `<Card>`, `<Grid>`, and `<Container>`.
- [ ] Create new files in `src/components/` and finish the logic for:
  - `Counter.jsx` (useState)
  - `TextInput.jsx` (onChange)
  - `LightSwitch.jsx` (Conditional styling)

### 6. The "Pro" Look
- Refresh the page and show how everything—from buttons to inputs—now has a consistent glassmorphism theme with zero extra CSS!
