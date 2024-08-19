
#!/bin/bash

# Set the path to add
path2add="$HOME/Library/Application Support/opentofu"

# Get the user's PATH
userPath=$(echo $PATH)

# Check if the path already contains the path to add
if [[ ! "$userPath" == *"$path2add"* ]]; then
    # Update .zshrc to persist the changes (also creates .zshrc if it doesn't already exist)
    echo "export PATH=\"\$PATH:$path2add\"" >> ~/.zshrc
    echo "OpenTofu path added to user PATH in .zshrc."


    # Check if .bashrc exists (if the user happens to be using a non-zsh terminal, we want to support that)
    if [ -f "$HOME/.bashrc" ]; then
        # Add the path to .bashrc
        echo "export PATH=\"\$PATH:$path2add\"" >> ~/.bashrc
        echo "OpenTofu path added to user PATH in .bashrc."
    fi
else
    echo "OpenTofu path already exists in user PATH."
fi
