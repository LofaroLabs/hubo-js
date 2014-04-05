// Generated by CoffeeScript 1.7.1
var FT_Sensor, flashLED, interpColor;

window.serial_stateRef = new Firebase('https://hubo-firebase.firebaseIO.com/serial_state');

window.ledTimeoutId = null;

flashLED = function() {
  window.clearTimeout(window.ledTimeoutId);
  $('#led').show();
  return window.ledTimeoutId = setTimeout(function() {
    return $('#led').hide();
  }, 100);
};

FT_Sensor = (function() {
  function FT_Sensor(name) {
    this.name = name;
    this.m_x_obj = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 0.1, 0xFF0000);
    this.m_y_obj = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 0.1, 0x00FF00);
    this.f_z_obj = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 0), 0.1, 0x00FF00);
    this.axis = new THREE.Object3D();
    this.axis.add(this.m_x_obj);
    this.axis.add(this.m_y_obj);
    this.axis.add(this.f_z_obj);
  }

  FT_Sensor.prototype.updateColor = function() {
    var fz_gradient, fz_max, fz_min, mx_gradient, mx_max, mx_min, my_gradient, my_max, my_min, temp;
    mx_min = $("#" + this.name + " .m_x_min").val();
    mx_max = $("#" + this.name + " .m_x_max").val();
    my_min = $("#" + this.name + " .m_y_min").val();
    my_max = $("#" + this.name + " .m_y_max").val();
    fz_min = $("#" + this.name + " .f_z_min").val();
    fz_max = $("#" + this.name + " .f_z_max").val();
    mx_gradient = interpColor(mx_min, mx_max, 0, this.m_x);
    my_gradient = interpColor(my_min, my_max, 0, this.m_y);
    fz_gradient = interpColor(fz_min, fz_max, 0, this.f_z);
    temp = new THREE.Color();
    temp.setRGB(mx_gradient, 1 - mx_gradient, 0);
    this.axis.children[0].setColor(temp.getHex());
    temp.setRGB(my_gradient, 1 - my_gradient, 0);
    this.axis.children[1].setColor(temp.getHex());
    temp.setRGB(fz_gradient, 1 - fz_gradient, 0);
    return this.axis.children[2].setColor(temp.getHex());
  };

  return FT_Sensor;

})();

interpColor = function(min, max, zero, t) {
  if (t > max) {
    t = max;
  }
  if (t < min) {
    t = min;
  }
  if (t < zero) {
    return Math.min((zero - t) / (zero - min), 1);
  } else {
    return Math.min((t - zero) / (max - zero), 1);
  }
};

