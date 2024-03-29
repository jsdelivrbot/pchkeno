/* */ 
(function(Buffer, process) {
  const os = require('os');
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');
  const execFile = require('child_process').execFile;
  const env = process.env;
  const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME || '';
  const exclusions = ['--help'];
  const configfile = '.v8flags.' + process.versions.v8 + '.' + crypto.createHash('md5').update(user).digest('hex') + '.json';
  const failureMessage = ['Unable to cache a config file for v8flags to a your home directory', 'or a temporary folder. To fix this problem, please correct your', 'environment by setting HOME=/path/to/home or TEMP=/path/to/temp.', 'NOTE: the user running this must be able to access provided path.', 'If all else fails, please open an issue here:', 'http://github.com/tkellen/js-v8flags'].join('\n');
  function fail(err) {
    err.message += '\n\n' + failureMessage;
    return err;
  }
  function openConfig(cb) {
    var userHome = require('user-home');
    if (!userHome) {
      return tryOpenConfig(path.join(os.tmpdir(), configfile), cb);
    }
    tryOpenConfig(path.join(userHome, configfile), function(err, fd) {
      if (err)
        return tryOpenConfig(path.join(os.tmpdir(), configfile), cb);
      return cb(null, fd);
    });
  }
  function tryOpenConfig(configpath, cb) {
    try {
      var content = require(configpath);
      process.nextTick(function() {
        cb(null, content);
      });
    } catch (e) {
      fs.open(configpath, 'w+', function(err, fd) {
        if (err) {
          return cb(err);
        }
        return cb(null, fd);
      });
    }
  }
  function getFlags(cb) {
    execFile(process.execPath, ['--v8-options'], function(execErr, result) {
      if (execErr) {
        return cb(execErr);
      }
      var flags = result.match(/\s\s--(\w+)/gm).map(function(match) {
        return match.substring(2);
      }).filter(function(name) {
        return exclusions.indexOf(name) === -1;
      });
      return cb(null, flags);
    });
  }
  function writeConfig(fd, flags, cb) {
    var buf = new Buffer(JSON.stringify(flags));
    return fs.write(fd, buf, 0, buf.length, 0, function(writeErr) {
      fs.close(fd, function(closeErr) {
        var err = writeErr || closeErr;
        if (err) {
          return cb(fail(err), flags);
        }
        return cb(null, flags);
      });
    });
  }
  module.exports = function(cb) {
    var isElectron = process.versions && process.versions.electron;
    if (isElectron) {
      return process.nextTick(function() {
        cb(null, []);
      });
    }
    openConfig(function(openErr, result) {
      if (!openErr && typeof result !== 'number') {
        return cb(null, result);
      }
      getFlags(function(flagsErr, flags) {
        if (flagsErr) {
          return cb(flagsErr);
        }
        if (openErr) {
          return cb(fail(openErr), flags);
        }
        return writeConfig(result, flags, cb);
      });
    });
  };
  module.exports.configfile = configfile;
})(require('buffer').Buffer, require('process'));
