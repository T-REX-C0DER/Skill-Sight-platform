// 25 PHP questions - each: {id, question, options:[], codeSnippet (optional), answerIndex}
const phpQuestions = [
  {id:1, question:"Which of the following is the correct way to start a PHP script?", options:["<?php", "<script>php", "<?ph", "<php>"], answerIndex:0},
  {id:2, question:"What function is used to include and evaluate a file in PHP, and will produce a warning but continue if the file isn't found?", options:["require()","include()","import()","require_once()"], answerIndex:1},
  {id:3, question:"Which superglobal contains data sent via POST?", options:["$_REQUEST","$_POST","$_GET","$_SESSION"], answerIndex:1},
  {id:4, question:"What is the output of: <?php echo 2 + '2'; ?> ?", options:["4","22","TypeError",""], answerIndex:0},
  {id:5, question:"Which function is used to start a new session or resume an existing one?", options:["session_start()","start_session()","begin_session()","session_open()"], answerIndex:0},
  {id:6, question:"How do you declare an associative array in PHP?", options:["$a = array('a' => 1);","$a = ['a',1];","$a = {a:1};","$a = assoc('a',1);"], answerIndex:0},
  {id:7, question:"Which operator is used for concatenation in PHP?", options:["+",".","&","concat()"], answerIndex:1},
  {id:8, question:"What does PDO stand for in PHP context?", options:["PHP Data Objects","PHP Direct Output","Persistent Data Objects","Primary Data Option"], answerIndex:0},
  {id:9, question:"Which function safely hashes passwords in modern PHP?", options:["md5()","password_hash()","crypt()","sha1()"], answerIndex:1},
  {id:10, question:"Which magic method is called when an object is converted to string?", options:["__toString()","__string()","__toStr()","__cast()"], answerIndex:0},
  {id:11, question:"What does the PHP function isset() do?", options:["Checks if variable is set and not NULL","Checks if variable is empty","Deletes variable","Returns variable type"], answerIndex:0},
  {id:12, question:"Which statement will print the length of a string $s?", options:["strlen($s)","size($s)","length($s)","count($s)"], answerIndex:0},
  {id:13, question:"How do you create an anonymous function (closure) in PHP?", options:["function($x) use ($y){}","fn $x => $x","lambda($x){}","create_function()"], answerIndex:0},
  {id:14, question:"Which function converts a string to an array by a delimiter?", options:["explode()","split()","join()","implode()"], answerIndex:0},
  {id:15, question:"Which is the correct way to send a raw HTTP header for location redirect?", options:["header('Location: /new');","redirect('/new');","set_header('Location','/new');","Response::redirect('/new')"], answerIndex:0},
  {id:16, question:"Which of these will create a new instance of class Foo?", options:["$f = new Foo();","$f = Foo();","$f = create Foo;","$f = instance(Foo)"], answerIndex:0},
  {id:17, question:"Which error reporting level shows all errors and strict notices?", options:["E_ALL","E_ERROR","E_WARNING","E_NOTICE"], answerIndex:0},
  {id:18, question:"What does the operator '===' check for?", options:["Equality and type","Only value equality","Only type equality","Greater-than"], answerIndex:0},
  {id:19, question:"Which function will get the number of elements in an array $arr?", options:["count($arr)","strlen($arr)","sizeOf($arr)","arr_len($arr)"], answerIndex:0},
  {id:20, question:"Which built-in function will remove whitespace from the beginning and end of a string?", options:["trim()","strip()","clean()","chop()"], answerIndex:0},
  {id:21, question:"Which of these is the best practice to avoid SQL injection when querying a database?", options:["Use prepared statements with bound parameters","Sanitize strings with strip_tags","Escape quotes manually","Use addslashes()"], answerIndex:0},
  {id:22, question:"Which construct was introduced in PHP 5.5 for simpler generators? (hint: keyword)", options:["yield","generator","iterator","produce"], answerIndex:0},
  {id:23, question:"Which function splits a string by a string and returns an array?", options:["explode()","str_split()","substr()","split()"], answerIndex:0},
  {id:24, question:"Which function will check if a file exists?", options:["file_exists()","exists()","is_file()","check_file()"], answerIndex:0},
  {id:25, question:"How do you include a file only once (prevents multiple inclusions)?", options:["include_once 'file.php';","include 'file.php';","require 'file.php';","require_once 'file.php';"], answerIndex:3}
];

// Export to global for the renderer script to use
window.phpQuestions = phpQuestions;

// Basic validation: logs any malformed questions so issues are easy to find
(function validateQuestions(){
  const problems = [];
  phpQuestions.forEach((q, idx) => {
    if(typeof q.id !== 'number') problems.push(`Missing or invalid id at index ${idx}`);
    if(!q.question || typeof q.question !== 'string') problems.push(`Missing question text for id ${q.id || '(unknown)'}`);
    if(!Array.isArray(q.options) || q.options.length < 2) problems.push(`Invalid options for id ${q.id}`);
    if(typeof q.answerIndex !== 'number' || q.answerIndex < 0 || q.answerIndex >= (q.options ? q.options.length : 0)) problems.push(`Invalid answerIndex for id ${q.id}`);
  });
  if(problems.length) console.error('phpQuestions validation errors:', problems);
  else console.info('phpQuestions validated: OK');
})();