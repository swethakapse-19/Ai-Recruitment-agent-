import { SKILL_CATEGORIES } from '../data/skillsDatabase';

const CATEGORY_STYLES = {
  tech: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  soft: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  tools: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  missing: 'bg-rose-500/15 text-rose-300 border-rose-500/25 line-through opacity-70',
  neutral: 'bg-white/10 text-white/60 border-white/10',
};

export default function SkillBadge({ skill, variant = 'auto', size = 'sm' }) {
  const category = variant === 'auto' ? (SKILL_CATEGORIES[skill] || 'neutral') : variant;
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.neutral;
  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-lg border font-medium transition-colors ${style} ${sizeClass}`}>
      {skill}
    </span>
  );
}
