# Issue Tracker

a re-code of issue tracker app from Pro MERN Stack by Vasan Subramanian 

Source code by the original author can be found at: https://github.com/vasansr/pro-mern-stack

## Why re-code?

I made the changes to conform with latest versions of packages used. the version used in the sample is old and deprecated.

see the [changes](deviations_from_sample.md) I made from the original code.

## setup:

1. Install NodeJS. I used ^16 and make sure it is on path
2. Install MongoDB (I used 4.4)
3. run mongod (or enable if installed as service)
4. clone this repository (check the Clone button on repository home page)
5. cd to the cloned repository
`cd issue-tracker`
6. run `npm ci`
7. run `npm run start`

if you don't want hot reloading:

8. run `npm run compile`
9. go to [localhost:3000](localhost:3000) on your preferred browser.

if you want hot reloading:

8. run `npm run serve`
9. go to [localhost:8000](localhost:8000) on your preferred browser.

With webpack-hot-middleware, this is now available:

8. `npm start`
9. go to [localhost:3000](localhost:8000) on your preferred browser. setting up separate front-end server is no longer needed.
