(function kit(window){
    var namespace = '' || 'kit';

    function Initialize() {
        this.path = _getPathName();
    }

    function _getPathName() {
        var pathname = window.location.pathname;

        return pathname.split('/');
    }

    Initialize.prototype.Routine = function() {
        var instance = this;

        instance.loaded = false;
        instance.controller = {};

        function _mergeExportsInstance(key) {
            var controller = instance.controller[key];
            var mergeControllerObject = { root: key };
            var isInvalid = function(property) {
                var validProperties = ['init', 'data', 'methods'];

                return validProperties.indexOf(property) < 0;
            };

            Object.keys(controller).forEach(function(property){
                if(isInvalid(property)) throw new Error('_mergeExportsInstance() :  "' + property +  '" is invalid controller property.');

                if(property !== 'init') {
                    var eachControllerProperty = controller[property];

                    Object.keys(eachControllerProperty).forEach(function(key){
                        mergeControllerObject[key] = eachControllerProperty[key];
                    });
                }
            });

            return mergeControllerObject;
        }

        function _callController(key) {
            var controller = instance.controller;
            var initMethod;
            var controllerInstance;

            if(!controller.hasOwnProperty(key)) throw new Error('_callController() : "' + key +  '" is invalid controller key.');
            if(!controller[key].hasOwnProperty('init')) throw new Error('_callController() : "' + key + '" controller does not have "init" method.');

            initMethod = controller[key].init;
            controllerInstance = _mergeExportsInstance.call(instance, key);

            if(initMethod !== undefined) initMethod.call(controllerInstance, controllerInstance, controller[key].methods, controller[key].data);
        }

        function _loaded() {
            instance.loaded = true;
        }

        function Routine(options) {
            var controller;
            var length;

            if(!instance.loaded) throw new Error('Routine() : each instance of a controller is already exists.');
            
            controller = Object.keys(options);
            
            length = controller.length;

            instance.controller = options;

            if(length) {
                controller.forEach(function(key){
                    _callController.call(instance, key);
                });
            }

            _loaded.call(instance);
        }

        return Routine;
    };

    Initialize.prototype.ForEach = function() {
        function ForEach(instance, callback) {
            Array.prototype.forEach.call(instance, callback);
        }

        return ForEach;
    };

    Initialize.prototype.Cookie = function() {
        function Cookie() {
        }

        function _getCookies() {
            return document.cookie.replace(/\s/g, '').split(';');
        }

        Cookie.prototype.get = function(key) {
            var value = '';
            var cookies = _getCookies();

            cookies.forEach(function(cookie){
                if(cookie.indexOf(key) === 0) {
                    var length = key.length;

                    value = cookie.slice(++length, cookie.length);
                }
            });

            return value;
        };

        return new Cookie();
    };

    window[namespace] = window[namespace] || new Initialize();
}(window));