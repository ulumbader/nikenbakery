# ─── Script Restore Niken Bakery (Windows / PowerShell) ───
# Mengembalikan database dan uploads dari arsip backup .zip
# Usage: .\scripts\restore.ps1 -BackupFile .\backups\nikenbakery_backup_yyyyMMdd_HHmmss.zip [-Force]

param (
    [Parameter(Mandatory = $true)]
    [string]$BackupFile,
    [string]$DataDir = ".\data",
    [switch]$Force
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $BackupFile)) {
    Write-Error "File backup tidak ditemukan: $BackupFile"
    exit 1
}

if (-not $Force) {
    Write-Host "PERINGATAN: Memulihkan backup akan menimpa data dan file di $DataDir!"
    $confirm = Read-Host "Apakah Anda yakin ingin melanjutkan? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "Pemulihan dibatalkan."
        exit 0
    }
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$emergencyBackup = ".\backups\pre_restore_$timestamp"
Write-Host "Membuat salinan pengaman darurat di $emergencyBackup..."
New-Item -ItemType Directory -Path $emergencyBackup -Force | Out-Null
if (Test-Path $DataDir) {
    Copy-Item -Path "$DataDir\*" -Destination $emergencyBackup -Recurse -Force
}

$tempExtract = ".\backups\tmp_restore_$timestamp"
New-Item -ItemType Directory -Path $tempExtract -Force | Out-Null

try {
    Write-Host "Mengekstrak file backup..."
    Expand-Archive -Path $BackupFile -DestinationPath $tempExtract -Force

    New-Item -ItemType Directory -Path $DataDir -Force | Out-Null

    $extractedDb = Join-Path $tempExtract "nikenbakery.db"
    if (Test-Path $extractedDb) {
        Write-Host "Memulihkan database SQLite..."
        Copy-Item -Path $extractedDb -Destination (Join-Path $DataDir "nikenbakery.db") -Force
        # Hapus wal/shm lama jika ada
        Remove-Item -Path "$DataDir\nikenbakery.db-wal" -ErrorAction SilentlyContinue
        Remove-Item -Path "$DataDir\nikenbakery.db-shm" -ErrorAction SilentlyContinue
    }

    $extractedUploads = Join-Path $tempExtract "uploads"
    if (Test-Path $extractedUploads) {
        Write-Host "Memulihkan folder uploads..."
        Copy-Item -Path "$extractedUploads\*" -Destination "$DataDir\uploads" -Recurse -Force
    }

    Write-Host "Pemulihan data selesai dengan sukses!"
}
finally {
    if (Test-Path $tempExtract) {
        Remove-Item -Path $tempExtract -Recurse -Force
    }
}
