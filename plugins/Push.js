import { execSync } from 'child_process'

let handler = async (m, { conn, text }) => {
  try {
    // Set the GitHub username and repository
    const GITHUB_USERNAME = 'aurtherle';  // GitHub username from the URL
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;  // GitHub personal access token from environment variables
    const GITHUB_REPO = 'TheMystic-Bot-MD';  // Repository name from the URL

    // Ensure the token is set
    if (!GITHUB_TOKEN) {
      return conn.reply(m.chat, 'GitHub token is missing. Please set GITHUB_TOKEN in your environment variables.', m);
    }

    // Set Git username and email for the current repository (required for commits)
    execSync('git config user.name "aurtherle"');
    execSync('git config user.email "hatg4179@gmail.com"');

    // Add all local changes to the staging area
    execSync('git add .');

    // Commit changes with a default or custom message
    const commitMessage = text || 'Update from bot';
    execSync(`git commit -m "${commitMessage}"`);

    // Push changes to the GitHub repository using the personal access token
    const remoteUrl = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;
    execSync(`git push ${remoteUrl} HEAD`);

    // Notify the user of the successful push
    conn.reply(m.chat, 'Changes have been successfully pushed to GitHub!', m);
  } catch (e) {
    // Handle errors and notify the user
    conn.reply(m.chat, 'Error pushing changes to GitHub: ' + e.message, m);
  }
}

handler.help = ['push']
handler.tags = ['owner']
handler.command = ['رفع', 'upload']
handler.rowner = true

export default handler;