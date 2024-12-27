import { execSync } from 'child_process';
import './config.js'; // Import global configuration

const handler = async (m, { conn, text }) => {
  try {
    // Configure Git identity using global.gitConfig
    execSync(`git config --global user.name "${global.gitConfig.userName}"`);
    execSync(`git config --global user.email "${global.gitConfig.userEmail}"`);

    // Check for uncommitted changes
    const status = execSync('git status --porcelain').toString();
    if (!status.trim()) {
      await conn.reply(m.chat, 'No changes to commit. The working directory is clean.', m);
      return;
    }

    // Stage all changes
    execSync('git add .');

    // Commit changes with a default or custom message
    const commitMessage = text ? text : 'Auto-commit by bot';
    execSync(`git commit -m "${commitMessage}"`);

    // Push changes to the remote repository
    const pushOutput = execSync('git push').toString();

    // Notify the user of success
    await conn.reply(m.chat, `Changes have been pushed successfully:\n\n${pushOutput}`, m);
  } catch (error) {
    console.error(error);
    let errorMessage = 'An error occurred while pushing changes.';
    if (error.message) {
      errorMessage += `\n*- Error Message:* ${error.message}`;
    }
    await conn.reply(m.chat, errorMessage, m);
  }
};

handler.command = /^(push|gitpush)$/i;
handler.rowner = true; // Restrict to owner
export default handler;
