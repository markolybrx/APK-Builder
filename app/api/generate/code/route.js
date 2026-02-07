import { NextResponse } from 'next/server';
import openai from '../../../../lib/openai';

// Force dynamic so it doesn't cache the AI response
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log("Generating code for:", prompt);

    // The Master System Prompt
    const systemPrompt = `
    You are an Expert Android Developer (Kotlin/XML).
    Your task is to generate a fully functional Android App based on the user's request.
    
    CRITICAL OUTPUT RULES:
    1. Output ONLY valid JSON. No markdown, no explanations.
    2. The JSON must be an ARRAY of file objects: [{ "path": "app/...", "content": "..." }]
    3. You MUST include these exact files:
       - app/src/main/AndroidManifest.xml
       - app/build.gradle
       - app/src/main/res/layout/activity_main.xml (The UI)
       - app/src/main/java/com/example/genapp/MainActivity.kt (The Logic)
       - app/src/main/res/values/strings.xml
       - .github/workflows/android.yml (The Build Blueprint)
    
    For the 'android.yml' file, use this content exactly:
    name: Android Build
    on: [push]
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v3
        - name: Set up JDK 17
          uses: actions/setup-java@v3
          with: { java-version: '17', distribution: 'temurin' }
        - name: Build Debug APK
          run: bash ./gradlew assembleDebug
        - name: Upload APK
          uses: actions/upload-artifact@v4
          with: { name: app-debug, path: app/build/outputs/apk/debug/app-debug.apk }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create an android app that: ${prompt}` },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" } 
    });

    // Parse the response
    const rawContent = completion.choices[0].message.content;
    const projectFiles = JSON.parse(rawContent);

    return NextResponse.json({ 
      success: true, 
      files: projectFiles.files || projectFiles 
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}
