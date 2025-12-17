import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skill } from '@/types/resume';
import { Plus, Trash2, Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
  onSuggestSkills?: () => void;
  isGenerating?: boolean;
}

const SKILL_CATEGORIES = [
  'Technical',
  'Programming',
  'Design',
  'Management',
  'Communication',
  'Languages',
  'Tools',
  'Frameworks',
  'Other',
];

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export function SkillsForm({ data, onChange, onSuggestSkills, isGenerating }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'intermediate' as Skill['level'],
    category: 'Technical',
  });

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    
    const skill: Skill = {
      id: crypto.randomUUID(),
      ...newSkill,
    };
    onChange([...data, skill]);
    setNewSkill({ name: '', level: 'intermediate', category: 'Technical' });
  };

  const removeSkill = (id: string) => {
    onChange(data.filter(skill => skill.id !== id));
  };

  const groupedSkills = data.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'beginner': return 'bg-muted text-muted-foreground';
      case 'intermediate': return 'bg-secondary text-secondary-foreground';
      case 'advanced': return 'bg-primary/10 text-primary';
      case 'expert': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Add New Skill</h4>
          {onSuggestSkills && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSuggestSkills}
              disabled={isGenerating}
              className="text-accent hover:text-accent/80"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {isGenerating ? 'Generating...' : 'AI Suggest'}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 space-y-2">
            <Label>Skill Name</Label>
            <Input
              placeholder="e.g., JavaScript, Project Management"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Select
              value={newSkill.level}
              onValueChange={(value: Skill['level']) => setNewSkill({ ...newSkill, level: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SKILL_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={newSkill.category}
              onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SKILL_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={addSkill} variant="accent" size="sm" disabled={!newSkill.name.trim()}>
          <Plus className="w-4 h-4 mr-1" />
          Add Skill
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <Zap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-foreground mb-2">No skills added yet</h3>
          <p className="text-sm text-muted-foreground">Add your technical and soft skills above</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="outline"
                    className={`${getLevelColor(skill.level)} px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity group`}
                    onClick={() => removeSkill(skill.id)}
                  >
                    {skill.name}
                    <Trash2 className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
