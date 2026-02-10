import { clientPromise } from "@/lib/db";
import { ObjectId } from "mongodb";
import WorkspaceUI from "./WorkspaceUI"; 

export default async function ProjectEditor({ params }) {
  // FIX 1: Await params (Required for Next.js 15+)
  const resolvedParams = await params; 
  const id = resolvedParams?.projectID; // Ensure folder is named [id], not [projectId]

  let project = null;

  try {
    const client = await clientPromise;
    const db = client.db();

    if (id && ObjectId.isValid(id)) {
        const rawProject = await db.collection("projects").findOne({ _id: new ObjectId(id) });
        
        if (rawProject) {
            // FIX 2: Deep Sanitization
            // This strips any remaining MongoDB objects (like Dates or nested ObjectIds)
            // that cause "Client-side Exception" serialization errors.
            project = JSON.parse(JSON.stringify({
                ...rawProject,
                _id: rawProject._id.toString(),
                userId: rawProject.userId?.toString() || "unknown",
            }));
        }
    }
  } catch (error) {
    console.error("❌ DB/Project Fetch Error:", error);
  }

  // FAILSAFE: Fallback for Invalid IDs, DB Errors, or Null Projects
  if (!project) {
    console.warn(`⚠️ Project "${id}" not found or invalid. Loading Demo Mode.`);
    project = {
      _id: "demo-mode-id",
      userId: "demo-user",
      name: "Untitled App (Demo)",
      packageName: "com.example.demo",
      type: "Android Native",
      description: "Demo Mode Active. Database connection may be failing.",
      createdAt: new Date().toISOString(),
      isDemo: true
    };
  }

  return <WorkspaceUI project={project} />;
}