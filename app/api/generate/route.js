import { NextResponse } from 'next/server';

// 1. SYSTEM PROMPT: THE "MASTER ARCHITECT" PERSONA
const SYSTEM_PROMPT = `
You are Visionary AI, an expert Senior Android Engineer.
Your goal is to modify Android XML layouts and Kotlin files based on user commands.

RULES:
1. You MUST return a pure JSON object. No markdown, no conversational text.
2. The JSON structure must be: { "files": [ { "name": "filename", "content": "file_content" } ], "message": "human_readable_summary" }
3. Always include the FULL content of the file you are modifying. Do not use placeholders like "// ... rest of code".
4. If the user asks for a UI change, update 'activity_main.xml'.
5. If the user asks for logic, update 'MainActivity.kt'.
6. Ensure XML IDs match the Kotlin findViewById calls.
`;

export async function POST(req) {
  try {
    const { messages, projectFiles } = await req.json();
    const latestUserMessage = messages[messages.length - 1].text;

    // 2. CONTEXT CONSTRUCTION
    // We send the current state of the files so the AI knows what to modify.
    const fileContext = projectFiles.map(f => 
      `--- ${f.name} ---\n${f.content}`
    ).join('\n\n');

    // 3. CALL THE LLM (Example using OpenAI structure - compatible with Gemini via adapter)
    // Replace 'YOUR_API_KEY' with process.env.OPENAI_API_KEY or process.env.GEMINI_API_KEY
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview", // Or "gemini-pro" if using Google's API
        response_format: { type: "json_object" }, // Crucial for stability
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `CURRENT FILES:\n${fileContext}\n\nUSER COMMAND: ${latestUserMessage}` }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    // 4. PARSE & RETURN
    const aiContent = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(aiContent);

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { message: "Neural Link disrupted. Please check API keys.", files: [] },
      { status: 500 }
    );
  }
}
