### Civic Login Lambdas

A simple library to  secure AWS Lambda resources using Civic Authentication.

### Installation

run `npm install civic-login-lambdas` --save

### Configuration

loginHandler.js

``` bash
import authFactory from 'civic-login-lambdas';

/*
Where logger is an instance of a winston logger that logs to your console or custom enviroment 
or you can set `const logger = false` to turn this off.
*/
import logger from './logger';

// Your login config details
import config from '../../config';

let authHandler;

// This callback function verifies the email address of the user 
const authCallback = userData => {
  const email = authHandler.sipClient.getEmailFromUserData(userData);
  if (!email.value.endsWith('@civic.com')) {
    return 'Please provide a valid email address';
  }

  if (!email.isOwner || !email.isValid) {
    return 'You are not the owner or the email address is not valid.';
  }

  return null;
};

// This function initializes the civic-login-lambdas library
authHandler = authFactory(logger, config.login, authCallback);

// This function handles the login authentication with civic
export const login = (event, context, callback) => authHandler.login(event, context, callback);

// This function renews the session token
export const keepAlive = (event, context, callback) => authHandler.keepAlive(event, context, callback);

// This function validates the session token
export const sessionAuthorizer = (event, context, callback) => authHandler.sessionAuthorizer(event, context, callback);
```

where config is a JS object that looks like 

```
login: {
  app: {
    appId: 'xx',
    pubKey: 'xxx'
    encPubKey: 'xxx',
    env: 'xxx
  },   
  sessionToken: {
    issuer: 'xxx',
    audience: 'xxx',
    subject: 'xxx',
    pubKey: 'xxx'
  }
}
```
See [Civic Docs](https://docs.civic.com/#GettingStarted) for details on getting and setting the config options.

### Example Usage

 Add a `login` and `keepAlive` function to your `serverless.yml`
 
 ```
 functions:
   login:
     handler: loginHandler.login
     timeout: 30
     events:
       - http:
         path: login
         method: POST
         cors: true
   keepAlive:
     handler: loginHandler.keepAlive
     timeout: 30
     events:
       - http:
         path: session/keepAlive
         method: POST
         cors: true
   sessionAuthorizer:
     handler: loginHandler.sessionAuthorizer
 ```

### Linting 

This project is using the [airbnb](https://github.com/airbnb/javascript) linting rules.

Run the following to lint the project
```
npm run lint
```

### Testing

This project was tested using [chai.js](http://www.chaijs.com/) and the [expect](http://www.chaijs.com/api/bdd/) assertion library

Run the following to test the project
```
npm run test
```
