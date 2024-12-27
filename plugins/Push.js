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

    // Get all local changes
    const allFiles = execSync('git diff --name-only').toString().trim().split('\n');

    // Filter out files to be ignored
    const filesToStage = allFiles.filter(line => {
      return !(
        line.includes('.npm/') ||
        line.includes('.cache/') ||
        line.includes('tmp/') ||
        line.includes('MysticSession/') ||
        line.includes('npm-debug.log')
      );
    });

    // If no files remain after filtering, exit the process
    if (filesToStage.length === 0) {
      return conn.reply(m.chat, 'No valid files to commit after filtering.', m);
    }

    // Stage the filtered files
    filesToStage.forEach(file => execSync(`git add "${file}"`));

    // Get the list of staged files
    const stagedFiles = execSync('git diff --cached --name-only').toString();

    // Commit changes with a default or custom message
    const commitMessage = text || 'Update from bot';
    execSync(`git commit -m "${commitMessage}"`);

    // Get the latest commit details (commit hash and message)
    const logOutput = execSync('git log -1 --oneline').toString();

    // Compile the information to send back to the user
    const response = `
Successfully staged and committed changes locally!

### Commit Details:
\`\`\`
${logOutput.trim()}
\`\`\`

### Files Staged:
\`\`\`
${stagedFiles.trim()}
\`\`\`
    `;

    // Notify the user with the commit details
    conn.reply(m.chat, response, m);
  } catch (e) {
    // Handle errors and notify the user
    conn.reply(m.chat, 'Error staging or committing changes: ' + e.message, m);
  }
};

handler.help = ['push']
handler.tags = ['owner']
handler.command = ['push', 'upload']
handler.rowner = true;

export default handler;