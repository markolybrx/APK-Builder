import { clientPromise } from "@/lib/db";
import { ObjectId } from "mongodb";
import WorkspaceUI from "./WorkspaceUI"; 

export default async function ProjectEditor({ params }) {
  // CRITICAL FIX FOR NEXT.JS 15: params must be awaited!
  const resolvedParams = await params; 
  const id = resolvedParams?.projectId; 

  let project = null;

  try {
    if (id && ObjectId.isValid(id)) {
        const client = await clientPromise;
        const db = client.db();
        const rawProject = await db.collection("projects").findOne({ _id: new ObjectId(id) });
        
        if (rawProject) {
            // DEEP SANITIZATION: Converts Dates and ObjectIds to Strings
            // This prevents "Serialization Error" crashes on the client
            project = JSON.parse(JSON.stringify({
                ...rawProject,
                _id: rawProject._id.toString(),
                userId: rawProject.userId?.toString() || "unknown",
            }));
        }
    }
  } catch (error) {
    console.error("DB Error:", error);
  }

  // FALLBACK DATA (Prevents crash if DB fails)
  if (!project) {
    project = {
      _id: "demo-id",
      name: "Debug Project",
      packageName: "com.debug.app",
      createdAt: new Date().toISOString(), // Must be a string, not a Date object!
      isDemo: true
    };
  }

  return <WorkspaceUI project={project} />;
}