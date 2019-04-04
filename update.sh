#!/bin/bash

echo "----------------------------------------"
date

/usr/local/bin/node clone_urls.js  | /usr/local/bin/jq -r '. | map(select(has("owner") and has("repo"))) | map( .owner + "--" + .repo + " " + .clone_url)[]' | sort -u | while read -r repo url ; do
  grep -q "$repo" exclude.txt && echo "Skipping $repo" && continue
  mkdir -p gh-backup
  pushd gh-backup >/dev/null

  if [[ -d "$repo" ]] ; then
    echo "Updating $repo"
    if pushd "$repo" >/dev/null ; then
      git fetch --tags --all
      git tag "gh-backup-$(date +%s)"
      popd >/dev/null
    fi
  else
    echo "Cloning $repo"
    function clone_and_tag() {
      url="$1"
      repo="$2"

      git clone --mirror "$url" "$repo" || echo "failed"
      if pushd "$repo" >/dev/null ; then
        git tag "gh-backup-$(date +%s)"
        popd >/dev/null
      fi
    }

    if [[ $repo =~ .wiki$ ]] ; then
      # Suppress noise caused by misleading API responses
      clone_and_tag "$url" "$repo" 2>/dev/null
    else
      clone_and_tag "$url" "$repo"
    fi
  fi

  popd >/dev/null
done

