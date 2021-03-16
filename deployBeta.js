const inquirer = require('inquirer')
const simpleGit = require('simple-git')

const prompt = inquirer.createPromptModule()

async function run(workingDir) {
  const git = simpleGit(workingDir)

  try {
    const { current: currentBranch } = await git.branchLocal()

    if (currentBranch !== 'beta') {
      console.error('You\'re not on beta branch')

      return
    }

    const tagName = 'preview-beta'

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