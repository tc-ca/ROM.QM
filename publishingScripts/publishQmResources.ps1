
#Script Location
$scriptPath = split-path -parent $MyInvocation.MyCommand.Definition
Write-Output "Script Path: $scriptPath"

Get-Content publishingScripts\password.txt | Where-Object {$_.length -gt 0} | Where-Object {!$_.StartsWith("#")} | ForEach-Object {
    $var = $_.Split('=',2).Trim()
    New-Variable -Scope Local -Name $var[0] -Value $var[1]
	Write-Output "$($var[0]) = $($var[1])"
	Write-Output "ConnectionString = $ConnectionStringDev"
}

#Connection String to Environment
# $ConnectionStringDev = "Url=https://xxxxxxxxx.dynamics.com; Username=xxxxxxxxx.onmicrosoft.com; Password=xxxxxxxxxxx; authtype=Office365; RequireNewInstance=True"

#how long we want to wait to realize something broke
$Timeout = 960

#the relative folder path to our build files 
$WebResourceFolderPath = "$scriptPath"

#the json file we will use to map our build files to the unique names of webresources in dynamics
$WebResourceJsonMappingPath = "$scriptPath\webresourceMapping.json"

#Load XrmCIFramework
#$xrmCIToolkit = "C:\Users\Aaron\Google Drive\Work\TDG Core\Source\dyn365-ce-vsts-tasks\BuildTools\Xrm.CI.Framework.BuildTools\Lib\xRMCIFramework\9.0.0\Xrm.Framework.CI.PowerShell.Cmdlets.dll"
$xrmCIToolkit = "$scriptPath\Xrm.Framework.CI.PowerShell.Cmdlets.dll"

Write-Output "Importing CIToolkit: $xrmCIToolkit" 
Import-Module $xrmCIToolkit
Write-Output "Imported CIToolkit"

$json = Get-Content -Raw -Path $WebResourceJsonMappingPath | ConvertFrom-Json

Write-Output $json

$json | ForEach-Object {
    $_.files | ForEach-Object {
	    $WebResourcePath = [System.Uri]::UnescapeDataString([System.IO.Path]::Combine($WebResourceFolderPath, $_.file))
	    Write-Output "Updating Web Resource: $WebResourcePath"   
	    Set-XrmWebResource -Path $WebResourcePath -UniqueName $_.uniquename -Publish $False -ConnectionString $ConnectionStringDev -Timeout $Timeout -Verbose
	    Write-Output "Updated Web Resource"
    }
}

Write-Output "Publishing All Customizations"
Publish-XrmCustomizations -ConnectionString $ConnectionStringDev -Timeout $Timeout
Write-Output "Publishing Customizations Complete"
