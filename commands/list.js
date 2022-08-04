import chalk from 'chalk';
import fs from 'node:fs/promises';
import compareVersions from 'compare-versions';
import utils from 'util'
import { exec } from 'child_process';

export const execute = utils.promisify(exec);


async function list () {
  const appDataDir =  process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
  const tfvmDir = appDataDir.concat('\\tfvm');

  const versionDirRegex = new RegExp('^v[0-9]+.{1}[0-9]+.{1}[0-9]+');

  const tfList = [];
  let printList = [];
  const files = await fs.readdir(tfvmDir);
  if (files && files.length) {
    files.forEach(file => {
      if (versionDirRegex.test(file)) {
        tfList.push(file);
      }
    })
    if (tfList && tfList.length) {
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
        }
      } else {
      //TODO what do we do if there are TF versions downloaded to tfvm but no version in the CLI? Allow the user to add on of the downloaded options?
        console.log(
          chalk.red.bold('You have versions of terraform downloaded to tfvm but no version is found from your command line. You are SOL')
        )
      }
    }
  else {
    console.log(
      chalk.cyan.bold('It appears you have no Terraform versions downloaded.', '\n',
        chalk.green.bold('Run tfmv install <version> to install a new version'))
    )
  }
}

async function getTerraformVersion () {
  let response = ''
    try {
      response = await execute('terraform -v');
    if (!response.stderr) {
      response = response.stdout.split('\n')[0];
      response = response.split(' ')[1];
      return response
    }
    } catch (e) {
      return null;
    }
}

export default list;
