import React, { useState, useEffect } from "react"
import { graphql, useStaticQuery } from "gatsby"
import styled from "styled-components"

/**
 * TODO - style video
 * TODO - create transitions
 * TODO - move to a seperate gatsby project
 *
 */

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
    }
  `)
  const videos = data.videosList.nodes //all videos

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
    if (timer !== undefined) {
      pauseTimers()
    }
    //start initial timer
    //TODO: create state that gives user the option if they want to have it automatically play the next one
    startAndStopTimer(videos[currentVideoIndex].videoDuration, progressForward)
  }, [currentVideoIndex, isMouseIn])

  //quick move to next video by one
  function progressForward() {
    setNewVideoIndex(1)
  }
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
        {videos.map((video, index) => (
          <Video key={video.id} activeSlide={{ index, currentVideoIndex }}>
            <div className="video-wrapper">
              {currentVideoIndex === index && (
                <video controls loop autoPlay>
                  <source src={video.publicURL} />
                </video>
              )}
            </div>
          </Video>
        ))}
      </SlideShowVideo>
      <VideoControls>
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
  height: 400px;
  position: relative;
  background: #000;
  overflow: hidden;
`
const Video = styled.li`
  transition: all 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  transform: ${props =>
    props.activeSlide.index === props.activeSlide.currentVideoIndex
      ? `translateX(0px)`
      : props.activeSlide.index >= props.activeSlide.currentVideoIndex
      ? `translateX(100%)`
      : props.activeSlide.index <= props.activeSlide.currentVideoIndex
      ? `translateX(-100%)`
      : `none`};
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
    .video-wrapper {
      /* background: #000; */
      width: 100%;
      max-height: 100%;
      text-align: center;
    }
    video {
      /* width: auto; */
      margin: 0 auto;
      max-height: 100%;
    }
  }
`
const VideoControls = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  span {
    visibility: hidden;
    background: rebeccapurple;
    padding: 20px;
    font-size: 20px;
    color: white;
  }
`
