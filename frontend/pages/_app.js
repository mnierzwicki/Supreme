import App, { Container } from "next/app";
import { ApolloProvider } from "react-apollo";
import { Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import Page from "../components/Page";
import withData from "../lib/withData";

class StoreApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // this exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }

  options = {
    timeout: 5000,
    position: "top center",
    transition: "scale"
  };

  render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Provider template={AlertTemplate} {...this.options}>
            <Page>
              <Component {...pageProps} />
            </Page>
          </Provider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withData(StoreApp);
