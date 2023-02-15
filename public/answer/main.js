const socket=io();

const configuration= {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
const peerConnection = new RTCPeerConnection(configuration);
const remoteStream = new MediaStream();
const remoteVideo = document.querySelector('#remoteVideo');


peerConnection.addEventListener('track', async (event) => {
    remoteStream.addTrack(event.track, remoteStream);
    remoteVideo.srcObject = remoteStream;
});



socket.on('message',message=>{
    console.log(message);
    var te=message+" primieo sam";
    //socket.emit('chatMessage',te);
});
socket.on('offer',(message)=>{
    console.log("dobili smo offer "+message);
    if (message.sdp) {
        console.log("kol");
        console.log("state: "+peerConnection.signalingState);
        peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
      console.log("state: "+peerConnection.signalingState);
    }
    document.getElementById("vr").disabled=false;
//socket.emit('answer',"moj odg");
});

async function makeCall() {
    console.log("odg");
    console.log("state1: "+peerConnection.signalingState);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    console.log("state1: "+peerConnection.signalingState);
    socket.emit('answer', {'answer': peerConnection.localDescription});
}

peerConnection.ontrack=e=>{
    document.getElementById("#remoteVideo").srcObject=e.streams[0];
}

// Listen for local ICE candidates on the local RTCPeerConnection
peerConnection.addEventListener('icecandidate', event => {
    console.log("pwp lis");
    if (event.candidate) {
        console.log("prosao if pwp lis cand="+event.candidate);
        socket.emit('ice1',{'candidate': event.candidate});
    }
});

// Listen for remote ICE candidates and add them to the local RTCPeerConnection
socket.on('ice', async message => {
    console.log("ice ="+message.candidate);
    if (message.candidate) {
        try {
            console.log("dodan kandidat");
            await peerConnection.addIceCandidate(message.candidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
});
/*
// Listen for local ICE candidates on the local RTCPeerConnection
peerConnection.addEventListener('icecandidate', event => {
    console.log("pwp lis");
    if (event.candidate) {
        console.log("prosao if pwp lis cand="+event.candidate);
        socket.emit('ice1',{'new-ice-candidate': event.candidate});
    }
});

// Listen for remote ICE candidates and add them to the local RTCPeerConnection
socket.on('ice', async message => {
    console.log("ice ="+message.icecandidate);
    if (message.iceCandidate) {
        try {
            await peerConnection.addIceCandidate(message.iceCandidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
});
*/


// Listen for connectionstatechange on the local RTCPeerConnection
peerConnection.addEventListener('connectionstatechange', event => {
    if (peerConnection.connectionState === 'connected') {
        // Peers connected!
        console.log("to jetooo");
    }
});