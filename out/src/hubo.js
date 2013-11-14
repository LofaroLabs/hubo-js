// Generated by CoffeeScript 1.6.3
var Hubo, clamp, lpad, rpad,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Hubo = (function(_super) {
  var _robot;

  __extends(Hubo, _super);

  _robot = Hubo;

  function Hubo(name, ready_callback, progress_callback) {
    var load_callback,
      _this = this;
    this.name = name;
    Hubo.__super__.constructor.call(this);
    _robot = this;
    this.motors = new Dict();
    this.loadURDF("" + local_root + "data/hubo-urdf/model.urdf", load_callback = function() {
      var key, value, _ref;
      _ref = _this.joints;
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        value = _ref[key];
        if (key.length === 3) {
          _this.addRegularMotor(key);
        }
      }
      _robot.motors.LSR.offset = +15 / 180 * Math.PI;
      _robot.motors.RSR.offset = -15 / 180 * Math.PI;
      _robot.motors.LEP.offset = -10 / 180 * Math.PI;
      _robot.motors.REP.offset = -10 / 180 * Math.PI;
      _this.addFinger('LF1');
      _this.addFinger('LF2');
      _this.addFinger('LF3');
      _this.addFinger('LF4');
      _this.addFinger('LF5');
      _this.addFinger('RF1');
      _this.addFinger('RF2');
      _this.addFinger('RF3');
      _this.addFinger('RF4');
      _this.addFinger('RF5');
      _this.addNeckMotor('NK1');
      _this.addNeckMotor('NK2');
      _this.reset();
      return ready_callback();
    }, progress_callback);
  }

  Hubo.prototype.addRegularMotor = function(name) {
    var motor;
    _robot = this;
    motor = {};
    motor.name = name;
    motor.lower_limit = this.joints[name].lower_limit;
    motor.upper_limit = this.joints[name].upper_limit;
    motor.default_value = 0;
    motor.offset = 0;
    motor.value = motor.default_value;
    Object.defineProperties(motor, {
      value: {
        get: function() {
          return _robot.joints[this.name].value - _robot.motors[this.name].offset;
        },
        set: function(val) {
          val = clamp(val, this);
          console.log('_robot.joints[@name].offset' + _robot.motors[this.name].offset);
          val = val + _robot.motors[this.name].offset;
          _robot.joints[this.name].value = val;
          return val;
        },
        enumerable: true
      }
    });
    return this.motors[name] = motor;
  };

  Hubo.prototype.addNeckMotor = function(name) {
    var motor;
    _robot = this;
    motor = {};
    motor.name = name;
    motor.lower_limit = 0;
    motor.upper_limit = 20;
    Object.defineProperties(motor, {
      value: {
        get: function() {
          return this._value;
        },
        set: function(val) {
          var pitch, roll, _ref;
          val = clamp(val, this);
          this._value = val;
          if ((_robot.motors.NK1 != null) && (_robot.motors.NK2 != null)) {
            _ref = _robot.neckKin(_robot.motors.NK1.value + 85, _robot.motors.NK2.value + 85), pitch = _ref[0], roll = _ref[1];
            _robot.joints.HNP.value = pitch * Math.PI / 180;
            return _robot.joints.HNR.value = roll * Math.PI / 180;
          }
        }
      }
    });
    motor.default_value = 10;
    motor.value = motor.default_value;
    return this.motors[name] = motor;
  };

  Hubo.prototype.addFinger = function(name) {
    var finger, fingers, hand, motor;
    _robot = this;
    motor = {};
    motor.name = name;
    motor.lower_limit = 0;
    motor.upper_limit = 1.4;
    hand = name[0] === 'L' ? 'left' : 'right';
    fingers = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
    finger = fingers[name[2] - 1];
    motor.full_name = hand + finger;
    Object.defineProperties(motor, {
      value: {
        get: function() {
          return this._value;
        },
        set: function(val) {
          val = clamp(val, this);
          this._value = val;
          _robot.joints[this.full_name + 'Knuckle1'].value = val;
          _robot.joints[this.full_name + 'Knuckle2'].value = val;
          _robot.joints[this.full_name + 'Knuckle3'].value = val;
        }
      }
    });
    motor.default_value = 0.9;
    motor.value = motor.default_value;
    return this.motors[name] = motor;
  };

  Hubo.prototype.neckKin = function(val1, val2) {
    var HNP, HNR;
    HNP = -294.4 + 1.55 * val1 + 1.55 * val2;
    HNR = 0.0 - 1.3197 * val1 + 1.3197 * val2;
    return [HNP, HNR];
  };

  Hubo.prototype.reset = function() {
    return this.motors.asArray().forEach(function(e) {
      return e.value = e.default_value;
    });
  };

  Hubo.prototype.outputPoseHeader = function() {
    return 'RHY         RHR         RHP         RKP         RAP         RAR         LHY         LHR         LHP         LKP         LAP         LAR         RSP         RSR         RSY         REP         RWY         RWR         RWP         LSP         LSR         LSY         LEP         LWY         LWR         LWP         NKY         NK1         NK2         WST         RF1         RF2         RF3         RF4         RF5         LF1         LF2         LF3         LF4         LF5         ';
  };

  Hubo.prototype.outputPose = function() {
    var name, names, str, v, vstr, _i, _len;
    str = '';
    names = this.outputPoseHeader().trim().split(/\W+/);
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      if (hubo.motors[name] != null) {
        v = hubo.motors[name].value;
      } else {
        v = 0;
      }
      vstr = v.toFixed(6);
      vstr = (v >= 0 ? "+" : "") + vstr;
      vstr = rpad(vstr, 11, ' ') + ' ';
      str += vstr;
    }
    return str;
  };

  return Hubo;

})(WebGLRobots.Robot);

clamp = function(val, joint) {
  var warn;
  warn = false;
  if (val < joint.lower_limit) {
    if (warn) {
      console.warn(joint.name + ' tried to violate lower limit: ' + joint.lower_limit);
    }
    return joint.lower_limit;
  } else if (val > joint.upper_limit) {
    if (warn) {
      console.warn(joint.name + ' tried to violate upper limit: ' + joint.upper_limit);
    }
    return joint.upper_limit;
  }
  return val;
};

lpad = function(originalstr, length, strToPad) {
  while (originalstr.length < length) {
    originalstr = strToPad + originalstr;
  }
  return originalstr;
};

rpad = function(originalstr, length, strToPad) {
  while (originalstr.length < length) {
    originalstr = originalstr + strToPad;
  }
  return originalstr;
};
