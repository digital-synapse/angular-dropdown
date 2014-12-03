angular.module('app', ['angular-dropdown'])

.controller('ctrl', function ($scope, dropdown, mockFormResourceFactory, mockListResourceFactory) {

    // init the dropdown service
    dropdown.init($scope);

    // load the form
    mockListResourceFactory.get(function (list) {
        
        dropdown.list.add('options', list);

        mockFormResourceFactory.get(function (form) {
            $scope.form = form;
            dropdown.binding.add('form.firstAnimalId', 'options');
            dropdown.binding.add('form.secondAnimalId', 'options');
        });
    });

    // post the form
    $scope.submit = function () {
        mockFormResourceFactory.save($scope.form);
    };
});
