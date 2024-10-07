const Hashes = require("jshashes");

/**
 * Hashes an email combined with a secret using SHA-256.
 *
 * @param {string} email - The email address to be hashed.
 * @param {string} secret - The secret key to be combined with the email.
 * @returns {string} The resulting SHA-256 hash in hexadecimal format.
 */
const createHashForEmail = (email, secret) => {
  const combined = email + secret;
  const SHA256 = new Hashes.SHA256();
  return SHA256.hex(combined);
};

module.exports = {
  createHashForEmail,
};
