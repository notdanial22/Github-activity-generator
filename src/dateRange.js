const jsonFile = require('jsonfile')
const moment = require('moment')
const simpleGit = require('simple-git')
const { faker } = require('@faker-js/faker')
const path = require('path')

/**
 * Generate commits for a date range with random distribution
 * @param {Object} options - Configuration options
 * @param {string} options.startDate - Start date in YYYY-MM-DD format
 * @param {string} options.endDate - End date in YYYY-MM-DD format
 * @param {number} options.maxCommitsPerDay - Maximum number of commits per day
 * @param {string} options.filePath - Path to the file to modify (default: './data.json')
 * @param {string} options.repoPath - Path to the git repository (default: process.cwd())
 * @returns {Promise} - Promise that resolves when all commits are made and pushed
 */

async function generateForDateRange(options) {
  const {
    startDate,
    endDate,
    maxCommitsPerDay = 5,
    filePath = './data.json',
    repoPath = process.cwd(),
  } = options

  if (!startDate || !endDate) {
    throw new Error('startDate and endDate are required')
  }

  const START_DATE = moment(startDate, 'YYYY-MM-DD')
  const END_DATE = moment(endDate, 'YYYY-MM-DD')
  const MAX_COMMITS_PER_DAY = maxCommitsPerDay
  const FILE_PATH = filePath

  if (!START_DATE.isValid() || !END_DATE.isValid()) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD format.')
  }

  if (END_DATE.isBefore(START_DATE)) {
    throw new Error('End date cannot be before start date')
  }

  const allCommits = []
  let current = START_DATE.clone()

  console.log(
    `🔍 Generating commits from ${START_DATE.format(
      'YYYY-MM-DD'
    )} to ${END_DATE.format('YYYY-MM-DD')}`
  )
  console.log(`📊 Maximum ${MAX_COMMITS_PER_DAY} commits per day`)

  while (current.isSameOrBefore(END_DATE, 'day')) {
    const commitsToday = faker.number.int({ min: 0, max: MAX_COMMITS_PER_DAY })

    for (let i = 0; i < commitsToday; i++) {
      const randomHour = faker.number.int({ min: 0, max: 23 })
      const randomMinute = faker.number.int({ min: 0, max: 59 })

      const commitDate = current
        .clone()
        .hour(randomHour)
        .minute(randomMinute)
        .second(0)
      allCommits.push(commitDate)
    }

    current.add(1, 'day')
  }

  console.log(`🎯 Generated ${allCommits.length} commits to make`)

  allCommits.sort((a, b) => a.valueOf() - b.valueOf())

  const git = simpleGit(repoPath)

  try {
    await git.status()
  } catch (error) {
    throw new Error(
      `Not a git repository: ${repoPath}. Please initialize a git repository first.`
    )
  }

  const makeCommit = async (index = 0) => {
    if (index >= allCommits.length) {
      console.log('✅ All commits made. Pushing to Git...')
      return git.push()
    }

    const DATE = allCommits[index].format()

    const data = { date: DATE }
    console.log(`📅 Commit ${index + 1}/${allCommits.length} on: ${DATE}`)

    return new Promise((resolve, reject) => {
      jsonFile.writeFile(FILE_PATH, data, async (err) => {
        if (err) {
          console.error('Error writing file:', err)
          reject(err)
          return
        }

        try {
          await git.add([FILE_PATH])
          await git.commit(`Commit on ${DATE}`, { '--date': DATE })
          resolve(makeCommit(index + 1))
        } catch (commitErr) {
          console.error('Error making commit:', commitErr)
          reject(commitErr)
        }
      })
    })
  }

  return makeCommit()
}

module.exports = { generateForDateRange }
