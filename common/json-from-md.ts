export function extractJsonFromMarkdown(text: string): string {
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  return jsonMatch ? jsonMatch[1] : text;
}
