import React from "react";

function VideoCall({ roomId }) {
  const roomUrl = `https://meet.jit.si/${roomId}`;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src={roomUrl}
        style={{ height: "100%", width: "100%", border: "none" }}
        allow="camera; microphone; fullscreen"
        title="Video Call"
      ></iframe>
    </div>
  );
}

export default VideoCall;
