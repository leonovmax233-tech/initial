import { CourseLevel, Priority, Topic } from '../../types/learning';
import { buildLesson } from './lesson-builder';

interface PyExercise {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Junior';
  topic: string;
  explanation: string;
  code: string;
  expected: string;
  hint: string;
  solution: string;
  q: string;
  opts: string[];
  ans: string;
}

// ── CORE PYTHON TOPICS (MOST IMPORTANT) ──
// Each core topic gets 10+ practical tasks.
const CORE_TOPICS: {
  id: string;
  title: string;
  desc: string;
  priority: Priority;
  exercises: PyExercise[];
}[] = [
  {
    id: 'py-variables',
    title: 'Variables',
    desc: 'Naming, assignment, reassignment, naming rules.',
    priority: 'core',
    theory: {
      explanation: 'Variables are named containers for storing data. In Python, you create a variable by assigning a value with =. Variables can be reassigned and change type dynamically.',
      rules: [
        'Variable names: letters, digits, underscores; cannot start with a digit',
        'Case-sensitive: Name and name are different',
        'Use snake_case for readability (e.g. user_name)',
        'UPPER_CASE by convention signals a constant',
        'Variables can change type at runtime (dynamic typing)',
      ],
      examples: [
        { original: 'name = "Alice"', translation: 'Assign string "Alice" to variable name' },
        { original: 'x = 10\nx = 20', translation: 'Reassign x from 10 to 20' },
        { original: 'a, b = 1, 2', translation: 'Multiple assignment: a=1, b=2' },
        { original: 'a, b = b, a', translation: 'Swap two variables in one line' },
        { original: 'PI = 3.14159', translation: 'Convention: UPPER_CASE for constants' },
        { original: 'count += 1', translation: 'Augmented assignment: count = count + 1' },
      ],
    },
    exercises: [
      { id: 'py-var-1', title: 'Assign a Variable', level: 'Beginner', topic: 'py-variables', explanation: 'Create a variable with name = value.', code: 'name = "LinguaFlow"\nprint(name)', expected: 'LinguaFlow', hint: 'Use = to assign', solution: 'name = "LinguaFlow"', q: 'How to assign 5 to x?', opts: ['x = 5', 'x == 5', '5 -> x', 'x: 5'], ans: 'x = 5' },
      { id: 'py-var-2', title: 'Reassign a Variable', level: 'Beginner', topic: 'py-variables', explanation: 'Variables can be reassigned to new values.', code: 'x = 1\nx = 2\nprint(x)', expected: '2', hint: 'Last assignment wins', solution: '2', q: 'After x=1; x=2, x is?', opts: ['1', '2', '3', 'Error'], ans: '2' },
      { id: 'py-var-3', title: 'Multiple Assignment', level: 'Beginner', topic: 'py-variables', explanation: 'Assign multiple variables at once.', code: 'a, b = 1, 2\nprint(a + b)', expected: '3', hint: 'Comma unpacking', solution: '3', q: 'Swap a and b in one line?', opts: ['a, b = b, a', 'swap(a,b)', 'a = b', 'exchange(a,b)'], ans: 'a, b = b, a' },
      { id: 'py-var-4', title: 'Naming Rules', level: 'Beginner', topic: 'py-variables', explanation: 'Names: letters, digits, underscores; cannot start with digit.', code: 'user_name = "ok"\nprint(user_name)', expected: 'ok', hint: 'snake_case is common', solution: 'ok', q: 'Valid variable name?', opts: ['_score', '2nd_place', 'class', 'my-var'], ans: '_score' },
      { id: 'py-var-5', title: 'Case Sensitivity', level: 'Beginner', topic: 'py-variables', explanation: 'Python is case-sensitive: Name != name.', code: 'Name = "A"\nname = "B"\nprint(name)', expected: 'B', hint: 'Different cases = different vars', solution: 'B', q: 'Are Age and age the same?', opts: ['No', 'Yes', 'Sometimes', 'Error'], ans: 'No' },
      { id: 'py-var-6', title: 'Constants Convention', level: 'Beginner', topic: 'py-variables', explanation: 'UPPER_CASE names signal constants by convention.', code: 'PI = 3.14\nprint(PI)', expected: '3.14', hint: 'UPPER_CASE = constant', solution: '3.14', q: 'Convention for constants?', opts: ['UPPER_CASE', 'lower_case', 'CamelCase', 'kebab-case'], ans: 'UPPER_CASE' },
      { id: 'py-var-7', title: 'Delete a Variable', level: 'Beginner', topic: 'py-variables', explanation: 'del removes a variable reference.', code: 'x = 5\ndel x\nprint("deleted")', expected: 'deleted', hint: 'del x removes binding', solution: 'deleted', q: 'Remove variable x?', opts: ['del x', 'remove x', 'delete x', 'free x'], ans: 'del x' },
      { id: 'py-var-8', title: 'Dynamic Typing', level: 'Beginner', topic: 'py-variables', explanation: 'Variables can change type at runtime.', code: 'x = 1\nx = "text"\nprint(x)', expected: 'text', hint: 'Python is dynamically typed', solution: 'text', q: 'Can x change from int to str?', opts: ['Yes', 'No', 'Only with cast', 'Error'], ans: 'Yes' },
      { id: 'py-var-9', title: 'Augmented Assignment', level: 'Beginner', topic: 'py-variables', explanation: '+=, -=, *=, /= update in place.', code: 'count = 0\ncount += 5\nprint(count)', expected: '5', hint: 'count += 5 adds 5', solution: '5', q: 'x += 3 means?', opts: ['x = x + 3', 'x = 3', 'x == x+3', 'x++'], ans: 'x = x + 3' },
      { id: 'py-var-10', title: 'Variable Scope Intro', level: 'Beginner', topic: 'py-variables', explanation: 'Variables inside functions are local by default.', code: 'def f():\n    v = 10\n    return v\nprint(f())', expected: '10', hint: 'Local to function', solution: '10', q: 'Local variable is accessible?', opts: ['Inside function only', 'Everywhere', 'In module', 'Never'], ans: 'Inside function only' },
    ],
  },
  {
    id: 'py-data-types',
    title: 'Data Types',
    desc: 'int, float, str, bool and type conversion.',
    priority: 'core',
    theory: {
      explanation: 'Python has built-in data types: int (whole numbers), float (decimals), str (text), and bool (True/False). Use type() to check a value\'s type, and int(), str(), float(), bool() to convert between types.',
      rules: [
        'int = whole numbers (42, -7, 0)',
        'float = decimal numbers (3.14, -0.5)',
        'str = text in quotes ("hello", \'world\')',
        'bool = True or False (capitalized)',
        'Division / always returns a float; // returns an int (floor)',
        'Use int(), str(), float(), bool() to convert between types',
      ],
      examples: [
        { original: 'x = 42', translation: 'int: whole number' },
        { original: 'pi = 3.14', translation: 'float: decimal number' },
        { original: 'name = "Alice"', translation: 'str: text in quotes' },
        { original: 'is_ready = True', translation: 'bool: True or False' },
        { original: 'n = int("42")', translation: 'Convert string "42" to integer 42' },
        { original: 's = str(42)', translation: 'Convert integer 42 to string "42"' },
      ],
    },
    exercises: [
      { id: 'py-dt-1', title: 'Integer Type', level: 'Beginner', topic: 'py-data-types', explanation: 'int stores whole numbers.', code: 'x = 42\nprint(type(x).__name__)', expected: 'int', hint: 'type() returns the type', solution: 'int', q: 'Type of 42?', opts: ['int', 'str', 'float', 'bool'], ans: 'int' },
      { id: 'py-dt-2', title: 'Float Type', level: 'Beginner', topic: 'py-data-types', explanation: 'float stores decimals.', code: 'x = 3.14\nprint(type(x).__name__)', expected: 'float', hint: 'Decimals are floats', solution: 'float', q: 'Type of 3.14?', opts: ['float', 'int', 'str', 'bool'], ans: 'float' },
      { id: 'py-dt-3', title: 'String Type', level: 'Beginner', topic: 'py-data-types', explanation: 'str stores text in quotes.', code: 's = "hi"\nprint(type(s).__name__)', expected: 'str', hint: 'Text in quotes', solution: 'str', q: 'Type of "hello"?', opts: ['str', 'int', 'float', 'bool'], ans: 'str' },
      { id: 'py-dt-4', title: 'Boolean Type', level: 'Beginner', topic: 'py-data-types', explanation: 'bool is True/False.', code: 'b = True\nprint(type(b).__name__)', expected: 'bool', hint: 'Capital T/F', solution: 'bool', q: 'Type of True?', opts: ['bool', 'str', 'int', 'float'], ans: 'bool' },
      { id: 'py-dt-5', title: 'String to Int', level: 'Beginner', topic: 'py-data-types', explanation: 'int() converts string to integer.', code: 'n = int("42")\nprint(n + 8)', expected: '50', hint: 'int() converts', solution: '50', q: 'Convert "42" to int?', opts: ['int("42")', 'str(42)', 'float("42")', 'bool("42")'], ans: 'int("42")' },
      { id: 'py-dt-6', title: 'Int to String', level: 'Beginner', topic: 'py-data-types', explanation: 'str() converts to text.', code: 's = str(42)\nprint(s + "x")', expected: '42x', hint: 'str() converts', solution: '42x', q: 'Convert 42 to string?', opts: ['str(42)', 'int(42)', 'text(42)', 'char(42)'], ans: 'str(42)' },
      { id: 'py-dt-7', title: 'String to Float', level: 'Beginner', topic: 'py-data-types', explanation: 'float() converts string to float.', code: 'f = float("3.14")\nprint(f)', expected: '3.14', hint: 'float() converts', solution: '3.14', q: 'Convert "3.14" to float?', opts: ['float("3.14")', 'int("3.14")', 'str(3.14)', 'bool("3.14")'], ans: 'float("3.14")' },
      { id: 'py-dt-8', title: 'Bool from Int', level: 'Beginner', topic: 'py-data-types', explanation: 'bool(0) is False; non-zero is True.', code: 'print(bool(0))', expected: 'False', hint: '0 is falsy', solution: 'False', q: 'bool(0) is?', opts: ['False', 'True', '0', 'Error'], ans: 'False' },
      { id: 'py-dt-9', title: 'Division Gives Float', level: 'Beginner', topic: 'py-data-types', explanation: '/ always returns float in Python 3.', code: 'r = 7 / 2\nprint(type(r).__name__)', expected: 'float', hint: '/ returns float', solution: 'float', q: 'Type of 7/2?', opts: ['float', 'int', 'str', 'bool'], ans: 'float' },
      { id: 'py-dt-10', title: 'Floor Division', level: 'Beginner', topic: 'py-data-types', explanation: '// returns an int (floor division).', code: 'r = 7 // 2\nprint(r)', expected: '3', hint: '// floors the result', solution: '3', q: 'Result of 7 // 2?', opts: ['3', '3.5', '4', '3.0'], ans: '3' },
    ],
  },
  {
    id: 'py-input-output',
    title: 'Input / Output',
    desc: 'print(), input(), formatting output.',
    priority: 'core',
    theory: {
      explanation: 'print() displays output to the console. input() reads user input as a string. f-strings (f"...") let you embed variables and expressions inside strings using {}.',
      rules: [
        'print(value) displays text or numbers',
        'print(a, b) separates multiple values with a space',
        'print(a, b, sep="-") changes the separator',
        'print(a, end="") prevents the default newline',
        'input(prompt) returns user input as a string',
        'f"Hi {name}" embeds variables in a string',
      ],
      examples: [
        { original: 'print("Hello")', translation: 'Output: Hello' },
        { original: 'print("A", "B")', translation: 'Output: A B' },
        { original: 'print("A", "B", sep="-")', translation: 'Output: A-B' },
        { original: 'name = input("Name: ")', translation: 'Read input with a prompt' },
        { original: 'age = int(input("Age: "))', translation: 'Read input and convert to int' },
        { original: 'print(f"Hi {name}")', translation: 'f-string embeds a variable' },
      ],
    },
    exercises: [
      { id: 'py-io-1', title: 'Print Text', level: 'Beginner', topic: 'py-input-output', explanation: 'print() displays output.', code: 'print("Hello")', expected: 'Hello', hint: 'print() shows text', solution: 'Hello', q: 'Function to display text?', opts: ['print()', 'show()', 'display()', 'output()'], ans: 'print()' },
      { id: 'py-io-2', title: 'Print Multiple Values', level: 'Beginner', topic: 'py-input-output', explanation: 'print accepts multiple args separated by space.', code: 'print("A", "B")', expected: 'A B', hint: 'Comma separates with space', solution: 'A B', q: 'print("A","B") outputs?', opts: ['A B', 'AB', 'A,B', 'A;B'], ans: 'A B' },
      { id: 'py-io-3', title: 'Print Numbers', level: 'Beginner', topic: 'py-input-output', explanation: 'print can show numbers.', code: 'print(2 + 2)', expected: '4', hint: 'Expressions are evaluated', solution: '4', q: 'print(2+2) outputs?', opts: ['4', '2+2', '22', 'Error'], ans: '4' },
      { id: 'py-io-4', title: 'sep Parameter', level: 'Beginner', topic: 'py-input-output', explanation: 'sep changes the separator.', code: 'print("A", "B", sep="-")', expected: 'A-B', hint: 'sep="-"', solution: 'A-B', q: 'Separate with dash?', opts: ['sep="-"', 'join="-"', 'dash=True', 'sep=" "'], ans: 'sep="-"' },
      { id: 'py-io-5', title: 'end Parameter', level: 'Beginner', topic: 'py-input-output', explanation: 'end changes the trailing character.', code: 'print("A", end="")\nprint("B")', expected: 'AB', hint: 'end="" removes newline', solution: 'AB', q: 'Avoid newline after print?', opts: ['end=""', 'newline=False', 'end="\\n"', 'noend()'], ans: 'end=""' },
      { id: 'py-io-6', title: 'Input Returns String', level: 'Beginner', topic: 'py-input-output', explanation: 'input() always returns a string.', code: 'val = "10"\nprint(type(val).__name__)', expected: 'str', hint: 'input() returns str', solution: 'str', q: 'input() returns?', opts: ['str', 'int', 'float', 'any'], ans: 'str' },
      { id: 'py-io-7', title: 'Convert Input to Int', level: 'Beginner', topic: 'py-input-output', explanation: 'Wrap input() with int() to get a number.', code: 'age = int("25")\nprint(age + 1)', expected: '26', hint: 'int(input(...))', solution: '26', q: 'Read an integer from input?', opts: ['int(input())', 'input(int)', 'read(int)', 'int_input()'], ans: 'int(input())' },
      { id: 'py-io-8', title: 'f-string Basics', level: 'Beginner', topic: 'py-input-output', explanation: 'f"..." embeds expressions in {}.', code: 'name = "Ann"\nprint(f"Hi {name}")', expected: 'Hi Ann', hint: 'f-string uses {}', solution: 'Hi Ann', q: 'Embed variable in string?', opts: ['f"Hi {name}"', '"Hi " + name', 'Both work', '"Hi name"'], ans: 'Both work' },
      { id: 'py-io-9', title: 'f-string Math', level: 'Beginner', topic: 'py-input-output', explanation: 'f-strings can evaluate expressions.', code: 'x = 5\nprint(f"{x} squared is {x**2}")', expected: '5 squared is 25', hint: '{} evaluates expressions', solution: '5 squared is 25', q: 'f-string supports?', opts: ['Expressions in {}', 'Only variables', 'Only strings', 'Nothing'], ans: 'Expressions in {}' },
      { id: 'py-io-10', title: 'Prompt in Input', level: 'Beginner', topic: 'py-input-output', explanation: 'input(prompt) shows a message before reading.', code: 'print("Name: ?")\nprint("Got it")', expected: 'Name: ?\nGot it', hint: 'input(prompt) shows text', solution: 'Name: ?, Got it', q: 'Show prompt with input?', opts: ['input("Name: ")', 'print(input)', 'read("Name: ")', 'ask("Name: ")'], ans: 'input("Name: ")' },
    ],
  },
  {
    id: 'py-conditions',
    title: 'Conditions (if / else)',
    desc: 'Branching with if, elif, else.',
    priority: 'core',
    theory: {
      explanation: 'Conditional statements let your program make decisions. if runs code when a condition is True. elif adds more checks. else runs when all previous conditions are False. Indentation (4 spaces) defines the code block.',
      rules: [
        'if condition: runs when the condition is True',
        'elif condition: checks another condition if previous was False',
        'else: runs when all conditions are False',
        'Indentation (4 spaces) defines the code block',
        'Comparison operators: ==, !=, <, >, <=, >=',
        'Logical operators: and, or, not',
        '0, "", [], None are falsy; everything else is truthy',
      ],
      examples: [
        { original: 'if x > 5:\n    print("big")', translation: 'Print "big" if x > 5' },
        { original: 'if x > 5:\n    print("big")\nelse:\n    print("small")', translation: 'Two-way branch' },
        { original: 'if x > 10:\n    print("A")\nelif x > 5:\n    print("B")\nelse:\n    print("C")', translation: 'Multi-way branch with elif' },
        { original: 'if x > 0 and x < 10:\n    print("in range")', translation: 'Combine with and' },
        { original: 'label = "big" if x > 3 else "small"', translation: 'Ternary one-liner' },
        { original: 'if not is_valid:\n    print("error")', translation: 'Use not to invert' },
      ],
    },
    exercises: [
      { id: 'py-if-1', title: 'Basic if', level: 'Beginner', topic: 'py-conditions', explanation: 'if runs code when condition is True.', code: 'x = 10\nif x > 5:\n    print("big")', expected: 'big', hint: 'Indentation matters', solution: 'big', q: 'if runs when?', opts: ['Condition is True', 'Always', 'Never', 'Loop ends'], ans: 'Condition is True' },
      { id: 'py-if-2', title: 'if / else', level: 'Beginner', topic: 'py-conditions', explanation: 'else runs when if is False.', code: 'x = 2\nif x > 5:\n    print("big")\nelse:\n    print("small")', expected: 'small', hint: 'else is fallback', solution: 'small', q: 'else runs when?', opts: ['if is False', 'Always', 'Never', 'Loop'], ans: 'if is False' },
      { id: 'py-if-3', title: 'elif Chain', level: 'Beginner', topic: 'py-conditions', explanation: 'elif checks more conditions.', code: 'x = 7\nif x > 10:\n    print("A")\nelif x > 5:\n    print("B")\nelse:\n    print("C")', expected: 'B', hint: 'First true branch wins', solution: 'B', q: 'Keyword for extra conditions?', opts: ['elif', 'else if', 'elseif', 'then'], ans: 'elif' },
      { id: 'py-if-4', title: 'Comparison Operators', level: 'Beginner', topic: 'py-conditions', explanation: '==, !=, <, >, <=, >= compare values.', code: 'print(3 == 3)', expected: 'True', hint: '== checks equality', solution: 'True', q: 'Equality operator?', opts: ['==', '=', '!=', '==='], ans: '==' },
      { id: 'py-if-5', title: 'and Operator', level: 'Beginner', topic: 'py-conditions', explanation: 'and requires both conditions True.', code: 'x = 5\nprint(x > 0 and x < 10)', expected: 'True', hint: 'Both must be True', solution: 'True', q: 'True and True =?', opts: ['True', 'False', 'Error', 'None'], ans: 'True' },
      { id: 'py-if-6', title: 'or Operator', level: 'Beginner', topic: 'py-conditions', explanation: 'or needs at least one True.', code: 'x = 15\nprint(x < 0 or x > 10)', expected: 'True', hint: 'One True is enough', solution: 'True', q: 'False or True =?', opts: ['True', 'False', 'Error', 'None'], ans: 'True' },
      { id: 'py-if-7', title: 'not Operator', level: 'Beginner', topic: 'py-conditions', explanation: 'not flips a boolean.', code: 'print(not False)', expected: 'True', hint: 'not flips', solution: 'True', q: 'not True =?', opts: ['False', 'True', 'Error', 'None'], ans: 'False' },
      { id: 'py-if-8', title: 'Nested if', level: 'Beginner', topic: 'py-conditions', explanation: 'if inside if for complex logic.', code: 'x = 10\nif x > 5:\n    if x < 20:\n        print("in range")', expected: 'in range', hint: 'Both must be True', solution: 'in range', q: 'Nested if checks?', opts: ['Inner after outer', 'Only inner', 'Only outer', 'Neither'], ans: 'Inner after outer' },
      { id: 'py-if-9', title: 'Truthy / Falsy', level: 'Beginner', topic: 'py-conditions', explanation: '0, "", [], None are falsy.', code: 'if 0:\n    print("yes")\nelse:\n    print("no")', expected: 'no', hint: '0 is falsy', solution: 'no', q: 'Is 0 truthy?', opts: ['No', 'Yes', 'Sometimes', 'Error'], ans: 'No' },
      { id: 'py-if-10', title: 'Ternary Expression', level: 'Beginner', topic: 'py-conditions', explanation: 'value_if_true if condition else value_if_false.', code: 'x = 5\nlabel = "big" if x > 3 else "small"\nprint(label)', expected: 'big', hint: 'One-line conditional', solution: 'big', q: 'Ternary syntax?', opts: ['a if c else b', 'c ? a : b', 'if c: a else b', 'case(c,a,b)'], ans: 'a if c else b' },
    ],
  },
  {
    id: 'py-loops',
    title: 'Loops (for / while)',
    desc: 'Iteration with for, while, break, continue.',
    priority: 'core',
    theory: {
      explanation: 'Loops repeat code. for loops iterate over a sequence (range, list, string). while loops repeat while a condition is True. break exits a loop immediately; continue skips to the next iteration.',
      rules: [
        'for i in range(n): iterates n times (0 to n-1)',
        'range(start, stop) iterates from start to stop-1',
        'range(start, stop, step) uses a custom step',
        'while condition: repeats while condition is True',
        'break exits the loop immediately',
        'continue skips the rest of the current iteration',
        'for char in "text": iterates characters in a string',
      ],
      examples: [
        { original: 'for i in range(3):\n    print(i)', translation: 'Output: 0 1 2' },
        { original: 'for i in range(2, 5):\n    print(i)', translation: 'Output: 2 3 4' },
        { original: 'for i in range(0, 10, 2):\n    print(i)', translation: 'Output: 0 2 4 6 8 (step=2)' },
        { original: 'while n > 0:\n    print(n)\n    n -= 1', translation: 'Count down from n to 1' },
        { original: 'for i in range(5):\n    if i == 3: break\n    print(i)', translation: 'Stop at 3; Output: 0 1 2' },
        { original: 'for i in range(4):\n    if i == 1: continue\n    print(i)', translation: 'Skip 1; Output: 0 2 3' },
      ],
    },
    exercises: [
      { id: 'py-loop-1', title: 'for with range', level: 'Beginner', topic: 'py-loops', explanation: 'for i in range(n) iterates n times.', code: 'for i in range(3):\n    print(i)', expected: '0\n1\n2', hint: 'range(3) = 0,1,2', solution: '0, 1, 2', q: 'range(3) gives?', opts: ['0,1,2', '1,2,3', '0,1,2,3', '3'], ans: '0,1,2' },
      { id: 'py-loop-2', title: 'range with start', level: 'Beginner', topic: 'py-loops', explanation: 'range(start, stop) starts at start.', code: 'for i in range(2, 5):\n    print(i)', expected: '2\n3\n4', hint: 'stop is exclusive', solution: '2, 3, 4', q: 'range(2,5) gives?', opts: ['2,3,4', '2,3,4,5', '2,3', '5'], ans: '2,3,4' },
      { id: 'py-loop-3', title: 'range with step', level: 'Beginner', topic: 'py-loops', explanation: 'range(start, stop, step) steps by step.', code: 'for i in range(0, 10, 2):\n    print(i)', expected: '0\n2\n4\n6\n8', hint: 'step=2', solution: '0,2,4,6,8', q: 'range(0,10,2) gives?', opts: ['0,2,4,6,8', '0,2,4,6,8,10', '2,4,6,8', '0,1,2'], ans: '0,2,4,6,8' },
      { id: 'py-loop-4', title: 'while Loop', level: 'Beginner', topic: 'py-loops', explanation: 'while repeats while condition is True.', code: 'n = 3\nwhile n > 0:\n    print(n)\n    n -= 1', expected: '3\n2\n1', hint: 'Decrements each time', solution: '3, 2, 1', q: 'while runs while?', opts: ['Condition True', 'Once', 'Never', 'Forever'], ans: 'Condition True' },
      { id: 'py-loop-5', title: 'break', level: 'Beginner', topic: 'py-loops', explanation: 'break exits the loop immediately.', code: 'for i in range(5):\n    if i == 2:\n        break\n    print(i)', expected: '0\n1', hint: 'break stops loop', solution: '0, 1', q: 'break does?', opts: ['Exits loop', 'Skips iteration', 'Restarts', 'Pauses'], ans: 'Exits loop' },
      { id: 'py-loop-6', title: 'continue', level: 'Beginner', topic: 'py-loops', explanation: 'continue skips to next iteration.', code: 'for i in range(4):\n    if i == 1:\n        continue\n    print(i)', expected: '0\n2\n3', hint: 'continue skips rest', solution: '0, 2, 3', q: 'continue does?', opts: ['Skips iteration', 'Exits loop', 'Restarts', 'Ends'], ans: 'Skips iteration' },
      { id: 'py-loop-7', title: 'else on Loops', level: 'Beginner', topic: 'py-loops', explanation: 'else runs if loop completes without break.', code: 'for i in range(3):\n    pass\nelse:\n    print("done")', expected: 'done', hint: 'else after loop', solution: 'done', q: 'Loop else runs when?', opts: ['No break', 'On break', 'Always', 'Never'], ans: 'No break' },
      { id: 'py-loop-8', title: 'Iterate a String', level: 'Beginner', topic: 'py-loops', explanation: 'for char in string iterates characters.', code: 'for c in "hi":\n    print(c)', expected: 'h\ni', hint: 'Strings are iterable', solution: 'h, i', q: 'for c in "ab" gives?', opts: ['a,b', 'ab', '0,1', 'None'], ans: 'a,b' },
      { id: 'py-loop-9', title: 'Sum with Loop', level: 'Beginner', topic: 'py-loops', explanation: 'Accumulate values in a loop.', code: 'total = 0\nfor i in range(4):\n    total += i\nprint(total)', expected: '6', hint: '0+1+2+3', solution: '6', q: 'Sum of range(4)?', opts: ['6', '10', '4', '3'], ans: '6' },
      { id: 'py-loop-10', title: 'Nested Loops', level: 'Beginner', topic: 'py-loops', explanation: 'Loops inside loops for 2D iteration.', code: 'for i in range(2):\n    for j in range(2):\n        print(i, j)', expected: '0 0\n0 1\n1 0\n1 1', hint: 'Inner runs fully per outer', solution: '0 0, 0 1, 1 0, 1 1', q: 'Nested loops produce?', opts: ['All pairs', 'Only outer', 'Only inner', 'One pair'], ans: 'All pairs' },
    ],
  },
  {
    id: 'py-functions',
    title: 'Functions',
    desc: 'def, parameters, return, defaults, args.',
    priority: 'core',
    theory: {
      explanation: 'Functions are reusable blocks of code. Use def to define them, pass values as parameters, and return sends a result back. Functions help organize code and avoid repetition (DRY principle).',
      rules: [
        'def name(params): defines a function',
        'return value sends a result back to the caller',
        'Parameters receive values; arguments are passed when calling',
        'Default parameters: def f(x=0) — used when argument omitted',
        '*args collects extra positional arguments into a tuple',
        '**kwargs collects keyword arguments into a dict',
        'Functions without return return None',
        'lambda args: expr creates an anonymous one-line function',
      ],
      examples: [
        { original: 'def greet():\n    return "Hi"', translation: 'Function with no parameters' },
        { original: 'def add(a, b):\n    return a + b', translation: 'Function with two parameters' },
        { original: 'def greet(name="User"):\n    return f"Hi {name}"', translation: 'Default parameter' },
        { original: 'def total(*nums):\n    return sum(nums)', translation: '*args collects many arguments' },
        { original: 'def minmax(nums):\n    return min(nums), max(nums)', translation: 'Return multiple values as a tuple' },
        { original: 'double = lambda x: x * 2', translation: 'Anonymous lambda function' },
      ],
    },
    exercises: [
      { id: 'py-fn-1', title: 'Define a Function', level: 'Beginner', topic: 'py-functions', explanation: 'def name(): creates a function.', code: 'def greet():\n    return "Hi"\nprint(greet())', expected: 'Hi', hint: 'def + name', solution: 'Hi', q: 'Keyword to define function?', opts: ['def', 'function', 'func', 'fn'], ans: 'def' },
      { id: 'py-fn-2', title: 'Parameters', level: 'Beginner', topic: 'py-functions', explanation: 'Functions accept arguments.', code: 'def add(a, b):\n    return a + b\nprint(add(3, 4))', expected: '7', hint: 'Pass values', solution: '7', q: 'add(3,4) returns?', opts: ['7', '34', '1', 'Error'], ans: '7' },
      { id: 'py-fn-3', title: 'return Statement', level: 'Beginner', topic: 'py-functions', explanation: 'return sends a value back.', code: 'def sq(x):\n    return x * x\nprint(sq(5))', expected: '25', hint: 'return outputs value', solution: '25', q: 'return does?', opts: ['Sends value back', 'Prints', 'Stops program', 'Loops'], ans: 'Sends value back' },
      { id: 'py-fn-4', title: 'Default Parameters', level: 'Beginner', topic: 'py-functions', explanation: 'Defaults used when arg omitted.', code: 'def greet(name="User"):\n    return f"Hi {name}"\nprint(greet())', expected: 'Hi User', hint: 'Default value', solution: 'Hi User', q: 'Default param syntax?', opts: ['def f(x=0):', 'def f(x:0):', 'def f(x==0):', 'def f[x=0]:'], ans: 'def f(x=0):' },
      { id: 'py-fn-5', title: 'Keyword Arguments', level: 'Beginner', topic: 'py-functions', explanation: 'Call with name=value to be explicit.', code: 'def f(a, b):\n    return a - b\nprint(f(b=1, a=5))', expected: '4', hint: 'Order by name', solution: '4', q: 'Keyword args allow?', opts: ['Any order by name', 'No order', 'Only first', 'Errors'], ans: 'Any order by name' },
      { id: 'py-fn-6', title: '*args', level: 'Beginner', topic: 'py-functions', explanation: '*args collects extra positional args.', code: 'def total(*nums):\n    return sum(nums)\nprint(total(1, 2, 3))', expected: '6', hint: '* collects many', solution: '6', q: '*args gives?', opts: ['Tuple of args', 'List', 'Dict', 'Single value'], ans: 'Tuple of args' },
      { id: 'py-fn-7', title: '**kwargs', level: 'Beginner', topic: 'py-functions', explanation: '**kwargs collects keyword args into a dict.', code: 'def info(**d):\n    return d\nprint(info(a=1))', expected: "{'a': 1}", hint: '** = dict of kwargs', solution: "{'a': 1}", q: '**kwargs gives?', opts: ['Dict', 'Tuple', 'List', 'Set'], ans: 'Dict' },
      { id: 'py-fn-8', title: 'No return', level: 'Beginner', topic: 'py-functions', explanation: 'Functions without return return None.', code: 'def f():\n    pass\nprint(f())', expected: 'None', hint: 'No return = None', solution: 'None', q: 'Function with no return gives?', opts: ['None', '0', 'Error', 'False'], ans: 'None' },
      { id: 'py-fn-9', title: 'Multiple Returns', level: 'Beginner', topic: 'py-functions', explanation: 'Return a tuple to send multiple values.', code: 'def minmax(nums):\n    return min(nums), max(nums)\nprint(minmax([3, 1, 5]))', expected: '(1, 5)', hint: 'Return tuple', solution: '(1, 5)', q: 'Return multiple values as?', opts: ['Tuple', 'List only', 'Dict', 'Not possible'], ans: 'Tuple' },
      { id: 'py-fn-10', title: 'Lambda', level: 'Beginner', topic: 'py-functions', explanation: 'lambda args: expression is an anonymous function.', code: 'double = lambda x: x * 2\nprint(double(5))', expected: '10', hint: 'lambda x: x*2', solution: '10', q: 'Lambda syntax?', opts: ['lambda x: x*2', 'def lambda x: x*2', 'fn x => x*2', 'function(x) x*2'], ans: 'lambda x: x*2' },
    ],
  },
  {
    id: 'py-lists',
    title: 'Lists',
    desc: 'Creating, indexing, slicing, methods.',
    priority: 'core',
    theory: {
      explanation: 'Lists store ordered, mutable collections of items. Use [] to create, indexing (list[i]) to access, slicing (list[a:b]) to get sublists, and methods like append, remove, pop to modify.',
      rules: [
        '[] creates an empty list; [1, 2, 3] creates with items',
        'Indexing is 0-based: list[0] is the first item',
        'Negative indices: list[-1] is the last item',
        'Slicing: list[start:end] returns a sublist (end is exclusive)',
        'append(item) adds to the end; insert(i, item) inserts at index',
        'remove(value) removes first match; pop() removes and returns last',
        'len(list) returns the number of items',
        'in checks membership: 2 in [1, 2, 3] → True',
        'List comprehension: [x**2 for x in range(5)]',
      ],
      examples: [
        { original: 'nums = [1, 2, 3]', translation: 'Create a list' },
        { original: 'print(nums[0])', translation: 'Access first item: 1' },
        { original: 'print(nums[-1])', translation: 'Access last item: 3' },
        { original: 'print(nums[1:3])', translation: 'Slice: [2, 3]' },
        { original: 'nums.append(4)', translation: 'Add 4 to end: [1, 2, 3, 4]' },
        { original: 'squares = [x**2 for x in range(5)]', translation: 'Comprehension: [0, 1, 4, 9, 16]' },
      ],
    },
    exercises: [
      { id: 'py-list-1', title: 'Create a List', level: 'Beginner', topic: 'py-lists', explanation: 'Lists store ordered items in [].', code: 'nums = [1, 2, 3]\nprint(nums)', expected: '[1, 2, 3]', hint: '[] creates a list', solution: '[1, 2, 3]', q: 'List literal uses?', opts: ['[]', '()', '{}', '<>'], ans: '[]' },
      { id: 'py-list-2', title: 'Indexing', level: 'Beginner', topic: 'py-lists', explanation: 'list[i] gets item at index i (0-based).', code: 'fruits = ["a", "b", "c"]\nprint(fruits[0])', expected: 'a', hint: 'Index starts at 0', solution: 'a', q: 'First item index?', opts: ['0', '1', '-1', 'None'], ans: '0' },
      { id: 'py-list-3', title: 'Negative Index', level: 'Beginner', topic: 'py-lists', explanation: 'list[-1] gets the last item.', code: 'nums = [1, 2, 3]\nprint(nums[-1])', expected: '3', hint: '-1 = last', solution: '3', q: 'Last item index?', opts: ['-1', '0', '1', 'len'], ans: '-1' },
      { id: 'py-list-4', title: 'Slicing', level: 'Beginner', topic: 'py-lists', explanation: 'list[start:end] returns a sublist.', code: 'nums = [0,1,2,3,4]\nprint(nums[1:3])', expected: '[1, 2]', hint: 'end is exclusive', solution: '[1, 2]', q: 'nums[1:3] gives?', opts: ['[1,2]', '[1,2,3]', '[0,1]', '[2,3]'], ans: '[1,2]' },
      { id: 'py-list-5', title: 'append()', level: 'Beginner', topic: 'py-lists', explanation: 'append() adds an item to the end.', code: 'lst = [1]\nlst.append(2)\nprint(lst)', expected: '[1, 2]', hint: 'append to end', solution: '[1, 2]', q: 'Add item to list?', opts: ['append()', 'add()', 'push()', 'insert()'], ans: 'append()' },
      { id: 'py-list-6', title: 'remove()', level: 'Beginner', topic: 'py-lists', explanation: 'remove() deletes first matching value.', code: 'lst = [1, 2, 1]\nlst.remove(1)\nprint(lst)', expected: '[2, 1]', hint: 'Removes first match', solution: '[2, 1]', q: 'remove(1) deletes?', opts: ['First 1', 'All 1s', 'Last 1', 'None'], ans: 'First 1' },
      { id: 'py-list-7', title: 'pop()', level: 'Beginner', topic: 'py-lists', explanation: 'pop() removes and returns last item.', code: 'lst = [1, 2, 3]\nprint(lst.pop())', expected: '3', hint: 'pop() = last', solution: '3', q: 'pop() returns?', opts: ['Last item', 'First item', 'Nothing', 'Error'], ans: 'Last item' },
      { id: 'py-list-8', title: 'len()', level: 'Beginner', topic: 'py-lists', explanation: 'len() returns the number of items.', code: 'print(len([1, 2, 3]))', expected: '3', hint: 'len = count', solution: '3', q: 'len([1,2,3])?', opts: ['3', '2', '6', '1'], ans: '3' },
      { id: 'py-list-9', title: 'in Operator', level: 'Beginner', topic: 'py-lists', explanation: 'in checks membership.', code: 'print(2 in [1, 2, 3])', expected: 'True', hint: 'in checks presence', solution: 'True', q: '2 in [1,2,3]?', opts: ['True', 'False', 'Error', '2'], ans: 'True' },
      { id: 'py-list-10', title: 'List Comprehension', level: 'Beginner', topic: 'py-lists', explanation: '[expr for x in iterable] builds lists concisely.', code: 'squares = [x**2 for x in range(3)]\nprint(squares)', expected: '[0, 1, 4]', hint: 'x**2 for x', solution: '[0, 1, 4]', q: 'Comprehension syntax?', opts: ['[x for x in iter]', '(x for x)', '{x for x}', '<x for x>'], ans: '[x for x in iter]' },
    ],
  },
  {
    id: 'py-dictionaries',
    title: 'Dictionaries',
    desc: 'Key-value pairs, access, methods.',
    priority: 'core',
    theory: {
      explanation: 'Dictionaries store data as key-value pairs. Keys must be unique and immutable (strings, numbers, tuples). Use {} to create, d[key] to access, and methods like keys(), values(), items() to iterate.',
      rules: [
        '{} creates an empty dict; {"a": 1} creates with a pair',
        'd[key] accesses the value; raises KeyError if key missing',
        'd.get(key, default) returns default if key is missing',
        'd[key] = value adds or updates a key',
        'del d[key] or d.pop(key) removes a key',
        'keys(), values(), items() return views for iteration',
        'in checks if a key exists: "a" in d',
        'Keys must be unique and immutable (str, int, tuple)',
      ],
      examples: [
        { original: 'd = {"name": "Alice", "age": 30}', translation: 'Create a dict' },
        { original: 'print(d["name"])', translation: 'Access by key: Alice' },
        { original: 'print(d.get("email", "N/A"))', translation: 'Safe access with default: N/A' },
        { original: 'd["email"] = "a@b.com"', translation: 'Add a new key-value pair' },
        { original: 'for k, v in d.items():\n    print(k, v)', translation: 'Iterate key-value pairs' },
        { original: 'del d["age"]', translation: 'Remove the "age" key' },
      ],
    },
    exercises: [
      { id: 'py-dict-1', title: 'Create a Dict', level: 'Beginner', topic: 'py-dictionaries', explanation: 'Dicts store key-value pairs in {}.', code: 'd = {"a": 1}\nprint(d)', expected: "{'a': 1}", hint: '{} with key:value', solution: "{'a': 1}", q: 'Dict literal uses?', opts: ['{}', '[]', '()', '<>'], ans: '{}' },
      { id: 'py-dict-2', title: 'Access by Key', level: 'Beginner', topic: 'py-dictionaries', explanation: 'd[key] returns the value.', code: 'd = {"name": "Ann"}\nprint(d["name"])', expected: 'Ann', hint: 'Use key in []', solution: 'Ann', q: 'Get value for "name"?', opts: ['d["name"]', 'd.name', 'd(0)', 'd->name'], ans: 'd["name"]' },
      { id: 'py-dict-3', title: 'Add / Update', level: 'Beginner', topic: 'py-dictionaries', explanation: 'd[key] = value adds or updates.', code: 'd = {}\nd["x"] = 5\nprint(d)', expected: "{'x': 5}", hint: 'Assignment adds key', solution: "{'x': 5}", q: 'Add key "x" with value 5?', opts: ['d["x"] = 5', 'd.add("x",5)', 'd.append("x")', 'd.push("x")'], ans: 'd["x"] = 5' },
      { id: 'py-dict-4', title: 'get() Method', level: 'Beginner', topic: 'py-dictionaries', explanation: 'get(key, default) returns default if missing.', code: 'd = {"a": 1}\nprint(d.get("b", 0))', expected: '0', hint: 'get has default', solution: '0', q: 'get("b",0) when "b" missing?', opts: ['0', 'None', 'Error', 'b'], ans: '0' },
      { id: 'py-dict-5', title: 'keys()', level: 'Beginner', topic: 'py-dictionaries', explanation: 'keys() returns all keys.', code: 'd = {"a": 1, "b": 2}\nprint(list(d.keys()))', expected: "['a', 'b']", hint: 'keys() lists keys', solution: "['a', 'b']", q: 'Get all keys?', opts: ['d.keys()', 'd.values()', 'd.items()', 'd.all()'], ans: 'd.keys()' },
      { id: 'py-dict-6', title: 'values()', level: 'Beginner', topic: 'py-dictionaries', explanation: 'values() returns all values.', code: 'd = {"a": 1, "b": 2}\nprint(list(d.values()))', expected: '[1, 2]', hint: 'values() lists values', solution: '[1, 2]', q: 'Get all values?', opts: ['d.values()', 'd.keys()', 'd.items()', 'd.list()'], ans: 'd.values()' },
      { id: 'py-dict-7', title: 'items()', level: 'Beginner', topic: 'py-dictionaries', explanation: 'items() returns (key, value) pairs.', code: 'd = {"a": 1}\nprint(list(d.items()))', expected: "[('a', 1)]", hint: 'items() = pairs', solution: "[('a', 1)]", q: 'Get key-value pairs?', opts: ['d.items()', 'd.pairs()', 'd.kv()', 'd.entries()'], ans: 'd.items()' },
      { id: 'py-dict-8', title: 'del Key', level: 'Beginner', topic: 'py-dictionaries', explanation: 'del d[key] removes a key.', code: 'd = {"a": 1, "b": 2}\ndel d["a"]\nprint(d)', expected: "{'b': 2}", hint: 'del removes key', solution: "{'b': 2}", q: 'Remove key "a"?', opts: ['del d["a"]', 'd.remove("a")', 'd.pop("a")', 'Both del and pop'], ans: 'Both del and pop' },
      { id: 'py-dict-9', title: 'in Operator', level: 'Beginner', topic: 'py-dictionaries', explanation: 'in checks if a key exists.', code: 'd = {"a": 1}\nprint("a" in d)', expected: 'True', hint: 'in checks keys', solution: 'True', q: '"a" in d checks?', opts: ['Keys', 'Values', 'Both', 'Neither'], ans: 'Keys' },
      { id: 'py-dict-10', title: 'Loop a Dict', level: 'Beginner', topic: 'py-dictionaries', explanation: 'for k, v in d.items() iterates pairs.', code: 'd = {"a": 1, "b": 2}\nfor k, v in d.items():\n    print(k, v)', expected: 'a 1\nb 2', hint: 'items() for pairs', solution: 'a 1, b 2', q: 'Loop key-value pairs?', opts: ['for k,v in d.items()', 'for k in d', 'for v in d', 'for d in items'], ans: 'for k,v in d.items()' },
    ],
  },
];

