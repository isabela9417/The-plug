import { useState, useEffect } from 'react';

const DAILY_LIMIT = 5;
const STORAGE_KEY = 'cv_daily_usage';

interface DailyUsage {
  date: string;
  count: number;
}

export function useDailyLimit() {
  const [usage, setUsage] = useState<DailyUsage>({ date: '', count: 0 });

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      const parsed: DailyUsage = JSON.parse(stored);
      if (parsed.date === today) {
        setUsage(parsed);
      } else {
        // Reset for new day
        const newUsage = { date: today, count: 0 };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
        setUsage(newUsage);
      }
    } else {
      const newUsage = { date: today, count: 0 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
      setUsage(newUsage);
    }
  }, []);

  const incrementUsage = () => {
    const today = new Date().toDateString();
    const newUsage = { date: today, count: usage.count + 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
    setUsage(newUsage);
    return newUsage.count;
  };

  const canGenerate = usage.count < DAILY_LIMIT;
  const remaining = DAILY_LIMIT - usage.count;

  return { canGenerate, remaining, incrementUsage, dailyLimit: DAILY_LIMIT };
}
