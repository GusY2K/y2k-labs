#!/usr/bin/env bash
# Validates Azure DevOps CLI prerequisites
# Usage: bash validate-prerequisites.sh [org-name] [project-name]

set -euo pipefail

ORG="${1:-}"
PROJECT="${2:-}"
ERRORS=0

echo "=== Azure DevOps Prerequisites Check ==="
echo ""

# 1. Azure CLI installed
echo -n "[1/5] Azure CLI: "
if command -v az &>/dev/null; then
    AZ_VERSION=$(az --version 2>/dev/null | head -1 | awk '{print $2}')
    echo "PASS (v${AZ_VERSION})"
else
    echo "FAIL - Install: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli"
    ERRORS=$((ERRORS + 1))
fi

# 2. Azure DevOps extension
echo -n "[2/5] DevOps extension: "
if az extension show --name azure-devops &>/dev/null 2>&1; then
    EXT_VERSION=$(az extension show --name azure-devops --query "version" -o tsv 2>/dev/null)
    echo "PASS (v${EXT_VERSION})"
else
    echo "FAIL - Run: az extension add --name azure-devops"
    ERRORS=$((ERRORS + 1))
fi

# 3. Authentication
echo -n "[3/5] Authentication: "
if az account show &>/dev/null 2>&1; then
    ACCOUNT=$(az account show --query "user.name" -o tsv 2>/dev/null)
    echo "PASS (${ACCOUNT})"
else
    echo "FAIL - Run: az login"
    ERRORS=$((ERRORS + 1))
fi

# 4. Organization access
echo -n "[4/5] Organization access: "
if [ -n "${ORG}" ]; then
    if az devops project list --organization "https://dev.azure.com/${ORG}" --query "[0].name" -o tsv &>/dev/null 2>&1; then
        echo "PASS (${ORG})"
    else
        echo "FAIL - Cannot access org '${ORG}'. Check PAT or login."
        ERRORS=$((ERRORS + 1))
    fi
else
    # Try defaults
    DEFAULT_ORG=$(az devops configure --list 2>/dev/null | grep "organization" | awk '{print $NF}')
    if [ -n "${DEFAULT_ORG}" ]; then
        echo "PASS (default: ${DEFAULT_ORG})"
    else
        echo "SKIP - No org specified, no default configured"
    fi
fi

# 5. Project access
echo -n "[5/5] Project access: "
if [ -n "${PROJECT}" ] && [ -n "${ORG}" ]; then
    if az boards query --wiql "SELECT [System.Id] FROM WorkItems WHERE [System.Id] = 1" --organization "https://dev.azure.com/${ORG}" --project "${PROJECT}" &>/dev/null 2>&1; then
        echo "PASS (${PROJECT})"
    else
        echo "FAIL - Cannot access project '${PROJECT}' in org '${ORG}'"
        ERRORS=$((ERRORS + 1))
    fi
else
    DEFAULT_PROJECT=$(az devops configure --list 2>/dev/null | grep "project" | awk '{print $NF}')
    if [ -n "${DEFAULT_PROJECT}" ]; then
        echo "PASS (default: ${DEFAULT_PROJECT})"
    else
        echo "SKIP - No project specified, no default configured"
    fi
fi

echo ""
if [ ${ERRORS} -eq 0 ]; then
    echo "All prerequisites PASSED. Ready to create work items."
    exit 0
else
    echo "${ERRORS} prerequisite(s) FAILED. Fix the issues above before proceeding."
    exit 1
fi
