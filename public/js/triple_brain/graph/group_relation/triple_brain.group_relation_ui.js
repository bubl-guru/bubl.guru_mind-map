/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "jquery",
    "triple_brain.graph_displayer",
    "triple_brain.graph_element_ui",
    "triple_brain.tree_edge",
    "bootstrap"
], function ($, GraphDisplayer, GraphElementUi, TreeEdge) {
    "use strict";
    var api = {};
    TreeEdge.buildCommonConstructors(api);
    api.getWhenEmptyLabel = function () {
        return $.t("group_relation.default");
    };
    api.createFromHtml = function (html) {
        var groupRelation = new api.GroupRelationUi(html);
        api.initCache(
            groupRelation
        );
        return groupRelation;
    };
    api.visitAllGroupRelations = function (visitor) {
        api.visitAll(function (element) {
            if (element.isGroupRelation()) {
                visitor(element);
            }
        });
    };
    api.GroupRelationUi = function (html) {
        this.html = html;
        TreeEdge.Self.prototype.init.call(
            this,
            html
        );
    };
    api.withUri = function () {
        return [];
    };
    api.GroupRelationUi.prototype = new TreeEdge.Self();
    api.GroupRelationUi.prototype.getGraphElementType = function () {
        return GraphElementUi.Types.GroupRelation;
    };

    api.GroupRelationUi.prototype.getGroupRelation = function () {
        return this.html.data(
            "group_relation"
        );
    };

    api.GroupRelationUi.prototype.isToTheLeft = function () {
        if (this._isToTheLeft === undefined) {
            this._isToTheLeft = this.html.parents(".left-oriented").length > 0;
        }
        return this._isToTheLeft;
    };
    api.GroupRelationUi.prototype.getHtml = function () {
        return this.html;
    };
    api.GroupRelationUi.prototype.addChildTree = function () {
        GraphDisplayer.expandGroupRelation(
            this
        );
        return new $.Deferred().resolve();
    };
    api.GroupRelationUi.prototype.select = function () {
        this.html.addClass("selected");
    };
    api.GroupRelationUi.prototype.deselect = function () {
        this.html.removeClass("selected");
        this.hideButtons();
        this.hideDescription();
    };

    api.GroupRelationUi.prototype.makeSingleSelected = function () {
        this.showButtons();
        this._showDescription();
    };

    api.GroupRelationUi.prototype.showButtons = function () {
        this.getMenuHtml().show();
    };

    api.GroupRelationUi.prototype.hideButtons = function () {
        this.getMenuHtml().hide();
    };

    api.GroupRelationUi.prototype.getMenuHtml = function () {
        return this.html.find('.menu');
    };

    api.GroupRelationUi.prototype._showDescription = function () {
        this.getLabel().popover('show');
    };

    api.GroupRelationUi.prototype.hideDescription = function () {
        this.getLabel().popover('hide');
    };

    api.GroupRelationUi.prototype.getLabel = function () {
        return this.html.find('.label');
    };

    api.GroupRelationUi.prototype.getNote = function () {
        return this.getLabel().attr("data-content");
    };

    api.GroupRelationUi.prototype.getModel = api.GroupRelationUi.prototype.getGroupRelation;

    return api;
});