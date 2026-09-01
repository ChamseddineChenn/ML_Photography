$ErrorActionPreference = "Stop"
$gh = "$env:TEMP\gh-cli\bin\gh.exe"
if (-not (Test-Path $gh)) {
  Write-Host "GitHub CLI not found. Install from https://cli.github.com/ or re-run the agent setup."
  exit 1
}

& $gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Sign in to GitHub first:"
  & $gh auth login -h github.com -p https -w
}

$repo = "ML_Photography"
& $gh repo view $repo 2>$null
if ($LASTEXITCODE -ne 0) {
  & $gh repo create $repo --private --source=. --remote=origin --push
} else {
  git push -u origin main
}

Write-Host "Done. Repo: https://github.com/$(& $gh api user -q .login)/$repo"
