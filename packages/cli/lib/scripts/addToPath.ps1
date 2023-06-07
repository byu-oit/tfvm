# This script attempts to add terraform to the system and local paths.
# It will not add it if it already exists.
# It will not add it to the system path if the shell it is being run from does not have admin rights

$userName = $env:UserName
$path2add = ";C:\Users\$userName\AppData\Roaming\terraform"
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User');

# attempts to add to local path
If (!$userPath.contains($path2add)) {
    $userPath += $path2add
    $userPath = $userPath -join ';'
    [Environment]::SetEnvironmentVariable('Path', $userPath, 'User');
}

# this code adds to system path, if we ever need it
#$systemPath = [Environment]::GetEnvironmentVariable('Path', 'machine');
#If (!$systemPath.contains($path2add)) {
#    echo '1'
#    $systemPath += $path2add
#    $systemPath = $systemPath -join ';'
#    [Environment]::SetEnvironmentVariable('Path', $systemPath, 'Machine');
#}
