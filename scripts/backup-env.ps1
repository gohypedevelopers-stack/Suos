[CmdletBinding()]
param(
  [string]$EnvFile
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Security

if (-not $EnvFile) {
  $EnvFile = Join-Path $PSScriptRoot "..\.env"
}

$resolvedEnvFile = (Resolve-Path -LiteralPath $EnvFile).Path
$contents = [System.IO.File]::ReadAllBytes($resolvedEnvFile)

if ($contents.Length -eq 0) {
  throw "The environment file is empty: $resolvedEnvFile"
}

$text = [System.Text.Encoding]::UTF8.GetString($contents)
$requiredKeys = @("DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL")

foreach ($key in $requiredKeys) {
  if ($text -notmatch "(?m)^$([regex]::Escape($key))=.+$") {
    throw "The environment file is missing a value for $key."
  }
}

$backupDirectory = Join-Path ([Environment]::GetFolderPath("LocalApplicationData")) "SUOS\backups"
$backupFile = Join-Path $backupDirectory "env.dpapi"
$temporaryFile = "$backupFile.tmp"
$entropy = [System.Text.Encoding]::UTF8.GetBytes("SUOS_ENV_BACKUP_V1")

New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null

$encrypted = [System.Security.Cryptography.ProtectedData]::Protect(
  $contents,
  $entropy,
  [System.Security.Cryptography.DataProtectionScope]::CurrentUser
)

[System.IO.File]::WriteAllBytes($temporaryFile, $encrypted)
Move-Item -LiteralPath $temporaryFile -Destination $backupFile -Force

Write-Output "Encrypted environment backup saved to $backupFile"
