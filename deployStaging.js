const simpleGit = require('simple-git')

async function run(workingDir) {
  const git = simpleGit(workingDir)

  try {
    const { current: currentBranch } = await git.branchLocal()

    if (currentBranch !== 'staging') {
      console.error('There is no staging branch')

      return
    }

    const today = new Date()
    const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()
    const month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1

    let tagName = `staging-${today.getFullYear()}-${month}-${day}`

    const { all: allTags } = await git.tags()

    const todayTags = allTags.filter(tag => tag.includes(tagName))

    if (todayTags.length > 0) {
      const latestVersion = todayTags.reduce((latest, tag) => {
        const version = parseInt(tag.slice(-1))

        return latest < version ? version : latest
      }, 0)

      tagName += `.v${latestVersion + 1}`
    } else {
      tagName += '.v1'
    }

    await git.addTag(tagName)
    await git.push(['origin', tagName])

    console.log('DONE')
  } catch (e) {
    console.error(e.message)
  }
}

module.exports = run