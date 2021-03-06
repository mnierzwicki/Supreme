import React from "react";
import styled, { ThemeProvider, injectGlobal } from "styled-components";

import Header from "../components/Header";
import Meta from "../components/Meta";
import Footer from "../components/Footer";

const theme = {
  maroon: "#8B1F41",
  orange: "#E87722",
  black: "#393939",
  grey: "#3A3A3A",
  lightgrey: "#E1E1E1",
  lightGrey: "#E1E1E1",
  offWhite: "#EDEDED",
  white: "#FFFFFF",
  maxWidth: "1000px",
  mediaMaxWidth: "1200px",
  bs: "0 12px 24px 0 rgba(0, 0, 0, 0.09)"
};

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};

  /*
  Extend our page if we don't have enough content
  to fill it, so that our footer doesn't float up
  */
  position: relative;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  /* Leave room for footer at the bottom of the page */
  padding-bottom: 2.5rem;
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

injectGlobal`
  @font-face {
    font-family: 'radnika_next';
    src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: 'radnika_next';
  }
  a {
    text-decoration: none;
    color: ${theme.black};
  }
`;

class Page extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Meta />
          <ContentWrapper>
            <Header />
            <Inner>{this.props.children}</Inner>
          </ContentWrapper>
          <Footer />
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export default Page;
