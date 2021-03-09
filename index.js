const simpleGit = require('simple-git')
const inquirer = require('inquirer')

const deployFeature = require('./deployFeature.js')
const deployStaging = require('./deployStaging.js')

const workingDir = process.argv[2] || './'

const DEPLOY_TYPES = {
  FEATURE: 'FEATURE',
  STAGING: 'STAGING',
  PRODUCTION: 'PRODUCTION',
}

const git = simpleGit(workingDir)

const typesOfDeploy = {
  type: 'list',
  name: 'deployType',
  message: 'Type of Deploy?',
  choices: [
    { name: 'Feature branch', value: DEPLOY_TYPES.FEATURE },
    { name: 'Staging', value: DEPLOY_TYPES.STAGING },
    { name: 'Production', value: DEPLOY_TYPES.PRODUCTION },
  ]
}

async function run() {
  try {
    const prompt = inquirer.createPromptModule()
    const { deployType } = await prompt(typesOfDeploy)

    switch (deployType) {
      case DEPLOY_TYPES.FEATURE:
        deployFeature(workingDir)
        break;
      case DEPLOY_TYPES.STAGING:
        deployStaging(workingDir)
        break;
    }
  } catch (e) {
    console.error(e.message)
  }
}

run()