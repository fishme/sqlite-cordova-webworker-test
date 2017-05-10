importScripts('SQLitePlugin.js');

self.addEventListener('message', function (ev) {
    if (ev.data.status === 'go') {
        sqlitePlugin.openDatabase({name: 'helloworld2.db', location: 0}, function (db) {
            db.sqlBatch(ev.data.items, function (res) {
                self.postMessage('Webworker done!');
            }, function (error) {
                console.log('SQL batch ERROR: ' + error.message);
            });
        });
    }
});
