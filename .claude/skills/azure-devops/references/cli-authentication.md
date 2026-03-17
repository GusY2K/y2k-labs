# Authentication & Setup

## Install Azure CLI + DevOps Extension

```bash
# Install Azure CLI (if not installed)
# Windows: winget install -e --id Microsoft.AzureCLI
# macOS: brew install azure-cli
# Linux: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Add Azure DevOps extension
az extension add --name azure-devops

# Verify
az --version
az extension show --name azure-devops
```

## Authentication Methods

### Interactive Login (recommended for local dev)

```bash
az login
az devops login --organization https://dev.azure.com/{org}
```

### Personal Access Token (PAT)

```bash
# Set PAT via environment variable (most secure — no shell history)
export AZURE_DEVOPS_EXT_PAT=your-pat-here

# Or pipe it
echo $MY_PAT | az devops login --organization https://dev.azure.com/{org}
```

### Service Principal (CI/CD)

```bash
az login --service-principal -u {app-id} -p {password} --tenant {tenant-id}
```

## Configure Defaults

```bash
# Set org and project defaults (avoid passing them every time)
az devops configure --defaults organization=https://dev.azure.com/{org} project={project}

# Verify defaults
az devops configure --list

# Test access
az boards query --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.Id] = 1" --output table
```

## Logout

```bash
az devops logout --organization https://dev.azure.com/{org}
```

## Troubleshooting

```bash
# Check current account
az account show

# List available organizations
az devops project list --organization https://dev.azure.com/{org}

# Test permissions (try to read a work item)
az boards work-item show --id 1

# Clear credential cache
az account clear
az login
```

## Output Formats

```bash
# Table (human-readable)
az boards query --wiql "..." --output table

# JSON (programmatic — use for capturing IDs)
az boards work-item create --type "Epic" --title "Test" --output json

# TSV (shell scripts — clean, no formatting)
az boards query --wiql "..." --query "[].id" --output tsv

# JSONC (JSON with comments, for readability)
az boards work-item show --id 1 --output jsonc

# None (suppress output — for silent operations)
az boards work-item update --id 1 --state "Active" --output none
```

## JMESPath Query Filters

```bash
# Get just the ID from create output
az boards work-item create --type "Epic" --title "Test" --query "id" --output tsv

# Get specific fields
az boards query --wiql "..." --query "[].{ID:id, Title:fields.\"System.Title\", State:fields.\"System.State\"}" --output table

# First item only
az boards query --wiql "..." --query "[0]" --output json

# Count items
az boards query --wiql "..." --output json | python3 -c "import sys,json; print(len(json.load(sys.stdin)))"
```
