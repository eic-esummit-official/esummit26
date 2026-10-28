// IMPORTANT: This file is SERVER-ONLY.
// Never import this in a 'use client' component or a page that runs client-side.
// Answers are stripped before any payload is sent to the browser.

export interface Question {
  id: string
  questionText: string
  answer: string // NEVER sent to client
  options: string[] // All options including correct one (shuffled before sending)
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  durationSeconds: number
}

export const VENTUREX_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    questionText: 'Who is an entrepreneur?',
    answer: 'A person who starts a new business and takes on its risks',
    options: [
      'A person who only invests in the stock market',
      'A person who works for a fixed monthly salary',
      'A person who starts a new business and takes on its risks',
      'A government officer who regulates businesses',
    ],
    category: 'Entrepreneurship',
    difficulty: 'Easy',
    durationSeconds: 45,
  },
  {
    id: 'q-2',
    questionText: 'What does MVP stand for in startup terminology?',
    answer: 'Minimum Viable Product',
    options: [
      'Most Valuable Player',
      'Minimum Viable Product',
      'Minimum Variable Pricing',
      'Maximum Value Proposition',
    ],
    category: 'Entrepreneurship',
    difficulty: 'Medium',
    durationSeconds: 45,
  },
  {
    id: 'q-3',
    questionText: "In startup language, what is a 'pivot'?",
    answer: 'A fundamental change in business model or strategy based on what the startup has learned',
    options: [
      'Shutting down the company',
      'Opening a new office in another city',
      'Hiring a new CEO',
      'A fundamental change in business model or strategy based on what the startup has learned',
    ],
    category: 'Entrepreneurship',
    difficulty: 'Medium',
    durationSeconds: 45,
  },
  {
    id: 'q-4',
    questionText:
      'A startup spends Rs. 10 lakh per month and earns Rs. 4 lakh per month in revenue. If it has Rs. 54 lakh in cash, how long is its runway (at the current net burn)?',
    answer: '9 months',
    options: ['9 months', '13.5 months', '6 months', '5.4 months'],
    category: 'Entrepreneurship',
    difficulty: 'Hard',
    durationSeconds: 45,
  },
  {
    id: 'q-5',
    questionText: 'Which key uniquely identifies each record in a table and cannot contain NULL values?',
    answer: 'Primary key',
    options: ['Composite attribute', 'Primary key', 'Foreign key', 'Candidate-only key'],
    category: 'DBMS',
    difficulty: 'Easy',
    durationSeconds: 45,
  },
  {
    id: 'q-6',
    questionText: 'Which JOIN returns all rows from the left table and the matching rows from the right table?',
    answer: 'LEFT JOIN',
    options: ['LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
    category: 'DBMS',
    difficulty: 'Medium',
    durationSeconds: 45,
  },
  {
    id: 'q-7',
    questionText: 'Which SQL clause is used to filter groups after a GROUP BY?',
    answer: 'HAVING',
    options: ['LIMIT', 'HAVING', 'WHERE', 'ORDER BY'],
    category: 'DBMS',
    difficulty: 'Medium',
    durationSeconds: 45,
  },
  {
    id: 'q-8',
    questionText:
      'A relation R(A, B, C, D) has the functional dependencies A → B, B → C and C → D. What is the highest normal form R satisfies?',
    answer: '2NF',
    options: ['BCNF', '2NF', '1NF only', '3NF'],
    category: 'DBMS',
    difficulty: 'Hard',
    durationSeconds: 45,
  },
  {
    id: 'q-9',
    questionText: 'What is 20% of 250?',
    answer: '50',
    options: ['40', '50', '60', '25'],
    category: 'Aptitude',
    difficulty: 'Easy',
    durationSeconds: 45,
  },
  {
    id: 'q-10',
    questionText: 'What is the next number in the series 2, 6, 12, 20, 30, ?',
    answer: '42',
    options: ['42', '44', '40', '36'],
    category: 'Aptitude',
    difficulty: 'Easy',
    durationSeconds: 45,
  },
  {
    id: 'q-11',
    questionText: 'A 120 m long train crosses a pole in 6 seconds. What is its speed in km/h?',
    answer: '72',
    options: ['90', '60', '80', '72'],
    category: 'Aptitude',
    difficulty: 'Medium',
    durationSeconds: 45,
  },
  {
    id: 'q-12',
    questionText: 'A sum of money doubles itself in 5 years at simple interest. In how many years will it become 4 times itself?',
    answer: '15 years',
    options: ['10 years', '15 years', '20 years', '12.5 years'],
    category: 'Aptitude',
    difficulty: 'Hard',
    durationSeconds: 45,
  },
  {
    id: 'q-13',
    questionText:
      'A can finish a work in 12 days and B in 18 days. They work together for 4 days, then A leaves. In how many more days will B finish the remaining work alone?',
    answer: '8 days',
    options: ['10 days', '9 days', '8 days', '6 days'],
    category: 'Aptitude',
    difficulty: 'Hard',
    durationSeconds: 45,
  },
  {
    id: 'q-14',
    questionText: 'Which of the following is NOT a pillar of Object-Oriented Programming?',
    answer: 'Compilation',
    options: ['Polymorphism', 'Encapsulation', 'Inheritance', 'Compilation'],
    category: 'OOPS',
    difficulty: 'Easy',
    durationSeconds: 45,
  },
  {
    id: 'q-15',
    questionText: 'Method overloading is an example of:',
    answer: 'Compile-time polymorphism',
    options: ['Data hiding', 'Runtime polymorphism', 'Compile-time polymorphism', 'Inheritance'],
    category: 'OOPS',
    difficulty: 'Medium',
    durationSeconds: 45,
  },
  {
    id: 'q-16',
    questionText:
      'In C++, what is required for a call through a base-class pointer to invoke the derived-class version of a method at runtime?',
    answer: 'The base-class method must be declared virtual',
    options: [
      'The base-class method must be declared virtual',
      'The method must be declared static',
      'The derived class must declare the method private',
      'The method must be declared inline',
    ],
    category: 'OOPS',
    difficulty: 'Hard',
    durationSeconds: 45,
  },
  {
    id: 'q-17',
    questionText:
      "A subclass overrides a parent method so that it throws an 'unsupported operation' error, making the subclass unusable wherever the parent is expected. Which design principle does this violate?",
    answer: 'Liskov Substitution Principle',
    options: [
      'Single Responsibility Principle',
      'Interface Segregation Principle',
      'Open/Closed Principle',
      'Liskov Substitution Principle',
    ],
    category: 'OOPS',
    difficulty: 'Hard',
    durationSeconds: 45,
  },
  {
    id: 'q-18',
    questionText: 'Which data structure follows the LIFO (Last In, First Out) principle?',
    answer: 'Stack',
    options: ['Stack', 'Array', 'Linked list', 'Queue'],
    category: 'DSA',
    difficulty: 'Easy',
    durationSeconds: 45,
  },
  {
    id: 'q-19',
    questionText: 'What is the time complexity of binary search on a sorted array of n elements?',
    answer: 'O(log n)',
    options: ['O(log n)', 'O(n log n)', 'O(n)', 'O(1)'],
    category: 'DSA',
    difficulty: 'Medium',
    durationSeconds: 45,
  },
  {
    id: 'q-20',
    questionText:
      'What is the worst-case time complexity of Quick Sort on an already sorted array when the first element is always chosen as the pivot?',
    answer: 'O(n^2)',
    options: ['O(log n)', 'O(n^2)', 'O(n)', 'O(n log n)'],
    category: 'DSA',
    difficulty: 'Hard',
    durationSeconds: 45,
  },
]
