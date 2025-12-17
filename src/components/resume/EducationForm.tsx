import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Education } from '@/types/resume';
import { Plus, Trash2, GraduationCap, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(data[0]?.id || null);

  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: [],
    };
    onChange([...data, newEducation]);
    setExpandedId(newEducation.id);
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange(data.map(edu => edu.id === id ? { ...edu, ...updates } : edu));
  };

  const removeEducation = (id: string) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {data.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-foreground mb-2">No education added</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your educational background</p>
          <Button onClick={addEducation} variant="accent" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      ) : (
        <>
          {data.map((edu) => (
            <Card
              key={edu.id}
              className={`p-4 transition-all duration-200 ${expandedId === edu.id ? 'ring-2 ring-accent/20' : ''}`}
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <h4 className="font-medium">
                    {edu.degree || 'New Degree'} {edu.field && `in ${edu.field}`}
                  </h4>
                  {edu.institution && (
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEducation(edu.id);
                  }}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {expandedId === edu.id && (
                <div className="mt-4 space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        placeholder="Harvard University"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input
                        placeholder="Computer Science"
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GPA (optional)</Label>
                      <Input
                        placeholder="3.8"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
          <Button onClick={addEducation} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Education
          </Button>
        </>
      )}
    </div>
  );
}
