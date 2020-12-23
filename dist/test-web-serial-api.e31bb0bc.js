// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/DrawerGCode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DrawerGCode = /*#__PURE__*/function () {
  function DrawerGCode(scene, settings) {
    var _settings$startX, _settings$startY, _settings$maxX, _settings$maxY, _settings$velocity, _settings$pointUp, _settings$pointDown;

    _classCallCheck(this, DrawerGCode);

    this.settings = {
      startX: (_settings$startX = settings.startX) !== null && _settings$startX !== void 0 ? _settings$startX : 0,
      startY: (_settings$startY = settings.startY) !== null && _settings$startY !== void 0 ? _settings$startY : 0,
      maxX: (_settings$maxX = settings.maxX) !== null && _settings$maxX !== void 0 ? _settings$maxX : 297,
      maxY: (_settings$maxY = settings.maxY) !== null && _settings$maxY !== void 0 ? _settings$maxY : 210,
      velocity: (_settings$velocity = settings.velocity) !== null && _settings$velocity !== void 0 ? _settings$velocity : 1000,
      pointUp: (_settings$pointUp = settings.pointUp) !== null && _settings$pointUp !== void 0 ? _settings$pointUp : 30,
      pointDown: (_settings$pointDown = settings.pointDown) !== null && _settings$pointDown !== void 0 ? _settings$pointDown : 0
    };
    this.scene = scene;
  }

  _createClass(DrawerGCode, [{
    key: "useRelativePosition",
    value: function useRelativePosition() {
      return 'G91';
    }
  }, {
    key: "useAbsolutePosition",
    value: function useAbsolutePosition() {
      return 'G90';
    }
  }, {
    key: "home",
    value: function home() {
      return [this.penUp(), 'G28 X0 Y0'];
    }
  }, {
    key: "round",
    value: function round(value) {
      return Math.round(value * 100) / 100;
    }
  }, {
    key: "setCurrentMachinePosition",
    value: function setCurrentMachinePosition(x, y) {
      return "G28.1 X".concat(this.round(x), " Y").concat(this.round(y));
    }
  }, {
    key: "setCurrentWorkspacePosition",
    value: function setCurrentWorkspacePosition(x, y) {
      return "G92 X".concat(this.round(x), " Y").concat(this.round(y));
    }
  }, {
    key: "penUp",
    value: function penUp() {
      return "M3 S".concat(this.settings.pointUp);
    }
  }, {
    key: "penDown",
    value: function penDown() {
      return "M3 S".concat(this.settings.pointDown);
    }
  }, {
    key: "moveTo",
    value: function moveTo(x, y) {
      return [this.penUp(), "G0 X".concat(this.round(x), " Y").concat(this.round(y)), this.penDown()];
    }
  }, {
    key: "lineTo",
    value: function lineTo(x, y) {
      return "G1 X".concat(this.round(x), " Y").concat(this.round(y), " F").concat(this.settings.velocity);
    }
  }, {
    key: "concat",
    value: function concat(result, data) {
      if (typeof data === 'string') result.push(data);else data.forEach(function (line) {
        return result.push(line);
      });
    }
  }, {
    key: "generate",
    value: function generate() {
      var sceneBounding = this.getSceneBounding();
      var scale = Math.max(this.scene.width, this.scene.height) / Math.min(this.settings.maxX, this.settings.maxY);
      var offset = [sceneBounding.minX / scale, sceneBounding.minY / scale];
      var gcode = [];
      this.concat(gcode, this.useAbsolutePosition());
      this.concat(gcode, this.penUp());
      this.concat(gcode, this.setCurrentMachinePosition(0, 0));
      this.concat(gcode, this.setCurrentWorkspacePosition(0, 0));
      this.scene.update(0);
      var sceneChilds = this.scene.getChildren();

      for (var i = 0, len = sceneChilds.length; i < len; i++) {
        sceneChilds[i].generate(0, true);
        var childBuffer = sceneChilds[i].getBuffer();
        var childIndexedBuffer = sceneChilds[i].getIndexedBuffer();

        for (var currentBufferIndex = 0, vertexIndex = 0, _len = childIndexedBuffer.length; currentBufferIndex < _len; currentBufferIndex++) {
          var currentIndexing = childIndexedBuffer[i];
          var startX = Urpflanze.clamp(this.settings.minX, this.settings.maxX, childBuffer[vertexIndex] / scale + offset[0]);
          var startY = Urpflanze.clamp(this.settings.minY, this.settings.maxY, childBuffer[vertexIndex + 1] / scale + offset[1]);
          this.concat(gcode, this.moveTo(startX, startY));
          vertexIndex += 2;

          for (var _len2 = vertexIndex + currentIndexing.frameLength - 2; vertexIndex < _len2; vertexIndex += 2) {
            var currentX = Urpflanze.clamp(this.settings.minX, this.settings.maxX, childBuffer[vertexIndex] / scale + offset[0]);
            var currentY = Urpflanze.clamp(this.settings.minY, this.settings.maxY, childBuffer[vertexIndex + 1] / scale + offset[1]);
            this.concat(gcode, this.lineTo(currentX, currentY));
          }

          if (currentIndexing.shape.isClosed()) this.concat(gcode, this.lineTo(startX, startY));
        }
      }

      this.concat(gcode, this.home());
      return gcode;
    }
  }, {
    key: "getSceneBounding",
    value: function getSceneBounding() {
      var maxX = Number.MIN_VALUE;
      var minX = Number.MAX_VALUE;
      var maxY = Number.MIN_VALUE;
      var minY = Number.MAX_VALUE;
      var sceneChilds = this.scene.getChildren();

      for (var i = 0, len = sceneChilds.length; i < len; i++) {
        sceneChilds[i].generate(0, true);
        var childBuffer = sceneChilds[i].getBuffer();
        var childIndexedBuffer = sceneChilds[i].getIndexedBuffer();

        for (var currentBufferIndex = 0, vertexIndex = 0, _len3 = childIndexedBuffer.length; currentBufferIndex < _len3; currentBufferIndex++) {
          var currentIndexing = childIndexedBuffer[i];
          if (minX > childBuffer[vertexIndex]) minX = childBuffer[vertexIndex];
          if (maxX < childBuffer[vertexIndex]) maxX = childBuffer[vertexIndex];
          if (minY > childBuffer[vertexIndex + 1]) minY = childBuffer[vertexIndex + 1];
          if (maxY < childBuffer[vertexIndex + 1]) maxY = childBuffer[vertexIndex + 1];
          vertexIndex += 2;

          for (var _len4 = vertexIndex + currentIndexing.frameLength - 2; vertexIndex < _len4; vertexIndex += 2) {
            if (minX > childBuffer[vertexIndex]) minX = childBuffer[vertexIndex];
            if (maxX < childBuffer[vertexIndex]) maxX = childBuffer[vertexIndex];
            if (minY > childBuffer[vertexIndex + 1]) minY = childBuffer[vertexIndex + 1];
            if (maxY < childBuffer[vertexIndex + 1]) maxY = childBuffer[vertexIndex + 1];
          }
        }
      }

      return {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY
      };
    }
  }]);

  return DrawerGCode;
}();

