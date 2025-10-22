# 获取所有语言文件夹中的CONTRIBUTING.md文件
$files = Get-ChildItem -Path pages/*/CONTRIBUTING.md

foreach ($file in $files) {
    Write-Host "Processing: $($file.FullName)"
    
    # 读取文件内容为字符串
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # 简单直接的方法：找到第一个# 开头的行作为标题
    # 然后找到包含"language"或"语言"的行，并移除它以及可能的空行
    $titleMatch = [regex]::Match($content, "^#.*$", [System.Text.RegularExpressions.RegexOptions]::Multiline)
    
    if ($titleMatch.Success) {
        $title = $titleMatch.Value
        $restContent = $content.Substring($titleMatch.Index + $titleMatch.Length)
        
        # 移除包含语言链接的行和后面的空行
        $cleanContent = $restContent -replace "^.*?(language|语言).*?$(\r\n)?", ""
        
        # 重新组合标题和干净的内容
        $newContent = $title + "\r\n\r\n" + $cleanContent.TrimStart()
        
        # 写回文件
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        Write-Host "Updated: $($file.FullName)"
    }
}