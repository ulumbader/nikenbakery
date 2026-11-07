# ─── Script Backup Niken Bakery (Windows / PowerShell) ───
# Menghasilkan arsip bertanggal nikenbakery_backup_yyyyMMdd_HHmmss.zip
# berisi database SQLite (salinan konsisten WAL) dan folder uploads.

param (
    [string]$BackupDir = ".\backups",
    [string]$DataDir = ".\data",
    [string]$DbPath = ".\data\nikenbakery.db",
    [string]$UploadsDir = ".\data\uploads"
)

$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$tempDir = Join-Path $BackupDir "tmp_$timestamp"
$archiveName = "nikenbakery_backup_$timestamp.zip"
$archivePath = Join-Path $BackupDir $archiveName

Write-Host "[Niken Bakery] Memulai proses backup..."

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

try {
    # 1. Buat salinan konsisten SQLite menggunakan helper node (aman WAL mode)
    if (Test-Path $DbPath) {
        Write-Host "Menyalin database SQLite..."
        $tempDb = Join-Path $tempDir "nikenbakery.db"
        & node scripts/sqlite-backup.js "$tempDb"
    } else {
        Write-Host "Database tidak ditemukan di $DbPath, lewati."
    }

    # 2. Salin folder uploads jika ada
    if (Test-Path $UploadsDir) {
        Write-Host "Menyalin file media upload..."
        $tempUploads = Join-Path $tempDir "uploads"
        Copy-Item -Path $UploadsDir -Destination $tempUploads -Recurse
    } else {
        New-Item -ItemType Directory -Path (Join-Path $tempDir "uploads") | Out-Null
    }

    # 3. Arsipkan ke ZIP
    Write-Host "Mengompresi ke $archivePath..."
    Compress-Archive -Path "$tempDir\*" -DestinationPath $archivePath -Force

    $fileSize = (Get-Item $archivePath).Length / 1KB
    $roundedSize = [math]::Round($fileSize, 2)
    Write-Host "Backup selesai dengan sukses!"
    Write-Host "Lokasi: $archivePath ($roundedSize KB)"
}
finally {
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force
    }
}
