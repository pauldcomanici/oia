
const {
  join,
} = require('path');
const {
  lstatSync,
  readdirSync,
} = require('fs-extra');


const setChangelog = require('./package.js');


/**
 * Determine if the path provided is a directory
 *
 * @param {String} path
 * @returns {Boolean}
 */
function isDirectory(path) {
  return lstatSync(path).isDirectory();
}


/**
 * Get directories that contain packages
 *
 * @returns {Array<String>}
 */
function getPackageDirectories() {
  const dirName = 'packages';
  try {
    return readdirSync(dirName)
      .map(name => join(dirName, name))
      .filter(isDirectory);
  } catch (err) {
    return [];
  }
}


const packageDirs = getPackageDirectories();


if (packageDirs.length > 0) {
  // we are on root folder => build changelog for all packages
  packageDirs.forEach(setChangelog);
} else {
  setChangelog('.');
}
