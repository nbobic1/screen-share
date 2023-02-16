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

//kod za pracenje pozicije misa
var x=0;
var y=0;
(function() {
    var mousePos;

    document.onmousemove = handleMouseMove;
    setInterval(getMousePosition, 100); // setInterval repeats every X ms

    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        mousePos = {
            x: event.pageX,
            y: event.pageY
        };
    }
    function getMousePosition() {
        var pos = mousePos;
        if (!pos) {
            // We haven't seen any movement yet
        }
        else if(Math.abs(x-pos.x)>3||Math.abs(y-pos.y)>3){
            // Use pos.x and pos.y
            x=pos.x;
            y=pos.y;
            console.log(pos.x, pos.y);
      
            socket.emit('mouseIncomeing',{'x':x, 'y':y});
        }
    }
})();