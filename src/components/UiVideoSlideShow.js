import React, { useState, useEffect, useRef, useContext } from "react"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"
import { useTransition } from "react-spring"

import { ThemeHelloContext } from "./layout"
import { colors } from "./styles"

export default function UiVideoSlideShow() {
  //pulls in all videos
  const data = useStaticQuery(graphql`
    query {
      videosList: allFile(
        filter: { ext: { eq: ".mp4" } }
        sort: { fields: relativePath, order: ASC }
      ) {
        nodes {
          id
          publicURL
          videoDuration
          name
        }
      }
      covers: allFile(filter: { sourceInstanceName: { eq: "covers" } }) {
        nodes {
          id
          publicURL
          name
        }
      }
    }
  `)
  const videos = data.videosList.nodes //all videos
  const covers = data.covers.nodes //all covers

  const myValue = useContext(ThemeHelloContext)

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const setNewVideoIndex = moveIndex => {
    //handles the setting the new current index and looping of videos
    pauseTimers()
    const newVideoIndex = currentVideoIndex + moveIndex
    if (newVideoIndex <= 0) {
      return setCurrentVideoIndex(videos.length - 1)
    } else if (newVideoIndex >= videos.length - 1) {
      return setCurrentVideoIndex(0)
    }
    myValue.setCurrentColor(Math.floor(Math.random() * 8))
    return setCurrentVideoIndex(newVideoIndex)
  }

  //will hold all the timers that are running
  let timer = [] // this shouldnt be state because it willl cause a render every second

  function pauseTimers() {
    //clears all timers if there are any
    return timer.forEach((timers, i) => clearTimeout(timer[i]))
  }

  function startAndStopTimer(time, cb) {
    if (isMouseIn === true) return //makes sure the timer is not running if the mouse is in the video player

    let cachedTime = time
    cachedTime = cachedTime - 1000 //decrease time by one second

    timer.push(
      setTimeout(() => {
        if (cachedTime === 0 || cachedTime === undefined) {
          pauseTimers()
          cb() //custom callback
          return
        } else {
          return startAndStopTimer(cachedTime, cb)
        }
      }, 1000)
    )
  }
  //makes sure the timer is not running if the mouse is in the video player

  const [isMouseIn, setisMouseIn] = useState(false) //this needs to come before useEffect
  useEffect(() => {
    if (timer.length !== 0) {
      pauseTimers()
    }
    //start initial timer
    //TODO: create state that gives user the option if they want to have it automatically play the next one
    startAndStopTimer(videos[currentVideoIndex].videoDuration, progressForward)
    console.log("mouse", isMouseIn)
  }, [currentVideoIndex, isMouseIn])

  //quick move to next video by one
  function progressForward() {
    setNewVideoIndex(1)
  }
  console.log(myValue)
  //these functions handle pauseing and starting the timer again
  const handlePauseTimer = () => {
    pauseTimers()
  }
  const handleResumeTimer = () => {
    startAndStopTimer(videos[currentVideoIndex].videoDuration, progressForward)
  }

  return (
    <SlideShow
      onMouseEnter={() => {
        setisMouseIn(true)
        handlePauseTimer()
      }}
      onMouseLeave={() => {
        setisMouseIn(false)
        handleResumeTimer()
      }}
    >
      <SlideShowVideo>
        {videos.map((video, index) => {
          const coverImg = covers.filter(cover => cover.name == video.name)
          return (
            <Video
              key={video.id}
              style={{
                transform:
                  index === currentVideoIndex
                    ? `translateX(0px)`
                    : index >= currentVideoIndex
                    ? `translateX(100%)`
                    : index <= currentVideoIndex
                    ? `translateX(-100%)`
                    : `none`,
              }}
            >
              <VideoPlayer
                activeVideo={index === currentVideoIndex}
                videoURL={video.publicURL}
              />
            </Video>
          )
        })}
      </SlideShowVideo>
      <VideoControls controlColor={colors[myValue.currentColor]}>
        <span className="prev" onClick={() => setNewVideoIndex(-1)}>
          &larr;
        </span>
        <span className="next" onClick={() => setNewVideoIndex(1)}>
          &rarr;
        </span>
      </VideoControls>
    </SlideShow>
  )
}

const SlideShow = styled.div`
  &:hover {
    .prev,
    .next {
      visibility: visible;
    }
  }
  width: 100%;
  height: 100vh;
  position: relative;
  background: white;
  overflow: hidden;
`
const Video = styled.li`
  overflow: hidden;
  transition: all 0.6s;
  box-shadow: none !important;
  background: #000;
`
const SlideBg = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
  object-position: center center;
  z-index: 0;
  box-shadow: none !important;
  background-color: black;
  filter: blur(15px);
`

const SlideShowVideo = styled.ul`
  padding: 0;
  margin: 0;
  display: grid;
  grid-template: 1fr / 1fr;
  width: 100%;
  height: 100%;

  > li {
    height: 100%;
    grid-row: 1/-1;
    grid-column: 1/-1;
    display: grid;
    grid-template-rows: 1fr;

    padding: 20px;
    .video-wrapper {
      background: #000;
      z-index: 5;
      box-shadow: 0 3px 20px rgba(0, 0, 0, 0.2);
      width: 100%;
      background: rgba(255, 255, 255, 0.6);
      max-height: 100%;
      text-align: center;
    }
    video {
      z-index: 3;
      /* width: auto; */
      margin: 0 auto;
      max-height: 100%;
    }
  }
`
const VideoControls = styled.div`
  position: absolute;
  top: 50%;
  left: 10%;
  width: 80%;
  display: flex;
  justify-content: space-between;
  span {
    transition: background 0.5s;
    visibility: hidden;
    background: ${props => props.controlColor};
    padding: 20px;
    font-size: 20px;
    color: white;
  }
`

const VideoPlayer = ({ videoURL, activeVideo }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    //this plays the video if it is the current video being displayed
    if (activeVideo) {
      videoRef.current.play()
      //getDuration(videoRef.current.currentTime)
    } else {
      videoRef.current.pause()
    }
  }, [activeVideo])

  return (
    <div className="video-wrapper">
      <video src={videoURL} data-active={activeVideo} loop ref={videoRef} />
    </div>
  )
}
