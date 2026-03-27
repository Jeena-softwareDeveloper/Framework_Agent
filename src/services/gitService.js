
import { exec } from 'child_process';
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';

const execPromise = (command) => new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
        if (error) reject(stderr || error.message);
        else resolve(stdout);
    });
});

export const gitService = {
  async executeMission(command, repoUrl = null) {
    logger.info(`🛠️ Developer Ravi: Git Mission Prompted (${command})`);
    
    try {
      if (command === 'push') {
        const buildRes = await execPromise('npm run build').catch(e => `Build Fail: ${e}`);
        if (buildRes && buildRes.includes('Fail')) {
            logger.warn("❌ Developer Ravi: Build check failed!");
            return `❌ Developer Ravi: Build failed. Ravi won't push broken code Boss! Fix it first.`;
        }
        
        await execPromise('git add .');
        await execPromise('git commit -m "Auto-update by Developer Ravi"').catch(() => "Nothing to commit");
        
        if (repoUrl) {
            const authedUrl = repoUrl.replace('https://', `https://${ENV.GITHUB_TOKEN}@`);
            await execPromise(`git push ${authedUrl} main --force`);
        } else {
            await execPromise('git push origin main');
        }
        
        return "✅ Developer Ravi: Mission Accomplished! Code built, committed, and pushed to GitHub Boss!";
      }
      return "Error: Unknown Git command.";
    } catch (err) {
      logger.error(`❌ Developer Ravi Error: ${err}`);
      return `❌ Developer Ravi: Error during push. Ravi is checking logs... (${err})`;
    }
  }
};
