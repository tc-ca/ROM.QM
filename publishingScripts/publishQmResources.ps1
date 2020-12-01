
#Script Location
$scriptPath = split-path -parent $MyInvocation.MyCommand.Definition
echo "Script Path: $scriptPath"

#Connection String to Environment
$ConnectionStringDev = "Url=https://xxxxxxxxx.dynamics.com; Username=xxxxxxxxx.onmicrosoft.com; Password=xxxxxxxxxxx; authtype=Office365; RequireNewInstance=True"

#how long we want to wait to realize something broke
$Timeout = 960

#the relative folder path to our build files 
$WebResourceFolderPath = "$scriptPath"

#the json file we will use to map our build files to the unique names of webresources in dynamics
$WebResourceJsonMappingPath = "$scriptPath\webresourceMapping.json"

#Load XrmCIFramework
#$xrmCIToolkit = "C:\Users\Aaron\Google Drive\Work\TDG Core\Source\dyn365-ce-vsts-tasks\BuildTools\Xrm.CI.Framework.BuildTools\Lib\xRMCIFramework\9.0.0\Xrm.Framework.CI.PowerShell.Cmdlets.dll"
$xrmCIToolkit = "$scriptPath\Xrm.Framework.CI.PowerShell.Cmdlets.dll"

echo "Importing CIToolkit: $xrmCIToolkit" 
Import-Module $xrmCIToolkit
echo "Imported CIToolkit"

$json = Get-Content -Raw -Path $WebResourceJsonMappingPath | ConvertFrom-Json

echo $json

$json | ForEach-Object {
    $_.files | ForEach-Object {
	    $WebResourcePath = [System.Uri]::UnescapeDataString([System.IO.Path]::Combine($WebResourceFolderPath, $_.file))
	    echo "Updating Web Resource: $WebResourcePath"   
	    Set-XrmWebResource -Path $WebResourcePath -UniqueName $_.uniquename -Publish $False -ConnectionString $ConnectionStringDev -Timeout $Timeout -Verbose
	    echo "Updated Web Resource"
    }
}

echo "Publishing All Customizations"
Publish-XrmCustomizations -ConnectionString $ConnectionStringDev -Timeout $Timeout
<<<<<<< HEAD
echo "Publishing Customizations Complete"
=======
echo "Publishing Customizations Complete"
>>>>>>> cb6407841fe5cb23b05b1d77105ca141a649d428
