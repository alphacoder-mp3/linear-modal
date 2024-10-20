import { useState, useEffect } from 'react';

export const useAIRecommendations = (title: string, description: string) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (title.length < 3 || description.length < 10) return;

      setLoading(true);
      try {
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });

        if (response.ok) {
          const data = await response.json();
          setRecommendations(data);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchRecommendations, 500);
    return () => clearTimeout(debounce);
  }, [title, description]);

  return { recommendations, loading };
};