$(document).ready(function() {
  var c, callback, progress;
  $("#mouse_info_dialog").dialog({
    autoOpen: false,
    closeOnEscape: true,
    buttons: {
      OK: function() {
        return $(this).dialog("close");
      }
    }
  });
  $("#mouse_info_button").on("click", function() {
    return $("#mouse_info_dialog").dialog("open");
  });
  window.stats = new Stats();
  stats.setMode(0);
  $('#hubo_container').append(stats.domElement);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '400px';
  stats.domElement.style.top = '0px';
  c = new WebGLRobots.DefaultCanvas("#hubo_container");
  return window.hubo = new Hubo("hubo2", callback = function() {
    c.add(hubo);
    hubo.autorender = false;
    $("#load").hide();
    if (hubo.ft == null) {
      hubo.ft = {};
    }
    hubo.ft.HUBO_FT_R_HAND = new FT_Sensor("HUBO_FT_R_HAND");
    hubo.ft.HUBO_FT_L_HAND = new FT_Sensor("HUBO_FT_L_HAND");
    hubo.ft.HUBO_FT_R_FOOT = new FT_Sensor("HUBO_FT_R_FOOT");
    hubo.ft.HUBO_FT_L_FOOT = new FT_Sensor("HUBO_FT_L_FOOT");
    hubo.links.Body_RWP.add(hubo.ft.HUBO_FT_R_HAND.axis);
    hubo.links.Body_LWP.add(hubo.ft.HUBO_FT_L_HAND.axis);
    hubo.links.Body_RAR.add(hubo.ft.HUBO_FT_R_FOOT.axis);
    hubo.links.Body_LAR.add(hubo.ft.HUBO_FT_L_FOOT.axis);
    hubo.ft.HUBO_FT_R_HAND.axis.position = new THREE.Vector3(0, 0, -0.1);
    hubo.ft.HUBO_FT_L_HAND.axis.position = new THREE.Vector3(0, 0, -0.1);
    hubo.ft.HUBO_FT_R_FOOT.axis.position = new THREE.Vector3(-0.05, 0, -0.11);
    hubo.ft.HUBO_FT_L_FOOT.axis.position = new THREE.Vector3(-0.05, 0, -0.11);
    serial_stateRef.on('value', function(snapshot) {
      var serial_state, state;
      stats.end();
      stats.begin();
      serial_state = snapshot.val();
      console.log(serial_state);
      state = JSON.parse(serial_state);
      console.log(state);
      flashLED();
      hubo.ft["HUBO_FT_R_HAND"].m_x = state.ft[0];
      hubo.ft["HUBO_FT_R_HAND"].m_y = state.ft[1];
      hubo.ft["HUBO_FT_R_HAND"].f_z = state.ft[2];
      hubo.ft["HUBO_FT_R_HAND"].updateColor();
      hubo.ft["HUBO_FT_L_HAND"].m_x = state.ft[3];
      hubo.ft["HUBO_FT_L_HAND"].m_y = state.ft[4];
      hubo.ft["HUBO_FT_L_HAND"].f_z = state.ft[5];
      hubo.ft["HUBO_FT_L_HAND"].updateColor();
      hubo.ft["HUBO_FT_R_FOOT"].m_x = state.ft[6];
      hubo.ft["HUBO_FT_R_FOOT"].m_y = state.ft[7];
      hubo.ft["HUBO_FT_R_FOOT"].f_z = state.ft[8];
      hubo.ft["HUBO_FT_R_FOOT"].updateColor();
      hubo.ft["HUBO_FT_L_FOOT"].m_x = state.ft[9];
      hubo.ft["HUBO_FT_L_FOOT"].m_y = state.ft[10];
      hubo.ft["HUBO_FT_L_FOOT"].f_z = state.ft[11];
      hubo.ft["HUBO_FT_L_FOOT"].updateColor();
      hubo.motors["WST"].value = state.joint[0];
      hubo.motors["NKY"].value = state.joint[1];
      hubo.motors["NK1"].value = state.joint[2];
      hubo.motors["NK2"].value = state.joint[3];
      hubo.motors["LSP"].value = state.joint[4];
      hubo.motors["LSR"].value = state.joint[5];
      hubo.motors["LSY"].value = state.joint[6];
      hubo.motors["LEP"].value = state.joint[7];
      hubo.motors["LWY"].value = state.joint[8];
      hubo.motors["LWP"].value = state.joint[10];
      hubo.motors["RSP"].value = state.joint[11];
      hubo.motors["RSR"].value = state.joint[12];
      hubo.motors["RSY"].value = state.joint[13];
      hubo.motors["REP"].value = state.joint[14];
      hubo.motors["RWY"].value = state.joint[15];
      hubo.motors["RWP"].value = state.joint[17];
      hubo.motors["LHY"].value = state.joint[19];
      hubo.motors["LHR"].value = state.joint[20];
      hubo.motors["LHP"].value = state.joint[21];
      hubo.motors["LKP"].value = state.joint[22];
      hubo.motors["LAP"].value = state.joint[23];
      hubo.motors["LAR"].value = state.joint[24];
      hubo.motors["RHY"].value = state.joint[26];
      hubo.motors["RHR"].value = state.joint[27];
      hubo.motors["RHP"].value = state.joint[28];
      hubo.motors["RKP"].value = state.joint[29];
      hubo.motors["RAP"].value = state.joint[30];
      hubo.motors["RAR"].value = state.joint[31];
      hubo.motors["RF1"].value = state.joint[32];
      hubo.motors["RF2"].value = state.joint[33];
      hubo.motors["RF3"].value = state.joint[34];
      hubo.motors["RF4"].value = state.joint[35];
      hubo.motors["RF5"].value = state.joint[36];
      hubo.motors["LF1"].value = state.joint[37];
      hubo.motors["LF2"].value = state.joint[38];
      hubo.motors["LF3"].value = state.joint[39];
      hubo.motors["LF4"].value = state.joint[40];
      hubo.motors["LF5"].value = state.joint[41];
      return hubo.canvas.render();
    });
    return c.render();
  }, progress = function(step, total, node) {
    return $("#load").html("Loading " + step + "/" + total);
  });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIvbGl2ZV9kaXNwbGF5L2luZGV4LmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWwogICAgIi9saXZlX2Rpc3BsYXkvaW5kZXguanMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIjtBQUdBLElBQUEsZ0NBQUE7O0FBQUEsTUFBTSxDQUFDLGVBQVAsR0FBNkIsSUFBQSxRQUFBLENBQVMsbURBQVQsQ0FBN0IsQ0FBQTs7QUFBQSxNQUVNLENBQUMsWUFBUCxHQUFzQixJQUZ0QixDQUFBOztBQUFBLFFBR0EsR0FBVyxTQUFBLEdBQUE7QUFFVCxFQUFBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLE1BQU0sQ0FBQyxZQUEzQixDQUFBLENBQUE7QUFBQSxFQUNBLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQUEsQ0FEQSxDQUFBO1NBR0EsTUFBTSxDQUFDLFlBQVAsR0FBc0IsVUFBQSxDQUFXLFNBQUEsR0FBQTtXQUMvQixDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFBLEVBRCtCO0VBQUEsQ0FBWCxFQUVwQixHQUZvQixFQUxiO0FBQUEsQ0FIWCxDQUFBOztBQUFBO0FBa0JlLEVBQUEsbUJBQUUsSUFBRixHQUFBO0FBRVgsSUFGWSxJQUFDLENBQUEsT0FBQSxJQUViLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxLQUFLLENBQUMsV0FBTixDQUFzQixJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQUFnQixDQUFoQixFQUFrQixDQUFsQixDQUF0QixFQUFnRCxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQUFnQixDQUFoQixFQUFrQixDQUFsQixDQUFoRCxFQUFxRSxHQUFyRSxFQUF5RSxRQUF6RSxDQUFmLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxLQUFLLENBQUMsV0FBTixDQUFzQixJQUFBLEtBQUssQ0FB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bmRvdy5zZXJpYWxfc3RhdGVSZWYgPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vaHViby1maXJlYmFzZS5maXJlYmFzZUlPLmNvbS9zZXJpYWxfc3RhdGUnKVxuXG53aW5kb3cubGVkVGltZW91dElkID0gbnVsbDtcbmZsYXNoTEVEID0gKCkgLT5cbiAgIyBDYW5jZWwgdGhlIHByZXZpb3VzIHRpbWVvdXQuXG4gIHdpbmRvdy5jbGVhclRpbWVvdXQod2luZG93LmxlZFRpbWVvdXRJZClcbiAgJCgnI2xlZCcpLnNob3coKVxuICAjIElmIHdlIGRvbid0IGdldCBtb3JlIGRhdGEgc29vbiwgaGlkZSB0aGUgTEVELlxuICB3aW5kb3cubGVkVGltZW91dElkID0gc2V0VGltZW91dCgoKS0+XG4gICAgJCgnI2xlZCcpLmhpZGUoKVxuICAsIDEwMClcblxuIyBUT0RPOiBtYWtlIHRoaXMgYSBmdW5jdGlvblxuIyAjIGh0dHA6Ly90aHJlZWpzLm9yZy9kb2NzLyNSZWZlcmVuY2UvRXh0cmFzLkdlb21ldHJpZXMvQ3lsaW5kZXJHZW9tZXRyeVxuIyByYXl4ID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoLjAxLCAuMDEsIC4xLCAyNCwgMSwgZmFsc2UpLFxuIyAgbmV3IFRIUkVFLk1lc2hOb3JtYWxNYXRlcmlhbCgpKVxuIyBjLnNjZW5lLmFkZChyYXl4KVxuY2xhc3MgRlRfU2Vuc29yXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUpIC0+XG4gICAgIyBUT0RPOiBVc2UgY3lsaW5kZXIgdG8gbWFrZSBpdCB0aGlja2VyP1xuICAgIEBtX3hfb2JqID0gbmV3IFRIUkVFLkFycm93SGVscGVyKG5ldyBUSFJFRS5WZWN0b3IzKDEsMCwwKSwgbmV3IFRIUkVFLlZlY3RvcjMoMCwwLDApLDAuMSwweEZGMDAwMClcbiAgICBAbV95X29iaiA9IG5ldyBUSFJFRS5BcnJvd0hlbHBlcihuZXcgVEhSRUUuVmVjdG9yMygwLDEsMCksIG5ldyBUSFJFRS5WZWN0b3IzKDAsMCwwKSwwLjEsMHgwMEZGMDApXG4gICAgQGZfel9vYmogPSBuZXcgVEhSRUUuQXJyb3dIZWxwZXIobmV3IFRIUkVFLlZlY3RvcjMoMCwwLC0xKSwgbmV3IFRIUkVFLlZlY3RvcjMoMCwwLDApLDAuMSwweDAwRkYwMClcbiAgICBAYXhpcyA9IG5ldyBUSFJFRS5PYmplY3QzRCgpXG4gICAgQGF4aXMuYWRkKEBtX3hfb2JqKVxuICAgIEBheGlzLmFkZChAbV95X29iailcbiAgICBAYXhpcy5hZGQoQGZfel9vYmopXG4gIHVwZGF0ZUNvbG9yOiAoKSAtPlxuICAgICMgR2V0IG14X21pbiwgbXhfbWF4LCBldGNcbiAgICBteF9taW4gPSAkKFwiIyN7IEBuYW1lIH0gLm1feF9taW5cIikudmFsKClcbiAgICBteF9tYXggPSAkKFwiIyN7IEBuYW1lIH0gLm1feF9tYXhcIikudmFsKClcbiAgICAjIGNvbnNvbGUubG9nKFwibXhfbWluOiAje214X21pbn1cIilcbiAgICAjIGNvbnNvbGUubG9nKFwibXhfbWF4OiAje214X21heH1cIilcbiAgICBteV9taW4gPSAkKFwiIyN7IEBuYW1lIH0gLm1feV9taW5cIikudmFsKClcbiAgICBteV9tYXggPSAkKFwiIyN7IEBuYW1lIH0gLm1feV9tYXhcIikudmFsKClcbiAgICBmel9taW4gPSAkKFwiIyN7IEBuYW1lIH0gLmZfel9taW5cIikudmFsKClcbiAgICBmel9tYXggPSAkKFwiIyN7IEBuYW1lIH0gLmZfel9tYXhcIikudmFsKClcbiAgICAjIFNjYWxlIFxuICAgIG14X2dyYWRpZW50ID0gaW50ZXJwQ29sb3IobXhfbWluLCBteF9tYXgsIDAsIEBtX3gpXG4gICAgIyBjb25zb2xlLmxvZyhcIm14X2dyYWRpZW50OiAje214X2dyYWRpZW50fVwiKVxuICAgIG15X2dyYWRpZW50ID0gaW50ZXJwQ29sb3IobXlfbWluLCBteV9tYXgsIDAsIEBtX3kpXG4gICAgZnpfZ3JhZGllbnQgPSBpbnRlcnBDb2xvcihmel9taW4sIGZ6X21heCwgMCwgQGZfeilcbiAgICAjIFNldCBjb2xvcnNcbiAgICB0ZW1wID0gbmV3IFRIUkVFLkNvbG9yKClcbiAgICB0ZW1wLnNldFJHQihteF9ncmFkaWVudCwoMS1teF9ncmFkaWVudCksMClcbiAgICBAYXhpcy5jaGlsZHJlblswXS5zZXRDb2xvcih0ZW1wLmdldEhleCgpKVxuXG4gICAgdGVtcC5zZXRSR0IobXlfZ3JhZGllbnQsKDEtbXlfZ3JhZGllbnQpLDApXG4gICAgQGF4aXMuY2hpbGRyZW5bMV0uc2V0Q29sb3IodGVtcC5nZXRIZXgoKSlcblxuICAgIHRlbXAuc2V0UkdCKGZ6X2dyYWRpZW50LCgxLWZ6X2dyYWRpZW50KSwwKVxuICAgIEBheGlzLmNoaWxkcmVuWzJdLnNldENvbG9yKHRlbXAuZ2V0SGV4KCkpXG5cbmludGVycENvbG9yID0gKG1pbixtYXgsemVybyx0KSAtPlxuICBpZiB0ID4gbWF4XG4gICAgdCA9IG1heFxuICBpZiB0IDwgbWluXG4gICAgdCA9IG1pblxuICBpZiB0IDwgemVyb1xuICAgIHJldHVybiBNYXRoLm1pbigoemVyby10KS8oemVyby1taW4pLDEpXG4gIGVsc2VcbiAgICByZXR1cm4gTWF0aC5taW4oKHQtemVybykvKG1heC16ZXJvKSwxKVxuXG4jXG4jIE1BSU5cbiNcbiQoIGRvY3VtZW50ICkucmVhZHkgKCkgLT5cbiAgI1xuICAjIFNldHVwIEdVSVxuICAjXG4gICQoXCIjbW91c2VfaW5mb19kaWFsb2dcIikuZGlhbG9nXG4gICAgYXV0b09wZW46IGZhbHNlXG4gICAgY2xvc2VPbkVzY2FwZTogdHJ1ZVxuICAgIGJ1dHRvbnM6XG4gICAgICBPSzogLT5cbiAgICAgICAgJCh0aGlzKS5kaWFsb2cgXCJjbG9zZVwiXG5cbiAgJChcIiNtb3VzZV9pbmZvX2J1dHRvblwiKS5vbiBcImNsaWNrXCIsIC0+XG4gICAgJChcIiNtb3VzZV9pbmZvX2RpYWxvZ1wiKS5kaWFsb2cgXCJvcGVuXCJcblxuICB3aW5kb3cuc3RhdHMgPSBuZXcgU3RhdHMoKTtcbiAgc3RhdHMuc2V0TW9kZSgwKTsgIyAwOiBmcHMsIDE6IG1zXG4gICQoJyNodWJvX2NvbnRhaW5lcicpLmFwcGVuZChzdGF0cy5kb21FbGVtZW50KVxuICBzdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICBzdGF0cy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnNDAwcHgnXG4gIHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcblxuICAjXG4gICMgU2V0dXAgSHViby1pbi10aGUtQnJvd3NlclxuICAjXG4gIGMgPSBuZXcgV2ViR0xSb2JvdHMuRGVmYXVsdENhbnZhcyhcIiNodWJvX2NvbnRhaW5lclwiKVxuICB3aW5kb3cuaHVibyA9IG5ldyBIdWJvKFwiaHVibzJcIiwgY2FsbGJhY2sgPSAtPiAgICBcbiAgICAjIE9uY2UgdGhlIFVSREYgaXMgY29tcGxldGVseSBsb2FkZWQsIHRoaXMgZnVuY3Rpb24gaXMgcnVuLlxuICAgICMgQWRkIHlvdXIgcm9ib3QgdG8gdGhlIGNhbnZhcy5cbiAgICBjLmFkZCBodWJvXG4gICAgaHViby5hdXRvcmVuZGVyID0gZmFsc2VcbiAgICAkKFwiI2xvYWRcIikuaGlkZSgpXG5cbiAgICAjIENyZWF0ZSBGVCBkaXNwbGF5IGF4ZXNcbiAgICBpZiBub3QgaHViby5mdD9cbiAgICAgIGh1Ym8uZnQgPSB7fVxuICAgIGh1Ym8uZnQuSFVCT19GVF9SX0hBTkQgPSBuZXcgRlRfU2Vuc29yKFwiSFVCT19GVF9SX0hBTkRcIilcbiAgICBodWJvLmZ0LkhVQk9fRlRfTF9IQU5EID0gbmV3IEZUX1NlbnNvcihcIkhVQk9fRlRfTF9IQU5EXCIpXG4gICAgaHViby5mdC5IVUJPX0ZUX1JfRk9PVCA9IG5ldyBGVF9TZW5zb3IoXCJIVUJPX0ZUX1JfRk9PVFwiKVxuICAgIGh1Ym8uZnQuSFVCT19GVF9MX0ZPT1QgPSBuZXcgRlRfU2Vuc29yKFwiSFVCT19GVF9MX0ZPT1RcIilcblxuICAgICMgQWRkIHRoZSBoYW5kIEZUIHNlbnNvcnMgdG8gdGhlIHdyaXN0IHBpdGNoIGxpbmtzXG4gICAgaHViby5saW5rcy5Cb2R5X1JXUC5hZGQoaHViby5mdC5IVUJPX0ZUX1JfSEFORC5heGlzKVxuICAgIGh1Ym8ubGlua3MuQm9keV9MV1AuYWRkKGh1Ym8uZnQuSFVCT19GVF9MX0hBTkQuYXhpcylcbiAgICBodWJvLmxpbmtzLkJvZHlfUkFSLmFkZChodWJvLmZ0LkhVQk9fRlRfUl9GT09ULmF4aXMpXG4gICAgaHViby5saW5rcy5Cb2R5X0xBUi5hZGQoaHViby5mdC5IVUJPX0ZUX0xfRk9PVC5heGlzKVxuICAgICMgVGhlIG9yaWdpbiBvZiB3cmlzdCBwaXRjaCBsaW5rIGlzIGluIHRoZSBtaWRkbGUgb2YgdGhlIHdyaXN0LCBzbyB3ZSB3aWxsXG4gICAgIyBvZmZzZXQgdGhlIGF4aXMgYSBiaXQgc28gaXQgaXMgaW4gdGhlIG1pZGRsZSBvZiB0aGUgaGFuZC5cbiAgICBodWJvLmZ0LkhVQk9fRlRfUl9IQU5ELmF4aXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygwLDAsLTAuMSlcbiAgICBodWJvLmZ0LkhVQk9fRlRfTF9IQU5ELmF4aXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygwLDAsLTAuMSlcbiAgICBodWJvLmZ0LkhVQk9fRlRfUl9GT09ULmF4aXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygtMC4wNSwwLC0wLjExKVxuICAgIGh1Ym8uZnQuSFVCT19GVF9MX0ZPT1QuYXhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKC0wLjA1LDAsLTAuMTEpXG4gICAgXG4gICAgIyBDcmVhdGUgdGhlIEZpcmViYXNlIHVwZGF0ZVxuICAgIHNlcmlhbF9zdGF0ZVJlZi5vbigndmFsdWUnLCAoc25hcHNob3QpIC0+XG4gICAgICAjIE5PVEU6IFdpdGggdGhlIHN0YXRzIGxpYnJhcnksIHdlIGFyZSB0aW1pbmcgdGhlIGludGVydmFsXG4gICAgICAjIGJldHdlZW4gcnVucyBvZiB0aGlzIGZ1bmN0aW9uLCBub3QgdGhlIHRpbWUgbmVlZGVkIHRvIHJlbmRlclxuICAgICAgIyBpdC4gVGhlcmVmb3JlLCB3ZSBlbmQgcmVjb3JkaW5nIGF0IHRoZSBiZWdpbm5pbmcgYW5kIGJlZ2luIHJlY29yZGluZ1xuICAgICAgIyByaWdodCBhd2F5LlxuICAgICAgc3RhdHMuZW5kKCk7XG4gICAgICBzdGF0cy5iZWdpbigpO1xuICAgICAgc2VyaWFsX3N0YXRlID0gc25hcHNob3QudmFsKClcbiAgICAgIGNvbnNvbGUubG9nKHNlcmlhbF9zdGF0ZSk7XG4gICAgICBzdGF0ZSA9IEpTT04ucGFyc2Uoc2VyaWFsX3N0YXRlKTtcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRlKTtcblxuICAgICAgIyBMRUQgc3RhdHVzIGluZGljYXRvclxuICAgICAgZmxhc2hMRUQoKVxuXG4gICAgICAjIFRPRE86IEluIHRoZSBmdXR1cmUsIG1ha2UgdGhpcyBhIGxvb3AgcmF0aGVyIHRoYW4gaGFyZC1jb2RlZC5cbiAgICAgIGh1Ym8uZnRbXCJIVUJPX0ZUX1JfSEFORFwiXS5tX3ggPSBzdGF0ZS5mdFswXVxuICAgICAgaHViby5mdFtcIkhVQk9fRlRfUl9IQU5EXCJdLm1feSA9IHN0YXRlLmZ0WzFdXG4gICAgICBodWJvLmZ0W1wiSFVCT19GVF9SX0hBTkRcIl0uZl96ID0gc3RhdGUuZnRbMl1cbiAgICAgIGh1Ym8uZnRbXCJIVUJPX0ZUX1JfSEFORFwiXS51cGRhdGVDb2xvcigpXG4gICAgICBodWJvLmZ0W1wiSFVCT19GVF9MX0hBTkRcIl0ubV94ID0gc3RhdGUuZnRbM11cbiAgICAgIGh1Ym8uZnRbXCJIVUJPX0ZUX0xfSEFORFwiXS5tX3kgPSBzdGF0ZS5mdFs0XVxuICAgICAgaHViby5mdFtcIkhVQk9fRlRfTF9IQU5EXCJdLmZfeiA9IHN0YXRlLmZ0WzVdXG4gICAgICBodWJvLmZ0W1wiSFVCT19GVF9MX0hBTkRcIl0udXBkYXRlQ29sb3IoKVxuICAgICAgaHViby5mdFtcIkhVQk9fRlRfUl9GT09UXCJdLm1feCA9IHN0YXRlLmZ0WzZdXG4gICAgICBodWJvLmZ0W1wiSFVCT19GVF9SX0ZPT1RcIl0ubV95ID0gc3RhdGUuZnRbN11cbiAgICAgIGh1Ym8uZnRbXCJIVUJPX0ZUX1JfRk9PVFwiXS5mX3ogPSBzdGF0ZS5mdFs4XVxuICAgICAgaHViby5mdFtcIkhVQk9fRlRfUl9GT09UXCJdLnVwZGF0ZUNvbG9yKClcbiAgICAgIGh1Ym8uZnRbXCJIVUJPX0ZUX0xfRk9PVFwiXS5tX3ggPSBzdGF0ZS5mdFs5XVxuICAgICAgaHViby5mdFtcIkhVQk9fRlRfTF9GT09UXCJdLm1feSA9IHN0YXRlLmZ0WzEwXVxuICAgICAgaHViby5mdFtcIkhVQk9fRlRfTF9GT09UXCJdLmZfeiA9IHN0YXRlLmZ0WzExXVxuICAgICAgaHViby5mdFtcIkhVQk9fRlRfTF9GT09UXCJdLnVwZGF0ZUNvbG9yKClcblxuICAgICAgaHViby5tb3RvcnNbXCJXU1RcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFswXVxuICAgICAgaHViby5tb3RvcnNbXCJOS1lcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFsxXVxuICAgICAgaHViby5tb3RvcnNbXCJOSzFcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFsyXVxuICAgICAgaHViby5tb3RvcnNbXCJOSzJcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFszXVxuICAgICAgaHViby5tb3RvcnNbXCJMU1BcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFs0XVxuICAgICAgaHViby5tb3RvcnNbXCJMU1JcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFs1XVxuICAgICAgaHViby5tb3RvcnNbXCJMU1lcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFs2XVxuICAgICAgaHViby5tb3RvcnNbXCJMRVBcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFs3XVxuICAgICAgaHViby5tb3RvcnNbXCJMV1lcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFs4XVxuICAgICAgIyBodWJvLm1vdG9yc1tcIkxXUlwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzldXG4gICAgICBodWJvLm1vdG9yc1tcIkxXUFwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzEwXVxuICAgICAgaHViby5tb3RvcnNbXCJSU1BcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFsxMV1cbiAgICAgIGh1Ym8ubW90b3JzW1wiUlNSXCJdLnZhbHVlID0gc3RhdGUuam9pbnRbMTJdXG4gICAgICBodWJvLm1vdG9yc1tcIlJTWVwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzEzXVxuICAgICAgaHViby5tb3RvcnNbXCJSRVBcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFsxNF1cbiAgICAgIGh1Ym8ubW90b3JzW1wiUldZXCJdLnZhbHVlID0gc3RhdGUuam9pbnRbMTVdXG4gICAgICAjIGh1Ym8ubW90b3JzW1wiUldSXCJdLnZhbHVlID0gc3RhdGUuam9pbnRbMTZdXG4gICAgICBodWJvLm1vdG9yc1tcIlJXUFwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzE3XVxuICAgICAgIyBtaW5kIHRoZSBnYXBcbiAgICAgIGh1Ym8ubW90b3JzW1wiTEhZXCJdLnZhbHVlID0gc3RhdGUuam9pbnRbMTldXG4gICAgICBodWJvLm1vdG9yc1tcIkxIUlwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzIwXVxuICAgICAgaHViby5tb3RvcnNbXCJMSFBcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFsyMV1cbiAgICAgIGh1Ym8ubW90b3JzW1wiTEtQXCJdLnZhbHVlID0gc3RhdGUuam9pbnRbMjJdXG4gICAgICBodWJvLm1vdG9yc1tcIkxBUFwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzIzXVxuICAgICAgaHViby5tb3RvcnNbXCJMQVJcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFsyNF1cbiAgICAgICMgbWluZCB0aGUgZ2FwXG4gICAgICBodWJvLm1vdG9yc1tcIlJIWVwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzI2XVxuICAgICAgaHViby5tb3RvcnNbXCJSSFJcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFsyN11cbiAgICAgIGh1Ym8ubW90b3JzW1wiUkhQXCJdLnZhbHVlID0gc3RhdGUuam9pbnRbMjhdXG4gICAgICBodWJvLm1vdG9yc1tcIlJLUFwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzI5XVxuICAgICAgaHViby5tb3RvcnNbXCJSQVBcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFszMF1cbiAgICAgIGh1Ym8ubW90b3JzW1wiUkFSXCJdLnZhbHVlID0gc3RhdGUuam9pbnRbMzFdXG4gICAgICBodWJvLm1vdG9yc1tcIlJGMVwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzMyXVxuICAgICAgaHViby5tb3RvcnNbXCJSRjJcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFszM11cbiAgICAgIGh1Ym8ubW90b3JzW1wiUkYzXCJdLnZhbHVlID0gc3RhdGUuam9pbnRbMzRdICAgIFxuICAgICAgaHViby5tb3RvcnNbXCJSRjRcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFszNV1cbiAgICAgIGh1Ym8ubW90b3JzW1wiUkY1XCJdLnZhbHVlID0gc3RhdGUuam9pbnRbMzZdXG4gICAgICBodWJvLm1vdG9yc1tcIkxGMVwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzM3XVxuICAgICAgaHViby5tb3RvcnNbXCJMRjJcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFszOF1cbiAgICAgIGh1Ym8ubW90b3JzW1wiTEYzXCJdLnZhbHVlID0gc3RhdGUuam9pbnRbMzldXG4gICAgICBodWJvLm1vdG9yc1tcIkxGNFwiXS52YWx1ZSA9IHN0YXRlLmpvaW50WzQwXVxuICAgICAgaHViby5tb3RvcnNbXCJMRjVcIl0udmFsdWUgPSBzdGF0ZS5qb2ludFs0MV1cbiAgICAgIGh1Ym8uY2FudmFzLnJlbmRlcigpXG4gICAgKVxuXG4gICAgIyBVcGRhdGUgdGhlIHJlbmRlcmluZyB0byByZWZsZWN0IGFueSBjaGFuZ2VzIHRvIEh1Ym8uXG4gICAgYy5yZW5kZXIoKVxuICAsIHByb2dyZXNzID0gKHN0ZXAsIHRvdGFsLCBub2RlKSAtPlxuICAgICQoXCIjbG9hZFwiKS5odG1sIFwiTG9hZGluZyBcIiArIHN0ZXAgKyBcIi9cIiArIHRvdGFsXG4gIClcbiIKICBdCn0=