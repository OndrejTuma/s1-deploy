(async () => {
  const simpleGit = require('simple-git')
  const inquirer = require('inquirer')

  const workingDir = process.argv[2] || './'

  const git = simpleGit(workingDir)

  const questions = [
    {
      type: 'list',
      name: 'deployType',
      message: 'Type of Deploy?',
      choices: [
        { name: 'Feature branch', value: 'f' },
        { name: 'Beta', value: 'b' },
        { name: 'Production', value: 'p' },
      ]
    }
  ]

  try {
    const { current: currentBranch } = await git.branch()

    const prompt = inquirer.createPromptModule()
    const { deployType } = await prompt(questions)

    console.log(currentBranch, deployType)
  } catch (e) {
    console.error(e.message)
  }
})()