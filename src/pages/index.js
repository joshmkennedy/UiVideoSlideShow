import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import UiVideoSlideShow from "../components/UiVideoSlideShow"
import TestSlider from "../components/TestSlider"

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="" />
      <UiVideoSlideShow />
    </Layout>
  )
}
export default IndexPage
