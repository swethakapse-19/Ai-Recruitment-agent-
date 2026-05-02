// InterviewAgent — Generates role-specific interview questions
export class InterviewAgent {
  static name = 'Interview Intelligence Agent';

  static QUESTION_BANK = {
    behavioral: [
      { q: 'Tell me about a time you faced a major technical challenge. How did you handle it?', difficulty: 'Medium' },
      { q: 'Describe a situation where you had to meet a tight deadline. What was your approach?', difficulty: 'Easy' },
      { q: 'Give an example of a project where you demonstrated leadership.', difficulty: 'Medium' },
      { q: 'Tell me about a time you disagreed with a team member. How did you resolve it?', difficulty: 'Hard' },
      { q: 'Describe your most impactful contribution to a previous project.', difficulty: 'Medium' },
      { q: 'How do you prioritize tasks when working on multiple projects simultaneously?', difficulty: 'Easy' },
      { q: 'Tell me about a time you failed. What did you learn?', difficulty: 'Hard' },
      { q: 'How do you stay updated with the latest technology trends?', difficulty: 'Easy' },
    ],
    technical: {
      Python: [
        { q: 'Explain the difference between a list and a tuple in Python. When would you use each?', difficulty: 'Easy' },
        { q: 'What are Python decorators? Write a simple example.', difficulty: 'Medium' },
        { q: 'Explain GIL (Global Interpreter Lock) and its implications for multi-threading.', difficulty: 'Hard' },
        { q: 'How would you optimize a slow Python script processing 1 million records?', difficulty: 'Hard' },
      ],
      JavaScript: [
        { q: 'Explain the difference between `==` and `===` in JavaScript.', difficulty: 'Easy' },
        { q: 'What is the event loop in JavaScript? How does it handle asynchronous code?', difficulty: 'Medium' },
        { q: 'Explain closures in JavaScript with an example.', difficulty: 'Medium' },
        { q: 'What is the difference between `Promise.all` and `Promise.allSettled`?', difficulty: 'Hard' },
      ],
      React: [
        { q: 'What is the virtual DOM and how does React use it?', difficulty: 'Easy' },
        { q: 'Explain the difference between `useEffect` and `useLayoutEffect`.', difficulty: 'Medium' },
        { q: 'How would you optimize a React app that re-renders too often?', difficulty: 'Hard' },
        { q: 'Explain the React reconciliation algorithm.', difficulty: 'Hard' },
      ],
      'Machine Learning': [
        { q: 'Explain the bias-variance tradeoff.', difficulty: 'Medium' },
        { q: 'What is the difference between supervised and unsupervised learning?', difficulty: 'Easy' },
        { q: 'How do you handle class imbalance in a classification problem?', difficulty: 'Medium' },
        { q: 'Explain gradient descent and its variants (SGD, Adam, etc.).', difficulty: 'Hard' },
      ],
      Docker: [
        { q: 'What is the difference between a Docker image and a container?', difficulty: 'Easy' },
        { q: 'Explain Docker networking modes.', difficulty: 'Medium' },
        { q: 'How would you optimize a Docker image for production?', difficulty: 'Hard' },
      ],
      AWS: [
        { q: 'What is the difference between EC2 and Lambda?', difficulty: 'Easy' },
        { q: 'Explain how you would architect a highly available web application on AWS.', difficulty: 'Hard' },
        { q: 'What is S3 and when would you use it vs EFS?', difficulty: 'Medium' },
      ],
      PostgreSQL: [
        { q: 'What is the difference between INNER JOIN and LEFT JOIN?', difficulty: 'Easy' },
        { q: 'How would you optimize a slow SQL query?', difficulty: 'Medium' },
        { q: 'Explain database indexing and when not to use indexes.', difficulty: 'Hard' },
      ],
    },
    coding: [
      { q: 'Write a function to find the two numbers in an array that sum to a target value. What is the time complexity?', difficulty: 'Easy' },
      { q: 'Implement a function that detects if a linked list has a cycle.', difficulty: 'Medium' },
      { q: 'Design a rate limiter that allows N requests per minute per user.', difficulty: 'Hard' },
      { q: 'Write a function to validate balanced parentheses in a string.', difficulty: 'Easy' },
      { q: 'Implement a simple LRU (Least Recently Used) cache.', difficulty: 'Hard' },
      { q: 'Given a binary tree, write a function to return its level-order traversal.', difficulty: 'Medium' },
      { q: 'Write a function to find all permutations of a string.', difficulty: 'Medium' },
      { q: 'Design a system that handles 1 million concurrent WebSocket connections. Walk through your approach.', difficulty: 'Hard' },
    ],
  };

