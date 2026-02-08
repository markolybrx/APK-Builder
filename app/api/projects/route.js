import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// FIX: Use absolute path '@/' to avoid relative path errors
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { clientPromise } from "@/lib/db";

export async function POST(req) {
  try {
    // 1. Verify User
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error("API Error: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get Data
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "App name is required" }, { status: 400 });
    }

    // 3. Connect to DB
    const client = await clientPromise;
    const db = client.db();

    // 4. Create Project
    const newProject = {
      userId: session.user.id,
      name: name,
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      buildStatus: "draft",
      githubRepo: null, 
      githubUrl: null,
      files: [] 
    };

    const result = await db.collection("projects").insertOne(newProject);

    return NextResponse.json({ 
      success: true, 
      projectId: result.insertedId 
    });

  } catch (error) {
    // FIX: Log the actual error to Vercel logs
    console.error("Project creation CRITICAL error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

// GET Route
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db();
    
    const projects = await db.collection("projects")
      .find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
