// Copyright 2020 Google LLC. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file.

// [START cloudrun_pubsub_server_setup]
// [START run_pubsub_server_setup]
const express = require('express');
const app = express();
var http = require('https');
var fs  = require('fs');


// This middleware is available in Express v4.16.0 onwards
app.use(express.json());
// [END run_pubsub_server_setup]
// [END cloudrun_pubsub_server_setup]

// [START cloudrun_pubsub_handler]
// [START run_pubsub_handler]
app.post('/', (req, res) => {
  if (!req.body) {
    const msg = 'no Pub/Sub message received';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  if (!req.body.message) {
    const msg = 'invalid Pub/Sub message format';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }

  const pubSubMessage = req.body.message;
  var userString = Buffer.from(pubSubMessage.data, 'base64').toString().trim();

  var headers = {
    'Content-Type': 'text/plain',
    'Content-Length': userString.length
  };
  
  // var username = 'solace-cloud-client';
  // var password = '1e5gblgcn8609aq8emq3q2id4l';
  // var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
  var options = {
    host: 'broker1-52.160.147.184.nip.io',
    port: 9443,
    path: '/TOPIC/a/b/c',
    method: 'POST',
    ca: [fs.readFileSync('CAcert.pem', 'utf-8')]
    // headers: {'Authorization': auth},
    // headers: {} //,
    // key: fs.readFileSync('client1.key'),
    // cert: fs.readFileSync('clientCert1.pem')
    //  ca: [fs.readFileSync('CAcert.pem', 'utf-8')]
      // rejectUnauthorized: false,
      // requestCert: true,
    // }
  };
  
  // console.log(options);
  
  // Setup the request.  The options parameter is
  // the object we defined above.
  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });
  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  
  req.write(userString);
  req.end();


  res.status(204).send();
});
// [END run_pubsub_handler]
// [END cloudrun_pubsub_handler]

module.exports = app;
