import { ResumeData, ResumeSettings, TemplateType } from '@/types/resume';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileCode, Printer } from 'lucide-react';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

interface ResumePreviewProps {
  data: ResumeData;
  settings: ResumeSettings;
  onTemplateChange: (template: TemplateType) => void;
}

const templates = [
  { id: 'modern' as TemplateType, name: 'Modern', description: 'Clean and minimal' },
  { id: 'classic' as TemplateType, name: 'Classic', description: 'Traditional and formal' },
  { id: 'creative' as TemplateType, name: 'Creative', description: 'Bold and unique' },
];

export function ResumePreview({ data, settings, onTemplateChange }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const renderTemplate = () => {
    switch (settings.template) {
      case 'modern':
        return <ModernTemplate data={data} settings={settings} />;
      case 'classic':
        return <ClassicTemplate data={data} settings={settings} />;
      case 'creative':
        return <CreativeTemplate data={data} settings={settings} />;
      default:
        return <ModernTemplate data={data} settings={settings} />;
    }
  };

  const exportToPDF = async () => {
    if (!resumeRef.current) return;
    
    toast({ title: 'Generating PDF...', description: 'Please wait while we create your resume.' });
    
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter',
      });
      
      const imgWidth = 8.5;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${data.personalInfo.fullName || 'resume'}_resume.pdf`);
      
      toast({ title: 'PDF Downloaded!', description: 'Your resume has been saved.' });
    } catch (error) {
      toast({ title: 'Export Failed', description: 'There was an error generating the PDF.', variant: 'destructive' });
    }
  };

  const exportToHTML = () => {
    if (!resumeRef.current) return;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.personalInfo.fullName || 'Resume'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body>
  ${resumeRef.current.innerHTML}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personalInfo.fullName || 'resume'}_resume.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'HTML Downloaded!', description: 'Your resume has been saved as HTML.' });
  };

  const printResume = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Template Selector */}
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              settings.template === template.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={exportToPDF} variant="accent" size="sm">
          <Download className="w-4 h-4 mr-2" />
          PDF
        </Button>
        <Button onClick={exportToHTML} variant="outline" size="sm">
          <FileCode className="w-4 h-4 mr-2" />
          HTML
        </Button>
        <Button onClick={printResume} variant="outline" size="sm">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Preview */}
      <div 
        className="border rounded-lg overflow-hidden bg-muted/30"
        style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}
      >
        <div ref={resumeRef} className="origin-top scale-[0.7] md:scale-[0.8]" style={{ transformOrigin: 'top center' }}>
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
