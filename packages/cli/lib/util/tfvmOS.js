import runShell from './runShell.js'
import fsp from 'node:fs/promises'
import { resolve, dirname, sep } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
const __dirname = dirname(fileURLToPath(import.meta.url))

let os
export function getOS () {
  if (os == null) {
    os = TfvmOS.getOS()
  }
  return os
}

const EXECUTE_PERM_CODE = 0o755

export class TfvmOS {
  settingsFileName = 'settings.json'
  logFolderName = 'logs'
  tfVersionsFolderName = 'versions'
  tfvmAppDataFolderName = 'tfvm'
  getOSName () {
    // This is whatever Terraform expects, not what node's process.platform returns
    throw new Error('Not implemented in parent class')
  }

  getTfvmDir () {
    return this.getAppDataDir().concat(sep + this.tfvmAppDataFolderName)
  }

  getTfVersionsDir () {
    return this.getTfvmDir().concat(sep + this.tfVersionsFolderName)
  }

  getLogsDir () {
    return this.getTfvmDir().concat(sep + this.logFolderName)
  }

  getTerraformDir () {
    return this.getAppDataDir().concat(sep + 'terraform')
  }

  getSettingsDir () {
    return this.getTfvmDir().concat(sep + this.settingsFileName)
  }

  getArchitecture () {
    throw new Error('Not implemented in parent class')
  }

  getBitWidth () {
    throw new Error('Not implemented in parent class')
  }

  getPathCommand () {
    throw new Error('Not implemented in parent class')
  }

  getPathDelimiter () {
    throw new Error('Not implemented in parent class')
  }

  addToPath () {
    throw new Error('Not implemented in parent class')
  }

  getAppDataDir () {
    throw new Error('Not implemented in parent class')
  }

  handleAddPathError () {
    throw new Error('Not Implemented in parent class')
  }

  getTFExecutableName () {
    throw new Error('Not Implemented in parent class')
  }

  /**
   * Returns arguments for the runShell() function and prepares the script for being run, if necessary
   */
  getAddToPathShellArgs () {
    throw new Error('Not Implemented in parent class')
  }

  getDirectories () {
    return {
      tfvmDir: this.getTfvmDir(),
      tfVersionsDir: this.getTfVersionsDir(),
      logsDir: this.getLogsDir(),
      tfDir: this.getTerraformDir(),
      settingsDir: this.getSettingsDir(),
      appDataDir: this.getAppDataDir()
    }
  }

  async prepareExecutable () {
    throw new Error('Not Implemented in parent class')
  }

  static getOS () {
    const osClassBinding = {
      darwin: Mac,
      win32: Windows
    //  TODO add more operating systems
    }
    const OSClass = osClassBinding[process.platform]
    if (OSClass == null) throw new Error('Operating system not supported')
    return new OSClass()
  }

  /**
   * Creates a 'path' by joining the arguments together with the system-specific dirSeparator
   * @param {...string} items
   * @returns {string}
   */
  getPath = (...items) => items.join(sep)
}

export class Mac extends TfvmOS {
  getPathCommand () {
    return 'echo $PATH'
  }

  getPathDelimiter () {
    return ':'
  }

  async getAddToPathShellArgs () {
    const scriptPath = resolve(__dirname, './../scripts/addToPathMac.sh')
    await fsp.chmod(scriptPath, EXECUTE_PERM_CODE)
    return [scriptPath, {}]
  }

  getAppDataDir () {
    return process.env.HOME + '/Library/Application Support'
  }

  handleAddPathError () {
    throw new Error('Bash script failed to add terraform directory to the path')
  }

  getArchitecture () {
    // 'arm64' or 'amd64', for Apple's ARM Chips and Intel chips, respectively.
    return process.arch
  }

  getBitWidth () {
    return '64'
  }

  getOSName () {
    return 'darwin'
  }

  getTFExecutableName () {
    return 'terraform'
  }

  async prepareExecutable (version) {
    const exeLoc = resolve(this.getTfVersionsDir(), `v${version}/${this.getTFExecutableName()}`)
    await fsp.chmod(exeLoc, EXECUTE_PERM_CODE)
  }
}

export class Windows extends TfvmOS {
  getPathCommand () {
    return 'echo %path%'
  }

  getPathDelimiter () {
    return ';'
  }

  async getAddToPathShellArgs () {
    return [resolve(__dirname, './../scripts/addToPathWindows.ps1'), { shell: 'powershell.exe' }]
  }

  getAppDataDir () {
    return process.env.APPDATA
  }

  handleAddPathError () {
    console.log(chalk.red.bold('tfvm script failed to run. Please run the following command in a powershell window:\n'))
    console.log(chalk.blue.bold('Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser'))
  }

  getOSName () {
    return 'windows'
  }

  getArchitecture () {
    return process.env.PROCESSOR_ARCHITECTURE === 'AMD64' ? 'amd64' : '386'
  }

  getBitWidth () {
    return process.env.PROCESSOR_ARCHITECTURE === 'AMD64' ? '64' : '32'
  }

  getTFExecutableName () {
    return 'terraform.exe'
  }

  async prepareExecutable () {}
}

export class Linux extends TfvmOS {
  getPathCommand () {
    return 'echo $PATH'
  }

  getPathDelimiter () {
    return ':'
  }

  async getPathAdd () {
    return await runShell(resolve(__dirname, './../scripts/addToPathLinux.sh'))
  }

  getAppDataDir () {
    return process.env.HOME + '/.local/share'
  }

  handleAddPathError () {
    throw new Error('Bash script failed to add terraform directory to the path')
  }
}
