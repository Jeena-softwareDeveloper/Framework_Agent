import chalk from 'chalk';

export const logger = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✔'), msg),
  warn: (msg) => console.log(chalk.yellow('⚠'), msg),
  error: (msg) => console.log(chalk.red('✖'), msg),
  boss: (msg) => console.log(chalk.magenta('\n🤖 Agent:'), msg),
  money: (msg) => console.log(chalk.yellow.bold('\n💰 [MONEY MODE]:'), msg),
};
