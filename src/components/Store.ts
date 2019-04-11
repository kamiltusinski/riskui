import worker from '../worker/worker';
import WebWorker from '../worker/workerSetup';

import { toast } from 'react-toastify';

export class Store {
  private testStartTime: any;
  private worker: any = null;

  columnDefs: any = [];
  gridOptions: any;
  globalRowData: any[] = [];

  init() {
    this.getColumnDefs();
    this.getGridOptions();

    this.worker = new WebWorker(worker);
    this.worker.addEventListener('message', (e: any) => {
      switch (e.data.type) {
        case 'start':
          this.testStartTime = new Date().getTime();
          this.logTestStart(e.data.messageCount, e.data.updateCount, e.data.interval);
          break;
        case 'end':
          this.logStressResults(e.data.messageCount, e.data.updateCount);
          break;
        case 'setRowData':
          this.gridOptions.api.setRowData(JSON.parse(e.data.records));
          break;
        case 'updateData':
          this.gridOptions.api.setRowData(JSON.parse(e.data.records));
          break;
        default:
          console.log('unrecognised event type ' + e.type);
      }
    });
  }

  onStartStress() {
    this.worker.postMessage('startStress');
  }

  onStartLoad() {
    this.worker.postMessage('startLoad');
  }

  onStopMessages() {
    this.worker.postMessage('stop');
    this.showMessage('Test stopped');
    console.log('Test stopped');
  }

  onShowToolPanel() {
    this.gridOptions.api.showToolPanel(true);
  }

  onHideToolPanel() {
    this.gridOptions.api.showToolPanel(false);
  }

  onColumnsGroup() {
    this.gridOptions.columnApi.setPivotMode(false);
    this.gridOptions.columnApi.setColumnState([{ "colId": "product", "hide": true, "width": 120, "rowGroupIndex": 0 }, { "colId": "portfolio", "hide": true, "width": 120, "rowGroupIndex": 1 }, { "colId": "book", "hide": true, "width": 120, "rowGroupIndex": 2 }, { "colId": "trade", "width": 100 }, { "colId": "dealType", "width": 120 }, { "colId": "bidFlag", "width": 100 }, { "colId": "current", "aggFunc": "sum", "width": 150 }, { "colId": "previous", "aggFunc": "sum", "width": 150 }, { "colId": "pl1", "aggFunc": "sum", "width": 150 }, { "colId": "pl2", "aggFunc": "sum", "width": 150 }, { "colId": "gainDx", "aggFunc": "sum", "width": 150 }, { "colId": "sxPx", "aggFunc": "sum", "width": 150 }, { "colId": "_99Out", "aggFunc": "sum", "width": 150 }, { "colId": "submitterID", "aggFunc": "sum", "width": 150 }, { "colId": "submitterDealID", "aggFunc": "sum", "width": 150 }]);
  }

  onColumnsPivot() {
    this.gridOptions.columnApi.setPivotMode(true);
    this.gridOptions.columnApi.setColumnState([{ "colId": "product", "hide": true, "width": 120, "rowGroupIndex": 0 }, { "colId": "portfolio", "width": 120, "pivotIndex": 0 }, { "colId": "book", "hide": true, "width": 120, "rowGroupIndex": 1 }, { "colId": "trade", "width": 100 }, { "colId": "dealType", "width": 120 }, { "colId": "bidFlag", "width": 100 }, { "colId": "current", "aggFunc": "sum", "width": 150 }, { "colId": "previous", "aggFunc": "sum", "width": 150 }, { "colId": "pl1", "width": 150 }, { "colId": "pl2", "width": 150 }, { "colId": "gainDx", "width": 150 }, { "colId": "sxPx", "width": 150 }, { "colId": "_99Out", "width": 150 }, { "colId": "submitterID", "width": 150 }, { "colId": "submitterDealID", "width": 150 }]);
  }

  onColumnsFlat() {
    this.gridOptions.columnApi.setPivotMode(false);
    this.gridOptions.columnApi.setColumnState([{ "colId": "product", "width": 120 }, { "colId": "portfolio", "width": 120 }, { "colId": "book", "width": 120 }, { "colId": "trade", "width": 100 }, { "colId": "dealType", "width": 120 }, { "colId": "bidFlag", "width": 100 }, { "colId": "current", "width": 150 }, { "colId": "previous", "width": 150 }, { "colId": "pl1", "width": 150 }, { "colId": "pl2", "width": 150 }, { "colId": "gainDx", "width": 150 }, { "colId": "sxPx", "width": 150 }, { "colId": "_99Out", "width": 150 }, { "colId": "submitterID", "width": 150 }, { "colId": "submitterDealID", "width": 150 }]);
  }

  onQueryRun(date: any) {
    const parsedDateTime = date;
    this.worker.postMessage(JSON.stringify({ data: 'getHistoricData', time: parsedDateTime }));
  }

  private getColumnDefs() {
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

  private getGridOptions() {
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
          valueFormatter: (params: any) => Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
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
      getRowNodeId: (data: any) => data.trade,
      defaultColDef: {
        width: 80
      },
    };
  }

