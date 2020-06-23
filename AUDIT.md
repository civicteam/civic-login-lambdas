This project uses [npm audit](https://docs.npmjs.com/cli/audit) to scan dependencies for vulnerabilities
and automatically install any compatible updates to vulnerable dependencies.
The security audit is also integrated into the project's CI pipeline via [audit-ci](https://github.com/IBM/audit-ci) command
which fails the build if there is any vulnerability found.
It is possible to ignore specific errors by whitelisting them in [audit-ci config.](./audit-ci.json).

## NPM audit whitelist
Whenever you whitelist a specific advisory it is required to refer it here and justify the whitelisting.

### Advisories

| #    | Level | Module | Title | Explanation |
|------|-------|---------|------|-------------|
| 658  | Moderate   | base64url  | Out-of-bounds Read | required by jwt-js            |
| 1541  | Moderate   | jsrsasign  | Improper Verification of Cryptographic Signature | required by npm-civic-sip-api            |
| 1505  | High   | jsrsasign  | Timing attack | required by npm-civic-sip-api            |
| 1066  | High   | lodash.merge  | Prototype Pollution | required by jwt-js            |

