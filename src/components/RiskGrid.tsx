import * as React from 'react';

import { AgGridReact } from 'ag-grid-react';

import { inject, observer } from 'mobx-react';
import { RiskGridStore } from './RiskGridStore';

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

@inject('riskGridStore')
@observer
class RiskGrid extends React.Component<{ riskGridStore?: RiskGridStore }, any> {
  gridApi: any = null;
  gridColumnApi: any = null;
  gridOptions: any = null;
  columnDefs: any = [];
  globalRowData = [];

  constructor(props: any) {
    super(props);

    this.getColumnDefs();
    this.getGridOptions();
  }

  getColumnDefs = () => {
    this.columnDefs = [
      // these are the row groups, so they are all hidden (they are showd in the group column)
      {
        headerName: 'Hierarchy', children: [
          { headerName: 'Market', field: 'marketEnvId', type: 'dimension', /*rowGroupIndex: 0,*/ hide: false },
          { headerName: 'Product', field: 'product', type: 'dimension', /*rowGroupIndex: 0,*/ hide: false },
          { headerName: 'Bank', field: 'Book1', type: 'dimension', /*rowGroupIndex: 1,*/ hide: false },
          { headerName: 'Desk', field: 'Book2', type: 'dimension', /*rowGroupIndex: 2,*/ hide: false },
          { headerName: 'Portfolio', field: 'Book3', type: 'dimension', /*rowGroupIndex: 2,*/ hide: false },
          { headerName: 'Book', field: 'Book4', type: 'dimension', /*rowGroupIndex: 2,*/ hide: false },
          { headerName: 'Risk', field: 'riskType', type: 'dimension', /*rowGroupIndex: 2,*/ hide: false },
          { headerName: 'underlying', field: 'underlying', type: 'measure', hide: false },
        ]
      },

      // some string values, that do not get aggregated
      {
        headerName: 'Attributes', children: [
          { headerName: 'Product', field: 'product', width: 100 },
          // {headerName: 'Trade', field: 'trade', width: 100},
          // {headerName: 'Deal Type', field: 'dealType', type: 'dimension'},
          // {headerName: 'Bid', field: 'bidFlag', type: 'dimension', width: 100}
        ]
      },

      // all the other columns (visible and not grouped)
      {
        headerName: 'Values', children: [
          { headerName: 'RiskAggregate', field: 'RiskAggregate', type: 'measure' },
          { headerName: 'delta', field: 'delta', type: 'measure' },
          // {headerName: 'Current', field: 'current', type: 'measure'},
          // {headerName: 'Previous', field: 'previous', type: 'measure'},
          // {headerName: 'PL 1', field: 'pl1', type: 'measure'},
          // {headerName: 'PL 2', field: 'pl2', type: 'measure'},
          // {headerName: 'Gain-DX', field: 'gainDx', type: 'measure'},
          // {headerName: 'SX / PX', field: 'sxPx', type: 'measure'},
          // {headerName: '99 Out', field: '_99Out', type: 'measure'},
          // {headerName: 'Submitter ID', field: 'submitterID', type: 'measure'},
          // {headerName: 'Submitted Deal ID', field: 'submitterDealID', type: 'measure'}
        ]
      }
    ];
  }

  getNumberCellFormatter = (params: any) => {
    return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  getGridOptions = () => {
    this.gridOptions = {
      columnTypes: {
        dimension: {
          enableRowGroup: true,
          enablePivot: true,
        },
        measure: {
          width: 150,
          aggFunc: 'sum',
          enableValue: true,
          cellClass: 'number',
          valueFormatter: this.getNumberCellFormatter,
          cellRenderer: 'agAnimateShowChangeCellRenderer'
        }
      },
      columnDefs: this.columnDefs,
      enableStatusBar: true,
      animateRows: true,
      enableCellChangeFlash: true,
      enableColResize: true,
      enableRangeSelection: true,
      enableSorting: true,
      rowGroupPanelShow: 'always',
      pivotPanelShow: 'always',
      suppressAggFuncInHeader: true,
      defaultColDef: {
        width: 80
      },
    };
  }

  onGridReady = (params: any) => {
    this.gridOptions.api = params.api;
    this.gridOptions.columnApi = params.columnApi;

    setTimeout(
      () => {
        params.api.sizeColumnsToFit();
      },
      100);
  }

  getRowNodeId = (data: any) => {
    return data.trade;
  }

  render() {
    return (
      <>
        <div
          className="full-height-container take-available-space ag-theme-balham"
          style={{ height: '100%' }}
        >
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={this.globalRowData}
            onGridReady={this.onGridReady}
            getRowNodeId={this.getRowNodeId}
          />
        </div>
      </>
    )
  }
}

export default RiskGrid;
