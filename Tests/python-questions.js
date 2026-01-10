// 25 Python questions
const pythonQuestions = [
  {id:1, question:"Which of the following is the correct way to create a list in Python?", options:["list = []", "list = list()", "list = {}", "Both A and B"], answerIndex:3},
  {id:2, question:"What does the len() function return when called on a string?", options:["The number of characters", "The number of words", "The memory size", "The hash value"], answerIndex:0},
  {id:3, question:"Which keyword is used to define a function in Python?", options:["def", "function", "define", "fun"], answerIndex:0},
  {id:4, question:"What is the output of: print(2 ** 3)?", options:["6", "8", "9", "5"], answerIndex:1},
  {id:5, question:"Which method is used to add an item to the end of a list?", options:["append()", "add()", "insert()", "push()"], answerIndex:0},
  {id:6, question:"What does the range(5) function generate?", options:["[0, 1, 2, 3, 4]", "[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4, 5]", "None"], answerIndex:0},
  {id:7, question:"Which operator is used for floor division in Python?", options:["//", "/", "%", "**"], answerIndex:0},
  {id:8, question:"What is a dictionary in Python?", options:["An unordered collection of key-value pairs", "An ordered collection", "A set of unique values", "A list of tuples"], answerIndex:0},
  {id:9, question:"Which exception is raised when you try to access a non-existent key in a dictionary?", options:["KeyError", "IndexError", "ValueError", "TypeError"], answerIndex:0},
  {id:10, question:"What does the strip() method do to a string?", options:["Removes whitespace from both ends", "Splits the string", "Reverses the string", "Converts to uppercase"], answerIndex:0},
  {id:11, question:"Which of the following is used for single-line comments in Python?", options:["//", "#", "/*", "<!--"], answerIndex:1},
  {id:12, question:"What is the result of: 'Hello' + 'World'?", options:["'HelloWorld'", "'Hello World'", "Error", "'Hello'+'World'"], answerIndex:0},
  {id:13, question:"Which module is commonly used for working with dates and times?", options:["datetime", "time", "date", "calendar"], answerIndex:0},
  {id:14, question:"What does list comprehension provide?", options:["A concise way to create lists", "A way to iterate", "A sorting method", "A filtering mechanism"], answerIndex:0},
  {id:15, question:"Which keyword is used to exit a loop prematurely?", options:["break", "exit", "stop", "return"], answerIndex:0},
  {id:16, question:"What is the difference between == and is in Python?", options:["== compares values, is compares identities", "== compares identities, is compares values", "They are the same", "== is for strings, is is for numbers"], answerIndex:0},
  {id:17, question:"Which method is used to read a file in Python?", options:["open()", "read()", "readfile()", "file.read()"], answerIndex:1},
  {id:18, question:"What does *args allow in a function definition?", options:["Variable number of positional arguments", "Variable number of keyword arguments", "Default arguments", "Required arguments"], answerIndex:0},
  {id:19, question:"Which built-in function returns the absolute value of a number?", options:["abs()", "absolute()", "absval()", "value()"], answerIndex:0},
  {id:20, question:"What is a lambda function?", options:["An anonymous function", "A named function", "A recursive function", "A generator function"], answerIndex:0},
  {id:21, question:"Which method removes an item from a list by value?", options:["remove()", "delete()", "pop()", "discard()"], answerIndex:0},
  {id:22, question:"What does the __init__ method do?", options:["Initializes a class instance", "Deletes an object", "Imports a module", "Exports a function"], answerIndex:0},
  {id:23, question:"Which operator is used for string formatting with f-strings?", options:["f", "format", "F", "Both A and C"], answerIndex:3},
  {id:24, question:"What does the isinstance() function check?", options:["If an object is an instance of a class", "If a variable is defined", "If a file exists", "If a string is numeric"], answerIndex:0},
  {id:25, question:"Which module needs to be imported to use regular expressions?", options:["re", "regex", "regexp", "string"], answerIndex:0}
];

window.pythonQuestions = pythonQuestions;

(function validateQuestions(){
  const problems = [];
  pythonQuestions.forEach((q, idx) => {
    if(typeof q.id !== 'number') problems.push(`Missing or invalid id at index ${idx}`);
    if(!q.question || typeof q.question !== 'string') problems.push(`Missing question text for id ${q.id || '(unknown)'}`);
    if(!Array.isArray(q.options) || q.options.length < 2) problems.push(`Invalid options for id ${q.id}`);
    if(typeof q.answerIndex !== 'number' || q.answerIndex < 0 || q.answerIndex >= (q.options ? q.options.length : 0)) problems.push(`Invalid answerIndex for id ${q.id}`);
  });
  if(problems.length) console.error('pythonQuestions validation errors:', problems);
  else console.info('pythonQuestions validated: OK');
})();

