import { execSync } from 'child_process';

let handler = async (m, { conn }) => {
  try {
    const GITHUB_USERNAME = 'aurtherle'; // GitHub username
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // GitHub personal access token
    const GITHUB_REPO = 'TheMystic-Bot-MD'; // Repository name

    if (!GITHUB_TOKEN) {
      return conn.reply(m.chat, 'GitHub token is missing. Please set GITHUB_TOKEN in your environment variables.', m);
    }

    // Set Git username and email for this repository
    execSync('git config --local user.name "aurtherle"');
    execSync('git config --local user.email "hatg4179@gmail.com"');

    // Form the remote URL
    const remoteUrl = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;

    // Check the status of the repository
    const status = execSync('git status --porcelain');

    if (status.length > 0) {
      const conflictedFiles = status
        .toString()
        .split('\n')
        .filter(line => line.trim() !== '') // Remove empty lines
        .map(line => {
          if (
            line.includes('.npm/') ||
            line.includes('.cache/') ||
            line.includes('tmp/') ||
            line.includes('MysticSession/') ||
            line.includes('npm-debug.log')
          ) {
            return null; // Filter out unwanted files
          }
          return line.trim();
        })
        .filter(Boolean); // Remove null values

      if (conflictedFiles.length > 0) {
        // Stash local changes if any
        execSync('git stash save "Auto-stashing local changes before pull"');
        const conflictMessage = `
### Conflict Detected!
The following files have conflicts or uncommitted changes:

\`\`\`
${conflictedFiles.join('\n')}
\`\`\`

We have automatically stashed your local changes and will proceed with pulling the latest changes from GitHub.
        `;
        conn.reply(m.chat, conflictMessage.trim(), m);
      }
    }

    // Pull the latest changes from GitHub
    let pullOutput;
    try {
      pullOutput = execSync(`git pull ${remoteUrl} master`); // Adjust branch as necessary
    } catch (e) {
      if (e.message.includes('would be overwritten by merge')) {
        return conn.reply(m.chat, 'Your local changes would be overwritten by the merge. Please commit or stash your changes before pulling.', m);
      }
      throw e; // Rethrow other errors
    }

    // Get the latest 5 commits from GitHub
    const logOutput = execSync('git log --oneline -n 5');

    // Restore the stashed changes if any were stashed
    if (conflictedFiles.length > 0) {
      execSync('git stash pop');
    }

    const response = `
Successfully pulled the latest changes from GitHub!

### Commit History:
\`\`\`
${logOutput.toString()}
\`\`\`

### Pull Output:
\`\`\`
${pullOutput.toString()}
\`\`\`
    `;

    conn.reply(m.chat, response.trim(), m);
  } catch (e) {
    conn.reply(m.chat, `Error pulling changes from GitHub: ${e.message}`, m);
  }
};

handler.help = ['pull'];
handler.tags = ['owner'];
handler.command = ['pull', 'تحديث'];
handler.rowner = true;

export default handler;
