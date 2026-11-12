param([string]$Only = '')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$assetRoot = Join-Path (Split-Path $PSScriptRoot -Parent) 'apps/assets/art-studio'
$sources = Get-Content (Join-Path $assetRoot 'online-sources.json') -Raw | ConvertFrom-Json
foreach ($item in $sources) {
  if ($Only -and $Only -ne $item.id) { continue }
  $download = Join-Path ([IO.Path]::GetTempPath()) ('art-studio-' + $item.id + '-download')
  try {
    Invoke-WebRequest $item.url -OutFile $download -TimeoutSec 60
    $im = [System.Drawing.Image]::FromFile($download)
    $scale = [math]::Min(1.0,1600.0/[math]::Max($im.Width,$im.Height))
    $out = New-Object System.Drawing.Bitmap ([int]($im.Width*$scale)),([int]($im.Height*$scale))
    $g = [System.Drawing.Graphics]::FromImage($out)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($im,0,0,$out.Width,$out.Height)
    $out.Save((Join-Path $assetRoot ($item.id+'.jpg')),[System.Drawing.Imaging.ImageFormat]::Jpeg)
    Write-Output "$($item.id): $($im.Width) x $($im.Height) -> $($out.Width) x $($out.Height)"
    $g.Dispose(); $out.Dispose(); $im.Dispose()
  } catch { Write-Warning "$($item.id): $($_.Exception.Message)" }
  finally { if (Test-Path -LiteralPath $download) { Remove-Item -LiteralPath $download } }
}
$json = Get-Content (Join-Path $assetRoot 'online-sources.json') -Raw
Set-Content (Join-Path $assetRoot 'online-sources.js') -Value ('const IMAGE_SOURCES = ' + $json + ';') -Encoding utf8
