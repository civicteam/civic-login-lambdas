### Civic Login Lambdas

A library to secure AWS Lambda resources using Civic Authentication.

### Installation

run `npm install civic-login-lambdas --save`

### Configuration

loginHandler.js

``` javascript
import authFactory from 'civic-login-lambdas';

/*
* Where logger is an instance of any logger that has should respond to functions "warn", "debug",  
* "info" and "error" being called on it. You can also set `const logger = false` to use the default `console` to log.
*/
import logger from './logger';

// Your login config details
import config from '../config';

let authHandler;

// This callback function is used to run any custom validation against the userData 
const authCallback = userData => {
   /*
   * Where userData is an array of PII(Personal Identity Information) that contains the results of the scopeRequest. 
   * Depending on the type of the scopeRequest requested by the caller, the contents will be different - e.g. you will 
   * get ID card data if you asked for proof of identity, home address data if you asked for proof of residence e.t.c.
   */
  
  // sipClient.getEmailFromUserData() is a convenience method in the library that is used to get the email address from the userData
  const email = authHandler.sipClient.getEmailFromUserData(userData);
  
  /*
  * Here you can perform any validation(s) you like against the UserData, e.g. checking the user against a database etc.
  * 
  * i.e To validate that the userData email ends with `@myCompanyName.com`
  * if (!email.value.endsWith('@myCompanyName.com')) {
  *   return 'Please provide a valid email address';
  * }
  */
  
  // Return null if the validation(s) was sucessful, or return a string containing an error message if the validation(s) failed
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
`sessionToken` are used to create a standard JWT token that can be used as a session token between the front-end and back-end
after authorisation is complete. 
See [Civic Docs](https://docs.civic.com/#GettingStarted) for details on getting and setting the config options.

### Example Usage

 Add a `login`, `sessionAuthorizer` and `keepAlive` function to your `serverless.yml`
 
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
npm test
```
