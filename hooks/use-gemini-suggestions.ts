import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractJsonFromMarkdown } from '@/common/json-from-md';

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
);

export function useGeminiSuggestions() {
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [projectSuggestions, setProjectSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!title && !description) return;

      setIsLoading(true);
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `Based on the following task title and description, suggest up to 1 relevant tag and 1 project name strictly only from these following data values: 
                        export const tagsData = [
                        { value: '1', label: 'Bug' },
                        { value: '2', label: 'Feature' },
                        { value: '3', label: 'Improvement' },
                        { value: '4', label: 'Story' },
                        { value: '5', label: 'Refactor' },
                        { value: '6', label: 'Research' },
                        { value: '7', label: 'Epic' },
                        { value: '8', label: 'Blocked' },
                        { value: '9', label: 'Testing' },
                        ];

                        export const projectsData = [
                        { value: '1', label: 'UI' },
                        { value: '2', label: 'BE' },
                        { value: '3', label: 'Cloud' },
                        { value: '4', label: 'Performance' },
                        { value: '5', label: 'Infra' },
                        { value: '6', label: 'Security' },
                        { value: '7', label: 'DevOps' },
                        ];.
                        Task title: "${title}". Task description: "${description}". Format the response as JSON with "tags" and "project" keys. Only send me the label values.`;

        const result = await model.generateContent(prompt);

        const response = result.response;
        const text = response.text();
        const jsonText = extractJsonFromMarkdown(text);
        const suggestions = JSON.parse(jsonText);
        // console.log({ suggestions });

        setTagSuggestions(suggestions.tags || []);
        setProjectSuggestions(suggestions.project || []);
      } catch (error) {
        console.warn('Error fetching suggestions/ parsing the text', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounce);
  }, [title, description]);

  return {
    tagSuggestions,
    projectSuggestions,
    isLoading,
    setTitle,
    setDescription,
  };
}
