import chalk from 'chalk';
import fs from 'node:fs/promises';
import getTerraformVersion from "../util/tfVersion.js";
import versionRegEx from "../util/versionRegEx.js";
import getInstalledVersions from "../util/getInstalledVersions.js";
import getDirectoriesObj from "../util/getDirectoriesObj.js";

async function use (useVersion) {
  useVersion = 'v' + useVersion
  if (!versionRegEx.test(useVersion)) {
    console.log(
      chalk.red.bold('Invalid version syntax')
    )
  } else {
    const terraformVersion = await getTerraformVersion()
    const tfvmDir = getDirectoriesObj().tfvmDir
    const useVerDir = tfvmDir.concat('\\').concat(useVersion)
    const installedVersions = await getInstalledVersions()
    if (installedVersions === null || !installedVersions.includes(useVersion)) {
      console.log(
        chalk.white.bold(`terraform ${useVersion} is not installed. Type "tfvm list" to see what is installed.`)
      )
    } else if (useVersion === terraformVersion) {
      console.log(
        chalk.white.bold(`terraform ${useVersion} is not installed. Type "tfvm list" to see what is installed.`)
      )
    }
  }
}
