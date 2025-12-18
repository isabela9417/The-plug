import { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';

interface JobMatchingAnalysisProps {
  data: ResumeData;
  onScoreChange?: (score: number) => void;
}

interface MatchResult {
  overallScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export function JobMatchingAnalysis({ data, onScoreChange }: JobMatchingAnalysisProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const extractKeywords = (text: string): string[] => {
    // Common skill/technology keywords to look for
    const commonKeywords = [
      // Tech skills
      'javascript', 'typescript', 'react', 'angular', 'vue', 'node', 'python', 'java', 'c++', 'c#',
      'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
      'git', 'ci/cd', 'agile', 'scrum', 'rest', 'api', 'graphql', 'html', 'css', 'sass',
      // Soft skills
      'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical', 'management',
      'collaboration', 'strategic', 'planning', 'organization', 'presentation',
      // Experience levels
      'senior', 'junior', 'lead', 'principal', 'manager', 'director',
      // Common requirements
      'bachelor', 'master', 'degree', 'certification', 'certified', 'experience', 'years'
    ];

    const words = text.toLowerCase().split(/\W+/);
    const found: string[] = [];
    
    // Find multi-word phrases first
    const phrases = text.toLowerCase();
    const multiWordKeywords = [
      'machine learning', 'data science', 'project management', 'product management',
      'full stack', 'front end', 'back end', 'user experience', 'user interface',
      'continuous integration', 'continuous deployment', 'test driven', 'object oriented'
    ];
    
    multiWordKeywords.forEach(phrase => {
      if (phrases.includes(phrase) && !found.includes(phrase)) {
        found.push(phrase);
      }
    });

    // Find single keywords
    words.forEach(word => {
      if (word.length > 2 && commonKeywords.includes(word) && !found.includes(word)) {
        found.push(word);
      }
    });

    // Also extract capitalized words that might be technologies/tools
    const capitalizedMatches = text.match(/\b[A-Z][a-zA-Z]+(?:\.[a-zA-Z]+)?\b/g) || [];
    capitalizedMatches.forEach(match => {
      const lower = match.toLowerCase();
      if (!found.includes(lower) && lower.length > 2) {
        found.push(lower);
      }
    });

    return [...new Set(found)];
  };

  const getResumeText = (): string => {
    const parts = [
      data.personalInfo.summary,
      data.personalInfo.fullName,
      ...data.experiences.map(exp => `${exp.position} ${exp.company} ${exp.description} ${exp.achievements.join(' ')}`),
      ...data.education.map(edu => `${edu.degree} ${edu.field} ${edu.institution}`),
      ...data.skills.map(skill => skill.name),
      ...data.projects.map(proj => `${proj.name} ${proj.description} ${proj.technologies.join(' ')}`),
    ];
    return parts.join(' ').toLowerCase();
  };

  const analyzeMatch = () => {
    if (!jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay for better UX
    setTimeout(() => {
      const jobKeywords = extractKeywords(jobDescription);
      const resumeText = getResumeText();
      
      const matched: string[] = [];
      const missing: string[] = [];
      
      jobKeywords.forEach(keyword => {
        if (resumeText.includes(keyword)) {
          matched.push(keyword);
        } else {
          missing.push(keyword);
        }
      });
      
      const score = jobKeywords.length > 0 
        ? Math.round((matched.length / jobKeywords.length) * 100)
        : 0;
      
      const suggestions: string[] = [];
      
      if (missing.length > 0) {
        suggestions.push(`Consider adding these keywords to your resume: ${missing.slice(0, 5).join(', ')}`);
      }
      if (score < 50) {
        suggestions.push('Your resume may not be well-aligned with this job. Consider tailoring your experience descriptions.');
      }
      if (data.skills.length < 5) {
        suggestions.push('Add more relevant skills that match the job requirements.');
      }
      if (!data.personalInfo.summary) {
        suggestions.push('Add a professional summary that incorporates key terms from the job description.');
      }
      if (score >= 70) {
        suggestions.push('Great match! Consider emphasizing your most relevant experiences in your summary.');
      }
      
      setMatchResult({
        overallScore: score,
        matchedKeywords: matched,
        missingKeywords: missing,
        suggestions,
      });
      
      onScoreChange?.(score);
      setIsAnalyzing(false);
    }, 800);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Strong Match';
    if (score >= 50) return 'Moderate Match';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Search className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground">Job Description Matching</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Paste a job description to see how well your resume matches the requirements.
              We'll identify matching keywords and suggest improvements.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={6}
          className="resize-none"
        />
        <Button 
          onClick={analyzeMatch} 
          variant="accent" 
          disabled={!jobDescription.trim() || isAnalyzing}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
        </Button>
      </div>

      {matchResult && (
        <div className="space-y-4 animate-fade-in">
          {/* Score */}
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">Match Score</h4>
                <p className={`text-sm ${getScoreColor(matchResult.overallScore)}`}>
                  {getScoreLabel(matchResult.overallScore)}
                </p>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(matchResult.overallScore)}`}>
                {matchResult.overallScore}%
              </div>
            </div>
            <Progress value={matchResult.overallScore} className="h-2" />
          </div>

          {/* Matched Keywords */}
          {matchResult.matchedKeywords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Found in your resume ({matchResult.matchedKeywords.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {matchResult.matchedKeywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {matchResult.missingKeywords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                <XCircle className="w-4 h-4" />
                Missing from your resume ({matchResult.missingKeywords.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingKeywords.slice(0, 15).map((keyword) => (
                  <Badge key={keyword} variant="outline" className="border-amber-300 text-amber-700">
                    {keyword}
                  </Badge>
                ))}
                {matchResult.missingKeywords.length > 15 && (
                  <Badge variant="outline" className="border-muted text-muted-foreground">
                    +{matchResult.missingKeywords.length - 15} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {matchResult.suggestions.length > 0 && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertCircle className="w-4 h-4 text-accent" />
                Suggestions to Improve Your Match
              </div>
              <ul className="space-y-2">
                {matchResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
