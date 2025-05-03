#!/usr/bin/env node

const { generateForDateRange } = require('./dateRange')
const { generateForSpecificDay } = require('./specificDay')

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
  .command(
    'range',
    'Generate commits for a date range',
    (yargs) => {
      return yargs
        .option('start-date', {
          alias: 's',
          describe: 'Start date (YYYY-MM-DD)',
          type: 'string',
          demandOption: true,
        })
        .option('end-date', {
          alias: 'e',
          describe: 'End date (YYYY-MM-DD)',
          type: 'string',
          demandOption: true,
        })
        .option('max-commits', {
          alias: 'm',
          describe: 'Maximum commits per day',
          type: 'number',
          default: 5,
        })
        .option('file-path', {
          alias: 'f',
          describe: 'Path to the file to modify',
          type: 'string',
          default: './data.json',
        })
        .option('repo-path', {
          alias: 'r',
          describe: 'Path to the git repository',
          type: 'string',
          default: process.cwd(),
        })
    },
    (argv) => {
      generateForDateRange({
        startDate: argv.startDate,
        endDate: argv.endDate,
        maxCommitsPerDay: argv.maxCommits,
        filePath: argv.filePath,
        repoPath: argv.repoPath,
      }).catch((err) => {
        console.error('Error:', err.message)
        process.exit(1)
      })
    }
  )
  .command(
    'day',
    'Generate commits for a specific day',
    (yargs) => {
      return yargs
        .option('date', {
          alias: 'd',
          describe: 'Target date (YYYY-MM-DD)',
          type: 'string',
          demandOption: true,
        })
        .option('commits', {
          alias: 'c',
          describe: 'Number of commits to make',
          type: 'number',
          demandOption: true,
        })
        .option('file-path', {
          alias: 'f',
          describe: 'Path to the file to modify',
          type: 'string',
          default: './data.json',
        })
        .option('repo-path', {
          alias: 'r',
          describe: 'Path to the git repository',
          type: 'string',
          default: process.cwd(),
        })
    },
    (argv) => {
      generateForSpecificDay({
        date: argv.date,
        numberOfCommits: argv.commits,
        filePath: argv.filePath,
        repoPath: argv.repoPath,
      }).catch((err) => {
        console.error('Error:', err.message)
        process.exit(1)
      })
    }
  )
  .demandCommand(1, 'You need to specify a command')
  .help().argv
