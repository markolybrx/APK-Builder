import { clientPromise } from "@/lib/db";
import { ObjectId } from "mongodb";
import WorkspaceUI from "./WorkspaceUI"; 

export default async function ProjectEditor({ params }) {
  // --- 1. NEXT.JS 15 PARAM RESOLUTION ---
  const resolvedParams = await params; 
  const id = resolvedParams?.projectID; // Matched to your exact folder [projectID]

  let project = null;

  try {
    if (id && ObjectId.isValid(id)) {
        const client = await clientPromise;
        const db = client.db();
        const rawProject = await db.collection("projects").findOne({ _id: new ObjectId(id) });

        if (rawProject) {
            // --- 2. DEEP SERIALIZATION ---
            // Ensures _id and userId are strings before hitting the Client Component
            project = JSON.parse(JSON.stringify({
                ...rawProject,
                _id: rawProject._id.toString(),
                userId: rawProject.userId?.toString() || "unknown",
            }));
        }
    }
  } catch (error) {
    console.error("Critical Database Error:", error);
  }

  // --- 3. FAIL-SAFE FALLBACK ---
  // If the database is unreachable or the ID is invalid, provide a Demo Context
  if (!project) {
    project = {
      _id: "demo-id",
      name: "Debug Project",
      packageName: "com.debug.app",
      createdAt: new Date().toISOString(), 
      isDemo: true,
      files: [] // Initialize empty VFS for WorkspaceUI
    };
  }

  return <WorkspaceUI project={project} />;
}
