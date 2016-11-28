'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTasks = undefined;

var _rx = require('rx');

var _rxNode = require('rx-node');

var _rxNode2 = _interopRequireDefault(_rxNode);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addExitOnInterrupt = function addExitOnInterrupt(taskProcess) {
  return process.on('SIGINT', taskProcess.kill);
}; /* eslint-disable no-console */

var executeTask = function executeTask(task) {
  var taskProcess = (0, _child_process.exec)('npm run ' + task + ' -- --color');

  addExitOnInterrupt(taskProcess);

  return taskProcess;
};

var createOutputStreamsFromProcess = function createOutputStreamsFromProcess(_ref) {
  var stdout = _ref.stdout,
      stderr = _ref.stderr;

  var stdoutStream = _rxNode2.default.fromReadableStream(stdout);

  var stderrStream = _rxNode2.default.fromReadableStream(stderr);

  return stdoutStream.merge(stderrStream);
};

var runTask = function runTask(task) {
  var taskProcess = executeTask(task);
  return createOutputStreamsFromProcess(taskProcess);
};

var runTasks = exports.runTasks = function runTasks(tasks) {
  _rx.Observable.from(tasks).selectMany(runTask).subscribe(function (output) {
    return process.stdout.write(output);
  });
};

/* eslint-enable no-console */