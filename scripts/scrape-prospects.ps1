$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Get-HashString {
    param([string]$Input)
    $sha = [System.Security.Cryptography.SHA1]::Create()
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($Input)
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
    if ([string]::IsNullOrWhiteSpace($safe)) { return 'root' }
    return $safe
}

function Get-AbsoluteUrl {
    param(
        [uri]$Base,
        [string]$Candidate
    )
    if ([string]::IsNullOrWhiteSpace($Candidate)) { return $null }
    try {
        $candidateTrim = $Candidate.Trim()
        if ($candidateTrim.StartsWith('javascript:', [System.StringComparison]::OrdinalIgnoreCase)) { return $null }
        if ($candidateTrim.StartsWith('mailto:', [System.StringComparison]::OrdinalIgnoreCase)) { return $null }
        if ($candidateTrim.StartsWith('tel:', [System.StringComparison]::OrdinalIgnoreCase)) { return $null }
        if ($candidateTrim.StartsWith('#')) { return $null }
        return [uri]::new($Base, $candidateTrim).AbsoluteUri
    }
    catch {
        return $null
    }
}

function Invoke-SafeWebRequest {
    param([string]$Url)
    try {
        return Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 30
    }
    catch {
        return $null
    }
}

function Parse-SitemapUrls {
    param([string[]]$SitemapUrls)

    $seenSitemaps = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    $pageUrls = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    $queue = New-Object 'System.Collections.Generic.Queue[string]'

    foreach ($s in $SitemapUrls) {
        if (-not [string]::IsNullOrWhiteSpace($s) -and $seenSitemaps.Add($s)) {
            $queue.Enqueue($s)
        }
    }

    while ($queue.Count -gt 0) {
        $sitemap = $queue.Dequeue()
        $resp = Invoke-SafeWebRequest -Url $sitemap
        if (-not $resp) { continue }

        try {
            [xml]$xml = $resp.Content
        }
        catch {
            continue
        }

        $locNodes = $xml.SelectNodes('//*[local-name()="loc"]')
        if (-not $locNodes) { continue }

        foreach ($loc in $locNodes) {
            $u = $loc.InnerText.Trim()
            if ([string]::IsNullOrWhiteSpace($u)) { continue }
            if ($u -match '\.xml($|\?)') {
                if ($seenSitemaps.Add($u)) { $queue.Enqueue($u) }
            }
            else {
                [void]$pageUrls.Add($u)
            }
        }
    }

    return @($pageUrls)
}

