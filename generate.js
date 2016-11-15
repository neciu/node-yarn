const fs = require('fs');
const fsPath = require('fs-path');
require('shelljs/global');
const nodeVersions = require('./node-versions');
const yarnVersions = require('./yarn-versions');


const template = fs.readFileSync('./Dockerfile.template', 'utf8');
const dockerfilePermutations =
  getDockerfilePermutations(nodeVersions, yarnVersions);
generateDockerfiles(template, dockerfilePermutations);
console.info('Done.');


function getDockerfilePermutations() {
  let permutations = [];
  for (nV of nodeVersions.versions) {
    for (yV of yarnVersions.versions) {
      permutations = permutations.concat({ nodeVersion: nV, yarnVersion: yV });
    }
  }
  const latest = {
    nodeVersion: nodeVersions.latest,
    yarnVersion: yarnVersions.latest,
  };

  return { permutations, latest };
}

function generateDockerfiles(template, dockerfilePermutations) {
  exec('git tag --list | xargs git tag -d');
  generateLatestDockerfile(template, dockerfilePermutations);

  for (versions of dockerfilePermutations.permutations) {
    exec('git checkout --detach');
    const { nodeVersion, yarnVersion } = versions;
    const path = `./Dockerfile`;
    generateDockerfile(path, template, nodeVersion, yarnVersion);
    exec('git add ./Dockerfile');
    exec(`git commit -m 'node-${nodeVersion}-yarn-${yarnVersion}'`);
    exec(`git tag 'node-${nodeVersion}-yarn-${yarnVersion}'`);
    exec('git checkout master');
  }
}

function generateLatestDockerfile(template, dockerfilePermutations) {
  exec('git checkout --detach');
  generateDockerfile(
    './Dockerfile',
    template,
    dockerfilePermutations.latest.nodeVersion,
    dockerfilePermutations.latest.yarnVersion
  );
  exec('git add ./Dockerfile');
  exec('git commit -m latest');
  exec('git tag latest');
  exec('git checkout master');
}

function generateDockerfile(path, template, nodeVersion, yarnVersion) {
  console.info(`Generating Dockerfile: ${path} ...`);
  const filledTemplate = template
    .replace('{{nodeVersion}}', nodeVersion)
    .replace('{{yarnVersion}}', yarnVersion);
  fsPath.writeFileSync(path, filledTemplate);
}
