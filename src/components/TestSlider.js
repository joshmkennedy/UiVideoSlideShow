import React, { useState } from "react"
import { animated, useTransition } from "react-spring"

const TestSlider = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const slides = [1, 2, 3, 4, 5]
  function next() {
    const position = activeSlideIndex + 1
    if (position > slides.length - 1) {
      return setActiveSlideIndex(0)
    }
    setActiveSlideIndex(position)
  }
  const transitions = useTransition(activeSlideIndex, null, {
    from: { transform: "translate3d(0,-40px,0)", opacity: 0 },
    enter: { transform: "translate3d(0,0px,0)", opacity: 1 },
    leave: { transform: "translate3d(0,40px,0)", opacity: 0 },
  })
  return (
    <div>
      <div
        style={{
          width: `100%`,
          height: `300px`,
          background: `grey`,
          color: `tomato`,
          textAlign: `center`,
          fontSize: `3rem`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
        }}
      >
        <div style={{ width: `100px`, height: `100px` }}>
          {transitions.map(({ item, props, key }, index) => (
            <animated.div
              key={item}
              style={{ ...props, background: `green`, position: `absolute` }}
            >
              {slides[item]}
            </animated.div>
          ))}
        </div>
      </div>
      <div className="controls">
        <div className="next" onClick={() => next()}>
          next slide
        </div>
      </div>
    </div>
  )
}

export default TestSlider
