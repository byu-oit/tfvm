# This script attempts to add terraform to the system and local paths.
# It will not add it if it already exists.
# It will not add it to the system path if the shell it is being run from does not have admin rights

$path2add = ';C:\Program Files\terraform'
$systemPath = [Environment]::GetEnvironmentVariable('Path', 'machine');
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User');

# attempts to add to system path. If it fails, it adds it to the local path.
If (!$systemPath.contains($path2add)) {
    echo '1'
    $systemPath += $path2add
    $systemPath = $systemPath -join ';'
    [Environment]::SetEnvironmentVariable('Path', $systemPath, 'Machine');
}
# attempts to add to local path
If (!$userPath.contains($path2add)) {
    echo '2'
    $userPath += $path2add
    $userPath = $userPath -join ';'
    [Environment]::SetEnvironmentVariable('Path', $userPath, 'User');
}
