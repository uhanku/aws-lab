#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "Error: run this script from inside the aws-lab Git repository." >&2
  exit 1
}

cd "$repo_root"

source_dir="uhanku.com"
always_include_dir="uhanku.com/src/blog/inspiration"
output="${1:-uhanku.com.zip}"

if [[ "$output" != /* ]]; then
  output="$repo_root/$output"
fi

if [[ ! -d "$source_dir" ]]; then
  echo "Error: $source_dir was not found in $repo_root." >&2
  exit 1
fi

command -v python3 >/dev/null 2>&1 || {
  echo "Error: python3 is required." >&2
  exit 1
}

file_list="$(mktemp)"
ignored_list="$(mktemp)"
trap 'rm -f "$file_list" "$ignored_list"' EXIT

# Gather tracked files plus untracked files that Git does not ignore.
git ls-files \
  --cached \
  --others \
  --exclude-standard \
  -z \
  -- "$source_dir" > "$file_list"

# Identify paths that currently match .gitignore rules.
ignore_status=0
git check-ignore --no-index -z --stdin < "$file_list" > "$ignored_list" \
  || ignore_status=$?

if [[ "$ignore_status" -ne 0 && "$ignore_status" -ne 1 ]]; then
  echo "Error: failed to evaluate .gitignore rules." >&2
  exit "$ignore_status"
fi

python3 - \
  "$repo_root" \
  "$output" \
  "$file_list" \
  "$ignored_list" \
  "$always_include_dir" <<'PY'
import os
import sys
import zipfile

repo_root, output, file_list, ignored_list, always_include_dir = sys.argv[1:]

repo_root = os.path.abspath(repo_root)
output = os.path.abspath(output)
temp_output = output + ".tmp"

always_include_dir = always_include_dir.rstrip("/\\")
always_include_root = os.path.join(repo_root, always_include_dir)


def read_nul_list(path):
    with open(path, "rb") as stream:
        return {
            os.fsdecode(item)
            for item in stream.read().split(b"\0")
            if item
        }


def is_force_included(relative_path):
    normalized = relative_path.replace(os.sep, "/")
    included = always_include_dir.replace(os.sep, "/")
    return normalized == included or normalized.startswith(included + "/")


paths = read_nul_list(file_list)
ignored_paths = read_nul_list(ignored_list)

# Force-include every file beneath the ignored inspiration directory.
if os.path.isdir(always_include_root):
    for directory, _, filenames in os.walk(always_include_root):
        for filename in filenames:
            full_path = os.path.join(directory, filename)

            if not os.path.isfile(full_path):
                continue

            relative_path = os.path.relpath(full_path, repo_root)
            paths.add(relative_path)

included = 0

try:
    os.makedirs(os.path.dirname(output), exist_ok=True)

    with zipfile.ZipFile(
        temp_output,
        mode="w",
        compression=zipfile.ZIP_DEFLATED,
        compresslevel=9,
    ) as archive:
        for relative_path in sorted(paths):
            # Apply .gitignore normally, except for the force-included folder.
            if (
                relative_path in ignored_paths
                and not is_force_included(relative_path)
            ):
                continue

            full_path = os.path.join(repo_root, relative_path)

            # Skip deleted tracked files and avoid archiving the ZIP itself.
            if not os.path.isfile(full_path):
                continue

            if os.path.abspath(full_path) in {
                output,
                os.path.abspath(temp_output),
            }:
                continue

            archive.write(full_path, arcname=relative_path)
            included += 1

    os.replace(temp_output, output)
except Exception:
    try:
        os.remove(temp_output)
    except FileNotFoundError:
        pass
    raise

print(f"Created: {output}")
print(f"Files included: {included}")
print(f"Force-included directory: {always_include_dir}")
PY