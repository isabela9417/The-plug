import { ResumeData, ResumeSettings } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar } from 'lucide-react';

interface ModernTemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export function ModernTemplate({ data, settings }: ModernTemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data;
  
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: settings.fontSize === 'small' ? '10px' : settings.fontSize === 'large' ? '12px' : '11px' }}
    >
      {/* Header */}
      <header className="border-b-2 pb-4 mb-6" style={{ borderColor: settings.primaryColor }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: settings.primaryColor }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 uppercase tracking-wide" style={{ color: settings.primaryColor }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide" style={{ color: settings.primaryColor }}>
            Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mt-1 text-sm">{exp.description}</p>
                )}
                {exp.achievements.filter(a => a).length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.achievements.filter(a => a).map((achievement, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="mr-2" style={{ color: settings.primaryColor }}>•</span>
                        {achievement}
                      </li>
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
          <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide" style={{ color: settings.primaryColor }}>
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide" style={{ color: settings.primaryColor }}>
            Skills
          </h2>
          <div className="space-y-2">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="flex flex-wrap items-center gap-x-2">
                <span className="font-medium text-gray-700">{category}:</span>
                <span className="text-gray-600">
                  {categorySkills.map(s => s.name).join(', ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide" style={{ color: settings.primaryColor }}>
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                  {proj.link && (
                    <span className="text-sm text-gray-500">({proj.link})</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Technologies:</span> {proj.technologies.join(', ')}
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
