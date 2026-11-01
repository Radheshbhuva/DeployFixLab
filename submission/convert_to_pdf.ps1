$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = "c:\House_of_Growth\DeployFix_Lab-Trial\submission\Complex Engineering Problem - Format.docx"
$pdfPath = "c:\House_of_Growth\DeployFix_Lab-Trial\submission\format_ref.pdf"
try {
    $doc = $word.Documents.Open($docPath)
    $doc.SaveAs([ref]$pdfPath, [ref]17)
    $doc.Close()
    Write-Output "SUCCESS"
} catch {
    Write-Error $_
} finally {
    $word.Quit()
}
