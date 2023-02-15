async function makeCall()
{
    //document.getElementById("#remoteVideo").srcObject=navigator.mediaDevices.getDisplayMedia({video: true, audio: true});
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        /* use the stream */
      } catch(err) {
          console.log("idemmm u blok")
        /* handle the error */
      }
    console.log("vlc");
}