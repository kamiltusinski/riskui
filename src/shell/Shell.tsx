import * as React from 'react';

import TopBar from '../components/TopBar';
import { Container } from 'semantic-ui-react';

import DevTools from 'mobx-react-devtools';

class Shell extends React.Component<any> {
  render() {
    return (
      <>
        <TopBar />
        <Container fluid className="view-container">
          {this.props.children}
        </Container>

        {false && <DevTools />}
      </>
    );
  }
}

export default Shell;