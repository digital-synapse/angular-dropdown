angular.module('app', ['angular-dropdown'])

.factory('MockFormResourceFactory', function () {
    return {
        get: function (callback) {
            callback({
                AnimalTypeId1: 1,
                AnimalTypeId2: 3
            });
        },
        save: function (item) {
            alert(JSON.stringify(item, null, '    '));
        }
    };
})
.factory('MockListResourceFactory', function () {
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

.controller('ctrl', function ($scope, dropdown, MockFormResourceFactory, MockListResourceFactory) {
    $scope.dropdown = dropdown;

    $scope.form = {};

    MockListResourceFactory.get(function (list) {
        dropdown.list.add('options', list);

        MockFormResourceFactory.get(function (form) {
            $scope.form = form;
            dropdown.binding.add($scope.form,'AnimalTypeId1', 'option1', 'options');
            dropdown.binding.add($scope.form, 'AnimalTypeId2', 'option2', 'options');
        });
    });

    $scope.submit = function () {
        MockFormResourceFactory.save($scope.form);
    };
});
