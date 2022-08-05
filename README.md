
# TFVM - Terraform Version Manager for Windows

#Step 1: Installation
Users must first install TFVM
- run `npm i -g tfvm-windows

#Step 2: Change Path System and User Variables
User must add the filepath for the terraform command to system and user environmental Path variable
- Add 'C:\Program Files\terraform' to your system and user Path environmental variable and remove any other instance of terraform from the Path environmental variables.

#Step 3: Use TFVM
Commands:
- install: installs terraform version and sets up folder inside your tfvm folder
  `tfvm install 1.0.3`
- list: lists all versions of terraform you have saved in your tfvm folder
  `tfvm list`
- uninstall: Deletes terraform executable and folder inside your tfvm folder
  `tfvm uninstall 1.0.3`
- use: sets specefied terraform version to being the actively used version
  ` tfvm use 1.0.3`
