import os
import hashlib
import subprocess
from pathlib import Path
import sys
import json

def clone_repo(repo_url, clone_dir):
    subprocess.run(['git', 'clone', '--depth=1', repo_url, clone_dir], check=True)

def get_all_files(directory):
    file_paths = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_paths.append(Path(root) / file)
    return file_paths

def file_hash(file_path):
    hash_algo = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_algo.update(chunk)
    return hash_algo.hexdigest()

def compare_files(repo1_files, repo2_files, repo1_dir, repo2_dir):
    repo1_hashes = {file: file_hash(file) for file in repo1_files}
    repo2_hashes = {file: file_hash(file) for file in repo2_files}

    differences = []

    for file1, hash1 in repo1_hashes.items():
        file2 = Path(str(file1).replace(str(repo1_dir), str(repo2_dir)))
        if file2 in repo2_hashes:
            if hash1 != repo2_hashes[file2]:
                differences.append((str(file1), str(file2)))
        else:
            differences.append((str(file1), None))

    for file2 in repo2_hashes.keys():
        file1 = Path(str(file2).replace(str(repo2_dir), str(repo1_dir)))
        if file1 not in repo1_hashes:
            differences.append((None, str(file2)))

    return differences

def main(repo1_url, repo2_url):
    repo1_dir = Path('repo1')
    repo2_dir = Path('repo2')

    clone_repo(repo1_url, repo1_dir)
    clone_repo(repo2_url, repo2_dir)

    repo1_files = get_all_files(repo1_dir)
    repo2_files = get_all_files(repo2_dir)

    differences = compare_files(repo1_files, repo2_files, repo1_dir, repo2_dir)

    return differences

if __name__ == '__main__':
    repo1_url = sys.argv[1]
    repo2_url = sys.argv[2]
    differences = main(repo1_url, repo2_url)
    print(json.dumps(differences))
