// Generated by CoffeeScript 1.7.1
var applyTrajectory;

jQuery.event.props.push("dataTransfer");

$('body').on('dragover', function(event) {
  event.stopPropagation();
  event.preventDefault();
});

$('body').on('drop', function(event) {
  var file, files, reader;
  event.stopPropagation();
  event.preventDefault();
  files = event.dataTransfer.files;
  if (files.length > 1) {
    alert("You can only drop one file at a time.");
    return;
  }
  file = files[0];
  reader = new FileReader();
  reader.onload = function(e) {
    return loadTrajectoryString(e.target.result, applyTrajectory);
  };
  reader.readAsText(file);
});

$('#mouse_info_dialog').dialog({
  autoOpen: false,
  closeOnEscape: true,
  buttons: {
    OK: function() {
      return $(this).dialog('close');
    }
  }
});

$('#mouse_info_button').on('click', function() {
  return $('#mouse_info_dialog').dialog('open');
});

$('#paste_traj_dialog').dialog({
  autoOpen: false,
  closeOnEscape: true,
  closeText: 'hide',
  buttons: {
    Cancel: function() {
      return $(this).dialog('close');
    },
    Load: function() {
      loadTrajectoryString($('#traj_input').val(), applyTrajectory);
      $('#traj_input').val('');
      return $(this).dialog('close');
    }
  }
});

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
    case 'PLAYING':
      return ui.html('Pause');
    case 'DONE_PLAYING':
      return ui.html('Replay');
    default:
      return ui.html('Play');
  }
});

applyTrajectory = function(headers, data) {
  var id, _i, _len;
  console.log(data.length);
  playback.data = data;
  playback.framerate = 200;
  playback.working_headers = {};
  for (_i = 0, _len = headers.length; _i < _len; _i++) {
    id = headers[_i];
    if (hubo.motors[id] != null) {
      playback.working_headers[id] = headers.indexOf(id);
    }
  }
  playback.state = 'LOADED';
  playback.frame = 0;
  togglePlay();
};

$('#traj_selection').on('change', function(event) {
  if ($(this).val() === '') {
    return;
  }
  if ($(this).val() === 'clipboard') {
    $('#paste_traj_dialog').dialog('open');
  }
  playback.state = 'LOADING';
  playback.filename = ("" + local_root + "data/hubo-trajectories/") + $(this).val();
  hubo.reset();
  c.render();
  return loadTrajectoryFile(playback.filename, applyTrajectory);
});

$('#toggle_play').on('click', togglePlay);

$('#load').on('click', function(event) {
  var callback, progress;
  $(this).html("Loading...").attr('disabled', 'disabled');
  window.c = new WebGLRobots.DefaultCanvas('#hubo_container');
  return window.hubo = new Hubo('hubo2', callback = function() {
    c.add(hubo);
    hubo.autorender = false;
    $('#panel_load').hide();
    return $('#panel_traj').show();
  }, progress = function(step, total, node) {
    return $('#load').html("Loading " + step + "/" + total);
  });
});

