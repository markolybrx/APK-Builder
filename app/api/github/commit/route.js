import { NextResponse } from 'next/server';
import { GitHubService } from '../../../../lib/github-service';

export async function POST(req) {
  try {
    // repoName should be "username/project-name"
    const { repoName, files, message } = await req.json();

    if (!repoName || !files) {
      return NextResponse.json({ error: 'Missing repo name or files' }, { status: 400 });
    }

    // Split "username/project-name"
    const [owner, repo] = repoName.split('/');

    await GitHubService.uploadFiles(owner, repo, files, message || "AI Initial Commit");

    return NextResponse.json({ success: true, message: "Code pushed to GitHub!" });

  } catch (error) {
    console.error("Commit Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
