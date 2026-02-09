import { clientPromise } from "@/lib/db";
import { ObjectId } from "mongodb";
import WorkspaceUI from "./WorkspaceUI"; 

export default async function ProjectEditor({ params }) {
  const { id } = params;

  let project = null;

  // 1. Try to fetch the real project
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Only attempt query if ID looks valid (24 hex chars)
    if (ObjectId.isValid(id)) {
        const rawProject = await db.collection("projects").findOne({ _id: new ObjectId(id) });
        if (rawProject) {
            project = {
                ...rawProject,
                _id: rawProject._id.toString(),
                userId: rawProject.userId.toString(),
                createdAt: rawProject.createdAt?.toISOString(),
                updatedAt: rawProject.updatedAt?.toISOString(),
            };
        }
    }
  } catch (error) {
    console.error("DB Error:", error);
  }

  // 2. FAILSAFE: If Project is still null (Not Found or DB Error), use Demo Data.
  // This ensures you ALWAYS see the UI.
  if (!project) {
    console.log("Project not found, using Fallback Data");
    project = {
      _id: "demo-mode-id",
      userId: "demo-user",
      name: "Untitled App (Demo)",
      packageName: "com.example.demo",
      description: "Could not fetch real project. Showing demo UI to debug layout.",
      createdAt: new Date().toISOString(),
      isDemo: true // Flag to show a warning banner
    };
  }

  // 3. Render the UI
  return <WorkspaceUI project={project} />;
}
