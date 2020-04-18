
const parseChangelog = require('changelog-parser');
const {
  existsSync,
  readFileSync,
  writeFileSync,
} = require('fs-extra');
const eol = require('eol');


/**
 * Set changelog for a package
 * @param {String} packageDir
 *
 * @returns {Promise<void>}
 */
async function setChangelog(packageDir) {
  const unreleasedVersion = 'v-next';
  const changelogFilePath = `${packageDir}/CHANGELOG.md`;

  const packageJsonString = readFileSync(`${packageDir}/package.json`);
  const packageJson = JSON.parse(packageJsonString);
  const newVersion = packageJson.version;
  const packageName = packageJson.name;

  let changelogExists = false;
  let parsedChangelog;

  console.info(`[${packageName}] Preparing changelog`);
  try {
    if (existsSync(changelogFilePath)) {
      changelogExists = true;
    }
  } catch (err) {
    changelogExists = false;
  }

  if (changelogExists) {
    const fileContent = readFileSync(changelogFilePath, 'utf8');

    try {
      parsedChangelog = await parseChangelog({
        text: fileContent,
      });
    } catch (error) {
      console.warn(`[${packageName}] ${changelogFilePath} has parsing issues`); // eslint-disable-line no-console
    }

    let newChangelogContent = `# ${parsedChangelog.title}\n`;

    newChangelogContent += `\n## ${unreleasedVersion}\n`;
    const newTitleVersion = `v${newVersion}`;
    let updateChangeLogContent = true;

    parsedChangelog.versions.forEach(
      ({title, body}) => {
        const titleVersion = title.split(' - ')[0];
        if (titleVersion === newTitleVersion) {
          updateChangeLogContent = false;
        }
        if (updateChangeLogContent) {
          if (body) {
            let versionTitle = title;

            if (title === unreleasedVersion) {
              const releaseDate = new Date()
                .toISOString()
                .substr(0, 10);
              versionTitle = `${newTitleVersion} - ${releaseDate}`;
            }

            newChangelogContent += `\n## ${versionTitle}\n${body}\n`;
          }
        }
      }
    );

    if (updateChangeLogContent) {
      writeFileSync(changelogFilePath, eol.lf(newChangelogContent));
      console.info(`[${packageName}] Changelog was updated`);
    } else {
      console.error(`[${packageName}] Version is the same, cannot generate changelog`);
    }
  } else {
    console.error(`[${packageName}] CHANGELOG.md not found in ${packageDir}/`);
  }
}

module.exports = setChangelog;
