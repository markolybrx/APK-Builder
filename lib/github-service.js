import { Octokit } from "@octokit/rest";

// Helper to get a fresh Octokit instance
const getOctokit = () => {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  if (!token) {
    throw new Error("GITHUB_ACCESS_TOKEN is missing in .env.local");
  }
  return new Octokit({ auth: token });
};

export const GitHubService = {
  // 1. Create a Repository
  createRepo: async (name, description) => {
    const octokit = getOctokit();
    try {
      const response = await octokit.repos.createForAuthenticatedUser({
        name: name,
        description: description,
        private: false, // Public repos are easier for APK hosting
        auto_init: true, // Important: Creates a README so the repo isn't empty
      });
      return response.data;
    } catch (error) {
      console.error("GitHub Create Repo Error:", error);
      throw error;
    }
  },

  // 2. Upload Files (Commit)
  // files format: [{ path: 'app/MainActivity.kt', content: '...' }]
  uploadFiles: async (owner, repo, files, message = "AI Generation") => {
    const octokit = getOctokit();
    try {
      // A. Get the SHA of the latest commit on main
      const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: "heads/main",
      });
      const latestCommitSha = refData.object.sha;

      // B. Create Blobs (File Objects)
      const treeItems = await Promise.all(
        files.map(async (file) => {
          const { data: blob } = await octokit.git.createBlob({
            owner,
            repo,
            content: file.content,
            encoding: "utf-8",
          });
          return {
            path: file.path,
            mode: "100644", // standard file mode
            type: "blob",
            sha: blob.sha,
          };
        })
      );

      // C. Create a Tree
      const { data: treeData } = await octokit.git.createTree({
        owner,
        repo,
        base_tree: latestCommitSha,
        tree: treeItems,
      });

      // D. Create the Commit
      const { data: commitData } = await octokit.git.createCommit({
        owner,
        repo,
        message: message,
        tree: treeData.sha,
        parents: [latestCommitSha],
      });

      // E. Update the Reference (Move main pointer)
      await octokit.git.updateRef({
        owner,
        repo,
        ref: "heads/main",
        sha: commitData.sha,
      });

      return commitData;
    } catch (error) {
      console.error("GitHub Upload Error:", error);
      throw error;
    }
  }
};
