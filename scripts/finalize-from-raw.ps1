param(
    [Parameter(Mandatory = $true)]
    [string]$Slug,
    [Parameter(Mandatory = $true)]
    [string]$BaseUrl
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Get-HashString {
    param([string]$Text)
    $sha = [System.Security.Cryptography.SHA1]::Create()
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
        $hash = $sha.ComputeHash($bytes)
        return ([BitConverter]::ToString($hash) -replace '-', '').ToLowerInvariant()
    }
    finally {
        $sha.Dispose()
    }
}

function Safe-FileName {
    param([string]$Name)
    $invalid = [IO.Path]::GetInvalidFileNameChars()
    $safe = -join ($Name.ToCharArray() | ForEach-Object {
        if ($invalid -contains $_) { '_' } else { $_ }
    })
    if ([string]::IsNullOrWhiteSpace($safe)) { return 'file' }
    return $safe
}

function Normalize-Text {
    param([string]$Html)
    if ([string]::IsNullOrWhiteSpace($Html)) { return '' }
    $text = $Html -replace '<script[\s\S]*?</script>', ' '
    $text = $text -replace '<style[\s\S]*?</style>', ' '
    $text = $text -replace '<[^>]+>', ' '
    $text = [System.Net.WebUtility]::HtmlDecode($text)
    $text = $text -replace '\s+', ' '
    return $text.Trim()
}

