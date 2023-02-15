const socket=io();
socket.on('message',message=>{
    console.log(message);
    var te=message+" primieo sam";
    //socket.emit('chatMessage',te);
});

const configuration= {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
const peerConnection = new RTCPeerConnection(configuration);


    socket.on('answer', async message => {
       
            console.log("answer "+message);
            console.log("state1: "+peerConnection.signalingState);
            const remoteDesc = new RTCSessionDescription(message.answer);
            await peerConnection.setRemoteDescription(remoteDesc);
            console.log("state1: "+peerConnection.signalingState);
    });
    async function makeCall() {
        const localStream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true});
localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
    
});/*
await navigator.mediaDevices.getUserMedia({video:true},(stream)=>{peerConnection.addTrack(stream)});*/
    console.log("Nudimo");
    console.log("state: "+peerConnection.signalingState);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("state: "+peerConnection.signalingState);
    socket.emit('offer', {'type':"offer",'sdp': peerConnection.localDescription});
    console.log("ponudjeno "+peerConnection.localDescription);
}

// Listen for local ICE candidates on the local RTCPeerConnection
peerConnection.addEventListener('icecandidate', event => {
    console.log("pwp lis");
    if (event.candidate) {
        console.log("prosao if pwp lis cndi="+event.candidate);
        socket.emit('ice',{'candidate': event.candidate});
    }
});

// Listen for remote ICE candidates and add them to the local RTCPeerConnection
socket.on('ice1', async message => {
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
        console.log("prosao if pwp lis cndi="+event.candidate);
        socket.emit('ice',{'new-ice-candidate': event.candidate});
    }
});

// Listen for remote ICE candidates and add them to the local RTCPeerConnection
socket.on('ice1', async message => {
    console.log("ice ="+message.candidate);
    if (message.iceCandidate) {
        try {
            console.log("dodan kandidat");
            await peerConnection.addIceCandidate(message.iceCandidate);
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    }
});
*/


// Listen for connectionstatechange on the local RTCPeerConnection
peerConnection.addEventListener('connectionstatechange', event => {
    console.log("state of connecton: "+peerConnection.connectionState);
    if (peerConnection.connectionState === 'connected') {
        // Peers connected!
        console.log("idemo daljee");
    }
});