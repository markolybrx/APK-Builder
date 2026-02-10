import { clientPromise } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { projectId, files } = await req.json();

    if (!projectId || !files) {
      return NextResponse.json({ error: "Missing Data" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // UPDATE OPERATION
    // We update the 'files' array and the 'updatedAt' timestamp
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(projectId) },
      { 
        $set: { 
          files: files,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true, modified: result.modifiedCount });

  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: "Database Write Failed" }, { status: 500 });
  }
}
