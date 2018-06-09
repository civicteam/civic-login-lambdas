const r = require('jsrsasign');

const ALGO = 'ES256';
const CURVE = 'secp256r1';

const ECDSA = new r.ECDSA({ alg: ALGO, curve: CURVE });
const keyPairHex = ECDSA.generateKeyPairHex();

// NOTE be careful with the output of this script - private keys must be kept secret.
console.log(keyPairHex);
