import { CourseLevel } from '../../types/learning';
import { buildLesson } from './lesson-builder';

const PYTHON_EXERCISES = [
  // Beginner — Variables & Types (8)
  { id: 'py-beg-1', title: 'Variables', level: 'Beginner' as const, topic: 'py-fundamentals', explanation: 'Variables store data values. Create with name = value.', code: 'name = "LinguaFlow"\nage = 25\nprint(name)', expected: 'LinguaFlow', hint: 'Use = to assign', solution: 'name = "LinguaFlow"', q: 'What type is 42?', opts: ['int', 'str', 'float', 'bool'], ans: 'int' },
  { id: 'py-beg-2', title: 'Strings', level: 'Beginner' as const, topic: 'py-fundamentals', explanation: 'Strings are text enclosed in quotes.', code: 'greeting = "Hello"\nprint(greeting + " World")', expected: 'Hello World', hint: 'Use + to concatenate strings', solution: 'greeting + " World"', q: 'How to combine "Hi" and "!"?', opts: ['"Hi" + "!"', '"Hi".add("!")', 'Hi & !', 'join("Hi","!")'], ans: '"Hi" + "!"' },
  { id: 'py-beg-3', title: 'Integers & Floats', level: 'Beginner' as const, topic: 'py-fundamentals', explanation: 'int for whole numbers, float for decimals.', code: 'x = 10\ny = 3.14\nprint(type(x).__name__)', expected: 'int', hint: 'type() returns the type', solution: 'int', q: 'Result of 7 / 2 in Python 3?', opts: ['3.5', '3', '4', '3.0'], ans: '3.5' },
  { id: 'py-beg-4', title: 'Boolean', level: 'Beginner' as const, topic: 'py-fundamentals', explanation: 'True and False are boolean values.', code: 'is_active = True\nprint(is_active)', expected: 'True', hint: 'Capital T in True', solution: 'True', q: 'Result of 5 > 3?', opts: ['True', 'False', '5', 'Error'], ans: 'True' },
  { id: 'py-beg-5', title: 'Input & Output', level: 'Beginner' as const, topic: 'py-fundamentals', explanation: 'print() displays output. input() reads user input.', code: 'print("Result:", 2 + 2)', expected: 'Result: 4', hint: 'print can take multiple arguments', solution: 'print("Result:", 4)', q: 'Function to display text?', opts: ['print()', 'show()', 'display()', 'output()'], ans: 'print()' },
  { id: 'py-beg-6', title: 'Comments', level: 'Beginner' as const, topic: 'py-fundamentals', explanation: 'Comments start with # and are ignored by Python.', code: '# This is a comment\nx = 5  # inline comment\nprint(x)', expected: '5', hint: '# starts a comment', solution: '5', q: 'Comment symbol in Python?', opts: ['#', '//', '/*', '--'], ans: '#' },
  { id: 'py-beg-7', title: 'Type Conversion', level: 'Beginner' as const, topic: 'py-fundamentals', explanation: 'Convert between types: int(), str(), float().', code: 'num = int("42")\nprint(num + 8)', expected: '50', hint: 'int() converts string to integer', solution: '50', q: 'Convert "3.14" to float?', opts: ['float("3.14")', 'int("3.14")', 'str(3.14)', 'float(3)'], ans: 'float("3.14")' },
  { id: 'py-beg-8', title: 'Multiple Assignment', level: 'Beginner' as const, topic: 'py-fundamentals', explanation: 'Assign multiple variables at once.', code: 'a, b = 1, 2\nprint(a + b)', expected: '3', hint: 'Use comma to unpack', solution: '3', q: 'Swap a and b in one line?', opts: ['a, b = b, a', 'swap(a,b)', 'a = b', 'exchange(a,b)'], ans: 'a, b = b, a' },

  // Beginner — Control Flow (8)
  { id: 'py-beg-9', title: 'If Statements', level: 'Beginner' as const, topic: 'py-control', explanation: 'if/elif/else control program flow.', code: 'x = 10\nif x > 5:\n    print("big")', expected: 'big', hint: 'Indentation matters in Python', solution: 'big', q: 'Keyword for alternative condition?', opts: ['elif', 'else if', 'elseif', 'then'], ans: 'elif' },
  { id: 'py-beg-10', title: 'For Loops', level: 'Beginner' as const, topic: 'py-control', explanation: 'for item in sequence: iterate over elements.', code: 'for i in range(3):\n    print(i)', expected: '0\n1\n2', hint: 'range(3) gives 0,1,2', solution: '0, 1, 2', q: 'Output of range(3)?', opts: ['0,1,2', '1,2,3', '0,1,2,3', '3'], ans: '0,1,2' },
  { id: 'py-beg-11', title: 'While Loops', level: 'Beginner' as const, topic: 'py-control', explanation: 'while condition: repeat while true.', code: 'n = 3\nwhile n > 0:\n    n -= 1\nprint(n)', expected: '0', hint: 'n -= 1 decrements n', solution: '0', q: 'Exit loop early with?', opts: ['break', 'stop', 'exit', 'return'], ans: 'break' },
  { id: 'py-beg-12', title: 'Lists', level: 'Beginner' as const, topic: 'py-data', explanation: 'Lists store ordered collections. Created with [].', code: 'fruits = ["apple", "banana"]\nprint(fruits[0])', expected: 'apple', hint: 'Index starts at 0', solution: 'apple', q: 'Add item to list?', opts: ['append()', 'add()', 'push()', 'insert()'], ans: 'append()' },
  { id: 'py-beg-13', title: 'List Slicing', level: 'Beginner' as const, topic: 'py-data', explanation: 'list[start:end] gets a sublist.', code: 'nums = [0,1,2,3,4]\nprint(nums[1:3])', expected: '[1, 2]', hint: 'End index is exclusive', solution: '[1, 2]', q: 'First 3 elements of lst?', opts: ['lst[:3]', 'lst[0:3]', 'lst[1:3]', 'lst[:2]'], ans: 'lst[:3]' },
  { id: 'py-beg-14', title: 'Dictionaries', level: 'Beginner' as const, topic: 'py-data', explanation: 'Dicts store key-value pairs with {}.', code: 'user = {"name": "Anna", "age": 30}\nprint(user["name"])', expected: 'Anna', hint: 'Access with key in brackets', solution: 'Anna', q: 'Create empty dict?', opts: ['{}', '[]', 'dict()', 'Both {} and dict()'], ans: 'Both {} and dict()' },
  { id: 'py-beg-15', title: 'Functions', level: 'Beginner' as const, topic: 'py-functions', explanation: 'def name(): define reusable code blocks.', code: 'def greet():\n    return "Hi"\nprint(greet())', expected: 'Hi', hint: 'return sends value back', solution: 'Hi', q: 'Define a function?', opts: ['def', 'function', 'func', 'fn'], ans: 'def' },
  { id: 'py-beg-16', title: 'Function Parameters', level: 'Beginner' as const, topic: 'py-functions', explanation: 'Functions accept arguments.', code: 'def add(a, b):\n    return a + b\nprint(add(3, 4))', expected: '7', hint: 'Pass values when calling', solution: '7', q: 'Default parameter syntax?', opts: ['def f(x=0):', 'def f(x:0):', 'def f(x==0):', 'def f[x=0]:'], ans: 'def f(x=0):' },

  // Intermediate (12)
  { id: 'py-int-1', title: 'List Comprehensions', level: 'Intermediate' as const, topic: 'py-advanced-data', explanation: 'Create lists in one line: [x*2 for x in range(5)]', code: 'squares = [x**2 for x in range(4)]\nprint(squares)', expected: '[0, 1, 4, 9]', hint: 'x**2 is x squared', solution: '[0, 1, 4, 9]', q: 'Even numbers 0-8?', opts: ['[x for x in range(9) if x%2==0]', '[x*2 for x in range(4)]', 'range(0,8,2)', 'All correct'], ans: 'All correct' },
  { id: 'py-int-2', title: 'Tuples', level: 'Intermediate' as const, topic: 'py-advanced-data', explanation: 'Tuples are immutable sequences.', code: 'point = (3, 4)\nx, y = point\nprint(x)', expected: '3', hint: 'Unpack with x, y = tuple', solution: '3', q: 'Tuple vs list?', opts: ['Tuple is immutable', 'List is immutable', 'Same thing', 'Tuple uses {}'], ans: 'Tuple is immutable' },
  { id: 'py-int-3', title: 'Sets', level: 'Intermediate' as const, topic: 'py-advanced-data', explanation: 'Sets store unique unordered elements.', code: 's = {1, 2, 2, 3}\nprint(len(s))', expected: '3', hint: 'Duplicates are removed', solution: '3', q: 'Union of sets a and b?', opts: ['a | b', 'a + b', 'a.union(b)', 'Both a|b and a.union(b)'], ans: 'Both a|b and a.union(b)' },
  { id: 'py-int-4', title: 'Exception Handling', level: 'Intermediate' as const, topic: 'py-errors', explanation: 'try/except catches errors gracefully.', code: 'try:\n    print(1/0)\nexcept ZeroDivisionError:\n    print("error")', expected: 'error', hint: 'except catches specific errors', solution: 'error', q: 'Catch all exceptions?', opts: ['except Exception:', 'except:', 'except All:', 'catch:'], ans: 'except Exception:' },
  { id: 'py-int-5', title: 'File Reading', level: 'Intermediate' as const, topic: 'py-files', explanation: 'open() with with statement for safe file access.', code: '# with open("file.txt") as f:\n#     content = f.read()\nprint("read mode")', expected: 'read mode', hint: 'Use with for auto-close', solution: 'read mode', q: 'Read entire file?', opts: ['f.read()', 'f.readall()', 'f.get()', 'f.load()'], ans: 'f.read()' },
  { id: 'py-int-6', title: 'Lambda Functions', level: 'Intermediate' as const, topic: 'py-functions', explanation: 'Anonymous functions: lambda x: x*2', code: 'double = lambda x: x * 2\nprint(double(5))', expected: '10', hint: 'lambda args: expression', solution: '10', q: 'Sort list by length?', opts: ['sorted(lst, key=len)', 'lst.sort(len)', 'sort(lst, len)', 'order(lst, len)'], ans: 'sorted(lst, key=len)' },
  { id: 'py-int-7', title: 'Map & Filter', level: 'Intermediate' as const, topic: 'py-functions', explanation: 'map(func, iterable) and filter(func, iterable).', code: 'nums = [1,2,3,4]\nevens = list(filter(lambda x: x%2==0, nums))\nprint(evens)', expected: '[2, 4]', hint: 'filter keeps items where func returns True', solution: '[2, 4]', q: 'Double each element?', opts: ['map(lambda x:x*2, lst)', '[x*2 for x in lst]', 'Both work', 'filter only'], ans: 'Both work' },
  { id: 'py-int-8', title: 'Classes', level: 'Intermediate' as const, topic: 'py-oop', explanation: 'class Name: define objects with attributes and methods.', code: 'class Dog:\n    def __init__(self, name):\n        self.name = name\nd = Dog("Rex")\nprint(d.name)', expected: 'Rex', hint: '__init__ is the constructor', solution: 'Rex', q: 'Constructor method?', opts: ['__init__', '__new__', 'constructor', 'init'], ans: '__init__' },
  { id: 'py-int-9', title: 'Inheritance', level: 'Intermediate' as const, topic: 'py-oop', explanation: 'class Child(Parent): inherit from parent class.', code: 'class Animal:\n    def speak(self): return "..."\nclass Cat(Animal):\n    def speak(self): return "Meow"\nprint(Cat().speak())', expected: 'Meow', hint: 'Override parent methods', solution: 'Meow', q: 'Inherit from Parent?', opts: ['class Child(Parent):', 'class Child extends Parent', 'Child : Parent', 'inherit Parent'], ans: 'class Child(Parent):' },
  { id: 'py-int-10', title: 'Modules', level: 'Intermediate' as const, topic: 'py-modules', explanation: 'import module to use external code.', code: 'import math\nprint(math.sqrt(16))', expected: '4.0', hint: 'math.sqrt for square root', solution: '4.0', q: 'Import specific function?', opts: ['from math import sqrt', 'import sqrt from math', 'include math.sqrt', 'use math.sqrt'], ans: 'from math import sqrt' },
  { id: 'py-int-11', title: 'String Methods', level: 'Intermediate' as const, topic: 'py-strings', explanation: 'Strings have useful methods: .split(), .join(), .strip().', code: 'text = "  hello world  "\nprint(text.strip())', expected: 'hello world', hint: 'strip() removes whitespace', solution: 'hello world', q: 'Split by space?', opts: ['text.split()', 'text.split(" ")', 'Both work', 'text.divide()'], ans: 'Both work' },
  { id: 'py-int-12', title: 'Enumerate & Zip', level: 'Intermediate' as const, topic: 'py-advanced-data', explanation: 'enumerate adds index; zip pairs iterables.', code: 'items = ["a","b"]\nfor i, v in enumerate(items):\n    print(i, v)', expected: '0 a\n1 b', hint: 'enumerate returns (index, value)', solution: '0 a, 1 b', q: 'Pair two lists?', opts: ['zip(a, b)', 'combine(a, b)', 'pair(a, b)', 'merge(a, b)'], ans: 'zip(a, b)' },

  // Junior (12) + Projects (4)
  { id: 'py-jun-1', title: 'Decorators', level: 'Junior' as const, topic: 'py-advanced', explanation: 'Decorators modify function behavior with @decorator.', code: 'def uppercase(fn):\n    def wrapper():\n        return fn().upper()\n    return wrapper\n@uppercase\ndef greet(): return "hi"\nprint(greet())', expected: 'HI', hint: '@ applies decorator', solution: 'HI', q: 'Decorator syntax?', opts: ['@decorator', '#decorator', 'decorator:', 'apply decorator'], ans: '@decorator' },
  { id: 'py-jun-2', title: 'Generators', level: 'Junior' as const, topic: 'py-advanced', explanation: 'yield creates generators for lazy iteration.', code: 'def count():\n    yield 1\n    yield 2\nfor n in count():\n    print(n)', expected: '1\n2', hint: 'yield pauses and returns value', solution: '1, 2', q: 'Keyword for generators?', opts: ['yield', 'return', 'generate', 'emit'], ans: 'yield' },
  { id: 'py-jun-3', title: 'Context Managers', level: 'Junior' as const, topic: 'py-advanced', explanation: 'with statement uses __enter__/__exit__.', code: 'with open("test.txt", "w") as f:\n    f.write("data")\nprint("done")', expected: 'done', hint: 'with ensures cleanup', solution: 'done', q: 'Create custom context manager?', opts: ['class with __enter__/__exit__', '@contextmanager', 'Both', 'with class'], ans: 'Both' },
  { id: 'py-jun-4', title: 'Async Basics', level: 'Junior' as const, topic: 'py-async', explanation: 'async/await for concurrent I/O operations.', code: 'import asyncio\nasync def main():\n    return "async"\nprint("async ready")', expected: 'async ready', hint: 'async def defines coroutine', solution: 'async ready', q: 'Run async function?', opts: ['asyncio.run()', 'async.run()', 'run_async()', 'await main()'], ans: 'asyncio.run()' },
  { id: 'py-jun-5', title: 'Unit Testing', level: 'Junior' as const, topic: 'py-testing', explanation: 'unittest or pytest for testing code.', code: 'def add(a, b): return a + b\nassert add(2, 3) == 5\nprint("pass")', expected: 'pass', hint: 'assert checks conditions', solution: 'pass', q: 'Popular test framework?', opts: ['pytest', 'unittest', 'Both', 'testpy'], ans: 'Both' },
  { id: 'py-jun-6', title: 'JSON Handling', level: 'Junior' as const, topic: 'py-data', explanation: 'json module for parsing and serializing JSON.', code: 'import json\ndata = {"key": "value"}\nprint(json.dumps(data))', expected: '{"key": "value"}', hint: 'dumps converts dict to string', solution: '{"key": "value"}', q: 'Parse JSON string?', opts: ['json.loads()', 'json.parse()', 'json.read()', 'parse_json()'], ans: 'json.loads()' },
  { id: 'py-jun-7', title: 'Regular Expressions', level: 'Junior' as const, topic: 'py-strings', explanation: 're module for pattern matching.', code: 'import re\nmatch = re.search(r"\\d+", "abc123")\nprint(match.group())', expected: '123', hint: "\\d+ matches digits", solution: '123', q: 'Match start of string?', opts: ['re.match()', 're.start()', 're.begin()', 're.find()'], ans: 're.match()' },
  { id: 'py-jun-8', title: 'Virtual Environments', level: 'Junior' as const, topic: 'py-tools', explanation: 'venv creates isolated Python environments.', code: '# python -m venv myenv\nprint("venv")', expected: 'venv', hint: 'python -m venv name', solution: 'venv', q: 'Activate venv on Windows?', opts: ['myenv\\Scripts\\activate', 'source myenv/bin/activate', 'venv activate', 'activate myenv'], ans: 'myenv\\Scripts\\activate' },
  { id: 'py-proj-1', title: 'Project: Todo CLI', level: 'Junior' as const, topic: 'py-projects', explanation: 'Build a command-line todo app using lists and file I/O.', code: 'todos = []\ndef add_task(task):\n    todos.append(task)\nadd_task("Learn Python")\nprint(len(todos))', expected: '1', hint: 'Start with a list and append()', solution: '1', q: 'Save todos to file?', opts: ['json.dump()', 'pickle.dump()', 'write str(todos)', 'All possible'], ans: 'All possible' },
  { id: 'py-proj-2', title: 'Project: Calculator', level: 'Junior' as const, topic: 'py-projects', explanation: 'Create a calculator with functions for +, -, *, /.', code: 'def calc(a, op, b):\n    return a + b if op == "+" else a - b\nprint(calc(10, "+", 5))', expected: '15', hint: 'Use if/elif for operators', solution: '15', q: 'Handle division by zero?', opts: ['try/except', 'if b==0', 'Both', 'ignore'], ans: 'Both' },
  { id: 'py-proj-3', title: 'Project: Web Scraper', level: 'Junior' as const, topic: 'py-projects', explanation: 'Use requests and BeautifulSoup to extract web data.', code: '# import requests\n# r = requests.get(url)\nprint("scraper ready")', expected: 'scraper ready', hint: 'requests.get() fetches pages', solution: 'scraper ready', q: 'Parse HTML?', opts: ['BeautifulSoup', 'html.parser', 'lxml', 'All common'], ans: 'All common' },
  { id: 'py-proj-4', title: 'Project: API Client', level: 'Junior' as const, topic: 'py-projects', explanation: 'Build a REST API client with error handling.', code: 'import json\nresponse = {"status": 200, "data": []}\nprint(response["status"])', expected: '200', hint: 'Check status code before processing', solution: '200', q: 'HTTP library?', opts: ['requests', 'httpx', 'urllib', 'All common'], ans: 'All common' },
];

