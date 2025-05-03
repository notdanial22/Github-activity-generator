# GitHub Activity Generator

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-ISC-green.svg" alt="License">
  <img src="https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg" alt="Node">
</p>

> 📅 Easily generate GitHub activity by creating backdated commits to fill your contribution graph.

GitHub Activity Generator is a powerful tool that helps you create backdated commits to fill in your GitHub contribution graph. Whether you want to add activity for specific days or generate random commits across a date range, this package makes it simple.

## 🚀 Features

- Create commits for a specific day with an exact number of commits
- Generate random commits across a date range
- Distribute commits throughout the day at realistic times
- Simple CLI interface for quick usage
- Flexible API for integration into your own scripts
- Works with any Git repository

## 📋 Prerequisites

- Node.js (v14 or higher)
- Git installed and configured
- A GitHub repository that you have push access to

## 💻 Installation

### Global Installation (Recommended for CLI usage)

```bash
npm install -g github-activity-generator
```

### Local Installation (For programmatic usage)

```bash
npm install github-activity-generator
```

## 🔧 Usage

### Command Line Interface (CLI)

The package provides a simple command-line interface with two main commands:

#### Option 1: Generate commits for a specific day

```bash
github-activity-generator day --date "2023-06-15" --commits 8
```

This will create 8 commits on June 15, 2023, distributed throughout the day.

#### Option 2: Generate commits for a date range

```bash
github-activity-generator range --start-date "2023-06-01" --end-date "2023-06-30" --max-commits 5
```

This will create random commits (0-5 per day) for each day from June 1 to June 30, 2023.

#### Additional CLI Options

```bash
# Show help
github-activity-generator --help

# Show help for a specific command
github-activity-generator day --help
github-activity-generator range --help

# Specify a custom file to modify
github-activity-generator day --date "2023-06-15" --commits 8 --file-path "./custom-data.json"

# Specify a different repository path
github-activity-generator range --start-date "2023-06-01" --end-date "2023-06-30" --repo-path "../my-other-repo"
```

### Programmatic Usage

You can also use the package programmatically in your Node.js scripts:

#### Option 1: Generate for a specific day

```javascript
const { generateForSpecificDay } = require('github-activity-generator')

generateForSpecificDay({
  date: '2023-06-15', // Target date (YYYY-MM-DD)
  numberOfCommits: 8, // Number of commits to make
  filePath: './data.json', // Optional: file to modify
  repoPath: './', // Optional: repository path
})
  .then(() => {
    console.log('Successfully generated GitHub activity!')
  })
  .catch((err) => {
    console.error('Error:', err)
  })
```

#### Option 2: Generate for a date range

```javascript
const { generateForDateRange } = require('github-activity-generator')

generateForDateRange({
  startDate: '2023-06-01', // Start date (YYYY-MM-DD)
  endDate: '2023-06-30', // End date (YYYY-MM-DD)
  maxCommitsPerDay: 5, // Maximum commits per day
  filePath: './data.json', // Optional: file to modify
  repoPath: './', // Optional: repository path
})
  .then(() => {
    console.log('Successfully generated GitHub activity!')
  })
  .catch((err) => {
    console.error('Error:', err)
  })
```

## 📝 How It Works

### Option 1: Specific Day with Fixed Number of Commits

When you choose this option:

1. You specify a target date and the exact number of commits you want
2. The script distributes these commits throughout the day at semi-random times
3. For each commit:
   - It updates the data.json file with the current timestamp
   - Adds the file to git
   - Creates a commit with the backdated timestamp
   - Moves to the next commit
4. Finally, it pushes all commits to GitHub

### Option 2: Date Range with Random Commits

When you choose this option:

1. You specify a start date, end date, and maximum commits per day
2. For each day in the range:
   - The script randomly decides how many commits to make (0 to max)
   - Assigns random times to each commit
3. It then processes all commits in chronological order:
   - Updates the data.json file
   - Adds and commits with the backdated timestamp
   - Moves to the next commit
4. Finally, it pushes all commits to GitHub

## 🔍 Examples

### Fill in weekends for the last month

```bash
# Get the first day of last month
LAST_MONTH=$(date -d "last month" +%Y-%m-01)

# Get the last day of last month
LAST_DAY=$(date -d "$LAST_MONTH +1 month -1 day" +%Y-%m-%d)

# Generate activity
github-activity-generator range --start-date "$LAST_MONTH" --end-date "$LAST_DAY" --max-commits 3
```

### Add activity for a specific holiday or event

```bash
# Add 10 commits for Christmas
github-activity-generator day --date "2023-12-25" --commits 10
```

## ⚠️ Important Notes

- This tool requires a git repository to work
- The repository should be connected to a remote (GitHub)
- You should have proper authentication set up for pushing to the remote
- GitHub's terms of service may have policies about artificially manipulating contribution graphs
- This tool is intended for educational purposes

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/notdanial22/github-activity-generator/issues).

## 📜 License

This project is [ISC](LICENSE) licensed.

## ⭐ Support

If you find this tool helpful, please consider giving it a star on GitHub! It helps others discover the project and motivates further development.

[⭐ Star this repo](https://github.com/notdanial22/github-activity-generator)

---

Created with ❤️ by [Muhammad Danial](https://github.com/notdanial22)
