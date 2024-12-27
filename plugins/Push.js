import { execSync } from 'child_process';

let handler = async (m, { conn, text }) => {
  try {
    // Set the GitHub username and repository
    const GITHUB_USERNAME = 'aurtherle'; // GitHub username
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub personal access token from environment variables
    const GITHUB_REPO = 'TheMystic-Bot-MD'; // Repository name

    // Ensure the token is set
    if (!GITHUB_TOKEN) {
      return conn.reply(m.chat, 'GitHub token is missing. Please set GITHUB_TOKEN in your environment variables.', m);
    }

    // Set Git username and email for the current repository (required for commits)
    execSync('git config user.name "aurtherle"');
    execSync('git config user.email "hatg4179@gmail.com"');

    // Get the list of all files and filter unwanted files/directories
    const files = execSync('git ls-files --others --modified --exclude-standard').toString().trim().split('\n');
    const filteredFiles = files.filter((file) => {
      if (
        file.includes('.npm/') ||
        file.includes('.cache/') ||
        file.includes('MysticSession/') ||
        file.includes('npm-debug.log') ||
        (file.startsWith('tmp/') && file !== 'tmp/')
      ) {
        return false; // Exclude these files/directories
      }
      return true; // Include all other files
    });

    // Stage only the filtered files
    for (const file of filteredFiles) {
      execSync(`git add "${file}"`);
    }

    // Get the list of staged files
    const stagedFiles = execSync('git diff --cached --name-only').toString();

    if (!stagedFiles) {
      return conn.reply(m.chat, 'No files to push.', m);
    }

    // Commit changes with a default or custom message
    const commitMessage = text || 'Update from bot';
    execSync(`git commit -m "${commitMessage}"`);

    // Push changes to the GitHub repository using the personal access token
    const remoteUrl = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;
    execSync(`git push ${remoteUrl} HEAD`);

    // Get the latest commit details (commit hash and message)
    const logOutput = execSync('git log -1 --oneline').toString();
    const response = `
Successfully pushed the changes to GitHub!

### Commit Details:
\`\`\`
${logOutput.trim()}
\`\`\`

### Files Pushed:
\`\`\`
${stagedFiles.trim()}
\`\`\`
    `;

    // Notify the user with the push details
    conn.reply(m.chat, response, m);
  } catch (e) {
    // Handle errors and notify the user
    conn.reply(m.chat, 'Error pushing changes to GitHub: ' + e.message, m);
  }
};

handler.help = ['push']
handler.tags = ['owner']
handler.command = ['push', 'upload']
handler.rowner = true;

export default handler;