function buildPythonLesson(ex: typeof PYTHON_EXERCISES[0]) {
  return buildLesson({
    id: ex.id,
    title: ex.title,
    topicId: ex.topic,
    subject: 'Python',
    level: ex.level,
    explanation: ex.explanation,
    rules: [
      'Read the code carefully',
      'Predict the output before checking',
      'Practice writing similar code',
    ],
    examples: [{ original: ex.code.split('\n')[0], translation: ex.expected }],
    vocabulary: [
      { original: ex.title, translation: ex.explanation.slice(0, 50), example: ex.code.split('\n')[0] },
      { original: 'Output', translation: ex.expected, example: ex.code },
    ],
    practiceQuestions: [{
      question: ex.q,
      options: ex.opts,
      correctAnswer: ex.ans,
      hint: ex.hint,
      steps: [ex.explanation, ex.hint, `Answer: ${ex.ans}`],
      explanation: ex.explanation,
      type: 'multiple-choice' as const,
    }],
    codeExercises: [{
      title: ex.title,
      description: ex.explanation,
      starterCode: ex.code,
      expectedOutput: ex.expected,
      hint: ex.hint,
      stepByStep: [ex.explanation, 'Analyze the code line by line', ex.hint, `Expected output: ${ex.expected}`],
      explanation: ex.explanation,
      solution: ex.solution,
      difficulty: ex.level === 'Beginner' ? 1 : ex.level === 'Intermediate' ? 3 : 4,
    }],
  });
}

