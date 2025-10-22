# 创建备份目录
$backupDir = "c:\Users\who\source\trae\.github\backup"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# 获取所有语言文件夹中的CONTRIBUTING.md文件
$files = Get-ChildItem -Path pages/*/CONTRIBUTING.md

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    
    # 备份原始文件
    $backupPath = Join-Path $backupDir "$($file.Directory.Name)_CONTRIBUTING.md.bak"
    Copy-Item -Path $file.FullName -Destination $backupPath
    Write-Host "  Backup created: $backupPath"
    
    # 读取文件所有行
    $lines = Get-Content -Path $file.FullName -Encoding UTF8
    $newLines = @()
    $skipLines = $false
    
    foreach ($line in $lines) {
        # 检查是否是标题行
        if ($line -match "^#\s*") {
            $newLines += $line
            $skipLines = $false
        }
        # 检查是否是语言链接行
        elseif ($line -match "语言版本" -or $line -match "Other.*language") {
            $skipLines = $true  # 跳过这一行
        }
        # 检查是否是空行并且前一行是语言链接
        elseif ($skipLines -and $line.Trim() -eq "") {
            # 继续跳过空行
            $skipLines = $false  # 空行后重置
        }
        # 正常内容行
        else {
            $newLines += $line
            $skipLines = $false
        }
    }
    
    # 确保至少保留标题和一些内容
    if ($newLines.Count -gt 0) {
        # 写回文件
        $newLines | Set-Content -Path $file.FullName -Encoding UTF8
        Write-Host "  Updated: $($file.FullName)"
    } else {
        # 如果文件为空，恢复备份
        Copy-Item -Path $backupPath -Destination $file.FullName -Force
        Write-Host "  ERROR: File would be empty, restored from backup"
    }
}