  // Generate questions for a candidate
  static generateQuestions(skills, experience, role) {
    const questions = [];

    // Always add behavioral questions
    const behavioral = this.shuffleArray(this.QUESTION_BANK.behavioral).slice(0, 3);
    questions.push(...behavioral.map(q => ({ ...q, type: 'Behavioral' })));

    // Add skill-specific technical questions
    const relevantSkills = skills.filter(s => this.QUESTION_BANK.technical[s]).slice(0, 3);
    relevantSkills.forEach(skill => {
      const skillQs = this.shuffleArray(this.QUESTION_BANK.technical[skill] || []).slice(0, 2);
      questions.push(...skillQs.map(q => ({ ...q, type: 'Technical', skill })));
    });

    // Add coding questions based on experience
    const codingDifficulty = experience >= 4 ? 'Hard' : experience >= 2 ? 'Medium' : 'Easy';
    const coding = this.QUESTION_BANK.coding.filter(q =>
      q.difficulty === codingDifficulty || (experience >= 3 && q.difficulty === 'Medium')
    ).slice(0, 2);
    questions.push(...coding.map(q => ({ ...q, type: 'Coding' })));

    return questions.map((q, i) => ({ ...q, id: i + 1, answer: '', score: null }));
  }

  // Evaluate a single answer
  static evaluateAnswer(question, answer) {
    if (!answer || answer.trim().length < 20) {
      return { score: 0, feedback: 'Answer too short or empty. Please provide a detailed response.' };
    }
    const wordCount = answer.trim().split(/\s+/).length;
    const hasSpecifics = /\d+|example|specifically|because|therefore|result|achieved/i.test(answer);
    const hasTechTerms = /algorithm|complexity|optimize|scale|performance|architecture/i.test(answer);

    let score = 40;
    if (wordCount >= 50) score += 15;
    if (wordCount >= 100) score += 10;
    if (hasSpecifics) score += 15;
    if (hasTechTerms) score += 10;
    score += Math.floor(Math.random() * 10);

    score = Math.min(100, score);

    const feedback = score >= 80
      ? 'Excellent response! Clear, specific, and technically accurate.'
      : score >= 60
        ? 'Good answer with solid understanding. Could add more specific examples or metrics.'
        : 'Adequate but lacks depth. Recommend elaborating with concrete examples and outcomes.';

    return { score, feedback };
  }

  // Generate interview performance summary
  static generatePerformanceSummary(answers, totalScore) {
    const avg = Math.round(answers.reduce((a, b) => a + (b.score || 0), 0) / answers.filter(a => a.score !== null).length);
    const level = avg >= 80 ? 'Excellent' : avg >= 65 ? 'Good' : avg >= 50 ? 'Needs Improvement' : 'Poor';
    return {
      averageScore: avg || 0,
      overallLevel: level,
      recommendation: avg >= 70 ? 'Proceed to next round' : avg >= 50 ? 'Consider for junior role' : 'Not recommended',
      strengths: answers.filter(a => a.score >= 70).slice(0, 2).map(a => a.type),
      improvements: answers.filter(a => a.score < 60).slice(0, 2).map(a => a.type),
    };
  }

  static shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }
}
