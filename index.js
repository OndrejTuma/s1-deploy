const simpleGit = require('simple-git')
const inquirer = require('inquirer')

const deployFeature = require('./deployFeature.js')
const deployBeta = require('./deployBeta.js')
const deployStaging = require('./deployStaging.js')
const deployProduction = require('./deployProduction.js')

const workingDir = process.argv[2] || './'

const DEPLOY_TYPES = {
  FEATURE: 'FEATURE',
  BETA: 'BETA',
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
    { name: 'Beta', value: DEPLOY_TYPES.BETA },
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
      case DEPLOY_TYPES.BETA:
        deployBeta(workingDir)
        break;
      case DEPLOY_TYPES.STAGING:
        deployStaging(workingDir)
        break;
      case DEPLOY_TYPES.PRODUCTION:
        deployProduction(workingDir)
        break;
    }
  } catch (e) {
    console.error(e.message)
  }
}

run()