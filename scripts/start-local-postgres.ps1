[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$dataDirectory = Join-Path $projectRoot ".local-postgres-data"
$pgCtl = "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe"

if (-not (Test-Path -LiteralPath $dataDirectory)) {
  throw "Local PostgreSQL data directory was not found: $dataDirectory"
}

if (-not (Test-Path -LiteralPath $pgCtl)) {
  throw "PostgreSQL 18 was not found at $pgCtl. Install PostgreSQL 18 or update scripts/start-local-postgres.ps1."
}

& $pgCtl status -D $dataDirectory *> $null
if ($LASTEXITCODE -eq 0) {
  Write-Output "Local PostgreSQL is already running on 127.0.0.1:5433"
  exit 0
}

& $pgCtl start -D $dataDirectory -o "-p 5433 -h 127.0.0.1" -w -t 60
if ($LASTEXITCODE -ne 0) {
  throw "Could not start local PostgreSQL. Check .local-postgres-data/server.log for details."
}

Write-Output "Local PostgreSQL is ready on 127.0.0.1:5433"
