import React, { useState, useCallback, useRef, useEffect } from "react";
import VideoPlayer from "react-video-markers";
import Webcam from "react-webcam";
import "./video.area.css";
import axios from "axios";

const VideoArea = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const [timerId, setTimerId] = useState(null);
  // let imageSrc = null;
  // const [captureYes, setCaptureYes] = useState(true);
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    // document.getElementById("image-src").src = imageSrc;
    // console.log(imageSrc);

    if (imageSrc)
      axios
        .post("http://13.235.244.51:5000", imageSrc, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${imageSrc._boundary}`,
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
  }, [webcamRef]);

  const videoConstraints = {
    width: 600,
    height: 600,
    facingMode: "user"
  };

  const captureViewer = () => {
    if (isPlaying) {
      console.log("capturing");
      let t = setInterval(() => {
        capture();
      }, 1000);
      setTimerId(t);
    } else if (!isPlaying) {
      clearInterval(timerId);
    }
  };

  useEffect(captureViewer, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    console.log("played");
  };

  const handlePause = () => {
    setIsPlaying(false);
    console.log("paused");
  };

  const handleVolume = vol => {
    setVolume(vol);
  };

  return (
    <div className="video-area">
      <VideoPlayer
        url="https://4bdba003.ngrok.io/video"
        isPlaying={isPlaying}
        volume={volume}
        onPlay={handlePlay}
        onPause={handlePause}
        onVolume={handleVolume}
      />
      {/* <img id="image-src" /> */}
      <div className="hidden-cam">
        <Webcam
          audio={false}
          height={600}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={600}
          videoConstraints={videoConstraints}
        />
      </div>
      <h1 className="video-title">This is a video title</h1>
    </div>
  );
};

export default VideoArea;
