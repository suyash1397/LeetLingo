import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY  // 2. Instantiate with your key :contentReference[oaicite:11]{index=11}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action !== 'PARAPHRASE') return;

    (async () => {  // 3. Async IIFE for await support :contentReference[oaicite:12]{index=12}
        try {
            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',  // 4. Use the correct model ID :contentReference[oaicite:13]{index=13}
                messages: [
                    {
                        role: 'user',
                        content: `You are an expert Software engineer and a problem solver who ONLY simplifies LeetCode questions into clear, plain English which is intutive, easy to understand, easy to comprehend.

                        ### Instructions
                        - Simplify the following LeetCode question without changing its meaning or losing any detail.
                        - Do NOT provide hints, solutions, or explanations.
                        - Do NOT use technical jargon.
                        - Do NOT add any extra text before or after the simplified question.
                        - Use short, active-voice sentences.
                        - Output ONLY the simplified question in one sentence.
                        - If you cannot preserve the exact meaning, respond exactly: “Cannot simplify.”
                        - Simplify words like lexicographically,non-decreasing,turn-table arrangements, absolute different, minimum of maximums, maximum of minimums, etc.

                        ### Original Question
                        ${message.text}

                        ### Simplified Question
                        `
                    }
                ],
                max_tokens: 1024  // 5. Control the max response length
            });

            const paraphrased = completion.choices?.[0]?.message?.content?.trim() || null;  // 6. Extract the reply :contentReference[oaicite:14]{index=14}
            sendResponse({ paraphrased });

        } catch (err) {
            console.error('Groq SDK error:', err);  // 7. Log any API or network errors :contentReference[oaicite:15]{index=15}
            sendResponse({ paraphrased: null });
        }
    })();

    return true;  // 8. Keep message channel open for async response :contentReference[oaicite:16]{index=16}
});
