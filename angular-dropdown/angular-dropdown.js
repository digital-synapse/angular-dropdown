angular.module('angular-dropdown', [])

.directive('dropdown', function ($compile) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {

            // assumes scope.item is defined
            var listname = scope.dropdown.binding[attrs.model];
            if (!listname) throw 'unable to bind to list!';
            var labelname = scope.dropdown.label[listname];

            element.html(
                '<select ng-model="dropdown.model.' + attrs.model +
                '" ng-options="' + attrs.model +
                '.' + labelname + ' for ' + attrs.model +
                ' in dropdown.list.' + listname +
                '"/>').show();
            $compile(element.contents())(scope);
        }
    };
})

.factory('dropdown', function ($rootScope) {
    var service = {
        model: {},
        key: {},
        label: {},
        list: {
            add: function (name, array) {
                service.list[name] = array;
                return service;
            }
        },
        binding: {
            add: function (parent, prop, name, listname, keyname, labelname) {
                if (!parent) parent = {};
                listname = listname || name + 's';
                service.key[name] = keyname || 'id';
                service.label[listname] = labelname || 'name';
                service.model[name] = {};
                service.binding[name] = listname;
                service.binding[listname] = name;
                var key = service.key[name] || service.key[service.binding[name]];
                $rootScope.$watch(function () {
                    return service.model[name];
                }, function watchCallback(newValue, oldValue) {
                    parent[prop] = newValue[key];
                });
                service.select(name, parent[prop]);
                return service;
            }
        },
        find: function (name, id) {
            var array = service.list[name] || service.list[service.binding[name]];
            if (!array) throw 'dropdown service could not find a list for: ' + name;
            var key = service.key[name] || service.key[service.binding[name]];
            var i = array.length;
            while (i--) {
                if (array[i][key] == id) {
                    return array[i];
                }
            }
        },
        select: function (name, id) {
            service.model[name] = service.find(name, id);
            return service;
        },
        selected: function (name) {
            var key = service.key[name] || service.key[service.binding[name]];
            return service.model[name][key];
        }
    };
    return service;
});
