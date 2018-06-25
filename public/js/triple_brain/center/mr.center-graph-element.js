/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "jquery",
    "triple_brain.friendly_resource"
], function ($, FriendlyResource) {
    "use strict";
    var api = {};
    api.fromServerFormat = function (centersServerFormat) {
        var elements = [];
        centersServerFormat.forEach(function(centerServerFormat){
            elements.push(
                new CenterGraphElement().init(
                    centerServerFormat
                )
            );
        });
        return elements;
    };
    function CenterGraphElement() {
    }

    CenterGraphElement.prototype = new FriendlyResource.FriendlyResource();
    CenterGraphElement.prototype.init = function (serverFormat) {
        this.centerGraphElementServerFormat = serverFormat;
        FriendlyResource.FriendlyResource.apply(
            this.centerGraphElementServerFormat.graphElement.friendlyResource
        );
        FriendlyResource.FriendlyResource.prototype.init.call(
            this,
            this.centerGraphElementServerFormat.graphElement.friendlyResource
        );
        return this;
    };
    CenterGraphElement.prototype.getNumberOfVisits = function () {
        if(!this.centerGraphElementServerFormat.numberOfVisits){
            return 0;
        }
        if(this.centerGraphElementServerFormat.numberOfVisits > 999){
            return 999;
        }
        return this.centerGraphElementServerFormat.numberOfVisits;
    };
    CenterGraphElement.prototype.getLastCenterDate = function () {
        return new Date(this.centerGraphElementServerFormat.lastCenterDate);
    };
    CenterGraphElement.prototype.getContext = function () {
        return this.centerGraphElementServerFormat.context;
    };
    CenterGraphElement.prototype.setVisitRank = function (rank) {
        this.visitRank = rank;
    };
    CenterGraphElement.prototype.getNumberOfVisitsRank = function () {
        return this.visitRank;
    };
    CenterGraphElement.prototype.getNbReferences = function () {
        return this.centerGraphElementServerFormat.nbReferences;
    };
    return api;
});