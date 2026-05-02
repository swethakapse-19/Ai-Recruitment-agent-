// ResumeAgent — Parses and analyzes resume text
import { SKILLS_DB, SKILL_CATEGORIES } from '../data/skillsDatabase';

export class ResumeAgent {
  static name = 'Resume Analysis Agent';

  // Extract skills from text
  static extractSkills(text) {
    const upperText = text.toUpperCase();
    const found = { tech: [], soft: [], tools: [] };

    Object.entries(SKILLS_DB).forEach(([category, skills]) => {
      skills.forEach(skill => {
        if (upperText.includes(skill.toUpperCase())) {
          found[category].push(skill);
        }
      });
    });

    return found;
  }

  // Parse name from resume text (heuristic)
  static extractName(text) {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    for (let line of lines.slice(0, 5)) {
      const trimmed = line.trim();
      if (trimmed.length > 2 && trimmed.length < 50 && /^[A-Za-z ]+$/.test(trimmed)) {
        return trimmed;
      }
    }
    return 'Candidate';
  }

  // Extract email
  static extractEmail(text) {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : 'Not Found';
  }

  // Extract phone
  static extractPhone(text) {
    const match = text.match(/[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
    return match ? match[0] : 'Not Found';
  }

  // Estimate experience from text
  static estimateExperience(text) {
    const expMatch = text.match(/(\d+)\+?\s*(years?|yrs?)\s*(of)?\s*(experience|exp)/i);
    if (expMatch) return parseInt(expMatch[1]);
    const yearMatches = text.match(/20\d{2}/g);
    if (yearMatches && yearMatches.length >= 2) {
      const years = yearMatches.map(Number).sort();
      return Math.max(0, new Date().getFullYear() - years[0]);
    }
    return Math.floor(Math.random() * 4) + 1;
  }

  // Calculate ATS score
  static calculateATSScore(text, skills) {
    const totalSkills = skills.tech.length + skills.soft.length + skills.tools.length;
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
    const hasPhone = /[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3}/.test(text);
    const hasLinkedIn = /linkedin/i.test(text);
    const hasGitHub = /github/i.test(text);
    const hasEducation = /degree|bachelor|master|b\.tech|m\.tech|b\.e|b\.sc|mba/i.test(text);
    const wordCount = text.split(/\s+/).length;

    let score = 50;
    score += Math.min(20, totalSkills * 2);
    score += hasEmail ? 5 : 0;
    score += hasPhone ? 3 : 0;
    score += hasLinkedIn ? 3 : 0;
    score += hasGitHub ? 4 : 0;
    score += hasEducation ? 5 : 0;
    score += wordCount > 300 ? 10 : wordCount > 150 ? 5 : 0;

    return Math.min(100, Math.round(score));
  }

  // Calculate resume score
  static calculateResumeScore(text, skills, experience) {
    const atsScore = this.calculateATSScore(text, skills);
    const expScore = Math.min(25, experience * 5);
    const projectScore = /project|built|developed|created|designed/i.test(text) ? 15 : 5;
    const quantScore = /\d+[%x]/i.test(text) || /\$\d+/.test(text) || /reduced|increased|improved/i.test(text) ? 10 : 0;

    return Math.min(100, Math.round((atsScore * 0.5) + expScore + projectScore + quantScore));
  }

  // Generate AI-style summary
  static generateSummary(name, skills, experience, role) {
    const topSkills = [...skills.tech].slice(0, 3).join(', ');
    const templates = [
      `${name} is a ${experience}-year experienced ${role || 'software professional'} specializing in ${topSkills}. Demonstrates strong technical depth with a proven record of delivering impactful solutions.`,
      `Skilled ${role || 'engineer'} with ${experience} years of hands-on expertise in ${topSkills}. Known for building scalable systems and driving measurable outcomes.`,
      `${experience}+ year ${role || 'developer'} proficient in ${topSkills}. Combines deep technical knowledge with collaborative skills to deliver high-quality software products.`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Full parse
  static parseResume(text) {
    const skills = this.extractSkills(text);
    const experience = this.estimateExperience(text);
    const atsScore = this.calculateATSScore(text, skills);
    const resumeScore = this.calculateResumeScore(text, skills, experience);
    const name = this.extractName(text);

    return {
      name,
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      skills: skills.tech,
      softSkills: skills.soft,
      tools: skills.tools,
      experience,
      atsScore,
      resumeScore,
      summary: this.generateSummary(name, skills, experience, null),
      keywordDensity: Math.min(100, Math.round((skills.tech.length / 20) * 100)),
    };
  }
}
