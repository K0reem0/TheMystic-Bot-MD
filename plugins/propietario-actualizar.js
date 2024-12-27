import { execSync } from 'child_process';

const handler = async (m, { conn, text }) => {
  try {
    // Attempt to pull the latest updates from Git
    const stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));
    let messager = stdout.toString();

    // Check the output message
    if (messager.includes('Already up to date.')) {
      messager = 'The repository is already up-to-date.';
    }
    if (messager.includes('Updating')) {
      messager = 'Repository updated successfully:\n' + stdout.toString();
    }

    // Send the response message
    conn.reply(m.chat, messager, m);
  } catch {
    try {
      // Check for any uncommitted changes or conflicts
      const status = execSync('git status --porcelain');
      if (status.length > 0) {
        const conflictedFiles = status
          .toString()
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => {
            if (
              line.includes('.npm/') ||
              line.includes('.cache/') ||
              line.includes('tmp/') ||
              line.includes('MysticSession/') ||
              line.includes('npm-debug.log')
            ) {
              return null;
            }
            return '*→ ' + line.slice(3) + '*';
          })
          .filter(Boolean);

        if (conflictedFiles.length > 0) {
          const errorMessage = `Conflicts or uncommitted changes found:\n\n${conflictedFiles.join('\n')}.*`;
          await conn.reply(m.chat, errorMessage, m);
        }
      }
    } catch (error) {
      console.error(error);
      let errorMessage2 = 'An error occurred while checking the repository status.';
      if (error.message) {
        errorMessage2 += '\n*- Error Message:* ' + error.message;
      }
      await conn.reply(m.chat, errorMessage2, m);
    }
  }
};

handler.command = /^(update|actualizar|gitpull)$/i;
handler.rowner = true;
export default handler;
