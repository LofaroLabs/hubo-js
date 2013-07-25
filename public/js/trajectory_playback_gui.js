// Generated by CoffeeScript undefined
watch(playback, 'state', function() {
  var ui, _ref;
  console.log(this);
  ui = $('#toggle_play');
  if ((_ref = this.state) === 'NOT_LOADED' || _ref === 'LOADING') {
    ui.attr('disabled', 'disabled');
  } else {
    ui.removeAttr('disabled');
  }
  switch (this.state) {
    case 'NOT_LOADED':
      return ui.html('Start');
    case 'PLAYING':
      return ui.html('Pause');
    case 'DONE_PLAYING':
      return ui.html('Replay');
    default:
      return ui.html('Play');
  }
});

$('#traj_selection').on('change', function(event) {
  if ($(this).val() === '') {
    return;
  }
  playback.state = 'NOT_LOADED';
  playback.filename = 'trajectories/' + $(this).val();
  return loadTrajectory(playback.filename, function(headers, data) {
    var id, _i, _len;
    console.log(data.length);
    playback.data = data;
    playback.framerate = 200;
    headers[headers.indexOf('LKN')] = 'LKP';
    headers[headers.indexOf('RKN')] = 'RKP';
    headers[headers.indexOf('LEB')] = 'LEP';
    headers[headers.indexOf('REB')] = 'REP';
    playback.working_headers = {};
    for (_i = 0, _len = headers.length; _i < _len; _i++) {
      id = headers[_i];
      if (hubo.motors[id] != null) {
        playback.working_headers[id] = headers.indexOf(id);
      }
    }
    playback.state = 'LOADED';
    playback.frame = 0;
  });
});

$('#toggle_play').on('click', togglePlay);
