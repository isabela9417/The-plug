import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/resume';
import { Plus, Trash2, FolderGit2, GripVertical, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(data[0]?.id || null);
  const [newTech, setNewTech] = useState<Record<string, string>>({});

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      link: '',
    };
    onChange([...data, newProject]);
    setExpandedId(newProject.id);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange(data.map(proj => proj.id === id ? { ...proj, ...updates } : proj));
  };

  const removeProject = (id: string) => {
    onChange(data.filter(proj => proj.id !== id));
  };

  const addTechnology = (projId: string) => {
    const tech = newTech[projId]?.trim();
    if (!tech) return;
    
    const proj = data.find(p => p.id === projId);
    if (proj && !proj.technologies.includes(tech)) {
      updateProject(projId, { technologies: [...proj.technologies, tech] });
      setNewTech({ ...newTech, [projId]: '' });
    }
  };

  const removeTechnology = (projId: string, tech: string) => {
    const proj = data.find(p => p.id === projId);
    if (proj) {
      updateProject(projId, { technologies: proj.technologies.filter(t => t !== tech) });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {data.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <FolderGit2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-foreground mb-2">No projects added</h3>
          <p className="text-sm text-muted-foreground mb-4">Showcase your best work and side projects</p>
          <Button onClick={addProject} variant="accent" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      ) : (
        <>
          {data.map((proj) => (
            <Card
              key={proj.id}
              className={`p-4 transition-all duration-200 ${expandedId === proj.id ? 'ring-2 ring-accent/20' : ''}`}
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <h4 className="font-medium">{proj.name || 'New Project'}</h4>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {proj.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{proj.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProject(proj.id);
                  }}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {expandedId === proj.id && (
                <div className="mt-4 space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input
                        placeholder="E-commerce Platform"
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Project Link (optional)</Label>
                      <Input
                        placeholder="https://github.com/..."
                        value={proj.link || ''}
                        onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe what you built, the problem it solves, and your role..."
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Technologies Used</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="React, Node.js, PostgreSQL..."
                        value={newTech[proj.id] || ''}
                        onChange={(e) => setNewTech({ ...newTech, [proj.id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && addTechnology(proj.id)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => addTechnology(proj.id)}
                        disabled={!newTech[proj.id]?.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {proj.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive/10 group"
                            onClick={() => removeTechnology(proj.id, tech)}
                          >
                            {tech}
                            <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
          <Button onClick={addProject} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Project
          </Button>
        </>
      )}
    </div>
  );
}
