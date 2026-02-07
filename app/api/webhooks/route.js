import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';

export async function POST(req) {
  try {
    const payload = await req.json();
    
    // Check if this is a "workflow_run" event (GitHub Actions)
    if (payload.workflow_run) {
      const repoName = payload.repository.full_name;
      const status = payload.workflow_run.status; // "completed"
      const conclusion = payload.workflow_run.conclusion; // "success" or "failure"

      if (status === 'completed') {
        await connectDB();
        
        // Find project by repo name
        const project = await Project.findOne({ githubRepo: repoName });
        
        if (project) {
          project.buildStatus = conclusion === 'success' ? 'success' : 'failed';
          
          if (conclusion === 'success') {
            // Construct the download URL for the artifact
            // Note: In a real app, you need to fetch the artifact URL via API. 
            // For now, we will link to the Actions tab.
            project.latestApkUrl = `${payload.repository.html_url}/actions`;
          }
          
          await project.save();
          console.log(`Updated build status for ${repoName}: ${conclusion}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