  private logTestStart(messageCount: any, updateCount: any, interval: any) {
    const message = messageCount ?
      'Sending ' + messageCount + ' messages at once with ' + updateCount + ' record updates each.' :
      'Sending 1 message with ' + updateCount + ' updates every ' + interval + ' milliseconds, that\'s ' + (1000 / interval * updateCount).toLocaleString() + ' updates per second.';

    console.log(message);
    this.showMessage(message);
  }

  private logStressResults(messageCount: any, updateCount: any) {
    const testEndTime = new Date().getTime();
    const duration = testEndTime - this.testStartTime;
    const totalUpdates = messageCount * updateCount;

    const updatesPerSecond = Math.floor((totalUpdates / duration) * 1000);

    this.showMessage('Processed ' + totalUpdates.toLocaleString() + ' updates in ' + duration.toLocaleString() + 'ms, that\'s ' + updatesPerSecond.toLocaleString() + ' updates per second.')

    console.log('####################');
    console.log('# -- Stress test results --');
    console.log('# The grid was pumped with ' + messageCount.toLocaleString() + ' messages. Each message had ' + updateCount.toLocaleString() + ' record updates which gives a total number of updates of ' + totalUpdates.toLocaleString() + '.');
    console.log('# Time taken to execute the test was ' + duration.toLocaleString() + ' milliseconds which gives ' + updatesPerSecond.toLocaleString() + ' updates per second.');
    console.log('####################');
  }

  private showMessage(message: string) {
    toast.info(message);
  }

  // build up the test data

  // private BOOK_COUNT = 15;
  // private TRADE_COUNT = 5;

  // // add / remove products to change the data set
  // private PRODUCTS = ['Palm Oil', 'Rubber', 'Wool', 'Amber', 'Copper', 'Lead', 'Zinc', 'Tin', 'Aluminium',
  //   'Aluminium Alloy', 'Nickel', 'Cobalt', 'Molybdenum', 'Recycled Steel', 'Corn', 'Oats', 'Rough Rice',
  //   'Soybeans', 'Rapeseed', 'Soybean Meal', 'Soybean Oil', 'Wheat', 'Milk', 'Coca', 'Coffee C',
  //   'Cotton No.2', 'Sugar No.11', 'Sugar No.14'];

  // // add / remove portfolios to change the data set
  // private PORTFOLIOS = ['Aggressive', 'Defensive', 'Income', 'Speculative', 'Hybrid'];

  // // these are the list of columns that updates go to
  // private VALUE_FIELDS = ['current', 'previous', 'pl1', 'pl2', 'gainDx', 'sxPx', '_99Out'];

  // private nextBookId = 62472;
  // private nextTradeId = 24287;
  // private nextBatchId = 101;

  // private createRowData() {
  //   this.globalRowData = [];
  //   const thisBatch = this.nextBatchId++;
  //   for (let i = 0; i < this.PRODUCTS.length; i++) {
  //     const product = this.PRODUCTS[i];
  //     for (let j = 0; j < this.PORTFOLIOS.length; j++) {
  //       const portfolio = this.PORTFOLIOS[j];

  //       for (let k = 0; k < this.BOOK_COUNT; k++) {
  //         const book = this.createBookName();
  //         for (let l = 0; l < this.TRADE_COUNT; l++) {
  //           const trade = this.createTradeRecord(product, portfolio, book, thisBatch);
  //           this.globalRowData.push(trade);
  //         }
  //       }
  //     }
  //   }
  //   console.log('Total number of records sent to grid = ' + this.globalRowData.length);
  // }

  // private batchUpdateRowData() {
  //   console.log('batch');
  // }

  // private randomBetween(min: any, max: any) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

  // private createTradeRecord(product: any, portfolio: any, book: any, batch: any) {
  //   const current = Math.floor(Math.random() * 100000) + 100;
  //   const previous = current + Math.floor(Math.random() * 10000) - 2000;
  //   const trade = {
  //     product,
  //     portfolio,
  //     book,
  //     current,
  //     previous,
  //     batch,
  //     trade: this.createTradeId(),
  //     submitterID: this.randomBetween(10, 1000),
  //     submitterDealID: this.randomBetween(10, 1000),
  //     dealType: (Math.random() < .2) ? 'Physical' : 'Financial',
  //     bidFlag: (Math.random() < .5) ? 'Buy' : 'Sell',
  //     pl1: this.randomBetween(100, 1000),
  //     pl2: this.randomBetween(100, 1000),
  //     gainDx: this.randomBetween(100, 1000),
  //     sxPx: this.randomBetween(100, 1000),
  //     _99Out: this.randomBetween(100, 1000),
  //   };
  //   return trade;
  // }

  // private createBookName() {
  //   this.nextBookId++;
  //   return 'GL-' + this.nextBookId;
  // }

  // private createTradeId() {
  //   this.nextTradeId++;
  //   return this.nextTradeId;
  // }
}

export default new Store();
