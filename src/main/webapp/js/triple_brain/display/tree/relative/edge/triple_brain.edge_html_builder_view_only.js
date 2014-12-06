/*
 * Copyright Vincent Blouin under the Mozilla Public License 1.1
 */
define([
    "triple_brain.tree_edge"
], function(TreeEdge){
    var api = {};
    api.withServerFacade = function (edgeServer) {
        return new EdgeCreator(
            edgeServer
        );
    };
    api.afterChildBuilt = function (edge, parentUi, childUi) {
        var edgeServer = edge.getOriginalServerObject(),
            parentVertexUi = parentUi.isVertex() ?
                parentUi :
                parentUi.getParentVertex(),
            isInverse = edgeServer.getSourceVertex().getUri() !== parentVertexUi.getUri();
        edge.getHtml().data(
            "source_vertex_id",
            parentVertexUi.getId()
        ).data(
            "destination_vertex_id",
            childUi.getId()
        );
        if (isInverse) {
            edge.inverse();
        }
        edge.getHtml().closest(
            ".vertex-tree-container"
        ).find("> .vertical-border").addClass("small");
    };
    return api;
    function EdgeCreator(edgeServerFormat){
        var html;
        this.create = function(){
            html = $(
                "<div class='relation bubble graph-element'>"
            ).append(
                buildInnerHtml()
            ).append(
                "<span class='connector'>"
            ).uniqueId();
            var edge = edgeFacade();
            edge.setUri(
                edgeServerFormat.getUri()
            );
            return edge;
            function buildInnerHtml(){
                var label = edgeServerFormat.getLabel();
                return $(
                    "<span>"
                ).addClass(
                    "label label-info"
                ).text(
                    label.trim()
                ).attr(
                    "data-placeholder",
                    TreeEdge.getWhenEmptyLabel()
                )
            }
            function edgeFacade() {
                return TreeEdge.withHtml(html);
            }
        };
    }
});