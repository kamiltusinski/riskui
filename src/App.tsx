import React, { Component } from 'react';

import { Provider } from 'mobx-react';

import Shell from './shell/Shell';
import RiskGrid from './components/RiskGrid';
import RiskGridStore from './components/RiskGridStore';

const stores = {
  riskGridStore: RiskGridStore
};

class App extends Component {
  render() {
    return (
      <>
        <Provider {...stores}>
          <Shell>
            <RiskGrid />
          </Shell>
        </Provider>
      </>
    );
  }
}

export default App;
