import fs from 'fs';

import logger from '../logger.js';

const privateApi = {};

/**
 * Callback executed when creating recorder directory
 *
 * @param {Object} config
 * @return {Function}
 */
privateApi.createRecorderDirCb = (config) => (err) => {
  if (err) {
    // ignore the error if the folder already exists
    if (err.code !== 'EEXIST') {
      logger.error(err.message, 'setup');
      config.options.recorder.enabled = false;
      logger.error('Disabling recording as there was an error while creating directory', 'setup');
    }
  }
};

/**
 * Create recorder directory.
 * Folder is created only if recorder is enabled.
 *
 * @param {Object} config
 */
privateApi.createRecorderDir = (config) => {
  const recorderConfig = config.options.recorder;
  const path = recorderConfig.path;
  if (recorderConfig.enabled && path) {
    fs.mkdir(
      path,
      {
        recursive: true,
      },
      privateApi.createRecorderDirCb(config)
    );
  }

};


const service = {};

/**
 * Setup amiddy
 *
 * @param {Object} config
 */
service.init = (config) => {
  privateApi.createRecorderDir(config);
};


export {privateApi};
export default service;