function Extract-RegexValues {
    param(
        [string]$Text,
        [string]$Pattern
    )
    if ([string]::IsNullOrWhiteSpace($Text)) { return @() }
    $matches = [regex]::Matches($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    return @($matches | ForEach-Object { $_.Value.Trim() } | Where-Object { $_ } | Sort-Object -Unique)
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

function Extract-TagValues {
    param(
        [string]$Html,
        [string]$Pattern,
        [string]$GroupName
    )
    if ([string]::IsNullOrWhiteSpace($Html)) { return @() }
    $matches = [regex]::Matches($Html, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    return @($matches | ForEach-Object { $_.Groups[$GroupName].Value.Trim() } | Where-Object { $_ } | Sort-Object -Unique)
}

function Download-Asset {
    param(
        [string]$AssetUrl,
        [string]$OutputDir
    )

    try {
        $uri = [uri]$AssetUrl
    }
    catch {
        return $null
    }

    $name = [IO.Path]::GetFileName($uri.AbsolutePath)
    if ([string]::IsNullOrWhiteSpace($name)) {
        $name = 'asset'
    }

    $name = Safe-FileName -Name $name
    $ext = [IO.Path]::GetExtension($name)
    if ([string]::IsNullOrWhiteSpace($ext)) {
        $name = "$name.bin"
    }

    $hash = Get-HashString -Input $AssetUrl
    $fileName = "${hash}_$name"
    $outPath = Join-Path $OutputDir $fileName

    if (Test-Path $outPath) {
        return $outPath
    }

    try {
        Invoke-WebRequest -Uri $AssetUrl -OutFile $outPath -TimeoutSec 45 | Out-Null
        return $outPath
    }
    catch {
        if (Test-Path $outPath) { Remove-Item $outPath -Force }
        return $null
    }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$customersRoot = Join-Path $repoRoot '.customer'

$prospects = @(
    @{ Slug = 'potter-perrone'; Domain = 'https://potter-perrone.com/' },
    @{ Slug = 'spencer-heating'; Domain = 'https://www.spencerheating.com/' },
    @{ Slug = 'heatwiser'; Domain = 'https://heatwiser.com/' }
)

foreach ($prospect in $prospects) {
    $slug = $prospect.Slug
    $baseUrl = $prospect.Domain
    $customerDir = Join-Path $customersRoot $slug

    $scrapeDir = Join-Path $customerDir 'scrape'
    $htmlDir = Join-Path $scrapeDir 'raw-html'
    $assetDir = Join-Path $scrapeDir 'assets'
    $imageDir = Join-Path $assetDir 'images'
    $logoDir = Join-Path $assetDir 'logos'
    $docDir = Join-Path $assetDir 'docs'
    $metaDir = Join-Path $scrapeDir 'metadata'

    New-Item -ItemType Directory -Path $customerDir, $scrapeDir, $htmlDir, $assetDir, $imageDir, $logoDir, $docDir, $metaDir -Force | Out-Null

    Write-Host "\n=== Processing $slug ==="

    $baseUri = [uri]$baseUrl
    $baseHost = $baseUri.Host

    $robotsUrl = [uri]::new($baseUri, '/robots.txt').AbsoluteUri
    $sitemapCandidates = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    [void]$sitemapCandidates.Add([uri]::new($baseUri, '/sitemap.xml').AbsoluteUri)

    $robotsResp = Invoke-SafeWebRequest -Url $robotsUrl
    if ($robotsResp) {
        $robotsPath = Join-Path $metaDir 'robots.txt'
        Set-Content -Path $robotsPath -Value $robotsResp.Content -Encoding UTF8

        foreach ($line in ($robotsResp.Content -split "`r?`n")) {
            if ($line -match '^\s*Sitemap\s*:\s*(?<url>\S+)') {
                [void]$sitemapCandidates.Add($Matches.url.Trim())
            }
        }
    }

    $sitemapUrls = Parse-SitemapUrls -SitemapUrls @($sitemapCandidates)

    $toVisit = New-Object 'System.Collections.Generic.Queue[string]'
    $queued = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    $visited = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)

    [void]$queued.Add($baseUrl)
    $toVisit.Enqueue($baseUrl)

    foreach ($u in $sitemapUrls) {
        try {
            $uu = [uri]$u
            if ($uu.Host -ieq $baseHost -and $queued.Add($uu.AbsoluteUri)) {
                $toVisit.Enqueue($uu.AbsoluteUri)
            }
        }
        catch {}
    }

    $maxPages = 500
    $pageRows = @()

    $allPhones = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    $allEmails = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    $allAddresses = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    $allPrices = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    $allNames = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    $allMottos = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)

    $assetUrls = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    $logoCandidateUrls = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)

    while ($toVisit.Count -gt 0 -and $visited.Count -lt $maxPages) {
        $url = $toVisit.Dequeue()
        if (-not $visited.Add($url)) { continue }

        $resp = Invoke-SafeWebRequest -Url $url
        if (-not $resp) {
            $pageRows += [PSCustomObject]@{
                url = $url
                status = 'error'
                title = ''
                file = ''
            }
            continue
        }

        $html = $resp.Content
        if ([string]::IsNullOrWhiteSpace($html)) {
            $pageRows += [PSCustomObject]@{
                url = $url
                status = 'empty'
                title = ''
                file = ''
            }
            continue
        }

        $pageUri = [uri]$url
        $pathPart = $pageUri.AbsolutePath.Trim('/')
        if ([string]::IsNullOrWhiteSpace($pathPart)) { $pathPart = 'home' }
        $pathPart = Safe-FileName -Name (($pathPart -replace '/', '_') -replace '\\', '_')
        $hash = Get-HashString -Input $url
        $htmlFile = "${pathPart}_${hash}.html"
        $htmlPath = Join-Path $htmlDir $htmlFile
        Set-Content -Path $htmlPath -Value $html -Encoding UTF8

        $title = ''
        $titleMatch = [regex]::Match($html, '<title[^>]*>(?<v>[\s\S]*?)</title>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($titleMatch.Success) {
            $title = [System.Net.WebUtility]::HtmlDecode($titleMatch.Groups['v'].Value.Trim())
        }

        $pageRows += [PSCustomObject]@{
            url = $url
            status = 'ok'
            title = $title
            file = $htmlFile
        }

        if (-not [string]::IsNullOrWhiteSpace($title)) {
            [void]$allNames.Add($title)
        }

        $metaDescriptions = Extract-TagValues -Html $html -Pattern "<meta[^>]+(?:name|property)=[`"'](?:description|og:description)[`"'][^>]*content=[`"'](?<val>[^`"']+)[`"']" -GroupName 'val'
        foreach ($md in $metaDescriptions) {
            if ($md.Length -ge 20) { [void]$allMottos.Add($md) }
        }

        $h1Values = Extract-TagValues -Html $html -Pattern '<h1[^>]*>(?<val>[\s\S]*?)</h1>' -GroupName 'val'
        foreach ($h1 in $h1Values) {
            $t = (Normalize-Text -Html $h1)
            if ($t.Length -ge 10) { [void]$allMottos.Add($t) }
        }

        $plainText = Normalize-Text -Html $html

        foreach ($p in (Extract-RegexValues -Text $plainText -Pattern '(?:\+1[\s\.-]?)?(?:\(?\d{3}\)?[\s\.-]?)\d{3}[\s\.-]?\d{4}')) {
            [void]$allPhones.Add($p)
        }

        foreach ($e in (Extract-RegexValues -Text $plainText -Pattern '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}')) {
            [void]$allEmails.Add($e)
        }

        foreach ($a in (Extract-RegexValues -Text $plainText -Pattern '\b\d{1,6}\s+[A-Za-z0-9\.\-\s]{2,40}\s(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl|Circle|Cir|Highway|Hwy|Route|Rte)\b(?:,\s*[A-Za-z\.\-\s]+){0,2}\s*,?\s*(?:NY|New York)?\s*\d{5}(?:-\d{4})?')) {
            [void]$allAddresses.Add($a)
        }

        foreach ($pr in (Extract-RegexValues -Text $plainText -Pattern '\$\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?(?:\s?(?:/|per)\s?\w+)?')) {
            [void]$allPrices.Add($pr)
        }

        $siteNames = Extract-TagValues -Html $html -Pattern "<meta[^>]+property=[`"']og:site_name[`"'][^>]*content=[`"'](?<val>[^`"']+)[`"']" -GroupName 'val'
        foreach ($n in $siteNames) { [void]$allNames.Add($n) }

        $hrefs = Extract-TagValues -Html $html -Pattern "(?:href|src)=[`"'](?<val>[^`"'#>]+)[`"']" -GroupName 'val'

        foreach ($ref in $hrefs) {
            $abs = Get-AbsoluteUrl -Base $pageUri -Candidate $ref
            if (-not $abs) { continue }

            try {
                $absUri = [uri]$abs
            }
            catch {
                continue
            }

            if ($absUri.Host -ieq $baseHost) {
                if ($abs -match '\.(?:jpe?g|png|gif|webp|svg|ico)(?:$|\?)') {
                    [void]$assetUrls.Add($abs)
                    if ($abs -match 'logo|brand|header') { [void]$logoCandidateUrls.Add($abs) }
                }
                elseif ($abs -match '\.(?:pdf|docx?|xlsx?|pptx?)(?:$|\?)') {
                    [void]$assetUrls.Add($abs)
                }
                else {
                    if ($queued.Add($abs)) { $toVisit.Enqueue($abs) }
                }
            }
        }

        $imgTags = [regex]::Matches($html, '<img[^>]*>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        foreach ($img in $imgTags) {
            $tag = $img.Value
            $srcMatch = [regex]::Match($tag, "src=[`"'](?<src>[^`"']+)[`"']", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
            if (-not $srcMatch.Success) { continue }
            $abs = Get-AbsoluteUrl -Base $pageUri -Candidate $srcMatch.Groups['src'].Value
            if (-not $abs) { continue }
            [void]$assetUrls.Add($abs)

            if ($tag -match 'logo' -or $abs -match 'logo|brand|header') {
                [void]$logoCandidateUrls.Add($abs)
            }
        }
    }

    $assetRows = @()
    foreach ($assetUrl in $assetUrls) {
        $lower = $assetUrl.ToLowerInvariant()
        $targetDir = if ($lower -match '\.(?:pdf|docx?|xlsx?|pptx?)(?:$|\?)') { $docDir } else { $imageDir }
        if ($logoCandidateUrls.Contains($assetUrl)) { $targetDir = $logoDir }

        $saved = Download-Asset -AssetUrl $assetUrl -OutputDir $targetDir
        $assetRows += [PSCustomObject]@{
            url = $assetUrl
            saved = if ($saved) { [IO.Path]::GetFileName($saved) } else { '' }
            type = if ($targetDir -eq $docDir) { 'doc' } elseif ($targetDir -eq $logoDir) { 'logo' } else { 'image' }
            status = if ($saved) { 'ok' } else { 'error' }
        }
    }

    $urlsOut = Join-Path $metaDir 'urls-discovered.txt'
    ($pageRows | Select-Object -ExpandProperty url) | Sort-Object -Unique | Set-Content -Path $urlsOut -Encoding UTF8

    $pageCsv = Join-Path $metaDir 'pages-index.csv'
    $pageRows | Export-Csv -Path $pageCsv -NoTypeInformation -Encoding UTF8

    $assetCsv = Join-Path $metaDir 'assets-index.csv'
    $assetRows | Export-Csv -Path $assetCsv -NoTypeInformation -Encoding UTF8

    $data = [ordered]@{
        scrapedAtUtc = (Get-Date).ToUniversalTime().ToString('o')
        baseUrl = $baseUrl
        totalPages = ($pageRows | Where-Object { $_.status -eq 'ok' }).Count
        totalAssets = ($assetRows | Where-Object { $_.status -eq 'ok' }).Count
        phones = @($allPhones | Sort-Object)
        emails = @($allEmails | Sort-Object)
        addresses = @($allAddresses | Sort-Object)
        pricing = @($allPrices | Sort-Object)
        names = @($allNames | Sort-Object)
        mottos_and_taglines = @($allMottos | Sort-Object)
    }

    $jsonPath = Join-Path $metaDir 'extracted-data.json'
    ($data | ConvertTo-Json -Depth 6) | Set-Content -Path $jsonPath -Encoding UTF8

    $summaryPath = Join-Path $metaDir 'extracted-summary.md'
    $summary = @()
    $summary += "# Prospect scrape summary: $slug"
    $summary += ""
    $summary += "- Base URL: $baseUrl"
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
    Set-Content -Path $summaryPath -Value $summary -Encoding UTF8

    Write-Host "Captured pages: $($data.totalPages); assets: $($data.totalAssets)"
}

Write-Host "\nDone. Prospect scrape artifacts are in .customer/<slug>/scrape/."


