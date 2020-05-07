import fs from 'fs';
import path from 'path';


const privateApi = {};

/**
 * Test if the provided filePath represents a file
 *
 * @param {String} filePath
 * @return {Boolean}
 */
privateApi.isFile = (filePath) => (
  fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()
);


const service = {};

/**
 * Synchronously read file contents.
 *
 * @param {String} filePath The filename to read.
 * @return {String} The file contents, with the BOM removed.
 */
service.read = (filePath) => (
  fs.readFileSync(filePath, 'utf8').replace(/^\ufeff/u, '')
);

/**
 * Test if the provided filePath represents a file
 *
 * @param {String} pathToResolve
 * @return {String}
 * @throws {Error}
 */
service.getAbsolutePath = (pathToResolve) => {
  const cwd = process.cwd();

  const absolutePath = path.isAbsolute(pathToResolve) ?
    pathToResolve : path.resolve(cwd, pathToResolve);

  if (privateApi.isFile(absolutePath)) {
    return absolutePath;
  }

  throw Error(` Cannot resolve file: ${pathToResolve}\n cwd: ${cwd}`);
};

export {privateApi};
export default service;
