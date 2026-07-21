#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "Error: run this script from inside the aws-lab Git repository." >&2
  exit 1
}

cd "$repo_root"

source_dir="uhanku.com"
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

# Also remove any tracked paths that now match an ignore rule.
# Git normally keeps tracked ignored files, but an archive should omit them.
ignore_status=0
git check-ignore --no-index -z --stdin < "$file_list" > "$ignored_list" || ignore_status=$?
if [[ "$ignore_status" -ne 0 && "$ignore_status" -ne 1 ]]; then
  echo "Error: failed to evaluate .gitignore rules." >&2
  exit "$ignore_status"
fi

python3 - "$repo_root" "$output" "$file_list" "$ignored_list" <<'PY'
import os
import sys
import zipfile

repo_root, output, file_list, ignored_list = sys.argv[1:]
output = os.path.abspath(output)
temp_output = output + ".tmp"

def read_nul_list(path):
    with open(path, "rb") as stream:
        return {
            os.fsdecode(item)
            for item in stream.read().split(b"\0")
            if item
        }

paths = sorted(read_nul_list(file_list))
ignored_paths = read_nul_list(ignored_list)

included = 0

try:
    os.makedirs(os.path.dirname(output), exist_ok=True)

    with zipfile.ZipFile(
        temp_output,
        mode="w",
        compression=zipfile.ZIP_DEFLATED,
        compresslevel=9,
    ) as archive:
        for relative_path in paths:
            if relative_path in ignored_paths:
                continue

            full_path = os.path.join(repo_root, relative_path)

            # Skip deleted tracked files and avoid archiving the output itself.
            if not os.path.isfile(full_path):
                continue
            if os.path.abspath(full_path) in {output, os.path.abspath(temp_output)}:
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
PY
