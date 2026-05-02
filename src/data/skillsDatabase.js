// Skills taxonomy database
export const SKILLS_DB = {
  tech: [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin',
    'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'Spring Boot',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Pandas', 'NumPy', 'OpenCV',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD',
    'PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Cassandra', 'ElasticSearch',
    'GraphQL', 'REST API', 'gRPC', 'WebSockets', 'Microservices',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'LLMs', 'RAG',
    'Git', 'Linux', 'Bash', 'HTML', 'CSS', 'SQL', 'Spark', 'Kafka', 'Airflow',
    'Tailwind CSS', 'Redux', 'React Native', 'Flutter', 'Figma',
  ],
  soft: [
    'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management',
    'Critical Thinking', 'Adaptability', 'Creativity', 'Attention to Detail',
    'Collaboration', 'Project Management', 'Mentoring', 'Decision Making',
    'Conflict Resolution', 'Presentation Skills', 'Stakeholder Management',
  ],
  tools: [
    'VS Code', 'IntelliJ', 'Jira', 'Confluence', 'Slack', 'GitHub', 'GitLab',
    'Postman', 'Swagger', 'Jupyter', 'Notion', 'Figma', 'Tableau', 'Power BI',
    'DataDog', 'Grafana', 'Prometheus', 'New Relic', 'PagerDuty',
    'Vercel', 'Netlify', 'Heroku', 'Render', 'Supabase', 'Firebase',
    'JIRA', 'Linear', 'Asana', 'Trello',
  ],
};

export const ALL_SKILLS = [...SKILLS_DB.tech, ...SKILLS_DB.soft, ...SKILLS_DB.tools];

export const SKILL_CATEGORIES = {
  'Python': 'tech', 'JavaScript': 'tech', 'TypeScript': 'tech', 'Java': 'tech',
  'C++': 'tech', 'C#': 'tech', 'Go': 'tech', 'Rust': 'tech',
  'React': 'tech', 'Vue': 'tech', 'Angular': 'tech', 'Next.js': 'tech',
  'Node.js': 'tech', 'Express': 'tech', 'FastAPI': 'tech', 'Django': 'tech', 'Flask': 'tech',
  'TensorFlow': 'tech', 'PyTorch': 'tech', 'Scikit-learn': 'tech', 'Keras': 'tech',
  'Pandas': 'tech', 'NumPy': 'tech', 'OpenCV': 'tech',
  'Docker': 'tech', 'Kubernetes': 'tech', 'AWS': 'tech', 'GCP': 'tech', 'Azure': 'tech',
  'PostgreSQL': 'tech', 'MongoDB': 'tech', 'Redis': 'tech', 'MySQL': 'tech',
  'GraphQL': 'tech', 'REST API': 'tech', 'Machine Learning': 'tech', 'Deep Learning': 'tech',
  'NLP': 'tech', 'Computer Vision': 'tech', 'LLMs': 'tech', 'RAG': 'tech',
  'Git': 'tools', 'GitHub': 'tools', 'GitLab': 'tools',
  'VS Code': 'tools', 'IntelliJ': 'tools', 'Jira': 'tools', 'Postman': 'tools',
  'Jupyter': 'tools', 'Figma': 'tools', 'Tableau': 'tools', 'Power BI': 'tools',
  'Communication': 'soft', 'Leadership': 'soft', 'Problem Solving': 'soft',
  'Teamwork': 'soft', 'Time Management': 'soft', 'Critical Thinking': 'soft',
  'Adaptability': 'soft', 'Creativity': 'soft', 'Collaboration': 'soft',
  'Project Management': 'soft', 'Mentoring': 'soft',
};
