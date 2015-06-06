/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "triple_brain.friendly_resource"
], function (FriendlyResource) {
    "use strict";
    var api = {};
    api.fromServerFormat = function(serverFormat){
        return new Self(serverFormat);
    };
    api.fromServerArray = function(serverArray){
        var origins = [];
        $.each(serverArray, function(){
            origins.push(
                api.fromServerFormat(this)
            );
        });
        return origins;
    };
    api.buildObjectWithUriAndOrigin = function(uri, origin){
        return {
            friendlyResource: FriendlyResource.buildObjectWithUri(
                uri
            ),
            origin: origin
        }
    };
    function Self(serverFormat){
        this.originServerFormat = serverFormat;
        FriendlyResource.Self.apply(
            this
        );
        FriendlyResource.Self.prototype.init.call(
            this,
            serverFormat.friendlyResource
        );
    }
    Self.prototype = new FriendlyResource.Self;
    Self.prototype.getOrigin = function(){
        return this.originServerFormat.origin;
    };
    Self.prototype.getServerFormat = function(){
        return {
            friendlyResource : FriendlyResource.Self.prototype.getServerFormat.call(this),
            origin: this.getOrigin()
        }
    };
    return api;
});