function Extract-RegexValues {
    param([string]$Text, [string]$Pattern)
    if ([string]::IsNullOrWhiteSpace($Text)) { return @() }
    $m = [regex]::Matches($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    return @($m | ForEach-Object { $_.Value.Trim() } | Where-Object { $_ } | Sort-Object -Unique)
}

function Extract-TagValues {
    param([string]$Html, [string]$Pattern, [string]$GroupName)
    if ([string]::IsNullOrWhiteSpace($Html)) { return @() }
    $m = [regex]::Matches($Html, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    return @($m | ForEach-Object { $_.Groups[$GroupName].Value.Trim() } | Where-Object { $_ } | Sort-Object -Unique)
}

function Get-AbsoluteUrl {
    param([uri]$Base, [string]$Candidate)
    if ([string]::IsNullOrWhiteSpace($Candidate)) { return $null }
    $c = $Candidate.Trim()
    if ($c.StartsWith('#')) { return $null }
    if ($c.StartsWith('javascript:', [System.StringComparison]::OrdinalIgnoreCase)) { return $null }
    if ($c.StartsWith('mailto:', [System.StringComparison]::OrdinalIgnoreCase)) { return $null }
    if ($c.StartsWith('tel:', [System.StringComparison]::OrdinalIgnoreCase)) { return $null }
    try {
        return [uri]::new($Base, $c).AbsoluteUri
    }
    catch {
        return $null
    }
}

function Download-Asset {
    param([string]$AssetUrl, [string]$OutputDir)

    try {
        $u = [uri]$AssetUrl
    }
    catch {
        return $null
    }

    $name = [IO.Path]::GetFileName($u.AbsolutePath)
    if ([string]::IsNullOrWhiteSpace($name)) { $name = 'asset.bin' }
    $name = Safe-FileName -Name $name
    if ([string]::IsNullOrWhiteSpace([IO.Path]::GetExtension($name))) { $name = "$name.bin" }

    $hash = Get-HashString -Text $AssetUrl
    $out = Join-Path $OutputDir ("${hash}_$name")
    if (Test-Path $out) { return $out }

    try {
        Invoke-WebRequest -Uri $AssetUrl -OutFile $out -TimeoutSec 45 | Out-Null
        return $out
    }
    catch {
        if (Test-Path $out) { Remove-Item $out -Force }
        return $null
    }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$customerDir = Join-Path $repoRoot ".customer\$Slug"
$scrapeDir = Join-Path $customerDir 'scrape'
$htmlDir = Join-Path $scrapeDir 'raw-html'
$metaDir = Join-Path $scrapeDir 'metadata'
$imageDir = Join-Path $scrapeDir 'assets\images'
$logoDir = Join-Path $scrapeDir 'assets\logos'
$docDir = Join-Path $scrapeDir 'assets\docs'

New-Item -ItemType Directory -Path $metaDir, $imageDir, $logoDir, $docDir -Force | Out-Null

if (-not (Test-Path $htmlDir)) {
    throw "Raw HTML directory not found: $htmlDir"
}

$baseUri = [uri]$BaseUrl
$baseHost = $baseUri.Host

$allPhones = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
$allEmails = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
$allAddresses = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
$allPrices = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
$allNames = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
$allMottos = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)

$assetUrls = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
$logoUrls = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)

$pageRows = @()
$files = Get-ChildItem -Path $htmlDir -File -Filter '*.html'

foreach ($f in $files) {
    $html = Get-Content -Path $f.FullName -Raw
    $title = ''

    $titleMatch = [regex]::Match($html, '<title[^>]*>(?<v>[\s\S]*?)</title>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($titleMatch.Success) {
        $title = [System.Net.WebUtility]::HtmlDecode($titleMatch.Groups['v'].Value.Trim())
        if (-not [string]::IsNullOrWhiteSpace($title)) {
            [void]$allNames.Add($title)
        }
    }

    $pageRows += [PSCustomObject]@{
        file = $f.Name
        title = $title
    }

    $metaDescriptions = Extract-TagValues -Html $html -Pattern "<meta[^>]+(?:name|property)=[`"'](?:description|og:description)[`"'][^>]*content=[`"'](?<val>[^`"']+)[`"']" -GroupName 'val'
    foreach ($md in $metaDescriptions) {
        if ($md.Length -ge 20) { [void]$allMottos.Add($md) }
    }

    $h1Values = Extract-TagValues -Html $html -Pattern '<h1[^>]*>(?<val>[\s\S]*?)</h1>' -GroupName 'val'
    foreach ($h in $h1Values) {
        $t = Normalize-Text -Html $h
        if ($t.Length -ge 10) { [void]$allMottos.Add($t) }
    }

    $siteNames = Extract-TagValues -Html $html -Pattern "<meta[^>]+property=[`"']og:site_name[`"'][^>]*content=[`"'](?<val>[^`"']+)[`"']" -GroupName 'val'
    foreach ($sn in $siteNames) { [void]$allNames.Add($sn) }

    $plainText = Normalize-Text -Html $html

    foreach ($p in (Extract-RegexValues -Text $plainText -Pattern '(?:\+1[\s\.-]?)?(?:\(?\d{3}\)?[\s\.-]?)\d{3}[\s\.-]?\d{4}')) { [void]$allPhones.Add($p) }
    foreach ($e in (Extract-RegexValues -Text $plainText -Pattern '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}')) { [void]$allEmails.Add($e) }
    foreach ($a in (Extract-RegexValues -Text $plainText -Pattern '\b\d{1,6}\s+[A-Za-z0-9\.\-\s]{2,40}\s(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl|Circle|Cir|Highway|Hwy|Route|Rte)\b(?:,\s*[A-Za-z\.\-\s]+){0,2}\s*,?\s*(?:NY|New York)?\s*\d{5}(?:-\d{4})?')) { [void]$allAddresses.Add($a) }
    foreach ($pr in (Extract-RegexValues -Text $plainText -Pattern '\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?(?:\s?(?:/|per)\s?\w+)?')) { [void]$allPrices.Add($pr) }

    $refs = Extract-TagValues -Html $html -Pattern "(?:href|src)=[`"'](?<val>[^`"'#>]+)[`"']" -GroupName 'val'
    foreach ($r in $refs) {
        $abs = Get-AbsoluteUrl -Base $baseUri -Candidate $r
        if (-not $abs) { continue }
        try {
            $u = [uri]$abs
        }
        catch {
            continue
        }
        if ($u.Host -ine $baseHost) { continue }

        if ($abs -match '\.(?:jpe?g|png|gif|webp|svg|ico)(?:$|\?)') {
            [void]$assetUrls.Add($abs)
            if ($abs -match 'logo|brand|header') { [void]$logoUrls.Add($abs) }
        }
        elseif ($abs -match '\.(?:pdf|docx?|xlsx?|pptx?)(?:$|\?)') {
            [void]$assetUrls.Add($abs)
        }
    }
}

$assetRows = @()
foreach ($a in $assetUrls) {
    $lower = $a.ToLowerInvariant()
    $target = if ($lower -match '\.(?:pdf|docx?|xlsx?|pptx?)(?:$|\?)') { $docDir } else { $imageDir }
    if ($logoUrls.Contains($a)) { $target = $logoDir }

    $saved = Download-Asset -AssetUrl $a -OutputDir $target
    $assetRows += [PSCustomObject]@{
        url = $a
        saved = if ($saved) { [IO.Path]::GetFileName($saved) } else { '' }
        type = if ($target -eq $docDir) { 'doc' } elseif ($target -eq $logoDir) { 'logo' } else { 'image' }
        status = if ($saved) { 'ok' } else { 'error' }
    }
}

$pageRows | Export-Csv -Path (Join-Path $metaDir 'pages-index.csv') -NoTypeInformation -Encoding UTF8
$assetRows | Export-Csv -Path (Join-Path $metaDir 'assets-index.csv') -NoTypeInformation -Encoding UTF8
($assetUrls | Sort-Object) | Set-Content -Path (Join-Path $metaDir 'urls-discovered.txt') -Encoding UTF8

$data = [ordered]@{
    scrapedAtUtc = (Get-Date).ToUniversalTime().ToString('o')
    baseUrl = $BaseUrl
    totalPages = $files.Count
    totalAssets = ($assetRows | Where-Object { $_.status -eq 'ok' }).Count
    phones = @($allPhones | Sort-Object)
    emails = @($allEmails | Sort-Object)
    addresses = @($allAddresses | Sort-Object)
    pricing = @($allPrices | Sort-Object)
    names = @($allNames | Sort-Object)
    mottos_and_taglines = @($allMottos | Sort-Object)
}

($data | ConvertTo-Json -Depth 6) | Set-Content -Path (Join-Path $metaDir 'extracted-data.json') -Encoding UTF8

$summary = @()
$summary += "# Prospect scrape summary: $Slug"
$summary += ""
$summary += "- Base URL: $BaseUrl"
$summary += "- Scraped at (UTC): $($data.scrapedAtUtc)"
$summary += "- Total pages captured: $($data.totalPages)"
$summary += "- Total assets downloaded: $($data.totalAssets)"
$summary += ""
$summary += "## Phones"
$summary += @($data.phones | ForEach-Object { "- $_" })
$summary += ""
$summary += "## Emails"
$summary += @($data.emails | ForEach-Object { "- $_" })
$summary += ""
$summary += "## Addresses"
$summary += @($data.addresses | ForEach-Object { "- $_" })
$summary += ""
$summary += "## Pricing"
$summary += @($data.pricing | ForEach-Object { "- $_" })
$summary += ""
$summary += "## Names"
$summary += @($data.names | ForEach-Object { "- $_" })
$summary += ""
$summary += "## Mottos / Taglines"
$summary += @($data.mottos_and_taglines | ForEach-Object { "- $_" })
Set-Content -Path (Join-Path $metaDir 'extracted-summary.md') -Value $summary -Encoding UTF8

Write-Host "Finalized $Slug from raw HTML. Pages: $($data.totalPages), assets: $($data.totalAssets)"
