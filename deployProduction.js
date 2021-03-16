const inquirer = require('inquirer')
const simpleGit = require('simple-git')

const prompt = inquirer.createPromptModule()

function getIncrementedVersion(oldVersion, versionType) {
  const [major, minor, patch] = oldVersion.split('.')

  switch (versionType) {
    case 'patch':
      return [major, minor, parseInt(patch) + 1].join('.')
    case 'minor':
      return [major, parseInt(minor) + 1, patch].join('.')
    case 'major':
      return [parseInt(major) + 1, minor, patch].join('.')
    default:
      return oldVersion
  }
}

async function run(workingDir) {
  const git = simpleGit(workingDir)

  try {
    const { current: currentBranch } = await git.branchLocal()

    if (currentBranch !== 'master') {
      console.error('You\'re not on master branch')

      return
    }

    const { semVer } = await prompt({
      type: 'list',
      name: 'semVer',
      message: 'Version of deploy?',
      choices: ['patch', 'minor', 'major'],
      default: 'patch',
    })

    const { all: allTags } = await git.tags()

    const latestVersion = allTags.reduce((acc, tag) => {
      const version = tag.match(/^v(\d+\.\d+\.\d+)/)

      if (!version) {
        return acc
      }

      const [accMajor, accMinor, accPatch] = acc.split('.')
      const [major, minor, patch] = version[1].split('.')

      if (parseInt(accMajor) === parseInt(major) && parseInt(accMinor) === parseInt(minor)) {
        return parseInt(patch) > parseInt(accPatch) ? version[1] : acc
      }
      if (parseInt(accMajor) === parseInt(major)) {
        return parseInt(minor) > parseInt(accMinor) ? version[1] : acc
      }

      return parseInt(major) > parseInt(accMajor) ? version[1] : acc
    }, '0.0.0')
    const latestRc = allTags.reduce((acc, tag) => {
      const rc = tag.match(/-rc\.(\d+)$/)

      if (!rc) {
        return acc
      }

      const parsedRc = parseInt(rc[1])

      return parsedRc > acc ? parsedRc : acc
    }, 0)

    const tagName = `v${getIncrementedVersion(latestVersion, semVer)}-rc.${latestRc + 1}`

    await git.addTag(tagName)
    console.log('Created tag:', tagName)
    await git.push(['origin', tagName])
    console.log('Tag pushed to origin')

    console.log('DONE')
  } catch (e) {
    console.error(e.message)
  }
}

module.exports = run