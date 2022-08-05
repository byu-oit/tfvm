import chalk from 'chalk';
function getErrorMessage(error) {
  if (error.code === 'EPERM') {
    console.log(
      chalk.red.bold('TFVM must be ran from the console as an administrator.')
    )
  }
  else {
    console.error(error)
  }
}

export default getErrorMessage
