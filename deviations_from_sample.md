# Changes from sample code

I made the changes to conform with latest versions of packages used. the version used in the sample is old and deprecated.

## babel-cli is @babel/cli
version bumped from 6.26 to ^7.15

## babel-preset-react is now @babel/preset-react

## `/static` dir is now `/public`

## babel command in package.json
from --out-dir to -o (--out-file) 

--out-dir will cause errors 
(-dir will be interpreted as -d -i -r)


## babel-preset-es2015 is changed to @babel/preset-env

## body-parser is not used

https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4 

use express.json() instead.

https://babeljs.io/docs/en/env/

## ~~there is now a babel.config.json file~~

replaced with webpack

## MongoDB

### no longer uses MongoClient.Connect

### https://docs.mongodb.com/drivers/node/current/fundamentals/authentication/enterprise-mechanisms/

feels cleaner to use MongoClient object than use a promise and nest app.listen(...) inside

## Webpack 

bunch of changes due to deprecation

## Polyfill

babel-polyfill replaced with core-js and regenerator-runtime due to old core-js version deprecation.

I might have missed something where core-js is applied, left it anyway. (might remove)


## hot module replacement

On `webpack.config.js.devServer`
- `contentBase` is replaced as `static`
- `'/api/*'` changed to `'api/**'`  on `.proxy`

set `webpack.output.publicPath` to `/js/`

hotreload won't work if this is not the case, to be investigated

### did not replace `watch` on scripts

added separate entry `serve` instead.



## hot-middleware

### webpack config

used a separate webpack.dev.js instead of pushing entry points via javascript

### `hotUpdateChunkFilename` and `hotUpdateMainFilename`

removed hashes for now. 

got to find way to remove the caching behavior (when starting a new node server, hmr-middleware looks for the filename with the old hash, causing an error.)

### doesn't quite "hot-reload"

tested by wrapping with `<PageContainer>` wrapper component with `<HMRTest>` child component, changing something there still rerenders `<IssueList>`

unsure: 

it might have something to do with the fact I removed hash in the hot-reload filenames, as when I did it before, I think it IssueList did not re-render. to test next time.

Update: tested on a clone with mint VM, tested with Firefox browser in VM, and chrome and firefox in host PC. looks like the problem is not linked to the browser.

<img src="md-assets/Screenshot 2021-10-12 025504.png" width="100%"/>

<img src="md-assets/Screenshot 2021-10-12 030600.png" width="100%"/>

## Server-side Es2015

used @babel/register instead of babel-register.

version bumped from 6.x to 7.15