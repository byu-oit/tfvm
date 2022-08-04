
# TFVM - Terraform Version Manager

**Table of Contents**

[TOCM]

[TOC]

#Step 1: Installation
Users must first install TFVM
- Clone this repo (git clone https://github.com/jsterner30/tfvm-windows)
- run `npm i -g` while inside repo
- You should now be able to use tfvm globally

#Step 2: Make Terraform version Directory
Set up a terraform directory so TFVM can use terraform files.
- Go to your AppData/Roaming folder (enter %appdata% into your file explorere and select Roaming)
- Create a folder called tfvm
- Inside, create folders for each terraform version you want to have available with a v infront of the version number (ex: v1.0.3)
- Place the terraform executable in that file. You can find executables here: https://releases.hashicorp.com/terraform/
- Run tfvm list in a adminstrative powershell window to test if tfvm can find your terraform files

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
