'use strict';

const express = require('express');
const app = express();
const path = require('path');
const { MongoClient } = require('mongodb');
const { validateIssue } = require('./issue.js');
const process = require('process');
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// mongoDB part
const mongoConf = {
  domain: 'localhost',
  port: 27017,
}

// mongoDB 4.4 does not accept database on URI (at least on my machine)
const mongoURI = `mongodb://${mongoConf.domain}`;
const dbClient = new MongoClient(mongoURI);
const db = dbClient.db('issuetracker');
let dbIssueCollection = db.collection('issues');

// always try to connect mongoDB on every request
app.use(async function (req, res, next) {
  await dbClient.connect(); // no-op if already connected
  next();
})

// express part

if (process.env.NODE_ENV !== "production") {
  const webpack = require('webpack');
  const webpackConf = require('../webpack.dev.js');
  const compiler = webpack(webpackConf);
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');

  app.use(function (req, res, next) {
    res.setHeader('Cache-Control', 'max-age=0, must-revalidate');
    next();
  });
  app.use(devMiddleware(compiler, {
    publicPath: webpackConf.output.publicPath
  }));
  app.use(hotMiddleware(compiler, {
    path: "/__webpack_hmr",
  }));
}

app.get('/api/issues', async (req, res) => {
  // const metadata = { total_count: issues.length };
  // res.json({ _metadata: metadata, records: issues });
  // await dbClient.connect();
  // console.debug("issue collection:", dbIssueCollection);
  let issues = dbIssueCollection.find().toArray().then(issues => {
    let metadata = {
      total_count: issues.length
    };

    res.json({ metadata: metadata, records: issues })
  });
});





app.post('/api/issues', (req, res) => {
  const newIssue = req.body;
  newIssue.created = new Date();
  if (!newIssue.status)
    newIssue.status = 'New';

  const err = validateIssue(newIssue);
  if (err) {
    res.status(422).json({
      message: `Invalid request: ${err}`
    });
    return;
  }
  // send the recently inserted id
  dbIssueCollection.insertOne(newIssue).then(result => {
    return dbIssueCollection.findOne({ _id: result.insertedId })
  }).then(newIssue => {
    res.json(newIssue);
  }).catch(error => {
    console.error(error);
    res.status(500).json({
      message: `Internal Server Error: ${error}`
    });

  })
})

app.listen(3000, function () {
  console.debug("App stated on port 3000");
})
