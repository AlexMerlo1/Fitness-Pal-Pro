import { useState, useEffect } from 'react';

const useWindowWidth = (threshold = 1125) => {
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > threshold);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > threshold);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check when component mounts

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [threshold]);

  return isWideScreen;
};

export default useWindowWidth;
