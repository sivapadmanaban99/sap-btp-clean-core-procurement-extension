#!/bin/bash

# Create archive of the project
PROJECT_NAME="ai-clean-core-poc"
ARCHIVE_NAME="${PROJECT_NAME}-$(date +%Y%m%d-%H%M%S).tar.gz"

echo "Creating project archive: $ARCHIVE_NAME"

# Create tar archive excluding unnecessary files
tar -czf "$ARCHIVE_NAME" \
  --exclude="node_modules" \
  --exclude="*.log" \
  --exclude="*.sqlite*" \
  --exclude=".git" \
  --exclude="gen" \
  --exclude="dist" \
  .

echo "Project archived successfully: $ARCHIVE_NAME"
echo "Archive location: $(pwd)/$ARCHIVE_NAME"