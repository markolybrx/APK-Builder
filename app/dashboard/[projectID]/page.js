import { clientPromise } from "@/lib/db";
import { ObjectId } from "mongodb";
import WorkspaceUI from "./WorkspaceUI"; 

export default async function ProjectEditor({ params }) {
  // 1. Await params (Required for Next.js 15)
  const resolvedParams = await params; 
  
  // 2. CRITICAL FIX: Match the folder name [projectId]
  const id = resolvedParams?.projectId; 

  let project = null;

  try {
    const client = await clientPromise;
    const db = client.db();

    if (id && ObjectId.isValid(id)) {
        const rawProject = await db.collection("projects").findOne({ _id: new ObjectId(id) });
        
        if (rawProject) {
            // 3. SANITIZATION: Convert all MongoDB objects to strings
            // This prevents "Serialization Error" crashes in the client
            project = JSON.parse(JSON.stringify({
                ...rawProject,
                _id: rawProject._id.toString(),
                userId: rawProject.userId?.toString() || "unknown",
            }));
        }
    }
  } catch (error) {
    console.error("❌ DB Error:", error);
  }

  // 4. FAILSAFE: If no project found (or ID invalid), load Demo Mode
  // This ensures the UI always loads instead of crashing
  if (!project) {
    project = {
      _id: "demo-id",
      name: "Untitled Project",
      type: "Android Native",
      packageName: "com.example.app",
      createdAt: new Date().toISOString(),
      isDemo: true
    };
  }

  return <WorkspaceUI project={project} />;
}