import chalk from 'chalk';
import versionRegEx from "../util/versionRegEx.js";
import getInstalledVersions from "../util/getInstalledVersions.js";
import getDirectoriesObj from "../util/getDirectoriesObj.js";

async function install (installVersion) {
  installVersion = 'v' + installVersion
  if (!versionRegEx.test(installVersion)) {
    console.log(
      chalk.red.bold('Invalid version syntax')
    )
  } else {
    const installedVersions = await getInstalledVersions();
    if (installedVersions.includes(installVersion)) {
      console.log(
        chalk.white.bold(`Version ${installVersion} is already installed.`)
      )
    }
    else {

    }
  }
}

export default install
