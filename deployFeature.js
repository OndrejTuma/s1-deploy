const inquirer = require('inquirer')
const simpleGit = require('simple-git')

function parseRMTaskNumber(branch) {
  const match = branch.match(/\d{5}/)

  return match ? parseInt(match[0]) : 0
}

const prompt = inquirer.createPromptModule()

async function run(workingDir) {
  const git = simpleGit(workingDir)

  try {
    const { all: allBranches, current: currentBranch } = await git.branchLocal()

    const { branch } = await prompt({
      type: 'list',
      name: 'branch',
      message: 'Which branch to deploy?',
      choices: allBranches,
      default: currentBranch,
    })

    const rmNumber = parseRMTaskNumber(branch)
    const branchName = branch.split('/').pop()

    if (!rmNumber) {
      console.error(`${branch} branch does not include a Redmine task number`)

      return
    }

    const tagName = `preview-feature-rm${rmNumber}-${branchName}`

    const { all: allTags } = await git.tags()

    // if tag exists, remove it
    if (allTags.includes(tagName)) {
      await git.tag(['-d', tagName])
      console.log('Removed local tag:', tagName)
      await git.push(['--delete', 'origin', tagName])
      console.log('Removed tag from origin:', tagName)
    }

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