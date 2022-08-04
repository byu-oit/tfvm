import chalk from 'chalk'
import fs from 'node:fs/promises'
import versionRegEx from '../util/versionRegEx.js'
import getInstalledVersions from '../util/getInstalledVersions.js'
import getDirectoriesObj from '../util/getDirectoriesObj.js'
import verifySetup from '../util/verifySetup.js'

async function use (useVersion) {
  await verifySetup()
  
  useVersion = 'v' + useVersion
  if (!versionRegEx.test(useVersion)) {
    console.log(
      chalk.red.bold('Invalid version syntax')
    )
  } else {
    const directories = getDirectoriesObj();
    const terraformDir = directories.terraformDir;
    const programFilesDir = directories.programFilesdDir
    const tfvmDir = directories.tfvmDir;
    const useVerDir = tfvmDir.concat('\\').concat(useVersion);
    const installedVersions = await getInstalledVersions();
    if (installedVersions === null || !installedVersions.includes(useVersion)) {
      console.log(
        chalk.white.bold(`terraform ${useVersion} is not installed. Type "tfvm list" to see what is installed.`)
      )
    } else {
      const programFiles = await fs.readdir(programFilesDir)
      if (programFiles.includes('terraform')) {
        await fs.rmdir(terraformDir)
      }

      await fs.symlink(useVerDir, terraformDir, 'dir');
      console.log(
        chalk.cyan.bold(`Now using terraform ${useVersion} (64-bit)`)
      )
    }
  }
}

export default use;
