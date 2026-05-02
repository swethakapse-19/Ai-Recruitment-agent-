// MatchingAgent — Computes JD vs Resume similarity and ranking
import { SKILLS_DB } from '../data/skillsDatabase';
import { JOB_ROLES } from '../data/jobRoles';

export class MatchingAgent {
  static name = 'Job Matching Agent';

  // Parse required skills from JD text
  static parseJD(jdText) {
    const upperJD = jdText.toUpperCase();
    const required = [];

    Object.values(SKILLS_DB).flat().forEach(skill => {
      if (upperJD.includes(skill.toUpperCase())) {
        required.push(skill);
      }
    });

    const expMatch = jdText.match(/(\d+)\+?\s*(years?|yrs?)/i);
    const minExperience = expMatch ? parseInt(expMatch[1]) : 0;

    let domain = 'General';
    if (/machine learning|ml|ai|deep learning|neural|nlp|llm/i.test(jdText)) domain = 'AI';
    else if (/react|frontend|ui\/ux|css|html|angular|vue/i.test(jdText)) domain = 'Web';
    else if (/devops|kubernetes|docker|aws|cloud|infra/i.test(jdText)) domain = 'Infrastructure';
    else if (/data scientist|analytics|pandas|tableau|sql/i.test(jdText)) domain = 'Data';

    const isJunior = /junior|entry.level|fresher|graduate|intern/i.test(jdText);
    const isSenior = /senior|lead|principal|architect|manager/i.test(jdText);

    return { requiredSkills: required, minExperience, domain, isJunior, isSenior };
  }

  static computeSkillMatch(candidateSkills, requiredSkills) {
    if (!requiredSkills.length) return 80;
    const allCandidateSkills = candidateSkills.map(s => s.toUpperCase());
    const matched = requiredSkills.filter(s => allCandidateSkills.includes(s.toUpperCase()));
    return Math.round((matched.length / requiredSkills.length) * 100);
  }

  static getMissingSkills(candidateSkills, requiredSkills) {
    const upperCandidate = candidateSkills.map(s => s.toUpperCase());
    return requiredSkills.filter(s => !upperCandidate.includes(s.toUpperCase()));
  }

  static computeSemanticSimilarity(candidateSkills, requiredSkills, experience, minExperience) {
    const skillScore = this.computeSkillMatch(candidateSkills, requiredSkills);
    const expBonus = experience >= minExperience ? 10 : Math.max(-20, (experience - minExperience) * 5);
    const noise = (Math.random() * 6) - 3;
    return Math.min(100, Math.max(0, Math.round(skillScore * 0.85 + expBonus + noise)));
  }

  static classifyFit(matchScore) {
    if (matchScore >= 80) return 'High';
    if (matchScore >= 60) return 'Medium';
    return 'Low';
  }

  static detectOverqualified(experience, minExperience) {
    return experience > minExperience + 4;
  }

  static recommendRole(skills) {
    let bestRole = null;
    let bestScore = 0;
    Object.values(JOB_ROLES).forEach(role => {
      const score = this.computeSkillMatch(skills, role.requiredSkills);
      if (score > bestScore) { bestScore = score; bestRole = role.title; }
    });
    return bestRole;
  }

  static analyze(candidateData, jdData) {
    const allSkills = [...(candidateData.skills || []), ...(candidateData.softSkills || [])];
    const matchScore = this.computeSemanticSimilarity(allSkills, jdData.requiredSkills, candidateData.experience, jdData.minExperience);
    const missingSkills = this.getMissingSkills(allSkills, jdData.requiredSkills);
    const skillMatchPct = this.computeSkillMatch(allSkills, jdData.requiredSkills);
    const fitLevel = this.classifyFit(matchScore);
    const isOverqualified = this.detectOverqualified(candidateData.experience, jdData.minExperience);
    const recommendedRole = this.recommendRole(allSkills);

    return { matchScore, skillMatchPct, missingSkills, fitLevel, isOverqualified, recommendedRole, domain: jdData.domain };
  }
}
