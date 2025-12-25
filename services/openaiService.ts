import type { GeneratorInput, GeneratedContent } from "../types";

export async function generateRagebait(input: GeneratorInput): Promise<GeneratedContent> {
  const apiKey = "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";
  
  const prompt = `You are an expert in social media virality and internet psychology. 
Your task is to generate a high-engagement "ragebait" post.

Topic: "${input.topic}"
Platform: ${input.platform}
Heat Level: ${input.heat}

Requirements:
- Create a hook that is either factually slightly incorrect (Cunningham's Law), aggressively gatekeeping, or shares a highly controversial preference.
- The hook must be catchy and look like a genuine post.
- Explain the "Strategy" used.
- Explain the "Psychology" (e.g., why this triggers the 'correction instinct' or 'moral outrage').

SAFETY RULE: Do not generate hate speech, harassment, or illegal content. Keep it to 'safe' controversies (food, tech, lifestyle, opinions).

Return your response as a JSON object with this exact structure:
{
  "hook": "The main text/headline of the post",
  "strategy": "The specific technique used",
  "psychology": "The cognitive trigger explanation"
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert in social media virality and internet psychology. Always return valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response content from OpenAI");
    }

    const parsedContent = JSON.parse(content);
    return parsedContent as GeneratedContent;
    
  } catch (error) {
    console.error("Failed to generate ragebait:", error);
    if (error instanceof Error) {
      throw new Error(`Generation failed: ${error.message}`);
    }
    throw new Error("The AI reasoning failed. Try adjusting the topic.");
  }
}
