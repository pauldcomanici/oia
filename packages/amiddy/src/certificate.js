import fs from 'fs';
import selfsigned from 'selfsigned';

const privateApi = {};

/**
 * Get name that will be used as value for altNames
 *
 * @param {String} vhostName
 * @return {String} altName
 */
privateApi.getAltName = (vhostName) => {
  const parts = vhostName.split('.');
  const partsLen = parts.length;

  if (partsLen <= 2) {
    return vhostName;
  }

  const [, ...relevantParts] = parts;

  return `*.${relevantParts.join('.')}`;
};

const service = {};

/**
 * Read certificate files
 *
 * @param {Object} config
 * @param {String} config.cert - path to the cert file
 * @param {String} config.key - path to the key file
 * @return {Object}
 */
service.read = (config) => {
  const sslObj = {};

  sslObj.cert = fs.readFileSync(config.cert);
  sslObj.key = fs.readFileSync(config.key);

  return sslObj;
};

/**
 * Generate certificate
 * @param {String} vhostName
 * @param {Object} [selfsignedConf]
 * @return {Object}
 */
service.generate = (vhostName, selfsignedConf) => {
  const conf = selfsignedConf || {};

  const name = privateApi.getAltName(vhostName);

  const selfsignedAttrs = conf.attrs || [
    {
      name: 'commonName',
      value: name,
    },
    {
      name: 'organizationName',
      value: 'amiddy Trust',
    },
  ];
  const selfsignedOpts = conf.opts || {
    algorithm: 'sha256',
    clientCertificate: true,
    clientCertificateCN: 'amiddy',
    days: 365,
    extensions: [
      {
        cA: false,
        critical: true,
        name: 'basicConstraints',
      },
      {
        critical: true,
        dataEncipherment: true,
        digitalSignature: true,
        keyCertSign: true,
        keyEncipherment: true,
        name: 'keyUsage',
        nonRepudiation: true,
      },
      {
        clientAuth: true,
        name: 'extKeyUsage',
        serverAuth: true,
      },
      {
        altNames: [
          {
            type: 2, // DNS
            value: name,
          },
        ],
        name: 'subjectAltName',
      },
      {
        name: 'subjectKeyIdentifier',
      },
      {
        authorityCertIssuer: true,
        keyIdentifier: true,
        name: 'authorityKeyIdentifier',
        serialNumber: true,
      },
    ],
    keySize: 2048,
  };

  return selfsigned.generate(selfsignedAttrs, selfsignedOpts);
};


// only for testing
export {privateApi};

export default service;
