import { execSync } from 'child_process';

let handler = async (m, { conn }) => {
  try {
    const GITHUB_USERNAME = 'aurtherle';
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = 'TheMystic-Bot-MD';

    if (!GITHUB_TOKEN) {
      return conn.reply(
        m.chat,
        'GitHub token is missing. Please set GITHUB_TOKEN in your environment variables.',
        m
      );
    }

    // Detect the default branch dynamically
    const defaultBranch = execSync(
      'git symbolic-ref refs/remotes/origin/HEAD | sed "s@^refs/remotes/origin/@@g"'
    ).toString().trim();

    // Configure Git username and email for commits
    execSync('git config --local user.name "aurtherle"');
    execSync('git config --local user.email "hatg4179@gmail.com"');

    // Stash uncommitted changes (if any)
    try {
      execSync('git stash');
    } catch (e) {
      // Ignore errors if there are no changes to stash
    }

    // Pull the latest changes
    const remoteUrl = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;
    execSync(`git pull ${remoteUrl} ${defaultBranch}`);

    // Pop the stash only if stash entries exist
    const stashList = execSync('git stash list').toString();
    if (stashList.trim()) {
      execSync('git stash pop');
    }

    // Commit changes to persist
    execSync('git add .');
    execSync('git commit -m "Pulled updates from GitHub"');

    // Respond with commit history
    const logOutput = execSync('git log --oneline -n 5');
    conn.reply(
      m.chat,
      `Updates pulled and committed successfully!\n\nCommit History:\n\`\`\`\n${logOutput.toString()}\n\`\`\``,
      m
    );
  } catch (e) {
    conn.reply(
      m.chat,
      `Error pulling updates from GitHub:\n${e.message}`,
      m
    );
  }
};

handler.help = ['pull'];
handler.tags = ['owner'];
handler.command = ['pull', 'تحديث'];
handler.rowner = true;

export default handler;
