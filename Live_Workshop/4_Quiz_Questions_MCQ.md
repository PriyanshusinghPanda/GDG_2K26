# React & JS Workshop: 15-Question MCQ Assessment

Here are 15 multiple-choice questions (MCQs) you can use for your Kahoot, Google Form, or live quiz. The correct answer is marked with **(CORRECT)**.

---

## Part 1: Day 3 Architecture & AI Integration (10 Questions)

**1. What is the primary purpose of the `@google/genai` package we installed on Day 3?**
- [ ] A) To add pre-built UI components like buttons and cards.
- [x] B) To securely communicate with Google's Gemini AI models using an SDK. **(CORRECT)**
- [ ] C) To manage React Router navigation between pages.
- [ ] D) To automatically write CSS for our web app.

**2. Where is the safest place to store an API key (like our Gemini Key) in a React/Vite project?**
- [ ] A) Directly in `App.jsx` so it loads first.
- [ ] B) In a public `config.json` file.
- [x] C) In an environment variable (e.g., `.env`) accessed via `import.meta.env`. **(CORRECT)**
- [ ] D) Inside the `<script>` tag of `index.html`.

**3. In our code, we use `{loading && <div>Thinking...</div>}`. What does the `&&` operator do here in React?**
- [ ] A) It joins two strings together.
- [x] B) Conditional Rendering: It only shows the `<div>` if `loading` is true. **(CORRECT)**
- [ ] C) It loops over an array of variables.
- [ ] D) It adds an event listener to the `<div>`.

**4. Why did we have to use `JSON.parse` on the response we got back from the Gemini AI?**
- [ ] A) Because React does not allow strings in state variables.
- [ ] B) To encrypt the data before sending it to the user.
- [x] C) The AI returns text (a string); we must parse it to turn it into a usable JavaScript object/array. **(CORRECT)**
- [ ] D) To check if the AI's response contains bad words.

**5. Why do we write `<button onClick={() => handleAnswer(opt)}>` instead of `<button onClick={handleAnswer(opt)}>`?**
- [x] A) The arrow function ensures `handleAnswer` is only called when clicked. The second one runs instantly on render, causing an infinite loop. **(CORRECT)**
- [ ] B) React only accepts arrow functions, normal functions are banned.
- [ ] C) The arrow function runs faster in the browser.
- [ ] D) They both do exactly the same thing.

**6. What is the role of the `currentIdx` state variable in our Quiz game?**
- [ ] A) It counts how many times the user clicked the button.
- [x] B) It acts as a pointer to show only one question at a time from our array of questions. **(CORRECT)**
- [ ] C) It randomly shuffles the questions.
- [ ] D) It timers how long the user takes to answer.

**7. Why do we put our API call inside a `try...catch...finally` block?**
- [ ] A) Because API calls never fail.
- [ ] B) To make the API call execute faster.
- [x] C) To handle errors gracefully if the network fails or the API key is wrong, without crashing the app. **(CORRECT)**
- [ ] D) Because Vite requires it for all functions.

**8. In `Quiz.jsx`, we use `onChange={(e) => setTopic(e.target.value)}` on our textarea. What React concept is this?**
- [ ] A) Uncontrolled Component
- [x] B) Controlled Component (State is the single source of truth) **(CORRECT)**
- [ ] C) Forwarding Refs
- [ ] D) Context API

**9. When checking the correct answer, we write `if (selectedOption === currentQ.answer)`. Why use `===` instead of `==`?**
- [x] A) `===` checks both value AND type (strict equality), preventing weird JavaScript bugs. **(CORRECT)**
- [ ] B) `===` is required by React; `==` throws an error.
- [ ] C) `===` ignores upper/lower case differences.
- [ ] D) `===` executes faster than `==`.

**10. What is the purpose of the `loading` state variable (set to `true` when clicked, `false` when done)?**
- [ ] A) To increase our score.
- [ ] B) To disconnect from the internet.
- [x] C) To show visual feedback (like a spinner or message) so the user knows the AI is processing their request. **(CORRECT)**
- [ ] D) To reload the entire webpage.

---

## Part 2: JavaScript & React Debugging (5 Questions)

**11. Look at the code below. What is the exact order of the console logs?**
```javascript
console.log("A");
setTimeout(() => { console.log("B"); }, 0);
Promise.resolve().then(() => { console.log("C"); });
console.log("D");
```
- [ ] A) `A, B, C, D`
- [ ] B) `A, D, B, C`
- [x] C) `A, D, C, B` **(CORRECT)**
- [ ] D) `C, B, A, D`

**12. A developer wrote this to get data. Why does `console.log(data)` show a "Pending Promise" instead of the data?**
```javascript
async function fetchData() {
  let data = fetch("https://api.com");
  console.log(data);
}
```
- [ ] A) The URL is incorrect.
- [ ] B) They forgot to use `console.error`.
- [ ] C) `fetch` only works in React, not plain JS.
- [x] D) They forgot the `await` keyword before `fetch`. **(CORRECT)**

**13. Why does this code crash with "Cannot read properties of undefined"?**
```javascript
const user = { name: "Krish" };
console.log(user.address.city);
```
- [x] A) Because `address` does not exist on `user`, so looking for `city` inside undefined throws an error. **(CORRECT)**
- [ ] B) Because "Krish" is not a valid city.
- [ ] C) Because `console.log` cannot print objects.
- [ ] D) Because it is missing a semicolon.

**14. In this React component, if the `count` is currently 0, what will it be after clicking the button once?**
```javascript
const [count, setCount] = useState(0);
function incrementTwice() {
  setCount(count + 1);
  setCount(count + 1);
}
```
- [ ] A) `2`
- [x] B) `1` **(CORRECT)**
- [ ] C) `0`
- [ ] D) It will throw an error.

**15. Why does this React component instantly crash the browser in an infinite loop?**
```javascript
const [data, setData] = useState([]);
useEffect(() => {
  setData([1, 2, 3]);
}, [data]);
```
- [ ] A) Because you cannot use arrays in `useState`.
- [ ] B) Because `1, 2, 3` are not valid numbers.
- [x] C) Arrays are passed by reference. `setData` creates a *new* array, which triggers `useEffect` again, creating another *new* array, infinitely. **(CORRECT)**
- [ ] D) Because `useEffect` should be named `useData`.
