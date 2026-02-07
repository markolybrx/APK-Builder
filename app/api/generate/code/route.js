import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// CRITICAL: This allows the AI to run for up to 60 seconds (Vercel Pro/Hobby limits)
export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    // 1. Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Get User Prompt
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log("Generating code with Gemini for:", prompt);

    // 3. Define the System Prompt
    const systemInstruction = `
    You are an Expert Android Developer (Kotlin/XML).
    Your task is to generate a fully functional Android App based on the user's request.
    
    CRITICAL OUTPUT RULES:
    1. Output ONLY valid JSON. No markdown (no \`\`\`json), no explanations.
    2. The JSON structure MUST be exactly this:
       {
         "files": [
            { "path": "app/src/main/AndroidManifest.xml", "content": "..." },
            { "path": "app/build.gradle", "content": "..." }
         ]
       }
    3. You MUST include these exact files:
       - app/src/main/AndroidManifest.xml
       - app/build.gradle (Module level)
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

    // 4. Configure the Model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    // 5. Generate Content
    const result = await model.generateContent(`Create an android app that: ${prompt}`);
    const responseText = result.response.text();

    // 6. Parse and Validate
    let projectFiles;
    try {
        projectFiles = JSON.parse(responseText);
    } catch (e) {
        console.error("Failed to parse Gemini JSON:", responseText);
        throw new Error("AI returned invalid JSON");
    }

    // Handle "files" array structure
    const filesArray = projectFiles.files || projectFiles;

    return NextResponse.json({ 
      success: true, 
      files: filesArray 
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: 'Failed to generate code: ' + error.message }, { status: 500 });
  }
}
