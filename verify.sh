#!/bin/bash

function validate_repos() {
  pushd "$1" >/dev/null
  find . -mindepth 1 -maxdepth 1 -type d | while read -r repo ; do
    repo="${repo#./}"
    echo "Validating $repo"
    if pushd "$repo" >/dev/null ; then
      git fsck --no-dangling
      popd >/dev/null
    fi
  done
  popd >/dev/null
}

validate_repos gh-backup
validate_repos bb-backup
