param (
    [Parameter(Mandatory=$true)]
    [string]$InputDocx,
    [Parameter(Mandatory=$true)]
    [string]$OutputPdf
)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open($InputDocx)
    $doc.SaveAs([ref]$OutputPdf, [ref]17)
    $doc.Close()
    Write-Output "SUCCESS"
} catch {
    Write-Error $_
} finally {
    $word.Quit()
}
