// api/compare.js

// Import necessary modules
const fetch = require('node-fetch');
const { diffLines } = require('diff');

// Handler function for Vercel serverless function
module.exports = async (req, res) => {
  const { repo1, repo2 } = req.query;
  const fileName = 'file-to-check.txt'; // Adjust this to the file you want to compare

  try {
    // Fetch file from repo1
    const file1Response = await fetch(`https://raw.githubusercontent.com/${repo1}/main/${fileName}`);
    if (!file1Response.ok) {
      throw new Error(`Failed to fetch file from ${repo1}`);
    }
    const file1Text = await file1Response.text();

    // Fetch file from repo2
    const file2Response = await fetch(`https://raw.githubusercontent.com/${repo2}/main/${fileName}`);
    if (!file2Response.ok) {
      throw new Error(`Failed to fetch file from ${repo2}`);
    }
    const file2Text = await file2Response.text();

    // Perform diff comparison
    const diff = diffLines(file1Text, file2Text);

    // Prepare response with differences
    const differences = diff.filter(part => part.added || part.removed);

    res.status(200).json({ differences });
  } catch (error) {
    console.error('Error fetching and comparing files:', error);
    res.status(500).json({ error: 'Failed to fetch and compare files' });
  }
};
