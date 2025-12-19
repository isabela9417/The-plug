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
import { ThemeToggle } from '@/components/ThemeToggle';
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
  Search,
  FileCheck,
  Brain,
  Rocket
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

  const features = [
    {
      icon: FileCheck,
      title: "ATS-Optimized",
      description: "Pass applicant tracking systems with our intelligent formatting and keyword optimization."
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Smart suggestions and content improvements powered by advanced AI technology."
    },
    {
      icon: Rocket,
      title: "Job Matching",
      description: "Analyze how well your resume matches specific job descriptions in real-time."
    }
  ];

  // Landing page
  if (showLanding) {
    return (
      <div className="min-h-screen bg-background">
        {/* Decorative background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

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
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {remaining}/{dailyLimit} CVs remaining
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-16 md:py-24">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6 border border-accent/20">
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Generation
            </div>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
              Create Your Perfect Resume
              <br />
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">in Minutes</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Build ATS-friendly resumes with AI-powered content suggestions, 
              multiple professional templates, and real-time optimization tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => setShowLanding(false)}
                disabled={!canGenerate}
                className="text-lg px-8 py-6 animate-pulse-glow"
              >
                {canGenerate ? (
                  <>
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  'Daily limit reached - Try tomorrow'
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                No signup required • {dailyLimit} free CVs daily
              </p>
            </div>
            {!canGenerate && (
              <p className="text-sm text-destructive mt-4">
                You've used all {dailyLimit} CV generations for today.
              </p>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-24 md:mt-32">
            <h3 className="text-center text-2xl md:text-3xl font-display font-bold mb-12">
              Everything you need to land your dream job
            </h3>
            <div className="grid md:grid-cols-3 gap-6 stagger-children">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all hover:shadow-glow group">
                  <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h4 className="font-display font-semibold text-lg mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 md:mt-32 text-center">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-3xl md:text-4xl font-bold text-accent">3+</div>
                <div className="text-sm text-muted-foreground mt-1">Templates</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl md:text-4xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground mt-1">ATS Compatible</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-3xl md:text-4xl font-bold text-accent">Free</div>
                <div className="text-sm text-muted-foreground mt-1">To Use</div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-24 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2024 The plug. Build your future, one resume at a time.
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
            <ThemeToggle />
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
