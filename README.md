This project serves primary for creating git tags in your projects

# Motivation

CI deploy in SiteOne uses tag as triggers. 

Since creating tags manually is a pain, s1-deploy package comes to the rescue!

# Usage

You can run `index.js` with `node` either from project you want to use it on, 
or from this project directly and pass you project location as a param

## Run from your project folder
- run `node ~/path/to/s1-deploy/index.js`

## Run from s1-deploy project folder
- run `node index.js ~/path/to/your/project` 

# How it works

The script will let you choose what type of deploy 
you want to use (preview, beta, staging, production) 
and creates corresponding tag which is then pushed to origin.
It also deletes tag if necessary (for preview branches)

# Running specific deploy type directly

You can also run specific deploy type directly, 
if you pass it as a second parameter:

- run `node ~/path/to/s1-deploy/index.js ./ FEATURE`

or

- run `node index.js ~/path/to/your/project FEATURE` 

This triggers feature deploy directly. 
You can pass following options as a second param:

- FEATURE
- BETA
- STAGING
- PRODUCTION