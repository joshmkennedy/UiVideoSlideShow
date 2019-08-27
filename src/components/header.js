import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => {
  console.log(black)

  return (
    <header>
      <div
        style={{
          margin: `0 auto`,
          padding: `1.45rem 1.0875rem`,
        }}
      ></div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
