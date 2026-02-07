# React & JS Workshop: 15-Question Quiz/Assessment

Here are 15 questions divided into two sections. You can use these to test your students' understanding of the Day 3 AI integration and their general JavaScript/React debugging skills.

---

## Part 1: Day 3 Architecture & Logic (10 Questions)

**1. What is the primary purpose of the `@google/genai` package we installed?**
- **Answer:** It is the official SDK that provides a secure and structured way for our JavaScript code to communicate with Google's Gemini AI models via an API key, without having to write manual `fetch` requests with HTTP headers.

**2. Why do we store the API key in `import.meta.env.VITE_GEMINI_API_KEY` instead of just typing it directly into the code as a string?**
- **Answer:** Security. Hardcoding an API key into frontend code means anyone inspecting the website can steal it and use our quota. Environment variables keep the key secure during development and deployment pipelines.

**3. In `Quiz.jsx`, we use `{loading && <div>Gemini is thinking...</div>}`. What is this React pattern called and how does it work?**
- **Answer:** It is called "Conditional Rendering". The `&&` operator checks if the left side (`loading` state) is true; if it is, React renders the JSX on the right side. If false, it renders nothing.

**4. Why do we use `JSON.parse(cleanText)` on the response we get back from Gemini?**
- **Answer:** The AI returns text (a string) formatted to *look* like JSON. To actually use it in JavaScript (like mapping over questions), we must parse that string into a real JavaScript object/array.

**5. In our UI, we write `<button onClick={() => handleAnswer(opt)}>` instead of `<button onClick={handleAnswer(opt)}>`. What happens if we use the second version?**
- **Answer:** The second version will call the function *immediately* when the component renders, causing an infinite loop of state updates. The arrow function wrapper ensures it is only called when the user actually clicks.

**6. What is the role of the `currentIdx` state variable in our Quiz game?**
- **Answer:** It acts as a pointer. Our AI returns an array of questions. By using `questions[currentIdx]`, we only show one question at a time. When they answer, we do `setCurrentIdx(currentIdx + 1)` to move the pointer to the next question.

**7. Why do we use a `try...catch...finally` block inside `handleGenerate`?**
- **Answer:** Network requests to AI can fail (bad API key, no internet). `try` attempts the call, `catch` securely captures any error so we can show it to the user without crashing the app, and `finally` ensures we stop the loading spinner whether the call succeeded or failed.

**8. How do we ensure the user's input in the textarea actually updates our React state?**
- **Answer:** By using the `onChange` event handler: `onChange={(e) => setTopic(e.target.value)}`. This creates a "Controlled Component" where React state is the single source of truth for what is in the text box.

**9. When checking the correct answer, we do `if (selectedOption === currentQ.answer)`. Why use `===` instead of `==`?**
- **Answer:** `===` is strict equality. It prevents JavaScript from doing unexpected type coercion (e.g., matching a string "1" to a number 1). It is always safer.

**10. What happens if the backend API takes 5 seconds to reply? How does the user know the app isn't frozen?**
- **Answer:** We use the `loading` state variable. It is set to `true` instantly when the generate button is clicked, triggering the loading UI. It remains true until the API `await` finishes, providing visual feedback during the delay.

---

## Part 2: JavaScript & React Debugging (5 Questions)

**11. Order of Execution (Event Loop)**
Look at the following code. What will be printed to the console, and in what order?
```javascript
console.log("A");
setTimeout(() => { console.log("B"); }, 0);
Promise.resolve().then(() => { console.log("C"); });
console.log("D");
```
- **Answer:** `A, D, C, B`. 
- **Explanation:** `A` and `D` are synchronous. Promises (`C`) go to the Microtask Queue which has higher priority. `setTimeout` (`B`) goes to the Macrotask queue which runs last, even with a 0ms delay.

**12. Missing Async/Await**
A junior dev wrote this code. Why does `console.log(data)` print a `Promise { <pending> }` instead of the actual user data?
```javascript
async function fetchData() {
  let data = fetch("https://api.com");
  console.log(data);
}
fetchData();
```
- **Answer:** They forgot the `await` keyword. `fetch` is asynchronous and instantly returns a Promise. You must write `await fetch(...)` to pause until the actual data arrives.

**13. Cannot Read Properties of Undefined**
Why does this code throw an error, and how would you fix it?
```javascript
const user = { name: "Krish" };
console.log(user.address.city);
```
- **Answer:** It throws "Cannot read properties of undefined (reading 'city')" because `address` does not exist on `user`.
- **Fix:** Use Optional Chaining: `console.log(user?.address?.city);` which will safely return `undefined` instead of crashing.

**14. Stale React State**
In this React component, if the user clicks the button once, what will the number on the button be?
```javascript
const [count, setCount] = useState(0);
function incrementTwice() {
  setCount(count + 1);
  setCount(count + 1);
}
// inside return: onClick={incrementTwice}
```
- **Answer:** It will be `1`, not `2`. 
- **Explanation:** React state updates are batched and asynchronous. Both `setCount` calls are looking at the same stale `count` value (`0`). To fix it, you must use functional state updates: `setCount(prev => prev + 1)`.

**15. Infinite Re-Renders (useEffect)**
Why does this React component instantly crash the browser in an infinite loop?
```javascript
const [data, setData] = useState([]);
useEffect(() => {
  setData([1, 2, 3]);
}, [data]);
```
- **Answer:** In JavaScript, arrays are passed by reference, not value. When `setData([1,2,3])` is called, it creates a *new array in memory*. React sees this new array, triggers the `useEffect` again because `[data]` changed, which sets a *new* array, triggering it again infinitely. The dependency array should be empty `[]`.
