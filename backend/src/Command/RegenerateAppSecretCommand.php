<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'regenerate-app-secret',
    description: 'generate a new APP_SECRET for your app',
)]
class RegenerateAppSecretCommand extends Command
{
    private string $envLocalPath;

    public function __construct()
    {
        parent::__construct();
        $this->envLocalPath = dirname(__DIR__, 2) . '/.env.local';
    }

    protected function configure(): void
    {
        $this
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $characters = '0123456789abcdef';
        $secret = '';
        for ($i = 0; $i < 32; $i++) {
            $secret .= $characters[rand(0, strlen($characters) - 1)];
        }

        if (!file_exists($this->envLocalPath)) {
            $io->error(".env.local file does not exist. Please create it first.");
            return Command::FAILURE;
        }

        $envContent = file_get_contents($this->envLocalPath);
        $newEnvContent = preg_replace(
            '/^APP_SECRET=.*$/m',
            'APP_SECRET=' . $secret,
            $envContent
        );

        if (file_put_contents($this->envLocalPath, $newEnvContent) === false) {
            $io->error("Failed to write to .env.local file.");
            return Command::FAILURE;
        }

        $io->success('New APP_SECRET was generated and saved in .env.local: ' . $secret);

        return Command::SUCCESS;
    }
}
