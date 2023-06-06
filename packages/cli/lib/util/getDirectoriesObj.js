function getDirectoriesObj () {
  const appDataDir = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share')
  const tfvmDir = appDataDir.concat('\\tfvm')
  const terraformDir = appDataDir.concat('\\terraform')

  return {
    appDataDir,
    tfvmDir,
    terraformDir
  }
}

export default getDirectoriesObj
