import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Target, Briefcase } from 'lucide-react';

interface TargetJobFormProps {
  targetJob: string;
  targetIndustry: string;
  onTargetJobChange: (value: string) => void;
  onTargetIndustryChange: (value: string) => void;
}

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Sales',
  'Engineering',
  'Design',
  'Legal',
  'Consulting',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Hospitality',
  'Non-profit',
  'Government',
  'Other',
];

export function TargetJobForm({ targetJob, targetIndustry, onTargetJobChange, onTargetIndustryChange }: TargetJobFormProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground">Optimize for Your Target Role</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tell us about your target job and industry. Our AI will tailor your resume content, 
              suggest relevant keywords, and optimize for ATS systems in your field.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="targetJob" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            Target Job Title
          </Label>
          <Input
            id="targetJob"
            placeholder="e.g., Senior Software Engineer"
            value={targetJob}
            onChange={(e) => onTargetJobChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter the specific job title you are applying for
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetIndustry" className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            Target Industry
          </Label>
          <Select value={targetIndustry} onValueChange={onTargetIndustryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            This helps optimize keywords for your field
          </p>
        </div>
      </div>
    </div>
  );
}
