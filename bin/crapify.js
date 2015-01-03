#!/usr/bin/env node

var yargs = require('yargs')
  .options('p', {
    alias: 'port',
    default: 5000,
    description: 'port to run crapify server on'
  })
  .options('s', {
    alias: 'speed',
    default: 10000,
    description: 'connection speed in bytes/second'
  })
  .options('c', {
    alias: 'concurrency',
    default: 10,
    description: 'how many concurrent connections are allowed to proxy'
  }),
  chalk = require('chalk'),
  commands = {
    start: {
      description: 'start:            start the crappy HTTP proxy.',
      command: function(args) {
        (new Crapify({
          port: args.port,
          speed: args.speed,
          concurrency: args.concurrency
        })).start();
      }
    },
  },
  Crapify = require('../index'),
  usageString = "crapify: simulate bad HTTP connections.\n\n";

// generate usage string.
Object.keys(commands).forEach(function(command) {
  usageString += commands[command].description;
});

yargs.usage(usageString);

// display help if command is not recognized.
if (yargs.argv.help || !commands[yargs.argv._[0]]) {
  console.log(yargs.help());
} else {
  commands[yargs.argv._[0]].command(yargs.argv);
}
