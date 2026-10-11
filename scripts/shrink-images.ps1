# Shrinks large JPEG/PNG images under huma1301/assets/images to at most 1600 px on the long side
# (JPEG quality 85) so pages load quickly and files stay small enough for git.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/shrink-images.ps1 [-MinKB 700]
param([int]$MinKB = 700, [int]$MaxSide = 1600)
Add-Type -AssemblyName System.Drawing
$dir = Join-Path (Split-Path $PSScriptRoot -Parent) "huma1301\assets\images"
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85L)
Get-ChildItem $dir -File | Where-Object { $_.Extension -match "^\.(jpg|jpeg)$" -and $_.Length -gt ($MinKB * 1KB) } | ForEach-Object {
  $path = $_.FullName
  $before = $_.Length
  $img = [System.Drawing.Image]::FromFile($path)
  $scale = [Math]::Min(1.0, $MaxSide / [Math]::Max($img.Width, $img.Height))
  $w = [int]($img.Width * $scale); $h = [int]($img.Height * $scale)
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $w, $h)
  $g.Dispose(); $img.Dispose()
  $tmp = "$path.tmp"
  $bmp.Save($tmp, $codec, $params); $bmp.Dispose()
  Move-Item -Force $tmp $path
  "{0}: {1:N0} KB -> {2:N0} KB ({3}x{4})" -f $_.Name, ($before / 1KB), ((Get-Item $path).Length / 1KB), $w, $h
}
