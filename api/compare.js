const { exec } = require('child_process');
const path = require('path');

export default function handler(req, res) {
    const { repo1, repo2 } = req.query;

    if (!repo1 || !repo2) {
        return res.status(400).json({ error: 'Missing repo1 or repo2 parameter' });
    }

    const scriptPath = path.resolve('./compare_repos.py');

    exec(`python3 ${scriptPath} ${repo1} ${repo2}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: stderr });
        }
        const differences = JSON.parse(stdout);
        res.status(200).json(differences);
    });
}
