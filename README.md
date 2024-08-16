# SmartLockerWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Configuration (config.json)

### apiUrlData

Define a URL for API

> apiUrl: 'https://lockerspace.exzycloud.com/data'
### apiUrl

Define a URL for API Lockers

> apiUrl: 'https://lockerspace.exzycloud.com/data/lockers'

### imageUrl

Define a URL for images

> apiUrl: 'https://lockerspace.exzycloud.com/data'

### apiPort

Define port number for API, this will only take effects if `apiUrl` is not defined.

> "apiPort": "8899"

### ADFSLogin

Define url to allow ADFS Login feature

> "ADFSLogin": "https://.../"

### ADSSOLogin

Define a URL for SSO login

> "ADSSOLogin": "https://.../"

### enableConsentAnalysis

Define to show Consent Selection Analysis

> "enableConsentAnalysis": false

### enablePersonalManagement

Define to show Section Personal Information Management

> "enablePersonalManagement": false

### enableTermOfService

Define to show Section Term Of Service

> "enableTermOfService": false

### enablePDPA

Define to enable pdpa section

> "enablePDPA": false
### enableAutoAssign

Define to enable hotseat assigned locker

> "enableAutoAssign": false

### enableCard

Define to show manage card on sidebar

> "enableCard": true

### loginReturnUrl

Define return url after login adfs, adsso success

> "loginReturnUrl": "/office"

### logoutReturnUrl

Define path to go after logout success

> "logoutReturnUrl": ""

### isDev

Define as `boolean` to is in develop

> "isDev": true

### passwordRegex

Define password format for form validators, If not set will default as /(?=.{8,})(?=._?[^\w\s])(?=._?[0-9])(?=._?[A-Z])._?[a-z].\*/

> passwordRegex: "^[\\w\\W]{4,}$"

### Web Domain ??