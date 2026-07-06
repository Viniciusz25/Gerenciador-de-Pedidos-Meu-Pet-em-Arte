$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$logFile = Join-Path $root "server.log"
$port = 4174
$address = [System.Net.IPAddress]::Parse("127.0.0.1")
$server = [System.Net.Sockets.TcpListener]::new($address, $port)
$server.Start()
Add-Content -LiteralPath $logFile -Value "$(Get-Date -Format s) started on http://127.0.0.1:$port/"

$types = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png" = "image/png"
  ".ico" = "image/x-icon"
}

function Send-Response($stream, [int]$status, [string]$statusText, [string]$contentType, [byte[]]$body) {
  $header = "HTTP/1.1 $status $statusText`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
  $stream.Write($headerBytes, 0, $headerBytes.Length)
  $stream.Write($body, 0, $body.Length)
}

while ($true) {
  try {
    $client = $server.AcceptTcpClient()
  } catch {
    Add-Content -LiteralPath $logFile -Value "$(Get-Date -Format s) accept failed: $($_.Exception.Message)"
    Start-Sleep -Milliseconds 250
    continue
  }
  try {
    $stream = $client.GetStream()
    $buffer = New-Object byte[] 8192
    $read = $stream.Read($buffer, 0, $buffer.Length)
    $request = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $read)
    $firstLine = ($request -split "`r?`n")[0]
    $parts = $firstLine -split " "
    $urlPath = if ($parts.Length -ge 2) { $parts[1].Split("?")[0] } else { "/" }
    $path = [Uri]::UnescapeDataString($urlPath.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }

    $file = [System.IO.Path]::GetFullPath((Join-Path $root $path))
    $rootFull = [System.IO.Path]::GetFullPath($root)

    if (-not $file.StartsWith($rootFull)) {
      Send-Response $stream 403 "Forbidden" "text/plain; charset=utf-8" ([System.Text.Encoding]::UTF8.GetBytes("Forbidden"))
    } elseif (-not (Test-Path -LiteralPath $file -PathType Leaf)) {
      Send-Response $stream 404 "Not Found" "text/plain; charset=utf-8" ([System.Text.Encoding]::UTF8.GetBytes("Not found"))
    } else {
      $extension = [System.IO.Path]::GetExtension($file).ToLowerInvariant()
      $contentType = if ($types.ContainsKey($extension)) { $types[$extension] } else { "application/octet-stream" }
      Send-Response $stream 200 "OK" $contentType ([System.IO.File]::ReadAllBytes($file))
    }
  } catch {
    Add-Content -LiteralPath $logFile -Value "$(Get-Date -Format s) request failed: $($_.Exception.Message)"
    try {
      Send-Response $stream 500 "Internal Server Error" "text/plain; charset=utf-8" ([System.Text.Encoding]::UTF8.GetBytes($_.Exception.Message))
    } catch {}
  } finally {
    $client.Close()
  }
}
