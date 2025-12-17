import { ResumeData, ResumeSettings } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface CreativeTemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export function CreativeTemplate({ data, settings }: CreativeTemplateProps) {
  const { personalInfo, experiences, education, skills, projects } = data;
  
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    return `${month}/${year}`;
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const getLevelWidth = (level: string) => {
    switch (level) {
      case 'beginner': return '25%';
      case 'intermediate': return '50%';
      case 'advanced': return '75%';
      case 'expert': return '100%';
      default: return '50%';
    }
  };

  return (
    <div 
      className="resume-template bg-white text-gray-900 max-w-[8.5in] mx-auto shadow-lg flex"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: settings.fontSize === 'small' ? '10px' : settings.fontSize === 'large' ? '12px' : '11px' }}
    >
      {/* Sidebar */}
      <aside 
        className="w-1/3 p-6 text-white"
        style={{ backgroundColor: settings.primaryColor }}
      >
        {/* Profile */}
        <div className="mb-8">
          <div 
            className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
          >
            {personalInfo.fullName?.split(' ').map(n => n[0]).join('') || 'YN'}
          </div>
          <h1 className="text-xl font-bold text-center">{personalInfo.fullName || 'Your Name'}</h1>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-white/30 pb-2">
            Contact
          </h2>
          <div className="space-y-2 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-3 h-3" />
                <span className="break-all">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                <span className="break-all">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-white/30 pb-2">
              Skills
            </h2>
            <div className="space-y-3">
              {skills.slice(0, 8).map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{skill.name}</span>
                  </div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{ width: getLevelWidth(skill.level) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-white/30 pb-2">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-white/80">{edu.field}</p>
                  <p className="text-white/60 text-xs">{edu.institution}</p>
                  <p className="text-white/60 text-xs">{formatDate(edu.endDate)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-6">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b-2"
              style={{ color: settings.primaryColor, borderColor: settings.primaryColor }}
            >
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b-2"
              style={{ color: settings.primaryColor, borderColor: settings.primaryColor }}
            >
              Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: settings.primaryColor }}>
                  <div 
                    className="absolute -left-[5px] top-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold" style={{ color: settings.primaryColor }}>{exp.position}</h3>
                      <p className="text-gray-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                  )}
                  {exp.achievements.filter(a => a).length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.achievements.filter(a => a).map((achievement, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="mr-2 font-bold" style={{ color: settings.primaryColor }}>→</span>
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

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 
              className="text-lg font-bold uppercase tracking-wider mb-3 pb-2 border-b-2"
              style={{ color: settings.primaryColor, borderColor: settings.primaryColor }}
            >
              Projects
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {projects.map((proj) => (
                <div 
                  key={proj.id} 
                  className="p-3 rounded-lg border"
                  style={{ borderColor: `${settings.primaryColor}30` }}
                >
                  <h3 className="font-bold text-sm" style={{ color: settings.primaryColor }}>
                    {proj.name}
                  </h3>
                  <p className="text-xs text-gray-700 mt-1">{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
