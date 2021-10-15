import express from 'express';
import path from 'path';
import { MongoClient } from 'mongodb';
import process from 'process';
import 'babel-polyfill';

import SourceMapSupport from 'source-map-support';
import Issue from './issue.js';

const app = express();

SourceMapSupport.install();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// mongoDB part
const mongoConf = {
  domain: 'localhost',
};

// mongoDB 4.4 does not accept database on URI (at least on my machine)
const mongoURI = `mongodb://${mongoConf.domain}`;
const dbClient = new MongoClient(mongoURI);
const db = dbClient.db('issuetracker');
const dbIssueCollection = db.collection('issues');

// always try to connect mongoDB on every request
app.use(async (req, res, next) => {
  await dbClient.connect(); // no-op if already connected
  next();
});

// express part

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackConf = require('../webpack.dev.js');
  const compiler = webpack(webpackConf);
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');

  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=0, must-revalidate');
    next();
  });
  app.use(devMiddleware(compiler, {
    publicPath: webpackConf.output.publicPath,
  }));
  app.use(hotMiddleware(compiler, {
    path: '/__webpack_hmr',
  }));
}

app.get('/api/issues', async (req, res) => {
  // const metadata = { total_count: issues.length };
  // res.json({ _metadata: metadata, records: issues });
  // await dbClient.connect();
  // console.debug("issue collection:", dbIssueCollection);
  // const issues = dbIssueCollection.find()
  dbIssueCollection.find()
    .toArray()
    .then((issues) => {
      const metadata = {
        total_count: issues.length,
      };

      res.json({ metadata, records: issues });
    });
});

app.post('/api/issues', (req, res) => {
  const newIssue = req.body;
  newIssue.created = new Date();
  if (!newIssue.status) { newIssue.status = 'New'; }

  const err = Issue.validateIssue(newIssue);
  if (err) {
    res.status(422).json({
      message: `Invalid request: ${err}`,
    });
    return;
  }
  // send the recently inserted id
  dbIssueCollection.insertOne(Issue.cleanupIssue(newIssue))
    .then((result) => dbIssueCollection.findOne({ _id: result.insertedId }))
    .then((insertedIssue) => {
      res.json(insertedIssue);
    }).catch((error) => {
      console.error(error);
      res.status(500).json({
        message: `Internal Server Error: ${error}`,
      });
    });
});

app.listen(3000, () => {
  console.debug('App stated on port 3000');
});
