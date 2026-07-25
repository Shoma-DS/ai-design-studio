$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$profile = Join-Path $projectDir ".chrome-profile"
$preview = Join-Path $projectDir "preview-page.png"
$output = Join-Path $projectDir "banner-final.png"
$pageUrl = "file:///" + ((Join-Path $projectDir "index.html") -replace "\\", "/")

New-Item -ItemType Directory -Force -Path $profile | Out-Null
& $chrome --headless=new --no-sandbox --disable-gpu --disable-crash-reporter --disable-breakpad --hide-scrollbars --force-device-scale-factor=1 "--user-data-dir=$profile" --window-size=952,810 "--screenshot=$preview" $pageUrl

Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Bitmap]::FromFile($preview)
$rect = New-Object System.Drawing.Rectangle(32, 32, 888, 746)
$final = $source.Clone($rect, $source.PixelFormat)
$final.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)
$final.Dispose()
$source.Dispose()

Write-Output "Rendered: $output"
