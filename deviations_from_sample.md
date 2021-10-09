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

## there is now a babel.config.json file

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