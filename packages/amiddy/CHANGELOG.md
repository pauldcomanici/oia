# Changelog

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :lollipop:   [Enhancement]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]


## v-next
* :house: moved project source to monorepo (from https://github.com/darkyndy/amiddy)
* :boom: Ability to set custom response headers for every request
* :lollipop: Move config documentation under docs/config 
* :lollipop: Extend logger response to accept startDate as 0
* :lollipop: Extend logger response to display if the request is a mock or proxy
* :lollipop: Ability to build Url object based on dependency data
* :house: Refactor data generation for registry

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
