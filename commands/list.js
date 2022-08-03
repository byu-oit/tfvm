import Conf from 'conf';
const conf = new Conf({ projectName: 'tfvm_windows' });
import chalk from 'chalk';

const tfList = [];

function list () {
  // const tfList = conf.get('todo-list')

  if (tfList && tfList.length) { //TODO highlight or add asterisk to current version
    tfList.forEach(version => {
      console.log(
        chalk.white(version)
      )
    })
  } else {
    console.log(
      chalk.cyan.bold('It appears you have no Terraform versions downloaded.', '\n',
        chalk.green.bold('Run tfmv install <version> to install a new version'))
    )
  }
}

export default list
