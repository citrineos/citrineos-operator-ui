import { useEffect, useState } from 'react';

// Custom hook for handling color mode
export function useColorMode(): [string, (mode: 'light' | 'dark') => void] {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedColorMode = localStorage.getItem('colorMode');
    if (storedColorMode === 'light' || storedColorMode === 'dark') {
      setColorMode(storedColorMode);
    }
  }, []);

  const updateColorMode = (mode: 'light' | 'dark') => {
    setColorMode(mode);
    localStorage.setItem('colorMode', mode);
  };

  return [colorMode, updateColorMode];
}