// ── ADVANCED TOPICS (fewer tasks) ──
const ADVANCED_TOPICS: {
  id: string;
  title: string;
  desc: string;
  priority: Priority;
  exercises: PyExercise[];
}[] = [
  {
    id: 'py-oop',
    title: 'OOP',
    desc: 'Classes, inheritance, methods.',
    priority: 'standard',
    exercises: [
      { id: 'py-oop-1', title: 'Define a Class', level: 'Intermediate', topic: 'py-oop', explanation: 'class Name: defines a class.', code: 'class Dog:\n    pass\nd = Dog()\nprint("ok")', expected: 'ok', hint: 'class keyword', solution: 'ok', q: 'Keyword for class?', opts: ['class', 'struct', 'object', 'type'], ans: 'class' },
      { id: 'py-oop-2', title: '__init__ Constructor', level: 'Intermediate', topic: 'py-oop', explanation: '__init__ initializes new objects.', code: 'class Dog:\n    def __init__(self, name):\n        self.name = name\nd = Dog("Rex")\nprint(d.name)', expected: 'Rex', hint: '__init__ is constructor', solution: 'Rex', q: 'Constructor method?', opts: ['__init__', '__new__', 'constructor', 'init'], ans: '__init__' },
      { id: 'py-oop-3', title: 'Inheritance', level: 'Intermediate', topic: 'py-oop', explanation: 'class Child(Parent): inherits.', code: 'class A:\n    def hi(self): return "hi"\nclass B(A): pass\nprint(B().hi())', expected: 'hi', hint: 'Parent in parens', solution: 'hi', q: 'Inherit from A?', opts: ['class B(A):', 'class B extends A', 'B : A', 'inherit A'], ans: 'class B(A):' },
    ],
  },
  {
    id: 'py-advanced',
    title: 'Advanced Python',
    desc: 'Decorators, generators, context managers.',
    priority: 'standard',
    exercises: [
      { id: 'py-adv-1', title: 'Decorators', level: 'Junior', topic: 'py-advanced', explanation: '@decorator modifies function behavior.', code: 'def up(fn):\n    def w(): return fn().upper()\n    return w\n@up\ndef g(): return "hi"\nprint(g())', expected: 'HI', hint: '@ applies decorator', solution: 'HI', q: 'Decorator syntax?', opts: ['@decorator', '#decorator', 'decorator:', 'apply'], ans: '@decorator' },
      { id: 'py-adv-2', title: 'Generators', level: 'Junior', topic: 'py-advanced', explanation: 'yield creates a generator.', code: 'def count():\n    yield 1\n    yield 2\nfor n in count():\n    print(n)', expected: '1\n2', hint: 'yield pauses', solution: '1, 2', q: 'Generator keyword?', opts: ['yield', 'return', 'generate', 'emit'], ans: 'yield' },
    ],
  },
  {
    id: 'py-async',
    title: 'Async Programming',
    desc: 'async/await for concurrent I/O.',
    priority: 'standard',
    exercises: [
      { id: 'py-async-1', title: 'async def', level: 'Junior', topic: 'py-async', explanation: 'async def defines a coroutine.', code: 'async def main():\n    return "x"\nprint("async ready")', expected: 'async ready', hint: 'async def', solution: 'async ready', q: 'Run async function?', opts: ['asyncio.run()', 'async.run()', 'run_async()', 'await main()'], ans: 'asyncio.run()' },
    ],
  },
  {
    id: 'py-testing',
    title: 'Testing',
    desc: 'Unit tests and assertions.',
    priority: 'standard',
    exercises: [
      { id: 'py-test-1', title: 'assert', level: 'Junior', topic: 'py-testing', explanation: 'assert checks a condition.', code: 'def add(a, b): return a + b\nassert add(2, 3) == 5\nprint("pass")', expected: 'pass', hint: 'assert checks', solution: 'pass', q: 'Popular test framework?', opts: ['pytest', 'unittest', 'Both', 'testpy'], ans: 'Both' },
    ],
  },
  {
    id: 'py-projects',
    title: 'Mini Projects',
    desc: 'Hands-on coding projects.',
    priority: 'standard',
    exercises: [
      { id: 'py-proj-1', title: 'Todo CLI', level: 'Junior', topic: 'py-projects', explanation: 'Build a CLI todo app.', code: 'todos = []\ntodos.append("Learn")\nprint(len(todos))', expected: '1', hint: 'List + append', solution: '1', q: 'Save todos to file?', opts: ['json.dump()', 'pickle.dump()', 'write str()', 'All possible'], ans: 'All possible' },
      { id: 'py-proj-2', title: 'Calculator', level: 'Junior', topic: 'py-projects', explanation: 'Functions for arithmetic.', code: 'def calc(a, op, b):\n    return a + b if op == "+" else a - b\nprint(calc(10, "+", 5))', expected: '15', hint: 'if/elif for ops', solution: '15', q: 'Handle division by zero?', opts: ['try/except', 'if b==0', 'Both', 'ignore'], ans: 'Both' },
    ],
  },
];

