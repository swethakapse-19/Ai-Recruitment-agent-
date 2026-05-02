// FeedbackAgent — Generates improvement suggestions and explainable AI
export class FeedbackAgent {
  static name = 'Feedback & Explainability Agent';

  // Resume improvement suggestions
  static getResumeImprovements(candidate) {
    const suggestions = [];

    if (!candidate.atsScore || candidate.atsScore < 80) {
      suggestions.push({
        type: 'ATS',
        icon: '🎯',
        priority: 'High',
        title: 'Improve ATS Compatibility',
        detail: 'Add more role-specific keywords from the job description. Use standard section headings like "Work Experience", "Skills", "Education".',
      });
    }
    if (candidate.missingSkills && candidate.missingSkills.length > 0) {
      suggestions.push({
        type: 'Skills',
        icon: '📚',
        priority: 'High',
        title: `Add Missing Skills: ${candidate.missingSkills.slice(0, 3).join(', ')}`,
        detail: 'These skills are required by the role. If you have related experience, list them explicitly. Consider upskilling through courses.',
      });
    }
    if (!candidate.skills || candidate.skills.length < 8) {
      suggestions.push({
        type: 'Skills',
        icon: '⚡',
        priority: 'Medium',
        title: 'Expand Skills Section',
        detail: 'List all technical tools, frameworks, and languages you have used — even briefly. Recruiters scan for specific keywords.',
      });
    }
    suggestions.push({
      type: 'Impact',
      icon: '📊',
      priority: 'Medium',
      title: 'Quantify Your Achievements',
      detail: 'Replace vague statements like "improved performance" with metrics: "Reduced API response time by 40% for 50k daily users".',
    });
    suggestions.push({
      type: 'Format',
      icon: '✨',
      priority: 'Low',
      title: 'Strengthen Your Professional Summary',
      detail: 'Write a 2-3 sentence summary at the top. Lead with years of experience, core expertise, and your biggest win.',
    });
    if (!candidate.summary || candidate.summary.length < 100) {
      suggestions.push({
        type: 'Content',
        icon: '🔗',
        priority: 'Low',
        title: 'Add GitHub & LinkedIn Links',
        detail: 'Recruiters check profiles. Include live portfolio links and a GitHub with active projects.',
      });
    }

    return suggestions;
  }

  // Skill learning recommendations
  static getSkillRecommendations(missingSkills) {
    const resources = {
      'Python': { course: 'Python for Everybody (Coursera)', time: '1 month', level: 'Beginner' },
      'Machine Learning': { course: 'ML Specialization - Andrew Ng (Coursera)', time: '3 months', level: 'Intermediate' },
      'Docker': { course: 'Docker Mastery (Udemy)', time: '2 weeks', level: 'Beginner' },
      'Kubernetes': { course: 'CKA Certification Course (Udemy)', time: '6 weeks', level: 'Advanced' },
      'AWS': { course: 'AWS Solutions Architect (Udemy)', time: '2 months', level: 'Intermediate' },
      'React': { course: 'React - The Complete Guide (Udemy)', time: '6 weeks', level: 'Beginner' },
      'TypeScript': { course: 'Understanding TypeScript (Udemy)', time: '3 weeks', level: 'Intermediate' },
      'LLMs': { course: 'LLM Engineering (DeepLearning.AI)', time: '4 weeks', level: 'Advanced' },
      'PostgreSQL': { course: 'Complete SQL and Databases Bootcamp (Udemy)', time: '3 weeks', level: 'Beginner' },
      'GraphQL': { course: 'GraphQL with React (Udemy)', time: '2 weeks', level: 'Intermediate' },
    };

    return missingSkills.slice(0, 4).map(skill => ({
      skill,
      ...(resources[skill] || { course: `${skill} Fundamentals (Search on Coursera/Udemy)`, time: '4 weeks', level: 'Intermediate' }),
    }));
  }

  // Explainable AI — why this score?
  static explainScore(candidate) {
    const explanations = [];

    const techScore = candidate.skills?.length || 0;
    explanations.push({
      factor: 'Technical Skills',
      weight: '35%',
      score: Math.min(100, techScore * 8),
      detail: `Identified ${techScore} technical skills. ${techScore >= 8 ? 'Strong technical profile.' : 'Consider adding more specific technologies.'}`,
      color: techScore >= 8 ? 'emerald' : 'amber',
    });

    const expScore = Math.min(100, (candidate.experience || 0) * 20);
    explanations.push({
      factor: 'Experience Level',
      weight: '25%',
      score: expScore,
      detail: `${candidate.experience || 0} years of experience detected. ${expScore >= 60 ? 'Meets seniority requirements.' : 'Below the ideal experience threshold.'}`,
      color: expScore >= 60 ? 'emerald' : 'rose',
    });

    explanations.push({
      factor: 'ATS Compatibility',
      weight: '20%',
      score: candidate.atsScore || 0,
      detail: `ATS score of ${candidate.atsScore || 0}/100. ${(candidate.atsScore || 0) >= 80 ? 'Excellent formatting and keyword usage.' : 'Improve keyword density and formatting.'}`,
      color: (candidate.atsScore || 0) >= 80 ? 'emerald' : 'amber',
    });

    const missingCount = candidate.missingSkills?.length || 0;
    const gapScore = Math.max(0, 100 - missingCount * 15);
    explanations.push({
      factor: 'Skill Gap',
      weight: '20%',
      score: gapScore,
      detail: `${missingCount} required skills are missing. ${missingCount === 0 ? 'No skill gaps!' : `Missing: ${candidate.missingSkills?.slice(0, 2).join(', ')}`}`,
      color: missingCount === 0 ? 'emerald' : missingCount <= 2 ? 'amber' : 'rose',
    });

    return explanations;
  }

  // Bias detection in JD text
  static detectBias(jdText) {
    const biasedTerms = {
      gender: ['ninja', 'rockstar', 'guru', 'dominant', 'aggressive', 'manpower', 'mankind', 'him', 'her'],
      age: ['young', 'recent graduate only', 'fresh', 'digital native'],
      cultural: ['native speaker only', 'local candidates only'],
    };

    const found = [];
    Object.entries(biasedTerms).forEach(([category, terms]) => {
      terms.forEach(term => {
        if (jdText.toLowerCase().includes(term)) {
          found.push({ term, category, suggestion: `Replace "${term}" with a neutral alternative to attract diverse talent.` });
        }
      });
    });

    return { biasFound: found.length > 0, issues: found };
  }
}
