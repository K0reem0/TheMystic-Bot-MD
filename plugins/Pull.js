import { execSync } from 'child_process'

let handler = async (m, { conn }) => {
  try {
    // Set the GitHub username and repository
    const GITHUB_USERNAME = 'aurtherle';  // GitHub username
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;  // GitHub personal access token from environment variables
    const GITHUB_REPO = 'TheMystic-Bot-MD';  // Repository name

    // Ensure the token is set
    if (!GITHUB_TOKEN) {
      return conn.reply(m.chat, 'GitHub token is missing. Please set GITHUB_TOKEN in your environment variables.', m);
    }

    // Set Git username and email for the current repository (required for commits)
    execSync('git config user.name "aurtherle"');
    execSync('git config user.email "hatg4179@gmail.com"');

    // Pull the latest changes from the GitHub repository
    const remoteUrl = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;
    const pullOutput = execSync(`git pull ${remoteUrl} master`);  // Use 'main' if your default branch is 'main'

    // Get the commit history since the last pull
    const logOutput = execSync('git log --oneline -n 5');  // Show the last 5 commits (adjust as needed)

    // Compile all the information (no file changes)
    const response = `
Successfully pulled the latest changes from GitHub!

### Commit History:
\`\`\`
${logOutput.toString()}
\`\`\`

Pull Output:
\`\`\`
${pullOutput.toString()}
\`\`\`
    `;

    // Notify the user with the pull details
    conn.reply(m.chat, response, m);
  } catch (e) {
    // Handle errors and notify the user
    conn.reply(m.chat, 'Error pulling changes from GitHub: ' + e.message, m);
  }
}

handler.help = ['pull']
handler.tags = ['owner']
handler.command = ['pull', 'تحديث']
handler.rowner = true

export default handler;
