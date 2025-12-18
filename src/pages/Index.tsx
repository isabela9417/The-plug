import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResumeData } from '@/hooks/useResumeData';
import { useDailyLimit } from '@/hooks/useDailyLimit';
import { PersonalInfoForm } from '@/components/resume/PersonalInfoForm';
import { ExperienceForm } from '@/components/resume/ExperienceForm';
import { EducationForm } from '@/components/resume/EducationForm';
import { SkillsForm } from '@/components/resume/SkillsForm';
import { ProjectsForm } from '@/components/resume/ProjectsForm';
import { TargetJobForm } from '@/components/resume/TargetJobForm';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ATSChecker } from '@/components/resume/ATSChecker';
import { JobMatchingAnalysis } from '@/components/resume/JobMatchingAnalysis';
import { toast } from 'sonner';
import { 
  Plug, 
  User, 
  Briefcase, 
  GraduationCap, 
  Zap, 
  FolderGit2, 
  Target,
  Eye,
  CheckSquare,
  Sparkles,
  ArrowRight,
  LayoutTemplate,
  Search
} from 'lucide-react';

const Index = () => {
  const {
    resumeData,
    settings,
    setSettings,
    updatePersonalInfo,
    updateExperiences,
    updateEducation,
    updateSkills,
    updateProjects,
    updateTargetJob,
    updateTargetIndustry,
  } = useResumeData();

  const { canGenerate, remaining, incrementUsage, dailyLimit } = useDailyLimit();
  const [activeTab, setActiveTab] = useState('target');
  const [showPreview, setShowPreview] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [jobMatchScore, setJobMatchScore] = useState<number | null>(null);

  const tabs = [
    { id: 'target', label: 'Target Job', icon: Target },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'ats', label: 'ATS Check', icon: CheckSquare },
    { id: 'jobmatch', label: 'Job Match', icon: Search },
  ];

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);
  const nextTab = tabs[currentTabIndex + 1];
  const prevTab = tabs[currentTabIndex - 1];

  const handleComplete = () => {
    if (!canGenerate) {
      toast.error(`Daily limit reached! You can generate ${dailyLimit} CVs per day. Try again tomorrow.`);
      return;
    }
    if (jobMatchScore === null || jobMatchScore < 50) {
      toast.error('Please complete Job Match analysis and achieve at least 50% score to download your CV.');
      return;
    }
    incrementUsage();
    setShowPreview(true);
    toast.success(`CV completed! You have ${remaining - 1} generations remaining today.`);
  };

  const canComplete = jobMatchScore !== null && jobMatchScore >= 50;

  // Landing page
  if (showLanding) {
    return (
      <div className="min-h-screen gradient-hero">
        <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowLanding(true)}>
              <div className="gradient-primary p-2 rounded-lg">
                <Plug className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl">The plug</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Resume Builder</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {remaining}/{dailyLimit} CVs remaining today
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Generation
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">
              Create Your Perfect Resume
              <br />
              <span className="text-accent">in Minutes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Build ATS-friendly resumes with AI-powered content suggestions, 
              multiple professional templates, and real-time optimization tips.
            </p>
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => setShowLanding(false)}
              disabled={!canGenerate}
            >
              {canGenerate ? (
                <>
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                'Daily limit reached - Try tomorrow'
              )}
            </Button>
            {!canGenerate && (
              <p className="text-sm text-destructive mt-4">
                You've used all {dailyLimit} CV generations for today.
              </p>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowLanding(true)}>
            <div className="gradient-primary p-2 rounded-lg">
              <Plug className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl">The plug</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Resume Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {remaining}/{dailyLimit} CVs remaining
            </span>
            <Button
              variant={showPreview ? 'default' : 'outline'}
              onClick={() => setShowPreview(!showPreview)}
              className="hidden md:flex"
            >
              {showPreview ? <LayoutTemplate className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Edit Mode' : 'Preview'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">

        {/* Main Content */}
        <div className={`grid gap-8 ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-4xl mx-auto'}`}>
          {/* Editor Panel */}
          <div className={showPreview ? '' : ''}>
            <Card className="p-6 shadow-card">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-1 mb-6 h-auto p-1 bg-muted/50">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col items-center gap-1 py-2 px-2 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm"
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="target" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Target Position</h3>
                    <p className="text-sm text-muted-foreground">Help us tailor your resume for your dream job</p>
                  </div>
                  <TargetJobForm
                    targetJob={resumeData.targetJob || ''}
                    targetIndustry={resumeData.targetIndustry || ''}
                    onTargetJobChange={updateTargetJob}
                    onTargetIndustryChange={updateTargetIndustry}
                  />
                </TabsContent>

                <TabsContent value="personal" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <p className="text-sm text-muted-foreground">Your contact details and professional summary</p>
                  </div>
                  <PersonalInfoForm
                    data={resumeData.personalInfo}
                    onChange={updatePersonalInfo}
                  />
                </TabsContent>

                <TabsContent value="experience" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    <p className="text-sm text-muted-foreground">Add your professional experience</p>
                  </div>
                  <ExperienceForm
                    data={resumeData.experiences}
                    onChange={updateExperiences}
                  />
                </TabsContent>

                <TabsContent value="education" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <p className="text-sm text-muted-foreground">Your academic background</p>
                  </div>
                  <EducationForm
                    data={resumeData.education}
                    onChange={updateEducation}
                  />
                </TabsContent>

                <TabsContent value="skills" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <p className="text-sm text-muted-foreground">Technical and soft skills</p>
                  </div>
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={updateSkills}
                  />
                </TabsContent>

                <TabsContent value="projects" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Projects</h3>
                    <p className="text-sm text-muted-foreground">Showcase your best work</p>
                  </div>
                  <ProjectsForm
                    data={resumeData.projects}
                    onChange={updateProjects}
                  />
                </TabsContent>

                <TabsContent value="ats" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">ATS Compatibility Check</h3>
                    <p className="text-sm text-muted-foreground">Optimize your resume for applicant tracking systems</p>
                  </div>
                  <ATSChecker data={resumeData} />
                </TabsContent>

                <TabsContent value="jobmatch" className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Job Description Matching</h3>
                    <p className="text-sm text-muted-foreground">Analyze how well your resume matches a specific job posting</p>
                  </div>
                  <JobMatchingAnalysis data={resumeData} onScoreChange={setJobMatchScore} />
                </TabsContent>
              </Tabs>

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => prevTab && setActiveTab(prevTab.id)}
                  disabled={!prevTab}
                >
                  Previous
                </Button>
                <Button
                  variant="accent"
                  onClick={() => {
                    if (nextTab) {
                      setActiveTab(nextTab.id);
                    } else {
                      handleComplete();
                    }
                  }}
                  disabled={!nextTab && !canComplete}
                >
                  {nextTab ? (
                    <>
                      Next: {nextTab.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    'Complete'
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="animate-slide-in-right">
              <Card className="p-6 shadow-card sticky top-24">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">See your resume in real-time</p>
                </div>
                <ResumePreview
                  data={resumeData}
                  settings={settings}
                  onTemplateChange={(template) => setSettings({ ...settings, template })}
                />
              </Card>
            </div>
          )}
        </div>

        {/* Mobile Preview Toggle */}
        <div className="fixed bottom-6 right-6 md:hidden">
          <Button
            variant="hero"
            size="lg"
            onClick={() => setShowPreview(!showPreview)}
            className="rounded-full shadow-lg"
          >
            {showPreview ? <LayoutTemplate className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
