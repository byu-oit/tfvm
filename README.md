# TFVM - Terraform Version Manager for Windows

## Usage

### Step 1: Installation
Users must first install tfvm
  ```shell
  npm i -g tfvm-windows
  ```

### Step 2: Delete existing terraform setup
tfvm will auto-create directories and an environment variable for terraform setup. This will conflict with anything you already have.
- If you already have terraform set up on your computer, delete your entry for your terraform directory in the PATH environment variable.
- You could leave your terraform.exe file(s), but you might as well delete them. tfvm will not get its own.

### Step 3: Use TFVM
- `install`: installs terraform version and sets up folder inside your tfvm folder
  `tfvm install 1.0.3`
- `list`: lists all versions of terraform you have saved in your tfvm folder
  `tfvm list`
- `uninstall`: Deletes terraform executable and folder inside your tfvm folder
  `tfvm uninstall 1.0.3`
- `use`: sets specefied terraform version to being the actively used version
  ` tfvm use 1.0.3`
- `help`: prints usage information. Run `tfvm help <command>` to see information about the other tfvm commands

## Supported versions
tfvm will install and use any major version that is available in the [Hashicorp Terraform Releases archive](https://releases.hashicorp.com/terraform/). tfvm will not allow you to select alpha, beta, or rc releases.