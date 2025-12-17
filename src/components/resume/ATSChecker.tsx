import { ResumeData } from '@/types/resume';
import { CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ATSCheckerProps {
  data: ResumeData;
}

interface CheckResult {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
}

export function ATSChecker({ data }: ATSCheckerProps) {
  const checks: CheckResult[] = [];
  
  // Contact information check
  const hasEmail = !!data.personalInfo.email;
  const hasPhone = !!data.personalInfo.phone;
  const hasLocation = !!data.personalInfo.location;
  
  checks.push({
    name: 'Contact Information',
    status: hasEmail && hasPhone && hasLocation ? 'pass' : hasEmail || hasPhone ? 'warning' : 'fail',
    message: hasEmail && hasPhone && hasLocation 
      ? 'Complete contact information provided'
      : 'Add email, phone, and location for better ATS parsing',
  });

  // Professional summary check
  const summaryLength = data.personalInfo.summary?.length || 0;
  checks.push({
    name: 'Professional Summary',
    status: summaryLength > 100 ? 'pass' : summaryLength > 0 ? 'warning' : 'fail',
    message: summaryLength > 100 
      ? 'Good summary length' 
      : summaryLength > 0 
        ? 'Summary is too short (aim for 100+ characters)'
        : 'Add a professional summary',
  });

  // Work experience check
  const hasExperience = data.experiences.length > 0;
  const hasAchievements = data.experiences.some(exp => exp.achievements.filter(a => a).length > 0);
  checks.push({
    name: 'Work Experience',
    status: hasExperience && hasAchievements ? 'pass' : hasExperience ? 'warning' : 'fail',
    message: hasExperience && hasAchievements
      ? 'Experience with achievements included'
      : hasExperience
        ? 'Add achievements to your experience entries'
        : 'Add work experience',
  });

  // Education check
  checks.push({
    name: 'Education',
    status: data.education.length > 0 ? 'pass' : 'warning',
    message: data.education.length > 0 
      ? 'Education section complete'
      : 'Consider adding education details',
  });

  // Skills check
  const skillsCount = data.skills.length;
  checks.push({
    name: 'Skills Section',
    status: skillsCount >= 5 ? 'pass' : skillsCount > 0 ? 'warning' : 'fail',
    message: skillsCount >= 5
      ? `${skillsCount} skills listed`
      : skillsCount > 0
        ? 'Add more skills (aim for 5+)'
        : 'Add relevant skills',
  });

  // Action verbs check (simplified)
  const descriptions = data.experiences.map(exp => exp.description).join(' ');
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'improved', 'increased', 'reduced', 'implemented', 'designed', 'built', 'achieved', 'delivered'];
  const hasActionVerbs = actionVerbs.some(verb => descriptions.toLowerCase().includes(verb));
  checks.push({
    name: 'Action Verbs',
    status: hasActionVerbs ? 'pass' : 'warning',
    message: hasActionVerbs
      ? 'Good use of action verbs'
      : 'Use strong action verbs (led, managed, developed, etc.)',
  });

  // Calculate score
  const passCount = checks.filter(c => c.status === 'pass').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const score = Math.round(((passCount * 1 + warningCount * 0.5) / checks.length) * 100);

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-destructive';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">ATS Compatibility Score</h3>
            <p className="text-sm text-muted-foreground">How well your resume will perform with ATS systems</p>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor()}`}>
            {score}%
          </div>
        </div>
        <Progress value={score} className="h-2" />
      </div>

      <div className="space-y-2">
        {checks.map((check, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
          >
            {getStatusIcon(check.status)}
            <div className="flex-1">
              <p className="font-medium text-sm">{check.name}</p>
              <p className="text-xs text-muted-foreground">{check.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <h4 className="font-medium text-sm">Tips for ATS Optimization</h4>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
              <li>Use standard section headings (Experience, Education, Skills)</li>
              <li>Include keywords from the job description</li>
              <li>Avoid graphics, tables, and complex formatting</li>
              <li>Use standard fonts and simple bullet points</li>
              <li>Save as PDF for best compatibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
