import chalk from 'chalk';
import fs from 'node:fs/promises';
import versionRegEx from "../util/versionRegEx.js";
import getInstalledVersions from "../util/getInstalledVersions.js";
import getDirectoriesObj from "../util/getDirectoriesObj.js";

async function uninstall (uninstallVersion) {
  uninstallVersion = 'v' + uninstallVersion
  if (!versionRegEx.test(uninstallVersion)) {
    console.log(
      chalk.red.bold('Invalid version syntax')
    )
  }
  else {
    const tfvmDir = getDirectoriesObj().tfvmDir
    const uninstallVerDir = tfvmDir.concat('\\').concat(uninstallVersion)
    const installedVersions = await getInstalledVersions()
    if (installedVersions === null || !installedVersions.includes(uninstallVersion)) {
      console.log(
        chalk.white.bold(`terraform ${uninstallVersion} is not installed. Type "tfvm list" to see what is installed.`)
      )
    } else {
      process.stdout.write(
        chalk.white.bold(`Uninstalling terraform ${uninstallVersion}...`)
      )
        const files = await fs.readdir(uninstallVerDir);
        for (const file of files) {
          await fs.unlink(uninstallVerDir + '\\' + file);
        }
        await fs.rmdir(uninstallVerDir)
      process.stdout.write(' done')
    }
  }
}

export default uninstall;
