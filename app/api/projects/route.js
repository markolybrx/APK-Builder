import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Import authOptions, NOT handler
import clientPromise from "@/lib/db";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Find projects belonging to this user
    const projects = await db.collection("projects")
      .find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
