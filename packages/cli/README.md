# @byu-oit/tfvm

*A NodeJS-based CLI tool to manage terraform versions without needing admin access.*

**Currently, this only works on Windows and Mac and Linux. (PR's welcome).**

## Setup

### Step 0 (For Windows Users):

In order to use tfvm on Windows, you must be able to run Powershell scripts, even if you call tfvm from another shell.
To enable Powershell scripts to run on your machine, **run the following command in a Powershell window**
(You do *not* need admin access to run this command):
```shell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 1: Installation

Install tfvm. You will need to have Node.js (≥v16) installed (some, but not all commands will also work with older versions).
```shell
npm i -g @byu-oit/tfvm
```

> If you frequently change versions of Node.js and you wish to use tfvm in other Node.js versions, you will need to re-install
> tfvm in this way for each version.
>
> Fortunately, any installed terraform versions and your selected terraform version will be maintained for each Node.js
> version that you switch to, as they are stored on your system and not in Node.js's files.

### Step 2: Delete existing terraform setup and terraform version manager setup
tfvm will auto-create directories and a variable in your 'Path' system environment variable for terraform setup.
This will conflict with any terraform paths or installations you already have.
1. If you already have terraform set up on your computer, delete your entry for your terraform directory in your user path or from any `/bin` directories
   1. If you know you have terraform installed but don't know where, you can run `which terraform` to help find it.
2. You could leave your terraform executable (e.g. `.exe`) file(s), but you might as well delete them. tfvm will download its own files.
3. If you are switching from another terraform version manager, you will probably have to uninstall it or remove any reference of it from your user PATH to use this package correctly.

### Step 3: Run tfvm for the first time
1. Open up any command line
2. Run any tfvm command. If you know what version you want to use first, you can run `tfvm install <that version>`
   and then `tfvm use <that version>`.
   If you don't have a version in mind, you could run something like `tfvm install latest`.
   > You should see some lines appear saying that tfvm has automatically added a directory pointing to its terraform
   installation folder to your Path. This means it is working correctly
3. Restart your terminal(s) where you want to use terraform so that your system path can be refreshed and your
   CLI can actually find terraform.
   Any terminals (including those built into IDEs) that were open before you installed tfvm will have to be restarted
   to use the versions of terraform that tfvm install.
   This may require you to also restart your IDE if you are using a terminal from within your IDE.
4. In your new terminal, run `terraform --version` to verify that you are using the version of terraform that you installed with tfvm.

## Usage
Run `tfvm` in any command line, followed by one of these commands:
- `install` or `i`: installs terraform version and sets up folder inside your tfvm folder.
    - Ex: `tfvm install 1.0.3` or `tfvm install latest`
- `list` or `ls`: lists all versions of terraform you have saved in your tfvm folder.
    - Ex: `tfvm list`
- `uninstall`: Deletes terraform executable and folder inside your tfvm folder.
    - Ex: `tfvm uninstall 1.0.3`
- `use` or `u`: sets specified terraform version to being the actively used version.
    - Ex: `tfvm use 1.0.3`
    - If you attempt to use a version that you haven't installed, you will be prompted to install it.
- `detect` (or no command): scans `.tf` files in the current directory for a terraform version constraint and uses that version
    - Ex: `tfvm detect` or `tfvm`
    - *This is the default command, and will be run if no command is specified*
- `current`: displays the terraform version you are using.
    - Ex: `tfvm current`
    - This does the same thing as running `terraform --version`
- `tfvm config <setting>=true/false`: allows the user to change tfvm settings.
    - `tfvm config disableErrors=true` - disables configuration warnings.
    - `tfvm config disableAWSWarnings=true` - disables AWS warnings that appear when using older terraform versions.
    - `tfvm config disableSettingPrompts=true` - disables prompts that show how to hide some error messages.
    - `tfvm config useOpenTofu=true` - uses the open source version of Terraform, OpenTofu (experimental flag). This flag will also delete your terraform executable so you can only perfom tofu actions. When you switch back to `useOpenTofu=false`, the tofu executable will be deleted. This is so you don't perform any accidental commands in the wrong type of IAC.
    - `tfvm config disableTofuWarnings=true` - disables warnings related to using Tofu (deleting executables, using Tofu instead of Terraform, etc.)
- `help`: prints usage information. Run `tfvm help <command>` to see information about the other tfvm commands.

## FAQ
**Q:** Why use this app instead of one of the other terraform version managers you can find?
<br>
**A:** It is the simplest to use for Windows and doesn't require administrator permissions on Mac or Windows.
Many terraform version managers don't support windows, and those that do are unintuitive.
This one is simple and works well, especially for beginners to terraform.

**Q:** I'm getting this error when running tfvm in powershell: `File C:\Users\<username>\nodejs\tfvm.ps1 cannot be
loaded because running scripts is disabled on this system.`
<br>
**A:** Most custom Node.js CLI apps will throw this error. Run this command in Powershell to update your powershell execution policy:
  ```shell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

**Q:** What terraform versions are supported?
<br>
**A:** tfvm will install and use any major version that is available in the
[Hashicorp Terraform Releases archive](https://releases.hashicorp.com/terraform/).
At this time, tfvm will not allow you to select alpha, beta, or rc releases.

**Q:** I'm seeing weird behavior or errors. Where can I view tfvm's logs for debugging?
<br>
**A:** The logs are stored separately from node so that they are maintained when you switch node versions.
This should be somewhere like `~/AppData/Roaming/tfvm/logs` (Windows) or `~/Library/Application Support/tfvm/logs` (Mac).

> <sup>To generate more detailed logs, run tfvm with the `LOG_LEVEL` environment variable set to `debug` or `trace`.
Alternatively, you can also use the `--log-level <level>` or `-l <level>` argument.
The CLI argument will take precedence over the environment variable if set.</sup>
