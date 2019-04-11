import React, { Component } from 'react';

import { ToastContainer } from 'react-toastify';

import { Provider } from 'mobx-react';

import Shell from './shell/Shell';
import RiskGrid from './components/RiskGrid';
import Store from './components/Store';

const stores = {
  store: Store
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

        <ToastContainer autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
      </>
    );
  }
}

export default App;
