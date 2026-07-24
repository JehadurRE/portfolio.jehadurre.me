import { useEffect, useState } from 'react';

export function useReadingProgress() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    let ticking = false;

    function updateScrollCompletion() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentProgress = window.scrollY;
          const scrollHeight = document.body.scrollHeight - window.innerHeight;

          if (scrollHeight > 0) {
            setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
          } else {
            setCompletion(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', updateScrollCompletion, { passive: true });

    // Initial call
    updateScrollCompletion();

    return () => {
      window.removeEventListener('scroll', updateScrollCompletion);
    };
  }, []);

  return completion;
}
