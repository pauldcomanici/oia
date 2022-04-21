
import parseChangelog from 'changelog-parser';
import fsExtra from 'fs-extra';
import eol from 'eol';


/**
 * Set changelog for a package
 * @param {String} packageDir
 *
 * @returns {Promise<void>}
 */
async function setChangelog(packageDir) {
  const unreleasedVersion = 'v-next';
  const changelogFilePath = `${packageDir}/CHANGELOG.md`;

  const packageJsonString = fsExtra.readFileSync(`${packageDir}/package.json`);
  const packageJson = JSON.parse(packageJsonString);
  const newVersion = packageJson.version;
  const packageName = packageJson.name;

  let changelogExists = false;
  let parsedChangelog;

  console.info(`[${packageName}] Preparing changelog`); // eslint-disable-line no-console
  try {
    if (fsExtra.existsSync(changelogFilePath)) {
      changelogExists = true;
    }
  } catch (err) {
    changelogExists = false;
  }

  if (changelogExists) {
    const fileContent = fsExtra.readFileSync(changelogFilePath, 'utf8');

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
      fsExtra.writeFileSync(changelogFilePath, eol.lf(newChangelogContent));
      console.info(`[${packageName}] Changelog was updated`); // eslint-disable-line no-console
    } else {
      console.error(`[${packageName}] Version is the same, cannot generate changelog`); // eslint-disable-line no-console
    }
  } else {
    console.error(`[${packageName}] CHANGELOG.md not found in ${packageDir}/`); // eslint-disable-line no-console
  }
}

export default setChangelog;
