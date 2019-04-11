//const BigTableApi = require('./BigTableSource');

export default () => {
    // update these to change the stress test parameters
    var STRESS_TEST_MESSAGE_COUNT = 1000;
    var STRESS_TEST_UPDATES_PER_MESSAGE = 100;

    // update these to change the
    var LOAD_TEST_UPDATES_PER_MESSAGE = 100;
    var LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES = 1000;

    // update these to change the size of the data initially loaded into the grid for updating
    var BOOK_COUNT = 15;
    var TRADE_COUNT = 5;

    // add / remove products to change the data set
    var PRODUCTS = ['Palm Oil','Rubber','Wool','Amber','Copper','Lead','Zinc','Tin','Aluminium',
        'Aluminium Alloy','Nickel','Cobalt','Molybdenum','Recycled Steel','Corn','Oats','Rough Rice',
        'Soybeans','Rapeseed','Soybean Meal','Soybean Oil','Wheat','Milk','Coca','Coffee C',
        'Cotton No.2','Sugar No.11','Sugar No.14'];

    // add / remove portfolios to change the data set
    var PORTFOLIOS = ['Aggressive','Defensive','Income','Speculative','Hybrid'];

    // these are the list of columns that updates go to
    var VALUE_FIELDS = ['current','previous','pl1','pl2','gainDx','sxPx','_99Out'];

    // a list of the data, that we modify as we go. if you are using an immutable
    // data store (such as Redux) then this would be similar to your store of data.
    var globalRowData;

    // start the book id's and trade id's at some future random number,
    // looks more realistic than starting them at 0
    var nextBookId = 62472;
    var nextTradeId = 24287;
    var nextBatchId = 101;

    function getDataWithThrottle(thisTestNumber) {
        var messageCount = null;

        postMessage({
            type: 'start',
            messageCount: messageCount,
            updateCount: LOAD_TEST_UPDATES_PER_MESSAGE,
            interval: LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES
        });

        var intervalId;

        function intervalFunc() {
            
            getData();
            if (thisTestNumber!==latestTestNumber) {
                clearInterval(intervalId);
            }
        }

        intervalId = setInterval(intervalFunc, LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES);
    }

    function getInitialData() {
        //var bigTableApi = new BigTableApi();
        //globalRowData = bigTableApi.getData();
        let url = 'https://facade.repbus.polaris.dev/risk/get_family';
        let init = {
            method: 'GET',
            mode: 'cors',
            cache: 'default'
        };

        fetch(url, init).then(function(response) {
            fetchInitialSuccess(response, url);
        }).catch(function(error) {
            fetchCatch(error, url);
        });

        //console.log('Total number of records sent to grid = ' + globalRowData.length);
    }

    function getHistoricData(date) {
        var time = date;
        if (date && typeof date !== Date) {
            time = Date.parse(date);
        }
        if(!date) {
            time = Date.now();
        }
        
        //var bigTableApi = new BigTableApi();
        //globalRowData = bigTableApi.getData();
        let url = 'https://facade.repbus.polaris.dev/risk/get_family?date=' + Math.floor(time/1000);
        let init = {
            method: 'GET',
            mode: 'cors',
            cache: 'default'
        };

        fetch(url, init).then(function(response) {
            fetchInitialSuccess(response, url);
        }).catch(function(error) {
            fetchCatch(error, url);
        });

        //console.log('Total number of records sent to grid = ' + globalRowData.length);
    }

    function getData() {
        //var bigTableApi = new BigTableApi();
        //globalRowData = bigTableApi.getData();
        let url = 'https://facade.repbus.polaris.dev/risk/get_family';
        let init = {
            method: 'GET',
            mode: 'cors',
            cache: 'default'
        };

        fetch(url, init).then(function(response) {
            fetchSuccess(response, url);
        }).catch(function(error) {
            fetchCatch(error, url);
        });

        //console.log('Total number of records sent to grid = ' + globalRowData.length);
    }

    function fetchSuccess(response, url) {
        const reader = response.body.getReader();
        if (response.ok) {
            let result = '';
            reader.read().then(function processText({ done, value }) {
                // Result objects contain two properties:
                // done  - true if the stream has already given you all its data.
                // value - some data. Always undefined when done is true.
                
                if (done) {
                    console.log("Stream complete");
                    postMessage({
                        type: 'updateData',
                        records: result
                    });
                    return;
                }
            
                const chunk = new TextDecoder("utf-8").decode(value);
                result += chunk;
            
                // Read some more, and call this function again
                return reader.read().then(processText);
            });            
          console.log('SUCCESS: ', url, response);
          
        } else {
          console.log('FAIL:', url, response);
        }
      }
      
    function fetchCatch(error, url) {
        console.log('ERROR: ', url, error);
    }
      
    function fetchInitialSuccess(response, url) {
        const reader = response.body.getReader();
        if (response.ok) {
            let result = '';
            reader.read().then(function processText({ done, value }) {
                // Result objects contain two properties:
                // done  - true if the stream has already given you all its data.
                // value - some data. Always undefined when done is true.
                
                if (done) {
                    console.log("Stream complete");
                    postMessage({
                        type: 'setRowData',
                        records: result
                    });
                    return;
                }
            
                const chunk = new TextDecoder("utf-8").decode(value);
                result += chunk;
            
                // Read some more, and call this function again
                return reader.read().then(processText);
            });            
          console.log('SUCCESS: ', url, response);
          
        } else {
          console.log('FAIL:', url, response);
        }
      }
     

    // build up the test data
    function createRowData() {
        globalRowData = [];
        var thisBatch = nextBatchId++;
        for (var i = 0; i<PRODUCTS.length; i++) {
            var product = PRODUCTS[i];
            for (var j = 0; j<PORTFOLIOS.length; j++) {
                var portfolio = PORTFOLIOS[j];

                for (var k = 0; k<BOOK_COUNT; k++) {
                    var book = createBookName();
                    for (var l = 0; l < TRADE_COUNT; l++) {
                        var trade = createTradeRecord(product, portfolio, book, thisBatch);
                        globalRowData.push(trade);
                    }
                }
            }
        }
        console.log('Total number of records sent to grid = ' + globalRowData.length);
    }


    // https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
    function randomBetween(min,max) {
        return Math.floor(Math.random()*(max - min + 1)) + min;
    }

    function createTradeRecord(product, portfolio, book, batch) {
        var current = Math.floor(Math.random()*100000) + 100;
        var previous = current + Math.floor(Math.random()*10000) - 2000;
        var trade = {
            product: product,
            portfolio: portfolio,
            book: book,
            trade: createTradeId(),
            submitterID: randomBetween(10,1000),
            submitterDealID: randomBetween(10,1000),
            dealType: (Math.random()<.2) ? 'Physical' : 'Financial',
            bidFlag: (Math.random()<.5) ? 'Buy' : 'Sell',
            current: current,
            previous: previous,
            pl1: randomBetween(100,1000),
            pl2: randomBetween(100,1000),
            gainDx: randomBetween(100,1000),
            sxPx: randomBetween(100,1000),
            _99Out: randomBetween(100,1000),
            batch: batch
        };
        return trade;
    }

    function createBookName() {
        nextBookId++;
        return 'GL-' + nextBookId
    }

    function createTradeId() {
        nextTradeId++;
        return nextTradeId
    }

    getInitialData();
    //createRowData();

    var latestTestNumber = 0;

    function updateSomeItems(updateCount) {
        var itemsToUpdate = [];
        for (var k = 0; k < updateCount; k++) {
            if (globalRowData.length === 0) { continue; }
            var indexToUpdate = Math.floor(Math.random()*globalRowData.length);
            var itemToUpdate = globalRowData[indexToUpdate];

            // make a copy of the item, and make some changes, so we are behaving
            // similar to how the
            var field = VALUE_FIELDS[Math.floor(Math.random() * VALUE_FIELDS.length)];
            itemToUpdate[field] = Math.floor(Math.random()*100000);

            itemsToUpdate.push(itemToUpdate);
        }
        return itemsToUpdate;
    }

    function sendMessagesWithThrottle(thisTestNumber) {
        var messageCount = null;

        postMessage({
            type: 'start',
            messageCount: messageCount,
            updateCount: LOAD_TEST_UPDATES_PER_MESSAGE,
            interval: LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES
        });

        var intervalId;

        function intervalFunc() {
            postMessage({
                type: 'updateData',
                records: updateSomeItems(LOAD_TEST_UPDATES_PER_MESSAGE)
            });
            if (thisTestNumber!==latestTestNumber) {
                clearInterval(intervalId);
            }
        }

        intervalId = setInterval(intervalFunc, LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES);
    }

    function sendMessagesNoThrottle() {
        postMessage({
            type: 'start',
            messageCount: STRESS_TEST_MESSAGE_COUNT,
            updateCount: STRESS_TEST_UPDATES_PER_MESSAGE,
            interval: null
        });

        // pump in 1000 messages without waiting
        for (var i = 0; i<=STRESS_TEST_MESSAGE_COUNT; i++) {
            postMessage({
                type: 'updateData',
                records: updateSomeItems(STRESS_TEST_UPDATES_PER_MESSAGE)
            });
        }

        postMessage({
            type: 'end',
            messageCount: STRESS_TEST_MESSAGE_COUNT,
            updateCount: STRESS_TEST_UPDATES_PER_MESSAGE
        });
    }

    // eslint-disable-next-line no-restricted-globals
    self.addEventListener('message', (e) => {
        // any previous tests will see that this test number
        // has increased and will then stop their tests
        latestTestNumber++;
        switch (e.data) {
            case 'startStress':
                console.log('starting stress test');
                //sendMessagesNoThrottle();
                getData();
                break;
            case 'startLoad':
                console.log('starting load test');
                getDataWithThrottle(latestTestNumber);
                //sendMessagesWithThrottle(latestTestNumber);
                //getData();
                break;
            case 'stopTest':
                console.log('stopping test');
                // sendMessagesNoThrottle();
                break;
            default:
                const obj = JSON.parse(e.data);
                switch (obj.data) {
                    case 'getHistoricData':
                        console.log('Detting Historic Data for [' + obj.time + ']');
                        getHistoricData(obj.time);
                        //sendMessagesWithThrottle(latestTestNumber);
                        //getData();
                        break;
                    default:
                        console.log('unknown message type ' + e.data);
                        break;
                }
        }
    })

}
