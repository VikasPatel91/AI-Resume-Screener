import dotenv from 'dotenv';
dotenv.config();

export const callOpenRouterLLM = async (resume: string, jobDesc: string) => {
  const prompt = `
Given the following resume and job description:

Resume:
${resume}

Job Description:
${jobDesc}

Extract the following:
1. Key Skills (as a list)
2. Experience Summary
3. Education Details
4. Match Score (0-100)
5. Short Analysis

Return JSON with:
{
  "skills": [...],
  "experience": "...",
  "education": "...",
  "score": 85,
  "analysis": "..."
}
`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // ✅ Use a valid model from OpenRouter
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) throw new Error('No content in LLM response');

    // ✅ Remove backticks and extra text (e.g., ```json ... ```)
    const cleaned = rawContent.replace(/```json|```/g, '').trim();

    return JSON.parse(cleaned); // Convert to JS object
  } catch (error: any) {
    console.error('LLM API error:', error.response?.data || error.message);
    throw new Error('Failed to process resume via LLM');
  }
};