$(document).ready(function() {
  window.stats = new Stats();
  stats.setMode(0);
  $('#hubo_container').append(stats.domElement);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '400px';
  return stats.domElement.style.top = '0px';
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIvZXhhbXBsZXMvdHJhamVjdG9yeV9wbGF5YmFjay90cmFqZWN0b3J5X3BsYXliYWNrX2d1aS5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsKICAgICIvZXhhbXBsZXMvdHJhamVjdG9yeV9wbGF5YmFjay90cmFqZWN0b3J5X3BsYXliYWNrX2d1aS5qcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiO0FBR0EsSUFBQSxlQUFBOztBQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQW5CLENBQXlCLGNBQXpCLENBQUEsQ0FBQTs7QUFBQSxDQUVBLENBQUUsTUFBRixDQUFTLENBQUMsRUFBVixDQUFhLFVBQWIsRUFBeUIsU0FBQyxLQUFELEdBQUE7QUFDdkIsRUFBQSxLQUFLLENBQUMsZUFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLEVBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBQSxDQURBLENBRHVCO0FBQUEsQ0FBekIsQ0FGQSxDQUFBOztBQUFBLENBT0EsQ0FBRSxNQUFGLENBQVMsQ0FBQyxFQUFWLENBQWEsTUFBYixFQUFxQixTQUFDLEtBQUQsR0FBQTtBQUNuQixNQUFBLG1CQUFBO0FBQUEsRUFBQSxLQUFLLENBQUMsZUFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLEVBQ0EsS0FBSyxDQUFDLGNBQU4sQ0FBQSxDQURBLENBQUE7QUFBQSxFQUdBLEtBQUEsR0FBUSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBSDNCLENBQUE7QUFJQSxFQUFBLElBQUksS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFuQjtBQUNFLElBQUEsS0FBQSxDQUFNLHVDQUFOLENBQUEsQ0FBQTtBQUNBLFVBQUEsQ0FGRjtHQUpBO0FBQUEsRUFPQSxJQUFBLEdBQU8sS0FBTSxDQUFBLENBQUEsQ0FQYixDQUFBO0FBQUEsRUFTQSxNQUFBLEdBQWEsSUFBQSxVQUFBLENBQUEsQ0FUYixDQUFBO0FBQUEsRUFVQSxNQUFNLENBQUMs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S0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFkLENBREEsQ0FBQTtBQUFBLEVBRUEsQ0FBQSxDQUFFLGlCQUFGLENBQW9CLENBQUMsTUFBckIsQ0FBNEIsS0FBSyxDQUFDLFVBQWxDLENBRkEsQ0FBQTtBQUFBLEVBR0EsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBdkIsR0FBa0MsVUFIbEMsQ0FBQTtBQUFBLEVBSUEsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBdkIsR0FBOEIsT0FKOUIsQ0FBQTtTQUtBLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQXZCLEdBQTZCLE1BTlg7QUFBQSxDQUFwQixDQXJHQSxDQUFBIiwKICAic291cmNlc0NvbnRlbnQiOiBbCiAgICAiIyBcbiMgR1VJIFxuI1xualF1ZXJ5LmV2ZW50LnByb3BzLnB1c2goIFwiZGF0YVRyYW5zZmVyXCIgKVxuXG4kKCdib2R5Jykub24gJ2RyYWdvdmVyJywgKGV2ZW50KSAtPlxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gIHJldHVyblxuXG4kKCdib2R5Jykub24gJ2Ryb3AnLCAoZXZlbnQpIC0+XG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICBmaWxlcyA9IGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlc1xuICBpZiAoZmlsZXMubGVuZ3RoID4gMSlcbiAgICBhbGVydChcIllvdSBjYW4gb25seSBkcm9wIG9uZSBmaWxlIGF0IGEgdGltZS5cIilcbiAgICByZXR1cm5cbiAgZmlsZSA9IGZpbGVzWzBdXG5cbiAgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICByZWFkZXIub25sb2FkID0gKGUpIC0+XG4gICAgbG9hZFRyYWplY3RvcnlTdHJpbmcoZS50YXJnZXQucmVzdWx0LCBhcHBseVRyYWplY3RvcnkpXG4gIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpXG4gIHJldHVyblxuXG4kKCcjbW91c2VfaW5mb19kaWFsb2cnKS5kaWFsb2dcbiAgYXV0b09wZW46IGZhbHNlXG4gIGNsb3NlT25Fc2NhcGU6IHRydWVcbiAgYnV0dG9uczpcbiAgICBPSzogKCkgLT5cbiAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpXG5cbiQoJyNtb3VzZV9pbmZvX2J1dHRvbicpLm9uICdjbGljaycsICgpIC0+ICQoJyNtb3VzZV9pbmZvX2RpYWxvZycpLmRpYWxvZygnb3BlbicpXG5cbiQoJyNwYXN0ZV90cmFqX2RpYWxvZycpLmRpYWxvZ1xuICBhdXRvT3BlbjogZmFsc2VcbiAgY2xvc2VPbkVzY2FwZTogdHJ1ZVxuICBjbG9zZVRleHQ6ICdoaWRlJ1xuICBidXR0b25zOlxuICAgIENhbmNlbDogKCkgLT5cbiAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpXG4gICAgTG9hZDogKCkgLT5cbiAgICAgIGxvYWRUcmFqZWN0b3J5U3RyaW5nKCQoJyN0cmFqX2lucHV0JykudmFsKCksIGFwcGx5VHJhamVjdG9yeSlcbiAgICAgICQoJyN0cmFqX2lucHV0JykudmFsKCcnKVxuICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJylcblxud2F0Y2ggcGxheWJhY2ssICdzdGF0ZScsICgpIC0+XG4gIGNvbnNvbGUubG9nKEApXG4gIHVpID0gJCgnI3RvZ2dsZV9wbGF5JylcbiAgaWYgQHN0YXRlIGluIFsnTk9UX0xPQURFRCcsICdMT0FESU5HJ11cbiAgICB1aS5hdHRyKCdkaXNhYmxlZCcsJ2Rpc2FibGVkJylcbiAgZWxzZVxuICAgIHVpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJylcbiAgc3dpdGNoIEBzdGF0ZVxuICAgIHdoZW4gJ1BMQVlJTkcnICAgICAgdGhlbiB1aS5odG1sKCdQYXVzZScpXG4gICAgd2hlbiAnRE9ORV9QTEFZSU5HJyB0aGVuIHVpLmh0bWwoJ1JlcGxheScpXG4gICAgZWxzZSB1aS5odG1sKCdQbGF5JylcblxuYXBwbHlUcmFqZWN0b3J5ID0gKGhlYWRlcnMsIGRhdGEpIC0+ICBcbiAgICBjb25zb2xlLmxvZyhkYXRhLmxlbmd0aClcbiAgICBwbGF5YmFjay5kYXRhID0gZGF0YVxuICAgIHBsYXliYWNrLmZyYW1lcmF0ZSA9IDIwMCAjIEh6XG4gICAgIyBGaW5kIHRoZSBqb2ludHMgd2UgY2FuIGFjdHVhbGx5IHVzZVxuICAgIHBsYXliYWNrLndvcmtpbmdfaGVhZGVycyA9IHt9XG4gICAgZm9yIGlkIGluIGhlYWRlcnNcbiAgICAgIHBsYXliYWNrLndvcmtpbmdfaGVhZGVyc1tpZF0gPSBoZWFkZXJzLmluZGV4T2YoaWQpIGlmIGh1Ym8ubW90b3JzW2lkXT9cbiAgICBwbGF5YmFjay5zdGF0ZSA9ICdMT0FERUQnXG4gICAgcGxheWJhY2suZnJhbWUgPSAwXG4gICAgdG9nZ2xlUGxheSgpXG4gICAgcmV0dXJuXG5cbiQoJyN0cmFqX3NlbGVjdGlvbicpLm9uICdjaGFuZ2UnLCAoZXZlbnQpIC0+XG4gIHJldHVybiBpZiAkKHRoaXMpLnZhbCgpIGlzICcnIFxuICBpZiAkKHRoaXMpLnZhbCgpIGlzICdjbGlwYm9hcmQnXG4gICAgJCgnI3Bhc3RlX3RyYWpfZGlhbG9nJykuZGlhbG9nKCdvcGVuJyk7XG4gIHBsYXliYWNrLnN0YXRlID0gJ0xPQURJTkcnICAjIFRoaXMgaXMgaW1wb3J0YW50IGJlY2F1c2Ugb2YgdGhlIGFzeW5jaHJvbmljaXR5XG4gIHBsYXliYWNrLmZpbGVuYW1lID0gXCIje2xvY2FsX3Jvb3R9ZGF0YS9odWJvLXRyYWplY3Rvcmllcy9cIiArICQodGhpcykudmFsKClcbiAgaHViby5yZXNldCgpICMgRml4IGFueSBtaXNzaW5nIGxpbWJzLi4uIGNhdXNlZCBieSBzZXR0aW5nIGpvaW50cyB0byBOYU4uIFRvbyBiYWQgdGhpcyBpc24ndCB0aGUgd2Fsay1yZWFkeSBwb3NlLlxuICBjLnJlbmRlcigpXG4gIGxvYWRUcmFqZWN0b3J5RmlsZSBwbGF5YmFjay5maWxlbmFtZSwgYXBwbHlUcmFqZWN0b3J5XG5cbiQoJyN0b2dnbGVfcGxheScpLm9uICdjbGljaycsIHRvZ2dsZVBsYXlcblxuJCgnI2xvYWQnKS5vbiAnY2xpY2snLCAoZXZlbnQpLT4gXG4gICQodGhpcykuaHRtbChcIkxvYWRpbmcuLi5cIikuYXR0cignZGlzYWJsZWQnLCdkaXNhYmxlZCcpXG4gICMgVGhpcyBjb2RlIGlzIG1lYW50IHRvIHNob3cgdGhlIGJhcmUgbWluaW11bSBuZWVkZWQgdG8gYWRkIGEgSHVibyB0byBhIHdlYnBhZ2UuXG4gICMgQ3JlYXRlIGEgVEhSRUUuV2ViR0xSZW5kZXJlcigpIHRvIGhvc3QgdGhlIHJvYm90LiBZb3UgY2FuIGNyZWF0ZSB5b3VyIG93biwgb3IgdXNlIHRoZSBwcm92aWRlZCBjb2RlIHRvIGdlbmVyYXRlIGRlZmF1bHQgc2V0dXAuXG4gIHdpbmRvdy5jID0gbmV3IFdlYkdMUm9ib3RzLkRlZmF1bHRDYW52YXMoJyNodWJvX2NvbnRhaW5lcicpXG4gICMgQ3JlYXRlIGEgbmV3IHJvYm90IGluc3RhbmNlLlxuICB3aW5kb3cuaHVibyA9IG5ldyBIdWJvICdodWJvMicsXG4gICAgY2FsbGJhY2sgPSAtPlxuICAgICAgIyBPbmNlIHRoZSBVUkRGIGlzIGNvbXBsZXRlbHkgbG9hZGVkLCB0aGlzIGZ1bmN0aW9uIGlzIHJ1bi5cbiAgICAgICMgQWRkIHlvdXIgcm9ib3QgdG8gdGhlIGNhbnZhcy5cbiAgICAgIGMuYWRkIGh1Ym9cbiAgICAgIGh1Ym8uYXV0b3JlbmRlciA9IGZhbHNlXG4gICAgICAkKCcjcGFuZWxfbG9hZCcpLmhpZGUoKTtcbiAgICAgICQoJyNwYW5lbF90cmFqJykuc2hvdygpO1xuICAgIHByb2dyZXNzID0gKHN0ZXAsdG90YWwsbm9kZSkgLT5cbiAgICAgICQoJyNsb2FkJykuaHRtbChcIkxvYWRpbmcgXCIgKyBzdGVwICsgXCIvXCIgKyB0b3RhbClcblxuI1xuIyBNQUlOXG4jXG4kKCBkb2N1bWVudCApLnJlYWR5ICgpIC0+XG4gIHdpbmRvdy5zdGF0cyA9IG5ldyBTdGF0cygpO1xuICBzdGF0cy5zZXRNb2RlKDApOyAjIDA6IGZwcywgMTogbXNcbiAgJCgnI2h1Ym9fY29udGFpbmVyJykuYXBwZW5kKHN0YXRzLmRvbUVsZW1lbnQpXG4gIHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gIHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICc0MDBweCdcbiAgc3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JyIKICBdCn0=