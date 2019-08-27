/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState, useContext } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql, Link } from "gatsby"

import styled from "styled-components"
import "./layout.css"
import { black, colors } from "./styles"
import { set } from "timm"

const ThemeHelloContext = React.createContext("hello")
export { ThemeHelloContext }

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const [currentColor, setCurrentColor] = useState(1)

  return (
    <ThemeHelloContext.Provider value={{ currentColor, setCurrentColor }}>
      <ThemeHelloContext.Consumer>
        {value => (
          <TheLayout currentColor={colors[value.currentColor]}>
            <div>
              <h1 style={{ margin: 0 }}>
                <Link
                  to="/"
                  style={{
                    fontSize: "20px",
                    textDecoration: `none`,
                    color: `white`,
                  }}
                >
                  {data.site.siteMetadata.title}
                </Link>
              </h1>
            </div>
            <PageWrapper>
              <main>{children}</main>
            </PageWrapper>
          </TheLayout>
        )}
      </ThemeHelloContext.Consumer>
    </ThemeHelloContext.Provider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
const TheLayout = styled.div`
  transition: background 0.5s;
  background: ${props => props.currentColor};
  display: grid;
  grid-template: 100% / 100px 1fr;
  h1 {
    position: absolute;
    transform: rotate(-90deg) translate(calc(201px + -100vh), 44%);
    left: 0;
    top: 0;
    transform-origin: left top;
  }
`

const PageWrapper = styled.div`
  width: 100%;
`
