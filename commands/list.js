import chalk from 'chalk';
import compareVersions from 'compare-versions';
import getTerraformVersion from "../util/tfVersion.js";
import getInstalledVersions from "../util/getInstalledVersions.js";

async function list () {
  let printList = [];
  const tfList = await getInstalledVersions()

  if (tfList !== null) {
      const currentTFVersion = await getTerraformVersion()
      if (currentTFVersion !== null) {
        process.stdout.write('\n');
        tfList.sort(compareVersions).reverse();
        for (const versionDir of tfList) {
          if (versionDir === currentTFVersion) {
            let printVersion = '  * ';
            printVersion = printVersion + versionDir.substring(1, versionDir.length);
            printVersion = printVersion + ' (Currently using 64-bit executable)';
            printList.push(printVersion);
          } else {
            let printVersion = '    ';
            printVersion = printVersion + versionDir.substring(1, versionDir.length);
            printList.push(printVersion);
            }
          }
          printList.forEach(printVersion => {
            console.log(
              chalk.white.bold(printVersion)
            )
          })
        } else {
      //TODO what do we do if there are TF versions downloaded to tfvm but no version in the CLI? Allow the user to add on of the downloaded options?
        console.log(
          chalk.red.bold('You have versions of terraform downloaded to tfvm but no version is found from your command line. You are SOL')
        )
      }
    } else {
    console.log(
      chalk.cyan.bold('It appears you have no Terraform versions downloaded.', '\n',
        chalk.green.bold('Run tfmv install <version> to install a new version'))
    )
  }
}

export default list;
