import { useState, useEffect, useCallback } from 'react';
import { ResumeData, ResumeSettings } from '@/types/resume';

const STORAGE_KEY = 'resumeBuilder_data';
const SETTINGS_KEY = 'resumeBuilder_settings';

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  targetJob: '',
  targetIndustry: '',
};

const defaultSettings: ResumeSettings = {
  template: 'modern',
  primaryColor: '#1e3a5f',
  fontSize: 'medium',
  spacing: 'normal',
};

export function useResumeData() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (typeof window === 'undefined') return defaultResumeData;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultResumeData;
  });

  const [settings, setSettings] = useState<ResumeSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updatePersonalInfo = useCallback((info: Partial<ResumeData['personalInfo']>) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  }, []);

  const updateExperiences = useCallback((experiences: ResumeData['experiences']) => {
    setResumeData(prev => ({ ...prev, experiences }));
  }, []);

  const updateEducation = useCallback((education: ResumeData['education']) => {
    setResumeData(prev => ({ ...prev, education }));
  }, []);

  const updateSkills = useCallback((skills: ResumeData['skills']) => {
    setResumeData(prev => ({ ...prev, skills }));
  }, []);

  const updateProjects = useCallback((projects: ResumeData['projects']) => {
    setResumeData(prev => ({ ...prev, projects }));
  }, []);

  const updateCertifications = useCallback((certifications: ResumeData['certifications']) => {
    setResumeData(prev => ({ ...prev, certifications }));
  }, []);

  const updateTargetJob = useCallback((targetJob: string) => {
    setResumeData(prev => ({ ...prev, targetJob }));
  }, []);

  const updateTargetIndustry = useCallback((targetIndustry: string) => {
    setResumeData(prev => ({ ...prev, targetIndustry }));
  }, []);

  const resetData = useCallback(() => {
    setResumeData(defaultResumeData);
    setSettings(defaultSettings);
  }, []);

  return {
    resumeData,
    settings,
    setSettings,
    updatePersonalInfo,
    updateExperiences,
    updateEducation,
    updateSkills,
    updateProjects,
    updateCertifications,
    updateTargetJob,
    updateTargetIndustry,
    resetData,
  };
}
