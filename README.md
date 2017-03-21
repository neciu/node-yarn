# This project is deprecated
 This project is deprecated due to the fact that Node images now contain Yarn pre installed out of the box.

<p align="center">
  <a href="https://hub.docker.com/r/netczuk/node-yarn/">
    <img alt="node-yarn" src="https://raw.githubusercontent.com/Ghostium/node-yarn/master/node-yarn-docker-img-logo.png" width="600">
  </a>
</p>

---

## Supported Node/Yarn versions
List of supported versions:
* [Node](./node-versions.js)
* [Yarn](./yarn-versions.js)

Docker tags are build with given template:
```
node-{{nodeVersion}}-yarn-{{yarnVersion}}
```
Special case is `latest` tag which targets `latest` Node version and latest Yarn version specified in [./yarn-versions.js](./yarn-versions.js).

## Workflow
1. Change stuff.
2. Commit changes to master.
3. Run `npm start` (it will generate Dockerfiles in separate git tags)
4. Push git tags to remote: ``for t in `git tag --list`; do git push origin ${t}; done``
5. Profit!
