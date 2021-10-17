import express from 'express';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';
import process from 'process';
import 'babel-polyfill';

import SourceMapSupport from 'source-map-support';
import Issue from './issue';

const app = express();

SourceMapSupport.install();

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
  // eslint-disable-next-line
  const webpack = require('webpack');
  // eslint-disable-next-line
  const webpackConf = require('../webpack.dev.js');
  const compiler = webpack(webpackConf);
  // eslint-disable-next-line
  const devMiddleware = require('webpack-dev-middleware');
  // eslint-disable-next-line
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

// issuelist/issuefilter
app.get('/api/issues', (req, res) => {
  console.debug('api issues hit.');
  console.debug('request query:', req.query);
  const filter = {};
  if (req.query.status) { filter.status = req.query.status; }
  if (req.query.effort_lte || req.query.effort_gte) { filter.effort = {}; }
  if (req.query.effort_lte) { filter.effort.$lte = parseInt(req.query.effort_lte, 10); }
  if (req.query.effort_gte) { filter.effort.$gte = parseInt(req.query.effort_gte, 10); }
  console.log(filter);
  db.collection('issues').find(filter).toArray()
    .then((issues) => {
      // console.debug('issues collected: ', issues);
      const metadata = { total_count: issues.length };
      res.json({ _metadata: metadata, records: issues });
    })
    .catch((error) => {
      // console.log(error);
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});
// issueedit page
app.get('/api/issues/:id', (req, res) => {
  console.log(new ObjectId(req.params.id));
  let issueId;
  try {
    issueId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
    return;
  }
  db.collection('issues').find({ _id: issueId }).limit(1).next()
    .then((issue) => {
      if (!issue) { res.status(404).json({ message: `No such issue: ${issueId}` }); } else { res.json(issue); }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: `Internal Server Error: ${error}` });
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

// fallback route, delegate to frontend
app.use('/**', express.static(path.join(__dirname, '../public')));
app.listen(3000, () => {
  console.debug('App stated on port 3000');
});
