import { NextResponse } from 'next/server';
import { GitHubService } from '@/lib/github-service';

export async function POST(req) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Repository name is required' }, { status: 400 });
    }

    const newRepo = await GitHubService.createRepo(name, description || "AI Generated App");

    return NextResponse.json({ 
      success: true, 
      repoUrl: newRepo.html_url,
      repoName: newRepo.full_name
    });

  } catch (error) {
    console.error("Create Repo Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
