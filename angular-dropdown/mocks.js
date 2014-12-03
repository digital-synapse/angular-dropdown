angular.module('app')

.factory('mockFormResourceFactory', function () {
    return {
        get: function (callback) {
            callback({
                firstAnimalId: 1,
                secondAnimalId: 3,
                checked: false
            });
        },
        save: function (item) {
            alert(JSON.stringify(item, null, '    '));
        }
    };
})
.factory('mockListResourceFactory', function () {
    return {
        get: function (callback) {
            callback([
                { id: 1, name: 'Red Fox' },
                { id: 2, name: 'Yellow Bird' },
                { id: 3, name: 'Brown Dog' }
            ]);
        }
    };
})