function buildPythonLesson(ex: PyExercise) {
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

function buildTopic(meta: {
  id: string;
  title: string;
  desc: string;
  priority: Priority;
  exercises: PyExercise[];
  theory?: { explanation: string; rules: string[]; examples: { original: string; translation: string }[] };
  practiceTasks?: string[];
}): Topic {
  const lessons = meta.exercises.map(buildPythonLesson);
  return {
    id: meta.id,
    title: meta.title,
    description: meta.desc,
    subject: 'Python',
    priority: meta.priority,
    section: meta.priority === 'core' ? 'CORE PYTHON (MOST IMPORTANT)' : 'Advanced Topics',
    lessons,
    theory: meta.theory,
    practiceTasks: meta.practiceTasks ?? meta.exercises.map((e) => e.title),
  };
}

export const PYTHON_COURSE: CourseLevel[] = [
  {
    level: 'Beginner',
    section: 'CORE PYTHON (MOST IMPORTANT)',
    topics: CORE_TOPICS.map(buildTopic),
  },
  {
    level: 'Intermediate',
    section: 'Advanced Topics',
    topics: ADVANCED_TOPICS.filter((t) => t.id === 'py-oop' || t.id === 'py-advanced').map(buildTopic),
  },
  {
    level: 'Junior',
    section: 'Advanced Topics',
    topics: ADVANCED_TOPICS.filter((t) => t.id === 'py-async' || t.id === 'py-testing' || t.id === 'py-projects').map(buildTopic),
  },
];
