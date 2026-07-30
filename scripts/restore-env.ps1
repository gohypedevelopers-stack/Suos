[CmdletBinding()]
param(
  [string]$EnvFile,
  [switch]$Force
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Security

if (-not $EnvFile) {
  $EnvFile = Join-Path $PSScriptRoot "..\.env"
}

$backupFile = Join-Path ([Environment]::GetFolderPath("LocalApplicationData")) "SUOS\backups\env.dpapi"
$targetFile = [System.IO.Path]::GetFullPath($EnvFile)

if (-not (Test-Path -LiteralPath $backupFile)) {
  throw "No encrypted environment backup exists at $backupFile"
}

if ((Test-Path -LiteralPath $targetFile) -and -not $Force) {
  throw "$targetFile already exists. Use npm run env:restore -- -Force to overwrite it."
}

$entropy = [System.Text.Encoding]::UTF8.GetBytes("SUOS_ENV_BACKUP_V1")
$encrypted = [System.IO.File]::ReadAllBytes($backupFile)
$contents = [System.Security.Cryptography.ProtectedData]::Unprotect(
  $encrypted,
  $entropy,
  [System.Security.Cryptography.DataProtectionScope]::CurrentUser
)

$text = [System.Text.Encoding]::UTF8.GetString($contents)
$requiredKeys = @("DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL")

foreach ($key in $requiredKeys) {
  if ($text -notmatch "(?m)^$([regex]::Escape($key))=.+$") {
    throw "The backup is missing a value for $key."
  }
}

$targetDirectory = Split-Path -Parent $targetFile
$temporaryFile = Join-Path $targetDirectory ".env.restore.tmp"

[System.IO.File]::WriteAllBytes($temporaryFile, $contents)
Move-Item -LiteralPath $temporaryFile -Destination $targetFile -Force

Write-Output "Environment file restored to $targetFile"
