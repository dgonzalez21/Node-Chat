var socket = io();
var rtc, web, mic;
DetectRTC.load(function() {
    web = DetectRTC.hasWebcam
    mic = DetectRTC.hasMicrophone
    rtc = DetectRTC.isWebRTCSupported
    console.log("WebRtc: " + rtc + " Mic: " + mic + " Webcam: " + web);
});

var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remoteVideos',
    // immediately ask for camera access
    autoRequestMedia: true
});

function checkReady() {
    if (web && mic && rtc) {
        return true;
    } else {
        console.log("WebRtc: " + rtc + " Mic: " + mic + " Webcam: " + web);
        if (!rtc) {
            alert('This site uses a cutting edge technology called WebRTC that is only available in Chrome, Firefox and Opera.');
        } else {
            alert('You need to have a microphone and webcam');
        }
        return false;
    }
}
$('#join').click(function() {
    if (checkReady()) {
        socket.emit('user-ready');
    }
    $('#landing').toggle();
    $('#tray').toggle();
    $('#localVideo').toggle();
    $('#msgs').text('Finding Users ... ');




});
$('#leave').click(function() {
    webrtc.leaveRoom();
    $('#msgs').text(' ');
    $('#landing').toggle();
    $('#tray').toggle();
    $('#localVideo').toggle();



});
$('#next').click(function() {
    socket.emit('user-ready');
    webrtc.leaveRoom();
    $('#msgs').text('Finding Users ... ');

});
socket.on('id', function(msg) {
    socket.emit('not-ready');
    $('#msgs').text('User Found!');
    webrtc.joinRoom(msg);


});
webrtc.on('videoRemoved', function(peer) {
    $('#msgs').text('User Left! Click "Next" to find a new match.');

});
socket.on('users-online', function(msg) {
    $("#count").text('User Count: ' + msg);

});