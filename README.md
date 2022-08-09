# TFVM - Terraform Version Manager for Windows
##A NodeJS-based CLI tool to manage terraform versions on windows (that actaully works)

## Usage

### Step 1: Installation
Users must first install tfvm
  ```shell
  npm i -g tfvm-windows
  ```

### Step 2: Delete existing terraform setup
tfvm will auto-create directories and an environment variable for terraform setup. This will conflict with anything you already have.
- If you already have terraform set up on your computer, delete your entry for your terraform directory in the PATH environment variable.
- You could leave your terraform.exe file(s), but you might as well delete them. tfvm will download its own files.

### Step 3: Use TFVM
run `tfvm` in any command line, followed by one of these commands:
- `install`: installs terraform version and sets up folder inside your tfvm folder.
  Ex: `tfvm install 1.0.3` or `tfvm install latest`
- `list`: lists all versions of terraform you have saved in your tfvm folder.
  Ex: `tfvm list`
- `uninstall`: Deletes terraform executable and folder inside your tfvm folder.
  Ex: `tfvm uninstall 1.0.3`
- `use`: sets specified terraform version to being the actively used version.
  Ex: `tfvm use 1.0.3`
- `current`: displays the terraform version you are using.
  Ex: `tfvm current`
- `help`: prints usage information. Run `tfvm help <command>` to see information about the other tfvm commands.

## FAQ
**Q:** Why use this app instead of one of the other terrform version managers you can find?

**A:** It is the simplest to use.

**Q:** I'm getting this error when running tfvm in powershell: `File C:\Program Files\nodejs\tfvm.ps1 cannot be loaded because running scripts is disabled on this system.`

**A:** Most custom CLI apps will throw this error in Powershell. Run this command to update your powershell execution policy:
  ```shell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

**Q:** What terraform versions are supported?

**A:** tfvm will install and use any major version that is available in the [Hashicorp Terraform Releases archive](https://releases.hashicorp.com/terraform/). At this time, tfvm will not allow you to select alpha, beta, or rc releases (though this is planned for a future update).
