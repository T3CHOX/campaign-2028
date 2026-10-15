$tsvPath = "C:\Users\quavo\Downloads\ICPSR_38506-V2 (2)\ICPSR_38506\DS0001\38506-0001-Data.tsv"
$outPath = "c:\Users\quavo\Downloads\campaign-2028-main\campaign-2028-main\counties\county_partisanship_registration.json"

Write-Host "Reading TSV dataset..."
$reader = [System.IO.File]::OpenText($tsvPath)
$header = $reader.ReadLine().Split("`t")

# Headers:
# 0: STCOFIPS10
# 1: YEAR
# 2: REG_VOTERS
# 3: BALLOTS_CAST
# 4: CVAP
# 5: REG_VOTERS_PCT
# 6: VOTER_TURNOUT_PCT
# 7: REG_VOTER_TURNOUT_PCT
# 8: PRES_DEM_VOTES
# 9: PRES_REP_VOTES
# 10: SEN_DEM_VOTES
# 11: SEN_REP_VOTES
# 12: PRES_DEM_RATIO
# 13: PRES_REP_RATIO
# 14: SEN_DEM_RATIO
# 15: SEN_REP_RATIO
# 16: PARTISAN_INDEX_DEM
# 17: PARTISAN_INDEX_REP

$byFips = @{}
while (($line = $reader.ReadLine()) -ne $null) {
    $p = $line.Split("`t")
    $fips = $p[0].Trim().PadLeft(5, '0')
    $year = [int]$p[1]
    
    if (-not $byFips.ContainsKey($fips)) {
        $byFips[$fips] = @{}
    }
    $byFips[$fips][$year] = $p
}
$reader.Close()
Write-Host "Loaded FIPS count: $($byFips.Count)"

# Build output dictionary
$output = @{}

foreach ($fips in $byFips.Keys) {
    $yearsMap = $byFips[$fips]
    
    # Priority for data: 2020 (presidential), fallback 2022, fallback 2018/2016
    $row = $null
    if ($yearsMap.ContainsKey(2020)) { $row = $yearsMap[2020] }
    elseif ($yearsMap.ContainsKey(2022)) { $row = $yearsMap[2022] }
    elseif ($yearsMap.ContainsKey(2018)) { $row = $yearsMap[2018] }
    elseif ($yearsMap.ContainsKey(2016)) { $row = $yearsMap[2016] }
    else {
        # Take latest available
        $availableYears = @($yearsMap.Keys) | Sort-Object -Descending
        if ($availableYears.Count -gt 0) { $row = $yearsMap[$availableYears[0]] }
    }
    
    if ($row -eq $null) { continue }
    
    $regVoters = 0
    if ($row[2].Trim() -ne "") { [int]::TryParse($row[2].Trim(), [ref]$regVoters) | Out-Null }
    
    $ballotsCast = 0
    if ($row[3].Trim() -ne "") { [int]::TryParse($row[3].Trim(), [ref]$ballotsCast) | Out-Null }
    
    $cvap = 0
    if ($row[4].Trim() -ne "") { [int]::TryParse($row[4].Trim(), [ref]$cvap) | Out-Null }
    
    $regVotersPct = 0.0
    if ($row[5].Trim() -ne "") { [double]::TryParse($row[5].Trim(), [ref]$regVotersPct) | Out-Null }
    
    $turnoutPct = 0.0
    if ($row[6].Trim() -ne "") { [double]::TryParse($row[6].Trim(), [ref]$turnoutPct) | Out-Null }
    
    $regTurnoutPct = 0.0
    if ($row[7].Trim() -ne "") { [double]::TryParse($row[7].Trim(), [ref]$regTurnoutPct) | Out-Null }
    
    $partDem = 0.5
    if ($row[16].Trim() -ne "") { [double]::TryParse($row[16].Trim(), [ref]$partDem) | Out-Null }
    elseif ($row[12].Trim() -ne "") { [double]::TryParse($row[12].Trim(), [ref]$partDem) | Out-Null }
    
    $partRep = 0.5
    if ($row[17].Trim() -ne "") { [double]::TryParse($row[17].Trim(), [ref]$partRep) | Out-Null }
    elseif ($row[13].Trim() -ne "") { [double]::TryParse($row[13].Trim(), [ref]$partRep) | Out-Null }
    
    # Normalize partisan index so partDem + partRep = 1.0 (two-party basis)
    $partTotal = $partDem + $partRep
    if ($partTotal -gt 0) {
        $partDem = [Math]::Round($partDem / $partTotal, 4)
        $partRep = [Math]::Round(1.0 - $partDem, 4)
    } else {
        $partDem = 0.5
        $partRep = 0.5
    }
    
    # Model Party Registration Breakdown:
    # Nationally, ~22% of registered voters are Unaffiliated/Independent.
    # In swing/center areas, unaffiliated is ~20-25%.
    # In heavily partisan areas, party registration tracks partisan index strongly.
    $unaffiliatedPct = 0.22
    $twoPartyRegPool = 1.0 - $unaffiliatedPct
    
    $regDemPct = [Math]::Round($twoPartyRegPool * $partDem, 4)
    $regRepPct = [Math]::Round($twoPartyRegPool * $partRep, 4)
    $regUnaffPct = [Math]::Round(1.0 - $regDemPct - $regRepPct, 4)
    
    $regDemCount = [int][Math]::Round($regVoters * $regDemPct)
    $regRepCount = [int][Math]::Round($regVoters * $regRepPct)
    $regUnaffCount = [int][Math]::Round($regVoters * $regUnaffPct)
    
    $output[$fips] = @{
        fips = $fips
        regVoters = $regVoters
        cvap = $cvap
        regVotersPct = [Math]::Round($regVotersPct, 4)
        turnoutPct = [Math]::Round($turnoutPct, 4)
        regTurnoutPct = [Math]::Round($regTurnoutPct, 4)
        partisanIndexDem = $partDem
        partisanIndexRep = $partRep
        regDem = $regDemCount
        regRep = $regRepCount
        regUnaff = $regUnaffCount
        regDemPct = $regDemPct
        regRepPct = $regRepPct
        regUnaffPct = $regUnaffPct
    }
}

