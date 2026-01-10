// 25 JavaScript questions
const javascriptQuestions = [
  {id:1, question:"What is the correct way to declare a variable in JavaScript?", options:["var x = 5;", "variable x = 5;", "v x = 5;", "All of the above"], answerIndex:0},
  {id:2, question:"Which operator is used for strict equality comparison?", options:["==", "===", "=", "!="], answerIndex:1},
  {id:3, question:"What does the typeof operator return for an array?", options:["'array'", "'object'", "'list'", "'Array'"], answerIndex:1},
  {id:4, question:"Which method adds one or more elements to the end of an array?", options:["push()", "append()", "add()", "insert()"], answerIndex:0},
  {id:5, question:"What is the result of: console.log(typeof null)?", options:["'null'", "'object'", "'undefined'", "null"], answerIndex:1},
  {id:6, question:"Which keyword is used to declare a constant in ES6?", options:["const", "constant", "let", "var"], answerIndex:0},
  {id:7, question:"What does the map() method do?", options:["Creates a new array with results of calling a function", "Filters array elements", "Sorts array elements", "Reverses array"], answerIndex:0},
  {id:8, question:"Which method is used to convert a JSON string to an object?", options:["JSON.parse()", "JSON.stringify()", "JSON.parseObject()", "JSON.toObject()"], answerIndex:0},
  {id:9, question:"What is a closure in JavaScript?", options:["A function with access to outer function variables", "A method to close windows", "A way to stop execution", "An error handler"], answerIndex:0},
  {id:10, question:"Which method removes the last element from an array?", options:["pop()", "remove()", "delete()", "shift()"], answerIndex:0},
  {id:11, question:"What does the spread operator (...) do?", options:["Expands iterables into individual elements", "Merges objects", "Copies arrays", "All of the above"], answerIndex:3},
  {id:12, question:"What is the result of: '5' + 3 in JavaScript?", options:["8", "53", "Error", "undefined"], answerIndex:1},
  {id:13, question:"Which method is used to find an element in an array?", options:["find()", "search()", "locate()", "get()"], answerIndex:0},
  {id:14, question:"What does the arrow function syntax allow?", options:["Shorter function syntax", "Lexical this binding", "Both A and B", "None of the above"], answerIndex:2},
  {id:15, question:"Which statement is used to handle errors in JavaScript?", options:["try-catch", "error-handle", "catch-error", "handle-try"], answerIndex:0},
  {id:16, question:"What does the filter() method return?", options:["A new array with filtered elements", "The original array", "A boolean value", "An object"], answerIndex:0},
  {id:17, question:"Which method converts a string to lowercase?", options:["toLowerCase()", "lowerCase()", "toLower()", "lower()"], answerIndex:0},
  {id:18, question:"What is the difference between let and var?", options:["let has block scope, var has function scope", "var has block scope, let has function scope", "They are identical", "let is deprecated"], answerIndex:0},
  {id:19, question:"Which method returns the first element that satisfies a condition?", options:["find()", "filter()", "search()", "get()"], answerIndex:0},
  {id:20, question:"What does the reduce() method do?", options:["Reduces array to a single value", "Removes duplicates", "Sorts array", "Reverses array"], answerIndex:0},
  {id:21, question:"Which operator is used for nullish coalescing?", options:["??", "||", "&&", "::"], answerIndex:0},
  {id:22, question:"What is the result of: Boolean([])?", options:["true", "false", "undefined", "Error"], answerIndex:0},
  {id:23, question:"Which method is used to check if an array includes a value?", options:["includes()", "contains()", "has()", "in()"], answerIndex:0},
  {id:24, question:"What does the Promise object represent?", options:["An asynchronous operation", "A synchronous operation", "A variable", "A function"], answerIndex:0},
  {id:25, question:"Which method creates a shallow copy of an array?", options:["slice()", "copy()", "clone()", "duplicate()"], answerIndex:0}
];

window.javascriptQuestions = javascriptQuestions;

(function validateQuestions(){
  const problems = [];
  javascriptQuestions.forEach((q, idx) => {
    if(typeof q.id !== 'number') problems.push(`Missing or invalid id at index ${idx}`);
    if(!q.question || typeof q.question !== 'string') problems.push(`Missing question text for id ${q.id || '(unknown)'}`);
    if(!Array.isArray(q.options) || q.options.length < 2) problems.push(`Invalid options for id ${q.id}`);
    if(typeof q.answerIndex !== 'number' || q.answerIndex < 0 || q.answerIndex >= (q.options ? q.options.length : 0)) problems.push(`Invalid answerIndex for id ${q.id}`);
  });
  if(problems.length) console.error('javascriptQuestions validation errors:', problems);
  else console.info('javascriptQuestions validated: OK');
})();

