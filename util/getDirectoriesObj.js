function getDirectoriesObj () {
  const appDataDir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
  const tfvmDir = appDataDir.concat('\\tfvm')
  const programFilesdDir = process.env.PROGRAMFILES || (process.platform == 'darwin' ? process.env.HOME + '/Applications' : process.env.HOME + "/.local/bin")
  const terraformDir = programFilesdDir.concat('\\terraform')

  const directoriesObject = {
    appDataDir,
    tfvmDir,
    programFilesdDir,
    terraformDir
  }
  return directoriesObject
}

export default getDirectoriesObj
