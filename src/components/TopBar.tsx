import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { Menu, } from 'semantic-ui-react';

import { DateTimeInput } from 'semantic-ui-calendar-react';

import { Store } from './Store';

@inject('store')
@observer
class TopBar extends React.Component<{ store?: Store }, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      dateTime: ''
    };
  }

  handleChange = (event: any, { name, value }: any) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value }, () => this.props.store.onQueryRun(value));
    }
  }

  render() {
    const { store } = this.props;

    return (<Menu fixed="top" inverted fluid>
      <Menu.Item header>Risk UI</Menu.Item>
      <Menu.Item onClick={() => store.onStartStress()} content="Stress" />
      <Menu.Item onClick={() => store.onStartLoad()} content="Load" />
      <Menu.Item onClick={() => store.onStopMessages()} content="Stop" />
      <Menu.Item header>Columns:</Menu.Item>
      <Menu.Item onClick={() => store.onColumnsFlat()} content="Flat" />
      <Menu.Item onClick={() => store.onColumnsGroup()} content="Group" />
      <Menu.Item onClick={() => store.onColumnsPivot()} content="Pivot" />
      <Menu.Item header> Panel:</Menu.Item>
      <Menu.Item onClick={() => store.onShowToolPanel()} content="Show" />
      <Menu.Item onClick={() => store.onHideToolPanel()} content="Hide" />
      <Menu.Item>
        <DateTimeInput name="dateTime"
          placeholder="Historic Date"
          value={this.state.dateTime}
          iconPosition="left"
          onChange={this.handleChange} />
      </Menu.Item>
    </Menu>);
  }
}

export default TopBar;
