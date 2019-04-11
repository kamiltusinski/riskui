import * as React from 'react';

import AppNav from '../components/AppNav';
import { Container } from 'semantic-ui-react';

import DevTools from 'mobx-react-devtools';

import './Shell.css';

class Shell extends React.Component<any> {
  render() {
    return (
      <>
        <AppNav />
        <Container fluid className="view-container">
          {this.props.children}
        </Container>

        {false && <DevTools />}
      </>
    );
  }
}

export default Shell;