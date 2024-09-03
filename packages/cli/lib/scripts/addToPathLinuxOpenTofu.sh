
#!/bin/bash

# Set the path to add
path2add="$HOME/.local/share/opentofu"

# Get the user's PATH
userPath=$(echo $PATH)

# Check if the path already contains the path to add
if [[ ! "$userPath" == *"$path2add"* ]]; then
    # Add the path to the user's PATH
    export PATH="$PATH:$path2add"
    # Update .bashrc to persist the changes (also creates .bashrc if it doesn't already exist)
    echo "export PATH=\"\$PATH:$path2add\"" >> ~/.bashrc
    echo "OpenTofu path added to user PATH in .bashrc."
    # Check if .zshrc exists
    if [ -f "$HOME/.zshrc" ]; then
        # Add the path to .zshrc
        echo "export PATH=\"\$PATH:$path2add\"" >> ~/.zshrc
        echo "OpenTofu path added to user PATH in .zshrc."
    fi
else
    echo "OpenTofu path already exists in user PATH."
fi
