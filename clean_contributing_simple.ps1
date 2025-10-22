# 简单方法：手动处理每个CONTRIBUTING.md文件

# 先恢复CN文件，因为它被清空了
$cnFile = "pages/CN/CONTRIBUTING.md"
$cnContent = @"
# 贡献

作为贡献者，您同意：

- 贡献者可以根据需要调整开源协议，使其更加严格或宽松。
- 您贡献的代码可用于商业用途，包括但不限于其云业务运营。

请注意，参与本项目时，您需要遵守我们的[行为准则](CODE_OF_CONDUCT.md)。

## 创建拉取请求
我们始终欢迎提交拉取请求 (PR)，即使它们只包含拼写错误或几行代码等小修复。如果需要大量工作，请将其记录为问题 (Issue)，并在开始工作之前进行讨论。

请将拉取请求 (PR) 分解成小的变更。包含大量功能和代码变更的拉取请求 (PR) 可能难以审核。建议以增量方式提交拉取请求 (PR)。

注意：如果您将拉取请求 (PR) 分解成小的变更，请确保提交到主分支 (main) 的任何变更都不会破坏任何功能。否则，在功能完成之前，这些变更将无法合并。

## 报告问题
报告问题是贡献代码的好方法。我们始终欢迎撰写完整、内容良好的错误报告！请提交一个问题并按照模板填写所需信息。

提交任何问题之前，请先查看现有问题，以避免提交重复内容。

如果您找到匹配的问题，可以"订阅"该问题以获取更新通知。如果您有关于该问题的其他有用信息，请发表评论。

报告问题时，请务必包含以下信息：

* 您使用的版本。
* 问题重现步骤。
* 快照或日志文件（如有需要）

由于这些问题是公开的，因此提交文件时，请务必删除所有敏感信息，例如用户名、密码、IP 地址和公司名称。您可以
将这些部分替换为"REDACTED"或其他字符串，例如"****"。

## 贡献奖励
我们鼓励大家参与贡献，可留下您的波场钱包地址（至少一次），我们会在每个周期（一个月或一个季度）评估您的贡献程度，针对积极参与者发放Fair代币等作为奖励。
"@

Set-Content -Path $cnFile -Value $cnContent -Encoding UTF8
Write-Host "已恢复: $cnFile"

# 简单方法：为其他语言文件夹创建新的CONTRIBUTING.md文件，只包含标题和基本结构
$languages = @("AR", "EN", "ES", "FR", "HI", "JA", "KO", "RU", "TH", "VI")

foreach ($lang in $languages) {
    $filePath = "pages/$lang/CONTRIBUTING.md"
    
    if (Test-Path $filePath) {
        # 读取原始文件内容
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        
        # 提取标题行
        $title = "# Contributing"
        if ($content -match "^(#[^\r\n]*)\r\n") {
            $title = $matches[1]
        }
        
        # 移除包含语言链接的部分
        $cleanContent = $content -replace "$title\r\n\s*\*?\*?.*?(language|语言).*?\r\n\s*", "$title\r\n\r\n"
        
        # 写回文件
        Set-Content -Path $filePath -Value $cleanContent -Encoding UTF8
        Write-Host "已更新: $filePath"
    }
}