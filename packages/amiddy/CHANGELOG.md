# Changelog

## v-next
* :house: Update dependencies
* :memo: Fix the link to the config documentation (when clicking from npm)

## v2.1.0 - 2021-02-15
* :house: Update dependencies
* :rocket: Ability to provide own files (cert & key) for the certificate

## v2.0.0 - 2020-05-18
* :memo: Upgrade guide from v1 to v2, see [v1->v2.md](docs/upgrade/v1->v2.md)
* :boom: Ability to set custom response headers for every request
* :rocket: Ability to save response for a proxy-request made to a dependency
* :rocket: Ability to define mocks for dependencies.
* :lollipop: Move config documentation under docs/config 
* :lollipop: Extend logger response to accept startDate as 0
* :lollipop: Extend logger response to display if the request is a mock or proxy
* :lollipop: Ability to build Url object based on dependency data
* :lollipop: - Setup service that prepares folder for recorded files
* :lollipop: - Prepare defaults for proxy & options
* :lollipop: - Integrate setup at startup
* :lollipop: - Option to ignore patterns when recording response
* :lollipop: - Ability to write file
* :lollipop: - Ability to enable/disable mocking or to disable a specific mock
* :house: Refactor data generation for registry
* :house: moved project source to monorepo (from https://github.com/darkyndy/amiddy)

## v1.3.3
* :lollipop: Update default opts for selfsigned `keyUsage` extension
* :house: Update dependencies (snyk@1.259.0)

## v1.3.2
* :house: Update dependencies
* :lollipop: Set default attrs & opts for selfsigned that are based on latest security guidelines

## v1.3.1
* :house: Update dependencies
* :house: Remove fossa notification with webhook
* :house: Add postinstall script

## v1.3.0
* :house: Update dependencies

## v1.2.0
* :rocket: `name` property contains domain name and is a fallback if `ip` is not set (applies to every dependency).
* :lollipop: Add more default values for the configuration & improve error reporting if the conf is not valid
* :lollipop: Allow all possible options for proxy (excluding ssl)
* :memo: Update documentation
* :house: Update dependencies

## v1.1.0
* :lollipop: Ability to show complete url when logging requests
* :house: Update dependencies

## v1.0.1
* :lollipop: Improve colors that are used when logging
* :house: Update dependencies

## v1.0.0
* :house: First release, contains base functionality that allows starting a server that acts as a middleware for your application
