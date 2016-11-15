const fs = require('fs');
const fsPath = require('fs-path');
const nodeVersions = require('./node-versions');
const yarnVersions = require('./yarn-versions');


const template = fs.readFileSync('./Dockerfile.template', 'utf8');
flushDockerfiles();
const dockerfilePermutations =
  getDockerfilePermutations(nodeVersions, yarnVersions);
generateDockerfiles(template, dockerfilePermutations);
console.info('Done.');


function flushDockerfiles() {
  // rimraf.sync('./dockerfiles');
  fsPath.removeSync('./dockerfiles');
}

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
  generateLatestDockerfile(template, dockerfilePermutations);
}

function generateLatestDockerfile(template, dockerfilePermutations) {
  generateDockerfile(
    './dockerfiles/Dockerfile',
    template,
    dockerfilePermutations.latest.nodeVersion,
    dockerfilePermutations.latest.yarnVersion
  );

  for (versions of dockerfilePermutations.permutations) {
    const { nodeVersion, yarnVersion } = versions;
    const path = `./dockerfiles/${nodeVersion}/${yarnVersion}/Dockerfile`;
    generateDockerfile(path, template, nodeVersion, yarnVersion);
  }
}

function generateDockerfile(path, template, nodeVersion, yarnVersion) {
  console.info(`Generating Dockerfile: ${path} ...`);
  const filledTemplate = template
    .replace('{{nodeVersion}}', nodeVersion)
    .replace('{{yarnVersion}}', yarnVersion);
  fsPath.writeFileSync(path, filledTemplate);
}
