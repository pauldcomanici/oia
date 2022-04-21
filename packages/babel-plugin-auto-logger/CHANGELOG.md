# Changelog

## v-next
* :house: Update dependencies
* :house: Update README

## v1.2.3 - 2021-01-18
* :bug: Plugin should not throw error when catch clause does not contain parameters

## v1.2.2 - 2021-01-17
* :house: Update dependencies
* :lollipop: Use stringLiteral instead of identifier when building object keys

## v1.2.1 - 2020-04-19
* :lollipop: ability to log arguments as object when `output.type` is `simple` and `argsAsObject`is `true`

## v1.2.0 - 2020-04-18
* :rocket: ability to log data as object
* :house: Update dependencies
* :house: moved project source to monorepo (from https://github.com/darkyndy/babel-plugin-auto-logger)
* :house: moved to GitHub Actions (replacing Travis CI)

## v1.1.2
* :house: Add .whitesource configuration file (#14)
* :house: Remove fossa notification with webhook
* :house: Update dependencies
* :house: Update eslint configuration & apply changes

## v1.1.1
* :house: Enable FOSSA from CI
* :house: Update dependencies

## v1.1.0
* :rocket: ability to use specific logging by source matching (file name/path) for verbose logging
* :house: Update dependencies
* :house: Improve documentation
* :house: Disable FOSSA from CI

## v1.0.5
* :house: Update dependencies

## v1.0.4
* :bug: Fix postinstall script
* :house: Integrate fossa for license checks
* :house: Update dependencies

## v1.0.3
* :house: Update dependencies
* :house: Use latest node version for CI
* :house: Add postinstall script

## v1.0.2
* :house: Update dependencies
* :bug: Use node LTS version as with latest (11.11.0) there is an error with jest

## v1.0.1
* :house: Update dependencies

## v1.0.0
:rocket: ability to use specific logging by source (file name/path) matching
:rocket: ability to use specific logging by function name matching
:house: add badge for dependencies
:house: add badge for paypal donate
:house: add badge for patreon support
:house: update project dependencies
:memo: document how version can be updated

## v0.6.0
* :lollipop: When the source file name cannot be determined based on sourceMapTarget or sourceFileName try to check parserOpts object (#2)
* :house: Update dependencies
* :house: Add badge for vulnerabilities (based on project dependencies)

## v0.5.0
* :house: Update dependencies
* :rocket: When preparing source file path keep it based on project root

## v0.4.0
* :house: Add e2e tests that will help with documentation and finding regressions
* :house: Extract jest from package.json to allow multiple configurations
* :house: Update dependencies

## v0.3.0
* :rocket: ability to control what logging level is set for catch block
* :rocket: ability to control what logging level is set for catch member expression
* :memo: document new features

## <v0.3.0
* :house: Initial set of features and documentation
