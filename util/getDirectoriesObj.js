function getDirectoriesObj () {
  const appDataDir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
  const tfvmDir = appDataDir.concat('\\tfvm')
  const terraformDir = appDataDir.concat('\\terraform') // TODO remove code for program files dir

  const directoriesObject = {
    appDataDir,
    tfvmDir,
    terraformDir
  }
  return directoriesObject
}

export default getDirectoriesObj
