
import chalk from 'chalk';


/**
 * Private api for logging
 *
 * @protected
 * @const {Object}
 */
const privateApi = {};

/**
 * Map of method name and background color to use
 *
 * @const {Object}
 */
privateApi.methodBg = {
  DELETE: chalk.bgRed.white,
  GET: chalk.bgGreen.black,
  HEAD: chalk.bgCyanBright.black,
  PATCH: chalk.bgCyan.black,
  POST: chalk.bgBlue.white,
  PUT: chalk.bgBlueBright.white,
};

/**
 * Map of status code and color.
 *
 * @const {Object}
 */
privateApi.statusColor = {
  2: chalk.green,
  3: chalk.yellow,
  4: chalk.redBright,
  5: chalk.red,
};

/**
 * Map of colors for different type of messages
 *
 * @const {Object}
 */
privateApi.messageColors = {
  error: {
    category: chalk.bgRed.white,
    text: chalk.red,
  },
  success: {
    category: chalk.bgGreen.black,
    text: chalk.green,
  },
};

/**
 * Log message
 *
 * @param {String} message
 * @param {String} [category]
 * @param {String} type
 */
privateApi.message = (message, category, type) => {
  const color = privateApi.messageColors[type] || privateApi.messageColors.success;

  const categoryLog = category ? color.category(`[${category}]`) : '';
  console.log(`${categoryLog} ${color.text(message)}`); // eslint-disable-line no-console
};

/**
 * Log method name
 *
 * @param {String} name - method name
 * @return {String}
 */
privateApi.method = (name) => {
  const color = privateApi.methodBg[name] || chalk.bgMagenta.black;

  return color(` ${name.padEnd(7, ' ')} `);
};

/**
 * Log status code
 *
 * @param {String} code - status code
 * @return {String}
 */
privateApi.status = (code) => {
  const codePrefix = Math.floor(code / 100);

  const color = privateApi.statusColor[codePrefix] || chalk.magenta;

  return color(` ${code} `);
};

/**
 * Log time for execution
 *
 * @param {Number} start - start time in ms
 * @param {Number} now - current time in ms
 * @return {String}
 */
privateApi.time = (start, now) => {
  const time = now - start;
  let str = time.toString();
  let unit = 'ms';

  if (time > 1000) {
    const seconds = time / 1000;
    let fractionDigit = 2;
    if (seconds > 100) {
      fractionDigit = 0;
    } else if (seconds > 10) {
      fractionDigit = 1;
    }
    str = seconds.toFixed(fractionDigit);
    unit = 's';
  }

  return chalk.gray(`${str.padStart(5, ' ')} ${unit.padStart(2, ' ')} `);
};


const service = {};

/**
 * Log response
 *
 * @param {Object} data - request data
 * @param {Object} res - response data
 */
service.response = (data, res) => {
  let executionTime;
  if (data.startTime) {
    const now = global.Date.now();
    executionTime = privateApi.time(data.startTime, now);
  } else {
    executionTime = privateApi.time(0, 0);
  }

  const msgParts = [
    privateApi.method(data.method),
    privateApi.status(res.statusCode),
    executionTime,
    data.uri,
  ];

  console.log(msgParts.join('')); // eslint-disable-line no-console
};

/**
 * Log error
 *
 * @param {String} message
 * @param {String} [category]
 */
service.error = (message, category) => {
  privateApi.message(message, category, 'error');
};

/**
 * Log success
 *
 * @param {String} message
 * @param {String} [category]
 */
service.success = (message, category) => {
  privateApi.message(message, category, 'success');
};

// only for testing
export {privateApi};

export default service;