var _default = DrawerGCode;
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _DrawerGCode = _interopRequireDefault(require("./src/DrawerGCode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var size = 1080;
var scene = new Urpflanze.Scene({
  width: size,
  height: size,
  background: '#eee',
  color: '#000'
});
var shapeloop = new Urpflanze.ShapeLoop({
  repetitions: [80, 1],
  sideLength: size / 3.6,
  translate: [80, -120],
  loop: {
    start: 0,
    end: 1000,
    inc: 1,
    vertex: function vertex(s, p) {
      var x = 0,
          y = 0;
      var time = p.time + p.repetition.index * 6;
      var stime = time * Urpflanze.PI2;
      var t = Math.sin(stime / 5000) + p.context.noise('seed', s.offset * 10, Math.sin(stime / 1000)) * 0.02;
      var angle = s.offset * (Urpflanze.PI2 * 1.5 + t * Math.PI * 2) - Math.sin(stime / 10000) * Math.PI * 2 - Math.sin(stime / 20000) * Math.PI * 2; // const at = Math.sin(stime / 10000) * Math.PI

      var at = 0;
      var minC = 0.96;
      var k = 1 + (0.5 + Math.sin(stime / 10000) * 0.5) * 0.5 + p.context.noise('seed', s.offset * 2, Math.sin(stime / 5000) * s.offset) * 0.2;
      var radius = 0.5 + (1 - s.offset) * 1;
      x += Math.cos(angle) * (1 - Math.pow(s.offset * 0.5, 1) * minC) * radius * k;
      y -= Math.sin(angle) * (1 - Math.pow(s.offset * 0.5, 1) * minC) * radius * k;
      var angle2 = angle * 60;
      var g = p.context.noise('seed', s.offset * 2 * Math.sin(stime / 20000));
      x -= Math.cos(angle2 + at) * (0.01 * g);
      y -= Math.sin(angle2 + at) * (0.01 * g);
      y -= Math.cos(angle) * Math.sin(angle * 3) * (0.5 + p.context.noise('seed', s.offset * 5, Math.sin(stime / 10000)) * 0.5) * Math.pow(1 - s.offset * 0.5, 10) * 0.8;
      return [x, y];
    }
  },
  loopDependencies: ['propArguments'],
  bClosed: false
});
scene.add(shapeloop);
var drawer = new Urpflanze.DrawerCanvas(scene, document.body, {
  simmetricLines: 0 // clear: false,
  // ghosts: 1000,
  // ghostSkipFunction: (i, time) => i.index ** 1.08,
  // // ghostSkipTime: 200,
  // ghostAlpha: false,

}, 1, 20000);
drawer.getTimeline().setTime(14200);
drawer.draw();
document.forms.data.addEventListener('submit', function (e) {
  return e.preventDefault();
});
document.getElementById('generate').addEventListener('click', function () {
  var labels = ['startX', 'startY', 'maxX', 'maxY', 'velocity', 'pointDown', 'pointUp'];
  var data = {};
  labels.forEach(function (label) {
    data[label] = parseFloat(document.querySelector("input[name=".concat(label, "]")).value);
  });
  console.log(data);
  var drawerGCode = new _DrawerGCode.default(scene, data);
  console.log(drawerGCode.generate().join('\r\n'));
});
},{"./src/DrawerGCode":"src/DrawerGCode.js"}],"../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "32927" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/test-web-serial-api.e31bb0bc.js.map