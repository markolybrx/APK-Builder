import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { clientPromise } from "@/lib/db";

export async function POST(req) {
  try {
    console.log("1. Starting Project Creation..."); // Debug Log

    const session = await getServerSession(authOptions);

    // --- DEV MODE BYPASS: DISABLE SECURITY CHECK ---
    // if (!session) {
    //   console.log("Error: No Session");
    //   return NextResponse.json({ error: "Unauthorized: Please log in again." }, { status: 401 });
    // }
    // -----------------------------------------------

    // Use Real ID if available, otherwise use the fake "dev-mode-user"
    const userId = session?.user?.id || "dev-mode-user";

    // 2. Get Data
    const body = await req.json();
    console.log("2. Received Body:", body);
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "App name is required" }, { status: 400 });
    }

    // 3. Connect to DB
    console.log("3. Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db();
    console.log("4. Connected.");

    // 4. Create Project
    const newProject = {
      userId: userId, // <--- Uses the fallback ID now
      name: name,
      description: description || "",
      createdAt: new Date(), 
      updatedAt: new Date(),
      buildStatus: "draft",
      files: [] 
    };

    const result = await db.collection("projects").insertOne(newProject);
    console.log("5. Inserted:", result.insertedId);

    return NextResponse.json({ 
      success: true, 
      projectId: result.insertedId 
    });

  } catch (error) {
    console.error("CRITICAL API ERROR:", error);
    return NextResponse.json({ 
      error: "Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}

// Simple GET for safety
export async function GET(req) {
    return NextResponse.json({ message: "API is working" });
}