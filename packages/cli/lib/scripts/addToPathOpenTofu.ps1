# This script attempts to add opentofu to the system and local paths.
# It will not add it if it already exists.
# It will not add it to the system path if the shell it is being run from does not have admin rights

$userName = $env:UserName
$path2addOpenTofu = ";C:\Users\$userName\AppData\Roaming\opentofu"
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User');

# attempts to add to local path
If (!$userPath.contains($path2addOpenTofu)) {
    $userPath += $path2addOpenTofu
    $userPath = $userPath -join ';'
    [Environment]::SetEnvironmentVariable('Path', $userPath, 'User');
}
