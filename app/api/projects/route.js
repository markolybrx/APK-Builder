import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { clientPromise } from "@/lib/db";

export async function POST(req) {
  try {
    // 1. Verify User
    const session = await getServerSession(authOptions);
    if (!session) {
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

    // 4. Create Project Object (WITHOUT GitHub data for now)
    const newProject = {
      userId: session.user.id,
      name: name,
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      buildStatus: "draft",
      // These will be filled later when user clicks "Link GitHub"
      githubRepo: null, 
      githubUrl: null,
      files: [] // Placeholder for file structure
    };

    const result = await db.collection("projects").insertOne(newProject);

    return NextResponse.json({ 
      success: true, 
      projectId: result.insertedId 
    });

  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET Route to fetch projects (Already likely correct, but included for safety)
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();
  
  const projects = await db.collection("projects")
    .find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .toArray();

  return NextResponse.json({ projects });
}