Write-Host "Output records: $($output.Count)"

# Also handle Alaska districts and DC wards if needed by copying parent
# DC wards 11002..11008 copy 11001
if ($output.ContainsKey("11001")) {
    $dc = $output["11001"]
    for ($w = 2; $w -le 8; $w++) {
        $wardFips = "1100$w"
        if (-not $output.ContainsKey($wardFips)) {
            $clone = $dc.Clone()
            $clone.fips = $wardFips
            $clone.regVoters = [int]($dc.regVoters / 8)
            $clone.cvap = [int]($dc.cvap / 8)
            $clone.regDem = [int]($dc.regDem / 8)
            $clone.regRep = [int]($dc.regRep / 8)
            $clone.regUnaff = [int]($dc.regUnaff / 8)
            $output[$wardFips] = $clone
        }
    }
}

# Alaska legislative districts 02001..02040
$akAnchorage = $output["02020"]
if ($akAnchorage -ne $null) {
    for ($d = 1; $d -le 40; $d++) {
        $akFips = "02" + $d.ToString().PadLeft(3, '0')
        if (-not $output.ContainsKey($akFips)) {
            $clone = $akAnchorage.Clone()
            $clone.fips = $akFips
            $clone.regVoters = [int]($akAnchorage.regVoters / 10)
            $clone.cvap = [int]($akAnchorage.cvap / 10)
            $clone.regDem = [int]($akAnchorage.regDem / 10)
            $clone.regRep = [int]($akAnchorage.regRep / 10)
            $clone.regUnaff = [int]($akAnchorage.regUnaff / 10)
            $output[$akFips] = $clone
        }
    }
}

$jsonStr = $output | ConvertTo-Json -Compress
[System.IO.File]::WriteAllText($outPath, $jsonStr)
Write-Host "Successfully wrote $outPath (Size: $([System.IO.FileInfo]::new($outPath).Length) bytes)"
