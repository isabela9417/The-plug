import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Experience } from '@/types/resume';
import { Plus, Trash2, Sparkles, Building2, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
  onGenerateDescription?: (experience: Experience) => void;
  isGenerating?: boolean;
}

export function ExperienceForm({ data, onChange, onGenerateDescription, isGenerating }: ExperienceFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(data[0]?.id || null);

  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
    };
    onChange([...data, newExperience]);
    setExpandedId(newExperience.id);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onChange(data.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const removeExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const addAchievement = (expId: string) => {
    const exp = data.find(e => e.id === expId);
    if (exp) {
      updateExperience(expId, { achievements: [...exp.achievements, ''] });
    }
  };

  const updateAchievement = (expId: string, index: number, value: string) => {
    const exp = data.find(e => e.id === expId);
    if (exp) {
      const newAchievements = [...exp.achievements];
      newAchievements[index] = value;
      updateExperience(expId, { achievements: newAchievements });
    }
  };

  const removeAchievement = (expId: string, index: number) => {
    const exp = data.find(e => e.id === expId);
    if (exp && exp.achievements.length > 1) {
      const newAchievements = exp.achievements.filter((_, i) => i !== index);
      updateExperience(expId, { achievements: newAchievements });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {data.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-foreground mb-2">No work experience added</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your professional experience to showcase your career journey</p>
          <Button onClick={addExperience} variant="accent" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      ) : (
        <>
          {data.map((exp, index) => (
            <Card
              key={exp.id}
              className={`p-4 transition-all duration-200 ${expandedId === exp.id ? 'ring-2 ring-accent/20' : ''}`}
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <h4 className="font-medium">
                    {exp.position || 'New Position'} {exp.company && `at ${exp.company}`}
                  </h4>
                  {exp.startDate && (
                    <p className="text-sm text-muted-foreground">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExperience(exp.id);
                  }}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {expandedId === exp.id && (
                <div className="mt-4 space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        placeholder="Software Engineer"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        placeholder="Google"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onCheckedChange={(checked) => 
                            updateExperience(exp.id, { current: checked as boolean, endDate: '' })
                          }
                        />
                        <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
                          I currently work here
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Description</Label>
                      {onGenerateDescription && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onGenerateDescription(exp)}
                          disabled={isGenerating}
                          className="text-accent hover:text-accent/80"
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          {isGenerating ? 'Generating...' : 'AI Enhance'}
                        </Button>
                      )}
                    </div>
                    <Textarea
                      placeholder="Describe your role and responsibilities..."
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Key Achievements</Label>
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex gap-2">
                        <Input
                          placeholder="Increased revenue by 25% through..."
                          value={achievement}
                          onChange={(e) => updateAchievement(exp.id, achIndex, e.target.value)}
                        />
                        {exp.achievements.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAchievement(exp.id, achIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addAchievement(exp.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Achievement
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
          <Button onClick={addExperience} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Experience
          </Button>
        </>
      )}
    </div>
  );
}
