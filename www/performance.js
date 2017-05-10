var database = null;
var items = [];

function initDatabase() {
    database = window.sqlitePlugin.openDatabase({name: 'helloworld2.db', location: 0});

    database.transaction(function (transaction) {
        transaction.executeSql('CREATE TABLE account (Id text)');
    });

    for (var i = 0; i < 10000; i++) {
        items.push('INSERT INTO account (Id) VALUES ("' + guidGenerator() + '")');
    }

}

function showCount() {
    database.transaction(function (transaction) {
        transaction.executeSql('SELECT count(*) AS recordCount FROM account', [], function (ignored, resultSet) {
            display('RECORD COUNT: ' + resultSet.rows.item(0).recordCount, true);
        });
    }, function (error) {
        alert('SELECT count error: ' + error.message);
    });

}

function clearDisplay() {
    document.getElementById("message").innerHTML = '';
}

function display(message, enter) {
    var container = document.getElementById("message"),
        lineBreak = document.createElement("br"),
        label = document.createTextNode(message);

    if (enter) {
        container.appendChild(lineBreak);
    }

    container.appendChild(label);
}

function deleteRecords() {
    database.transaction(function (transaction) {
        transaction.executeSql('DELETE FROM account', [], function (ignored, resultSet) {
            display('delete done', true);
        });
    }, function (error) {
        alert('Delete error: ' + error.message);
    });

}

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function runWebWorker() {
    var w = new Worker('webworker/sample-worker.js');
    AQ.aqworker('w1', w);
    w.addEventListener('message', function (ev) {
        console.log(ev);
        display(ev.data, true);
    });
    var transfer = {
        'status': 'go',
        'items': items
    };
    w.postMessage(transfer);

}

document.addEventListener('deviceready', function () {
    $('#show-count').click(showCount);
    $('#delete-records').click(deleteRecords);
    $('#clear-display').click(clearDisplay);
    $('#webworker').click(runWebWorker);

    initDatabase();
});
