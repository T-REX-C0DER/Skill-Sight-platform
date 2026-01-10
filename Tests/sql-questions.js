// 25 SQL questions
const sqlQuestions = [
  {id:1, question:"What does SQL stand for?", options:["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"], answerIndex:0},
  {id:2, question:"Which SQL command is used to retrieve data from a database?", options:["GET", "SELECT", "FETCH", "RETRIEVE"], answerIndex:1},
  {id:3, question:"What is the purpose of the WHERE clause?", options:["To filter rows", "To sort results", "To group data", "To join tables"], answerIndex:0},
  {id:4, question:"Which operator is used to combine multiple conditions in SQL?", options:["AND", "OR", "BOTH", "Both A and B"], answerIndex:3},
  {id:5, question:"What does the JOIN clause do?", options:["Combines rows from multiple tables", "Splits a table", "Deletes rows", "Updates data"], answerIndex:0},
  {id:6, question:"Which SQL function returns the number of rows?", options:["COUNT()", "SUM()", "TOTAL()", "NUM()"], answerIndex:0},
  {id:7, question:"What is a primary key?", options:["A unique identifier for each row", "A foreign key", "An index", "A constraint"], answerIndex:0},
  {id:8, question:"Which clause is used to sort the result set?", options:["ORDER BY", "SORT BY", "ARRANGE BY", "GROUP BY"], answerIndex:0},
  {id:9, question:"What does GROUP BY do?", options:["Groups rows with same values", "Orders rows", "Filters rows", "Joins tables"], answerIndex:0},
  {id:10, question:"Which SQL command is used to insert new data?", options:["INSERT", "ADD", "CREATE", "NEW"], answerIndex:0},
  {id:11, question:"What is the purpose of HAVING clause?", options:["Filter groups after GROUP BY", "Filter rows before grouping", "Join tables", "Sort results"], answerIndex:0},
  {id:12, question:"Which SQL command updates existing data?", options:["UPDATE", "MODIFY", "CHANGE", "ALTER"], answerIndex:0},
  {id:13, question:"What does DISTINCT do?", options:["Returns unique values", "Sorts data", "Groups data", "Filters data"], answerIndex:0},
  {id:14, question:"Which join returns all rows from both tables?", options:["FULL OUTER JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN"], answerIndex:0},
  {id:15, question:"What is a foreign key?", options:["A key that references another table", "A primary key", "An index", "A constraint"], answerIndex:0},
  {id:16, question:"Which SQL function finds the maximum value?", options:["MAX()", "HIGHEST()", "TOP()", "PEAK()"], answerIndex:0},
  {id:17, question:"What does DELETE command do?", options:["Removes rows from a table", "Removes a table", "Removes a database", "Removes columns"], answerIndex:0},
  {id:18, question:"Which clause limits the number of rows returned?", options:["LIMIT", "TOP", "FIRST", "Both A and B"], answerIndex:3},
  {id:19, question:"What is the purpose of an index?", options:["Improve query performance", "Store data", "Join tables", "Filter rows"], answerIndex:0},
  {id:20, question:"Which SQL function calculates the average?", options:["AVG()", "AVERAGE()", "MEAN()", "MEDIAN()"], answerIndex:0},
  {id:21, question:"What does UNION do?", options:["Combines result sets", "Joins tables", "Groups data", "Filters rows"], answerIndex:0},
  {id:22, question:"Which data type stores text in SQL?", options:["VARCHAR", "INT", "DATE", "BOOLEAN"], answerIndex:0},
  {id:23, question:"What is a view in SQL?", options:["A virtual table", "A physical table", "A database", "A schema"], answerIndex:0},
  {id:24, question:"Which SQL command creates a new table?", options:["CREATE TABLE", "NEW TABLE", "ADD TABLE", "MAKE TABLE"], answerIndex:0},
  {id:25, question:"What does TRUNCATE do?", options:["Removes all rows from a table", "Removes the table", "Removes the database", "Removes columns"], answerIndex:0}
];

window.sqlQuestions = sqlQuestions;

(function validateQuestions(){
  const problems = [];
  sqlQuestions.forEach((q, idx) => {
    if(typeof q.id !== 'number') problems.push(`Missing or invalid id at index ${idx}`);
    if(!q.question || typeof q.question !== 'string') problems.push(`Missing question text for id ${q.id || '(unknown)'}`);
    if(!Array.isArray(q.options) || q.options.length < 2) problems.push(`Invalid options for id ${q.id}`);
    if(typeof q.answerIndex !== 'number' || q.answerIndex < 0 || q.answerIndex >= (q.options ? q.options.length : 0)) problems.push(`Invalid answerIndex for id ${q.id}`);
  });
  if(problems.length) console.error('sqlQuestions validation errors:', problems);
  else console.info('sqlQuestions validated: OK');
})();

