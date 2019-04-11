import * as React from 'react';

import { AgGridReact } from 'ag-grid-react';

import { inject, observer } from 'mobx-react';
import { Store } from './Store';

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

@inject('store')
@observer
class RiskGrid extends React.Component<{ store?: Store }> {
  componentWillMount() {
    this.props.store.init();
    this.props.store.onStartLoad();
  }

  onGridReady = (params: any) => {
    this.props.store.gridOptions.api = params.api;
    this.props.store.gridOptions.columnApi = params.columnApi;

    setTimeout(
      () => {
        params.api.sizeColumnsToFit();
      },
      100);
  }

  render() {
    const { store } = this.props;

    return (
      <div className="full-height-container take-available-space ag-theme-balham">
        <AgGridReact
          columnDefs={store.columnDefs}
          rowData={store.globalRowData}
          onGridReady={this.onGridReady}          
        />
      </div>
    )
  }
}

export default RiskGrid;
