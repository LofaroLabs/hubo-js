// Generated by CoffeeScript 1.7.1
var Hubo, clamp, lpad, rpad,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Hubo = (function(_super) {
  var _robot;

  __extends(Hubo, _super);

  _robot = Hubo;

  function Hubo(name, ready_callback, progress_callback) {
    var load_callback;
    this.name = name;
    Hubo.__super__.constructor.call(this);
    _robot = this;
    this.motors = new Dict();
    this.loadURDF("hubojs/hubo-urdf/model.urdf", load_callback = (function(_this) {
      return function() {
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
      };
    })(this), progress_callback);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIvb2ZmbGluZS9odWJvanMvaHViby5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsKICAgICIvb2ZmbGluZS9odWJvanMvaHViby5qcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsSUFBQSx1QkFBQTtFQUFBO2lTQUFBOztBQUFBO0FBQ0UsTUFBQSxNQUFBOztBQUFBLHlCQUFBLENBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBOztBQUNhLEVBQUEsY0FBRSxJQUFGLEVBQVEsY0FBUixFQUF3QixpQkFBeEIsR0FBQTtBQUVYLFFBQUEsYUFBQTtBQUFBLElBRlksSUFBQyxDQUFBLE9BQUEsSUFFYixDQUFBO0FBQUEsSUFBQSxvQ0FBQSxDQUFBLENBQUE7QUFBQSxJQUNBLE1BQUEsR0FBUyxJQURULENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxJQUFBLENBQUEsQ0FIZCxDQUFBO0FBQUEsSUFLQSxJQUFDLENBQUEsUUFBRCxDQUNFLDZCQURGLEVBRUUsYUFBQSxHQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO0FBRWQsWUFBQSxnQkFBQTtBQUFBO0FBQUEsYUFBQSxXQUFBOzs0QkFBQTtBQUNFLFVBQUEsSUFBRyxHQUFHLENBQUMsTUFBSixLQUFjLENBQWpCO0FBQ0UsWUFBQSxLQUFDLENBQUEsZUFBRCxDQUFpQixHQUFqQixDQUFBLENBREY7V0FERjtBQUFBLFNBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQWxCLEdBQTJCLENBQUEsRUFBQSxHQUFJLEdBQUosR0FBUSxJQUFJLENBQUMsRUFKeEMsQ0FBQTtBQUFBLFFBS0EsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBbEIsR0FBMkIsQ0FBQSxFQUFBLEdBQUksR0FBSixHQUFRLElBQUksQ0FBQyxFQUx4QyxDQUFBO0FB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QU8sV0FBUCxDQUhHO0FBQUEsQ0E5SlAsQ0FBQSIsCiAgInNvdXJjZXNDb250ZW50IjogWwogICAgIiMgQSBjdXN0b20gZXh0ZW5zaW9uIG9mIFdlYkdMUm9ib3RzLlJvYm90IGp1c3QgZm9yIEh1Ym8uXG5jbGFzcyBIdWJvIGV4dGVuZHMgV2ViR0xSb2JvdHMuUm9ib3RcbiAgX3JvYm90ID0gdGhpc1xuICBjb25zdHJ1Y3RvcjogKEBuYW1lLCByZWFkeV9jYWxsYmFjaywgcHJvZ3Jlc3NfY2FsbGJhY2spIC0+XG4gICAgIyBTZXQgdGhpcyA9IG5ldyBXZWJHTFJvYm90cy5Sb2JvdCgpXG4gICAgc3VwZXIoKVxuICAgIF9yb2JvdCA9IHRoaXNcbiAgICAjIE1vdG9yc1xuICAgIEBtb3RvcnMgPSBuZXcgRGljdCgpXG4gICAgIyBMb2FkIHRoZSByb2JvdCB1c2luZyB0aGUgVVJERiBpbXBvcnRlci5cbiAgICBAbG9hZFVSREYoXG4gICAgICBcImh1Ym9qcy9odWJvLXVyZGYvbW9kZWwudXJkZlwiLFxuICAgICAgbG9hZF9jYWxsYmFjayA9ICgpID0+XG4gICAgICAgICMgT25jZSB0aGUgVVJERiBpcyBjb21wbGV0ZWx5IGxvYWRlZCwgdGhpcyBmdW5jdGlvbiBpcyBydW4uXG4gICAgICAgIGZvciBvd24ga2V5LCB2YWx1ZSBvZiBAam9pbnRzXG4gICAgICAgICAgaWYga2V5Lmxlbmd0aCA9PSAzXG4gICAgICAgICAgICBAYWRkUmVndWxhck1vdG9yKGtleSk7XG4gICAgICAgICMgT2Zmc2V0cyBmb3Igc2hvdWxkZXIgcm9sbCBhbmQgZWxib3cgcGl0Y2ggKHZhbHVlcyB0YWtlbiBmcm9tIGh1Ym9wbHVzLmtpbmJvZHkueG1sIFwiPGluaXRpYWw+XCIgZmllbGRzKVxuICAgICAgICBfcm9ib3QubW90b3JzLkxTUi5vZmZzZXQgPSArMTUvMTgwKk1hdGguUElcbiAgICAgICAgX3JvYm90Lm1vdG9ycy5SU1Iub2Zmc2V0ID0gLTE1LzE4MCpNYXRoLlBJXG4gICAgICAgIF9yb2JvdC5tb3RvcnMuTEVQLm9mZnNldCA9IC0xMC8xODAqTWF0aC5QSVxuICAgICAgICBfcm9ib3QubW90b3JzLlJFUC5vZmZzZXQgPSAtMTAvMTgwKk1hdGguUElcbiAgICAgICAgQGFkZEZpbmdlcignTEYxJylcbiAgICAgICAgQGFkZEZpbmdlcignTEYyJylcbiAgICAgICAgQGFkZEZpbmdlcignTEYzJylcbiAgICAgICAgQGFkZEZpbmdlcignTEY0JylcbiAgICAgICAgQGFkZEZpbmdlcignTEY1JylcbiAgICAgICAgQGFkZEZpbmdlcignUkYxJylcbiAgICAgICAgQGFkZEZpbmdlcignUkYyJylcbiAgICAgICAgQGFkZEZpbmdlcignUkYzJylcbiAgICAgICAgQGFkZEZpbmdlcignUkY0JylcbiAgICAgICAgQGFkZEZpbmdlcignUkY1JykgICAgICBcbiAgICAgICAgQGFkZE5lY2tNb3RvcignTksxJylcbiAgICAgICAgQGFkZE5lY2tNb3RvcignTksyJylcbiAgICAgICAgQHJlc2V0KClcbiAgICAgICAgIyBBZGQgeW91ciByb2JvdCB0byB0aGUgY2FudmFzLlxuICAgICAgICByZWFkeV9jYWxsYmFjaygpXG4gICAgICBwcm9ncmVzc19jYWxsYmFja1xuICAgIClcbiAgYWRkUmVndWxhck1vdG9yOiAobmFtZSkgLT5cbiAgICBfcm9ib3QgPSB0aGlzXG4gICAgbW90b3IgPSB7fVxuICAgIG1vdG9yLm5hbWUgPSBuYW1lXG4gICAgbW90b3IubG93ZXJfbGltaXQgPSBAam9pbnRzW25hbWVdLmxvd2VyX2xpbWl0XG4gICAgbW90b3IudXBwZXJfbGltaXQgPSBAam9pbnRzW25hbWVdLnVwcGVyX2xpbWl0XG4gICAgbW90b3IuZGVmYXVsdF92YWx1ZSA9IDBcbiAgICBtb3Rvci5vZmZzZXQgPSAwXG4gICAgbW90b3IudmFsdWUgPSBtb3Rvci5kZWZhdWx0X3ZhbHVlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgbW90b3IsXG4gICAgdmFsdWU6XG4gICAgICBnZXQ6IC0+IHJldHVybiBfcm9ib3Quam9pbnRzW0BuYW1lXS52YWx1ZSAtIF9yb2JvdC5tb3RvcnNbQG5hbWVdLm9mZnNldFxuICAgICAgc2V0OiAodmFsKSAtPiBcbiAgICAgICAgdmFsID0gY2xhbXAodmFsLHRoaXMpXG4gICAgICAgIHZhbCA9IHZhbCArIF9yb2JvdC5tb3RvcnNbQG5hbWVdLm9mZnNldFxuICAgICAgICBfcm9ib3Quam9pbnRzW0BuYW1lXS52YWx1ZSA9IHZhbFxuICAgICAgICByZXR1cm4gdmFsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgQG1vdG9yc1tuYW1lXSA9IG1vdG9yXG4gIGFkZE5lY2tNb3RvcjogKG5hbWUpIC0+XG4gICAgX3JvYm90ID0gdGhpc1xuICAgICMgQ3JlYXRlIHRoZSBuZWNrIG1vdG9ycy5cbiAgICBtb3RvciA9IHt9XG4gICAgbW90b3IubmFtZSA9IG5hbWUgIyBFaXRoZXIgTksxIG9yIE5LMlxuICAgIG1vdG9yLmxvd2VyX2xpbWl0ID0gMCAjIG1tLCBOb3RlOiBsaW5lYXIgYWN0dWF0b3IgcGl0Y2ggaXMgMW1tL3JldiwgMTI4IGVuY29kZXIgY291bnRzIHBlciByZXYuXG4gICAgbW90b3IudXBwZXJfbGltaXQgPSAyMCAjIG1tXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgbW90b3IsXG4gICAgICB2YWx1ZTpcbiAgICAgICAgZ2V0OiAtPiByZXR1cm4gQF92YWx1ZVxuICAgICAgICBzZXQ6ICh2YWwpIC0+XG4gICAgICAgICAgdmFsID0gY2xhbXAodmFsLHRoaXMpXG4gICAgICAgICAgQF92YWx1ZSA9IHZhbFxuICAgICAgICAgICMgV2UgbmVlZCBib3RoIG5lY2sgbW90b3JzIHRvIGNhbGN1bGF0ZSB0aGUgaGVhZCBwb3NlXG4gICAgICAgICAgaWYgX3JvYm90Lm1vdG9ycy5OSzE/IGFuZCBfcm9ib3QubW90b3JzLk5LMj9cbiAgICAgICAgICAgICMgV2UgYWRkIDg1bW0gdG8gdGhlIGV4dGVuc2lvbiBvZiB0aGUgbGluZWFyIGFjdHVhdG9yIHRvIGdldCB0aGUgdG90YWwgbGluayBsZW5ndGhcbiAgICAgICAgICAgIFtwaXRjaCwgcm9sbF0gPSBfcm9ib3QubmVja0tpbihfcm9ib3QubW90b3JzLk5LMS52YWx1ZSs4NSwgX3JvYm90Lm1vdG9ycy5OSzIudmFsdWUrODUpXG4gICAgICAgICAgICBfcm9ib3Quam9pbnRzLkhOUC52YWx1ZSA9IHBpdGNoKk1hdGguUEkvMTgwXG4gICAgICAgICAgICBfcm9ib3Quam9pbnRzLkhOUi52YWx1ZSA9IHJvbGwqTWF0aC5QSS8xODBcbiAgICBtb3Rvci5kZWZhdWx0X3ZhbHVlID0gMTAgI21tXG4gICAgbW90b3IudmFsdWUgPSBtb3Rvci5kZWZhdWx0X3ZhbHVlXG4gICAgQG1vdG9yc1tuYW1lXSA9IG1vdG9yXG4gIGFkZEZpbmdlcjogKG5hbWUpIC0+XG4gICAgX3JvYm90ID0gdGhpc1xuICAgICMgQWRkIGZpbmdlciBtb3RvclxuICAgIG1vdG9yID0ge31cbiAgICBtb3Rvci5uYW1lID0gbmFtZVxuICAgIG1vdG9yLmxvd2VyX2xpbWl0ID0gMFxuICAgIG1vdG9yLnVwcGVyX2xpbWl0ID0gMS40XG4gICAgIyBOb3RlOiB3ZSBhcmUgVkVSWSBNVUNIIGV4cGVjdGluZyBhIFRMQSBmb3IgJ25hbWUnXG4gICAgaGFuZCA9IGlmIChuYW1lWzBdPT0nTCcpIHRoZW4gJ2xlZnQnIGVsc2UgJ3JpZ2h0J1xuICAgIGZpbmdlcnMgPSBbJ1RodW1iJywgJ0luZGV4JywgJ01pZGRsZScsICdSaW5nJywgJ1Bpbmt5J11cbiAgICBmaW5nZXIgPSBmaW5nZXJzW25hbWVbMl0tMV1cbiAgICBtb3Rvci5mdWxsX25hbWUgPSBoYW5kICsgZmluZ2VyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgbW90b3IsXG4gICAgICB2YWx1ZTpcbiAgICAgICAgZ2V0OiAtPiByZXR1cm4gQF92YWx1ZVxuICAgICAgICBzZXQ6ICh2YWwpIC0+IFxuICAgICAgICAgIHZhbCA9IGNsYW1wKHZhbCx0aGlzKVxuICAgICAgICAgIEBfdmFsdWUgPSB2YWwgICAgICAgICAgICAgIFxuICAgICAgICAgIF9yb2JvdC5qb2ludHNbQGZ1bGxfbmFtZSArICdLbnVja2xlMSddLnZhbHVlID0gdmFsXG4gICAgICAgICAgX3JvYm90LmpvaW50c1tAZnVsbF9uYW1lICsgJ0tudWNrbGUyJ10udmFsdWUgPSB2YWxcbiAgICAgICAgICBfcm9ib3Quam9pbnRzW0BmdWxsX25hbWUgKyAnS251Y2tsZTMnXS52YWx1ZSA9IHZhbFxuICAgICAgICAgIHJldHVyblxuICAgIG1vdG9yLmRlZmF1bHRfdmFsdWUgPSAwLjkgIyBzdGFydCB3aXRoIGZpbmdlcnMgaGFsZiBjdXJsZWRcbiAgICBtb3Rvci52YWx1ZSA9IG1vdG9yLmRlZmF1bHRfdmFsdWVcbiAgICAjIEFkZCB0byBtb3RvciBjb2xsZWN0aW9uXG4gICAgQG1vdG9yc1tuYW1lXSA9IG1vdG9yXG4gICMgQVRURU5USU9OOiBUaGlzIHJldHVybnMgdmFsdWVzIGluIGRlZ3JlZXMuXG4gIG5lY2tLaW46ICh2YWwxLCB2YWwyKSAtPlxuICAgICMgVGhlIGNvZGUgdXNlZCB0byBkZXJpdmUgdGhlc2UgZXF1YXRpb25zIGNhbiBiZSBmb3VuZCBpbiB0aGUgJ25lY2tfa2luJyBicmFuY2guIFxuICAgICMgU2hvcnQgRXhwbGFuYXRpb246IFRoZSBuZWNrIGZvcndhcmQga2luZW1hdGljcyBoYXMgbm8gc3RyYWlnaHRmb3J3YXJkIGFuYWx5dGljYWwgc29sdXRpb24uIEluc3RlYWQsIGl0IHdhcyBzb2x2ZWQgbnVtZXJpY2FsbHkgYnlcbiAgICAjIGZpeGluZyB0aGUgaGVhZCBwaXRjaCBhbmQgcm9sbCwgYW5kIHRoZW4gZmluZGluZyB0aGUgbGVuZ3RocyBvZiB0aGUgbGluZWFyIGFjdHVhdG9ycy4gKEVzc2VudGlhbGx5LCB0aGUgaW52ZXJzZSBraW5lbWF0aWNzIGFyZSBcbiAgICAjIGVhc2llciB0byBzb2x2ZS4pIFVzaW5nIHRoaXMsIGEgYmlnIGxvb2t1cCB0YWJsZSB3YXMgY2FsY3VsYXRlZC4gV2hlbiBwbG90dGVkLCB0aGUgcGl0Y2ggYW5kIHJvbGwgZnVuY3Rpb25zIGNhbiBiZSBzZWVuIHRvIGJlIFxuICAgICMgbm9uLWxpbmVhciBidXQgdGhleSBhcmUgbmVhcmx5IHBsYW5hciAyRCBmdW5jdGlvbnMuIFRoZSBlcXVhdGlvbnMgdXNlZCBiZWxvdyBhcmUgdGhlIGxpbmVhciBiZXN0IGZpdCBvZiB0aGUgbnVtZXJpY2FsIGxvb2t1cCB0YWJsZXMuXG4gICAgIyBJdCBzaG91bGRuJ3QgYmUgb2ZmIGJ5IG1vcmUgdGhhbiBhIGNvdXBsZSBkZWdyZWVzIGF0IHdvcnN0LiAgICBcbiAgICBITlAgPSAtMjk0LjQgKyAxLjU1KnZhbDEgKyAxLjU1KnZhbDJcbiAgICBITlIgPSAgICAwLjAgLSAxLjMxOTcqdmFsMSArIDEuMzE5Nyp2YWwyXG4gICAgcmV0dXJuIFtITlAsIEhOUl1cbiAgcmVzZXQ6ICgpIC0+XG4gICAgQG1vdG9ycy5hc0FycmF5KCkuZm9yRWFjaCAoZSkgLT5cbiAgICAgIGUudmFsdWUgPSBlLmRlZmF1bHRfdmFsdWVcbiAgb3V0cHV0UG9zZUhlYWRlcjogKCkgLT5cbiAgICByZXR1cm4gJ1JIWSAgICAgICAgIFJIUiAgICAgICAgIFJIUCAgICAgICAgIFJLUCAgICAgICAgIFJBUCAgICAgICAgIFJBUiAgICAgICAgIExIWSAgICAgICAgIExIUiAgICAgICAgIExIUCAgICAgICAgIExLUCAgICAgICAgIExBUCAgICAgICAgIExBUiAgICAgICAgIFJTUCAgICAgICAgIFJTUiAgICAgICAgIFJTWSAgICAgICAgIFJFUCAgICAgICAgIFJXWSAgICAgICAgIFJXUiAgICAgICAgIFJXUCAgICAgICAgIExTUCAgICAgICAgIExTUiAgICAgICAgIExTWSAgICAgICAgIExFUCAgICAgICAgIExXWSAgICAgICAgIExXUiAgICAgICAgIExXUCAgICAgICAgIE5LWSAgICAgICAgIE5LMSAgICAgICAgIE5LMiAgICAgICAgIFdTVCAgICAgICAgIFJGMSAgICAgICAgIFJGMiAgICAgICAgIFJGMyAgICAgICAgIFJGNCAgICAgICAgIFJGNSAgICAgICAgIExGMSAgICAgICAgIExGMiAgICAgICAgIExGMyAgICAgICAgIExGNCAgICAgICAgIExGNSAgICAgICAgICdcbiAgb3V0cHV0UG9zZTogKCkgLT5cbiAgICBzdHIgPSAnJ1xuICAgIG5hbWVzID0gQG91dHB1dFBvc2VIZWFkZXIoKS50cmltKCkuc3BsaXQoIC9cXFcrLyApXG4gICAgZm9yIG5hbWUgaW4gbmFtZXNcbiAgICAgIGlmIGh1Ym8ubW90b3JzW25hbWVdPyAgICAgICAgXG4gICAgICAgIHYgPSBodWJvLm1vdG9yc1tuYW1lXS52YWx1ZVxuICAgICAgZWxzZVxuICAgICAgICAjIFdlIG5lZWQgdG8gc3VwcG9ydCBpZ25vcmluZyBjb2x1bW5zICh3cmlzdCByb2xsLCBzcGVjaWZpY2FsbHkpIGluIG9yZGVyIHRvIGJlIGNvbXBhdGlibGUgXG4gICAgICAgICMgd2l0aCBodWJvLXJlYWQtdHJhamVjdG9yeVxuICAgICAgICB2ID0gMCAgICAgICBcbiAgICAgIHZzdHIgPSB2LnRvRml4ZWQoNilcbiAgICAgIHZzdHIgPSAoaWYgdj49MCB0aGVuIFwiK1wiIGVsc2UgXCJcIikgKyB2c3RyXG4gICAgICAjIGlmIHYgPj0gMCBcbiAgICAgICMgICB2c3RyID0gXCIrXCIgKyB2c3RyXG4gICAgICAjIGVsc2VcbiAgICAgICMgICB2c3RyID0gXCItXCIgKyB2c3RyXG4gICAgICB2c3RyID0gcnBhZCh2c3RyLDExLCcgJykgKyAnICdcbiAgICAgIHN0ciArPSB2c3RyXG4gICAgcmV0dXJuIHN0clxuXG5jbGFtcCA9ICh2YWwsam9pbnQpIC0+XG4gIHdhcm4gPSBvZmZcbiAgaWYgdmFsIDwgam9pbnQubG93ZXJfbGltaXRcbiAgICBpZiB3YXJuIHRoZW4gY29uc29sZS53YXJuIGpvaW50Lm5hbWUgKyAnIHRyaWVkIHRvIHZpb2xhdGUgbG93ZXIgbGltaXQ6ICcgKyBqb2ludC5sb3dlcl9saW1pdFxuICAgIHJldHVybiBqb2ludC5sb3dlcl9saW1pdFxuICBlbHNlIGlmIHZhbCA+IGpvaW50LnVwcGVyX2xpbWl0XG4gICAgaWYgd2FybiB0aGVuIGNvbnNvbGUud2FybiBqb2ludC5uYW1lICsgJyB0cmllZCB0byB2aW9sYXRlIHVwcGVyIGxpbWl0OiAnICsgam9pbnQudXBwZXJfbGltaXRcbiAgICByZXR1cm4gam9pbnQudXBwZXJfbGltaXRcbiAgcmV0dXJuIHZhbFxuXG5cbmxwYWQgPSAob3JpZ2luYWxzdHIsIGxlbmd0aCwgc3RyVG9QYWQpIC0+XG4gICAgd2hpbGUgKG9yaWdpbmFsc3RyLmxlbmd0aCA8IGxlbmd0aClcbiAgICAgICAgb3JpZ2luYWxzdHIgPSBzdHJUb1BhZCArIG9yaWdpbmFsc3RyXG4gICAgcmV0dXJuIG9yaWdpbmFsc3RyXG5cbiBcbnJwYWQgPSAob3JpZ2luYWxzdHIsIGxlbmd0aCwgc3RyVG9QYWQpIC0+XG4gICAgd2hpbGUgKG9yaWdpbmFsc3RyLmxlbmd0aCA8IGxlbmd0aClcbiAgICAgICAgb3JpZ2luYWxzdHIgPSBvcmlnaW5hbHN0ciArIHN0clRvUGFkXG4gICAgcmV0dXJuIG9yaWdpbmFsc3RyXG4iCiAgXQp9