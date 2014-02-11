/*
 * Copyright Mozilla Public License 1.1
 */
define([
    "triple_brain.friendly_resource_server_facade"
], function (FriendlyResourceServerFacade) {
    var api = {};
    api.fromServerFormat = function (serverFormat) {
        return new api.Object(
            serverFormat
        );
    };
    api.Object = function (serverFormat) {
        var _types = buildTypes();
        var _sameAs = buildSameAs();
        var _genericIdentifications = buildGenericIdentifications();
        var _identifications;
        FriendlyResourceServerFacade.Object.apply(
            this, [serverFormat.friendlyResource]
        );
        this.getTypes = function () {
            return _types;
        };
        this.getSameAs = function () {
            return _sameAs;
        };
        this.getGenericIdentifications = function () {
            return _genericIdentifications;
        };
        this.getIdentifications = function () {
            if (undefined === _identifications) {
                _identifications = [].concat(
                        _types
                    ).concat(
                        _sameAs
                    ).concat(
                        _genericIdentifications
                    );
            }
            return _identifications;
        };
        function buildTypes() {
            var types = [];
            if (undefined === serverFormat.additionalTypes) {
                return types;
            }
            $.each(serverFormat.additionalTypes, function () {
                types.push(
                    FriendlyResourceServerFacade.fromServerFormat(
                        this
                    )
                );
            });
            return types;
        }

        function buildSameAs() {
            var sameAs = [];
            if (undefined === serverFormat.sameAs) {
                return sameAs;
            }
            $.each(serverFormat.sameAs, function () {
                sameAs.push(
                    FriendlyResourceServerFacade.fromServerFormat(
                        this
                    )
                );
            });
            return sameAs;
        }

        function buildGenericIdentifications() {
            var genericIdentifications = [];
            if (undefined === genericIdentifications) {
                return genericIdentifications;
            }
            $.each(serverFormat.genericIdentifications, function () {
                genericIdentifications.push(
                    FriendlyResourceServerFacade.fromServerFormat(
                        this
                    )
                );
            });
            return genericIdentifications;
        }
    };
    return api;
});