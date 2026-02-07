import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import connectDB from '../../../lib/db';
import Project from '../../../models/Project';
import { handler } from '../auth/[...nextauth]/route'; 

export async function POST(req) {
  try {
    const session = await getServerSession(handler);
    
    const { name, description, repoName, repoUrl } = await req.json();
    
    await connectDB();
    
    const newProject = await Project.create({
      userId: "user_123", // Ideally use session.user.id if logged in
      name,
      description,
      githubRepo: repoName,
      githubUrl: repoUrl,
      buildStatus: 'generating_code'
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fetch all projects for the dashboard
export async function GET(req) {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 }); 
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