const TOPIC_META: Record<string, { title: string; desc: string; level: 'Beginner' | 'Intermediate' | 'Junior' }> = {
  'py-fundamentals': { title: 'Python Fundamentals', desc: 'Variables, types, and basic syntax.', level: 'Beginner' },
  'py-control': { title: 'Control Flow', desc: 'If statements and loops.', level: 'Beginner' },
  'py-data': { title: 'Data Structures', desc: 'Lists, dicts, and collections.', level: 'Beginner' },
  'py-functions': { title: 'Functions', desc: 'Define and use functions.', level: 'Beginner' },
  'py-advanced-data': { title: 'Advanced Data', desc: 'Comprehensions, sets, tuples.', level: 'Intermediate' },
  'py-errors': { title: 'Error Handling', desc: 'Try/except and debugging.', level: 'Intermediate' },
  'py-files': { title: 'File I/O', desc: 'Reading and writing files.', level: 'Intermediate' },
  'py-oop': { title: 'OOP', desc: 'Classes and inheritance.', level: 'Intermediate' },
  'py-modules': { title: 'Modules', desc: 'Import and organize code.', level: 'Intermediate' },
  'py-strings': { title: 'String Processing', desc: 'String methods and regex.', level: 'Intermediate' },
  'py-advanced': { title: 'Advanced Python', desc: 'Decorators, generators, context managers.', level: 'Junior' },
  'py-async': { title: 'Async Programming', desc: 'async/await patterns.', level: 'Junior' },
  'py-testing': { title: 'Testing', desc: 'Unit tests and assertions.', level: 'Junior' },
  'py-tools': { title: 'Dev Tools', desc: 'venv, pip, and tooling.', level: 'Junior' },
  'py-projects': { title: 'Mini Projects', desc: 'Hands-on coding projects.', level: 'Junior' },
};

function groupByTopic(): CourseLevel[] {
  const levels: CourseLevel[] = [
    { level: 'Beginner', topics: [] },
    { level: 'Intermediate', topics: [] },
    { level: 'Junior', topics: [] },
  ];

  const topicMap = new Map<string, ReturnType<typeof buildPythonLesson>[]>();

  PYTHON_EXERCISES.forEach((ex) => {
    if (!topicMap.has(ex.topic)) topicMap.set(ex.topic, []);
    topicMap.get(ex.topic)!.push(buildPythonLesson(ex));
  });

  topicMap.forEach((lessons, topicId) => {
    const meta = TOPIC_META[topicId];
    const topic = {
      id: topicId,
      title: meta.title,
      description: meta.desc,
      subject: 'Python' as const,
      lessons,
    };
    const levelIdx = meta.level === 'Beginner' ? 0 : meta.level === 'Intermediate' ? 1 : 2;
    levels[levelIdx].topics.push(topic);
  });

  return levels;
}

export const PYTHON_COURSE: CourseLevel[] = groupByTopic();
