import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export default function init(projectName) {
  if (!projectName) {
    console.log(chalk.red('❌ Nome do projeto é obrigatório'));
    console.log('Uso: gbit-stakin init <nome-do-projeto>');
    return;
  }

  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red('❌ A pasta já existe'));
    return;
  }

  // Criar pasta
  fs.mkdirSync(projectPath);

  // .env
  fs.writeFileSync(
    path.join(projectPath, '.env'),
`PRIVATE_KEY=
RPC_URL=
STAKING_CONTRACT=
WALLET_ADDRESS=
`
  );

  // .gitignore
  fs.writeFileSync(
    path.join(projectPath, '.gitignore'),
`node_modules
.env
`
  );

  // package.json
  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
JSON.stringify({
  name: projectName,
  private: true,
  scripts: {
    balance: 'gbit-stakin balance',
    stake: 'gbit-stakin stake gbit 100',
    price: 'gbit-stakin price'
  }
}, null, 2)
  );

  console.log(chalk.green('✅ Projeto criado com sucesso!'));
  console.log(chalk.cyan(`📁 Pasta: ${projectName}`));
  console.log(chalk.yellow('➡️ Próximos passos:'));
  console.log(`   cd ${projectName}`);
  console.log('   edite o arquivo .env');
  console.log('   gbit-stakin balance');
}
