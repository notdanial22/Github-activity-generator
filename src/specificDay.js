const jsonFile = require('jsonfile')
const moment = require('moment')
const simpleGit = require('simple-git')
const { faker } = require('@faker-js/faker')
const path = require('path')

/**
 * Generate a specific number of commits for a single day
 * @param {Object} options - Configuration options
 * @param {string} options.date - Date in YYYY-MM-DD format
 * @param {number} options.numberOfCommits - Number of commits to make
 * @param {string} options.filePath - Path to the file to modify (default: './data.json')
 * @param {string} options.repoPath - Path to the git repository (default: process.cwd())
 * @returns {Promise} - Promise that resolves when all commits are made and pushed
 */
async function generateForSpecificDay(options) {
  const {
    date,
    numberOfCommits,
    filePath = './data.json',
    repoPath = process.cwd(),
  } = options

  if (!date) {
    throw new Error('date is required')
  }

  if (typeof numberOfCommits !== 'number' || numberOfCommits < 1) {
    throw new Error('numberOfCommits must be a positive number')
  }

  const TARGET_DATE = moment(date, 'YYYY-MM-DD')
  const FILE_PATH = filePath

  if (!TARGET_DATE.isValid()) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD format.')
  }

  const allCommits = []

  console.log(
    `🔍 Generating ${numberOfCommits} commits for ${TARGET_DATE.format(
      'YYYY-MM-DD'
    )}`
  )

  for (let i = 0; i < numberOfCommits; i++) {
    const hoursPerCommit = 24 / numberOfCommits
    const baseHour = Math.floor(i * hoursPerCommit)

    const randomHourOffset = faker.number.float({
      min: 0,
      max: hoursPerCommit * 0.8,
    })
    const hour = Math.min(Math.floor(baseHour + randomHourOffset), 23)
    const minute = faker.number.int({ min: 0, max: 59 })

    const commitDate = TARGET_DATE.clone().hour(hour).minute(minute).second(0)
    allCommits.push(commitDate)
  }

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

module.exports = { generateForSpecificDay }
