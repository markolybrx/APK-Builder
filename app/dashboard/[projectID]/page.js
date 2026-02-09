import { clientPromise } from "@/lib/db";
import { ObjectId } from "mongodb";
import WorkspaceUI from "./WorkspaceUI"; // <--- Importing your UI

export default async function ProjectEditor({ params }) {
  const { id } = params;

  // 1. Fetch Project directly from DB (Safe Mode)
  let project = null;
  try {
    const client = await clientPromise;
    const db = client.db();
    if (ObjectId.isValid(id)) {
        // Fetch project and convert ObjectId to string to prevent serialization errors
        const rawProject = await db.collection("projects").findOne({ _id: new ObjectId(id) });
        if (rawProject) {
            project = {
                ...rawProject,
                _id: rawProject._id.toString(),
                userId: rawProject.userId.toString(),
                // Ensure dates are strings
                createdAt: rawProject.createdAt?.toISOString(),
                updatedAt: rawProject.updatedAt?.toISOString(),
            };
        }
    }
  } catch (error) {
    console.error("DB Error:", error);
  }

  // 2. If no project found, show error
  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1>Project Not Found</h1>
      </div>
    );
  }

  // 3. Render your Beautiful UI with Real Data
  return <WorkspaceUI project={project} />;
}