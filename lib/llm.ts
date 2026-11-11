export const invoke_llm = async (system_prompt: string, message: string, image?: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey || apiKey === 'your_google_gemini_api_key_here') {
        throw new Error('Google Gemini API key is missing. Please set NEXT_PUBLIC_GOOGLE_API_KEY in your .env.local or hosting provider environment variables.');
    }

    const preferredModel = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const modelsToTry = Array.from(new Set([preferredModel, 'gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-3.5-flash']));

    type ContentPart = 
        | { text: string }
        | { inlineData: { mimeType: string; data: string } };

    const parts: ContentPart[] = [{ text: message }];

    if (image) {
        if (image.includes(',')) {
            const [header, base64Data] = image.split(',');
            const mimeType = header.replace(/^data:/, '').replace(/;base64$/, '') || 'image/jpeg';
            parts.push({
                inlineData: {
                    mimeType,
                    data: base64Data
                }
            });
        } else {
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: image
                }
            });
        }
    }

    const payload = {
        system_instruction: {
            parts: [{ text: system_prompt }]
        },
        contents: [
            {
                parts
            }
        ],
        generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json'
        }
    };

    let lastError: Error | null = null;

    for (const model of modelsToTry) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            const bodyText = await response.text();
            if (!bodyText) {
                lastError = new Error(`Empty response from Gemini API (status ${response.status}).`);
                continue;
            }

            let data: any;
            try {
                data = JSON.parse(bodyText);
            } catch {
                lastError = new Error(`Invalid JSON response from Gemini API (status ${response.status}).`);
                continue;
            }

            if (!response.ok) {
                const errorMsg = data.error?.message || `API request failed with status ${response.status}`;
                console.warn(`Model ${model} failed (${response.status}):`, errorMsg);
                lastError = new Error(`[GoogleGenerativeAI Error]: ${errorMsg}`);
                // If it's a 503 (demand spike) or 404 (model not found), continue to try next fallback model
                continue;
            }

            const candidate = data.candidates?.[0];
            const rawText = candidate?.content?.parts?.[0]?.text;
            if (!rawText || !rawText.trim()) {
                lastError = new Error('No valid response received from Gemini model.');
                continue;
            }

            // Clean markdown code blocks or extract JSON object boundaries safely
            const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            let cleaned = match ? match[1].trim() : rawText.trim();
            const firstBrace = cleaned.indexOf('{');
            const lastBrace = cleaned.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
                cleaned = cleaned.slice(firstBrace, lastBrace + 1);
            }

            // Verify valid JSON before returning so callers never hit Unexpected end of JSON input
            JSON.parse(cleaned);
            return cleaned;
        } catch (err: any) {
            console.warn(`Model ${model} request error:`, err?.message || err);
            lastError = err instanceof Error ? err : new Error(String(err));
        }
    }

    throw lastError || new Error('All Gemini model fallbacks failed.');
};
