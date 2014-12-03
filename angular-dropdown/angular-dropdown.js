angular.module('angular-dropdown', [])

.directive('dropdown', function ($compile) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {

            // assumes scope.item is defined
            var modelName;
            if (scope.dropdown.model[attrs.model]) modelName = attrs.model;
            else modelName = scope.dropdown.prop[attrs.model];
            var listname = scope.dropdown.binding[modelName];
            if (!listname) throw 'unable to bind to list!';
            var labelname = scope.dropdown.label[listname];

            element.html(
                '<select ng-model="dropdown.model.' + modelName +
                '" ng-options="' + modelName +
                '.' + labelname + ' for ' + modelName +
                ' in dropdown.list.' + listname +
                '"/>').show();
            $compile(element.contents())(scope);
        }
    };
})

.factory('dropdown', function ($rootScope) {
    var service = {
        init: function (scope) {
            scope.dropdown = service;
            service.scope = scope;
        },
        model: {},
        key: {},
        label: {},
        prop: {},
        list: {
            add: function (name, array) {
                service.list[name] = array;
                return service;
            }
        },
        binding: {
            count: 0,
            add: function (
                binding,    /* <string> required: ng-model for the selected id or key */
                listname,   /* <string> required: name of the array of options added with dropdown.list.add() */
                keyname,    /* <string> optional: name of the key field in the options array */
                labelname,  /* <string> optional: name of the label field in the options array */
                name        /* <string> optional: name for the intermediate object used by the dropdown service internally */
            ) {
                service.binding.count++;

                var tokens = binding.split('.');
                var parent = tokens[0];
                var prop = tokens[1];
                if (!parent) parent = service.scope;
                else parent = service.scope[parent];
                name = name || 'option' + service.binding.count;
                listname = listname || name + 's';
                service.key[name] = keyname || 'id';
                service.label[listname] = labelname || 'name';
                service.model[name] = {};
                service.binding[name] = listname;
                service.binding[listname] = name;
                service.prop[binding] = name;
                service.prop[name] = binding;
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
