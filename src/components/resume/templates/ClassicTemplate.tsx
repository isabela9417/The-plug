import { ResumeData, ResumeSettings } from '@/types/resume';

interface ClassicTemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export function ClassicTemplate({ data, settings }: ClassicTemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data;
  
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div 
      className="resume-template bg-white text-gray-900 p-8 max-w-[8.5in] mx-auto shadow-lg"
      style={{ fontFamily: 'Georgia, Times New Roman, serif', fontSize: settings.fontSize === 'small' ? '10px' : settings.fontSize === 'large' ? '12px' : '11px' }}
    >
      {/* Header */}
      <header className="text-center mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold tracking-wide mb-2" style={{ color: settings.primaryColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-600 mt-1">
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>| {personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 
            className="text-center text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b"
            style={{ color: settings.primaryColor, borderColor: settings.primaryColor }}
          >
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 
            className="text-center text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b"
            style={{ color: settings.primaryColor, borderColor: settings.primaryColor }}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{exp.position}</h3>
                  <span className="text-sm italic text-gray-600">
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="italic text-gray-700">{exp.company}</p>
                {exp.description && (
                  <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                )}
                {exp.achievements.filter(a => a).length > 0 && (
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    {exp.achievements.filter(a => a).map((achievement, i) => (
                      <li key={i} className="text-sm text-gray-700">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 
            className="text-center text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b"
            style={{ color: settings.primaryColor, borderColor: settings.primaryColor }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{edu.institution}</h3>
                  <span className="text-sm italic text-gray-600">
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="italic text-gray-700">
                  {edu.degree} in {edu.field}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 
            className="text-center text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b"
            style={{ color: settings.primaryColor, borderColor: settings.primaryColor }}
          >
            Skills & Competencies
          </h2>
          <div className="space-y-1">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <p key={category} className="text-sm">
                <span className="font-bold">{category}:</span>{' '}
                <span className="text-gray-700">{categorySkills.map(s => s.name).join(' • ')}</span>
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 
            className="text-center text-sm font-bold uppercase tracking-widest mb-3 pb-1 border-b"
            style={{ color: settings.primaryColor, borderColor: settings.primaryColor }}
          >
            Notable Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <h3 className="font-bold">
                  {proj.name}
                  {proj.link && (
                    <span className="font-normal text-sm text-gray-500 ml-2">({proj.link})</span>
                  )}
                </h3>
                <p className="text-sm text-gray-700">{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <p className="text-sm italic text-gray-600 mt-1">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
