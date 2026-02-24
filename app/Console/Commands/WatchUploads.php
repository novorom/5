<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class WatchUploads extends Command
{
    protected $signature = 'uploads:watch {directory=storage/uploads : Directory to watch}';
    protected $description = 'Watch a directory for new Excel files and automatically import them';

    public function handle()
    {
        $directory = base_path($this->argument('directory'));

        if (!File::isDirectory($directory)) {
            $this->info("Directory {$directory} does not exist. Creating it.");
            File::makeDirectory($directory, 0755, true);
        }

        $this->info("Started watching directory: {$directory}");
        $this->info("Place .xlsx or .xls files in this directory to auto-import");
        $this->info("Press Ctrl+C to stop");

        $processedFiles = [];

        while (true) {
            $files = File::files($directory);

            foreach ($files as $file) {
                if (!in_array($file->getPathname(), $processedFiles)) {
                    $extension = $file->getExtension();

                    if (in_array($extension, ['xlsx', 'xls'])) {
                        $this->info("Processing new file: {$file->getFilename()}");

                        try {
                            // Process the file
                            $this->call('products:import', [
                                '--file' => $file->getPathname()
                            ]);

                            $processedFiles[] = $file->getPathname();

                            // Move processed file to avoid re-processing
                            $processedDir = dirname($file->getPathname()) . '/processed';
                            if (!File::isDirectory($processedDir)) {
                                File::makeDirectory($processedDir, 0755, true);
                            }

                            File::move(
                                $file->getPathname(),
                                $processedDir . '/' . $file->getFilename()
                            );

                            $this->info("Successfully processed and moved to: {$processedDir}");

                            // Log success
                            Log::info('Auto-imported file: ' . $file->getFilename());
                        } catch (\Exception $e) {
                            $this->error("Failed to process {$file->getFilename()}: " . $e->getMessage());
                            Log::error('Auto-import failed for: ' . $file->getFilename() . ' - ' . $e->getMessage());
                        }
                    }
                }
            }

            // Clean old processed files (older than 30 days)
            $this->cleanupOldFiles($directory . '/processed', 30);

            sleep(5); // Check every 5 seconds
        }
    }

    protected function cleanupOldFiles($directory, $days = 30)
    {
        if (!File::isDirectory($directory)) {
            return;
        }

        $files = File::files($directory);
        $cutoff = now()->subDays($days)->timestamp;

        foreach ($files as $file) {
            if ($file->getCTime() < $cutoff) {
                File::delete($file->getPathname());
            }
        }
    }
}