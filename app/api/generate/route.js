import { NextResponse } from 'next/server';

// 1. SYSTEM PROMPT
const SYSTEM_PROMPT = `
You are Visionary AI, an expert Senior Android Engineer.
Your goal is to modify Android XML layouts and Kotlin files based on user commands.

RULES:
1. You MUST return a pure JSON object.
2. The JSON structure must be: { "files": [ { "name": "filename", "content": "file_content" } ], "message": "human_readable_summary" }
3. Always include the FULL content of the file you are modifying.
4. If the user asks for a UI change, update 'activity_main.xml'.
5. If the user asks for logic, update 'MainActivity.kt'.
6. Ensure XML IDs match the Kotlin findViewById calls.
`;

export async function POST(req) {
  try {
    const { messages, projectFiles } = await req.json();
    
    // CRITICAL: Ensure this variable matches what you set in Vercel
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return NextResponse.json({ message: "Server Error: Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const latestUserMessage = messages[messages.length - 1].text;

    // 2. CONTEXT CONSTRUCTION
    const fileContext = projectFiles.map(f => 
      `--- ${f.name} ---\n${f.content}`
    ).join('\n\n');

    const fullPrompt = `${SYSTEM_PROMPT}\n\nCURRENT FILES:\n${fileContext}\n\nUSER COMMAND: ${latestUserMessage}`;

    // 3. CALL GOOGLE GEMINI 2.0 FLASH (STABLE)
    // FIXED: Changed model to 'gemini-2.0-flash' (Stable) instead of 'exp'
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API Error Details:", JSON.stringify(data.error, null, 2));
      throw new Error(`Gemini Error: ${data.error.message}`);
    }

    // 4. PARSE GEMINI RESPONSE
    const rawText = data.candidates[0].content.parts[0].text;
    const aiContent = JSON.parse(rawText);

    return NextResponse.json(aiContent);

  } catch (error) {
    console.error("Backend Handler Error:", error);
    return NextResponse.json(
      { message: "Neural Link disrupted. Check Vercel logs.", error: error.message },
      { status: 500 }
    );
  }
}