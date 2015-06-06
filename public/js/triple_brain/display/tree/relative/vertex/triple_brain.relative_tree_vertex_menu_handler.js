/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "jquery",
    "triple_brain.vertex_service",
    "triple_brain.selection_handler",
    "triple_brain.relative_tree_vertex",
    "triple_brain.ui.utils",
    "triple_brain.triple_ui",
    "triple_brain.identification_menu",
    "triple_brain.graph_displayer",
    "triple_brain.graph_element_menu_handler",
    "triple_brain.delete_menu",
    "triple_brain.edge_ui",
    "triple_brain.image_menu",
    "triple_brain.link_to_far_vertex_menu",
    "triple_brain.included_graph_elements_menu",
    "triple_brain.vertex_ui",
    "triple_brain.mind_map_info"
], function ($, VertexService, SelectionHandler, RelativeTreeVertex, UiUtils, TripleUi, IdentificationMenu, GraphDisplayer, GraphElementMenuHandler, DeleteMenu, EdgeUi, ImageMenu, LinkToFarVertexMenu, IncludedGraphElementsMenu, VertexUi, MindMapInfo) {
    "use strict";
    var api = {},
        forSingle = {},
        forSingleNotOwned = {},
        forGroup = {},
        forGroupNotOwned = {};
    api.forSingle = function () {
        return MindMapInfo.isViewOnly() ?
            forSingleNotOwned :
            forSingle;
    };
    forSingle.addChild = function (event, sourceVertex) {
        forSingle.addChildAction(sourceVertex);
    };
    forSingle.addChildAction = function (sourceVertex) {
        VertexService.addRelationAndVertexToVertex(
            sourceVertex,
            sourceVertex,
            function (triple) {
                SelectionHandler.setToSingleGraphElement(
                    triple.destinationVertex()
                );
            }
        );
    };
    forSingle.addSibling = function (event, vertex) {
        forSingle.addSiblingAction(vertex);
    };
    forSingle.addSiblingAction = function (vertex) {
        forSingle.addChildAction(
            vertex.getParentVertex()
        );
    };
    forSingle.addSiblingCanDo = function (vertex) {
        return !vertex.isCenterBubble();
    };
    forSingle.remove = function (event, vertex) {
        forSingle.removeAction(vertex);
    };
    forSingle.removeAction = function (vertex, skipConfirmation) {
        if (skipConfirmation) {
            deleteAfterConfirmationBehavior(vertex);
            return;
        }
        DeleteMenu.ofVertexAndDeletionBehavior(
            vertex,
            deleteAfterConfirmationBehavior
        ).build();
        function deleteAfterConfirmationBehavior(vertex) {
            VertexService.remove(vertex, function (vertex) {
                vertex.remove();
            });
        }
    };
    forSingleNotOwned.identify = forSingle.identify = function (event, vertex) {
        event.stopPropagation();
        forSingle.identifyAction(vertex);
    };
    forSingle.identifyAction = function (vertex) {
        IdentificationMenu.ofGraphElement(
            vertex
        ).create();
    };
    forSingleNotOwned.identifyCanDo = function (vertex) {
        return vertex.hasIdentifications();
    };
    forSingle.center = function (event, vertex) {
        forSingle.centerAction(vertex);
    };

    forSingle.centerAction = function (vertex) {
        GraphDisplayer.displayUsingCentralVertex(
            vertex
        );
    };

    forSingleNotOwned.note = forSingle.note = function (event, vertex) {
        forSingle.noteAction(vertex);
    };
    forSingleNotOwned.noteAction = forSingle.noteAction = GraphElementMenuHandler.forSingle().noteAction;

    forSingleNotOwned.noteCanDo = function (vertex) {
        return vertex.hasNote();
    };
    forSingle.images = function (event, vertex) {
        ImageMenu.ofVertex(
            vertex
        ).build();
    };
    forSingle.connectTo = function (event, vertex) {
        LinkToFarVertexMenu.ofVertex(
            vertex
        ).create();
    };
    forSingle.makePrivate = function (event, vertex) {
        VertexService.makePrivate(vertex, function () {
            getMakePrivateButtons().hide();
            getMakePublicButtons().show();
        });
    };
    forSingle.makePrivateCanDo = function (vertex) {
        return vertex.isPublic();
    };
    forSingle.makePublic = function (event, vertex) {
        VertexService.makePublic(vertex, function () {
            getMakePrivateButtons().show();
            getMakePublicButtons().hide();
        });
    };
    forSingle.makePublicCanDo = function (vertex) {
        return !vertex.isPublic();
    };
    forSingle.subElements = function (event, vertex) {
        IncludedGraphElementsMenu.ofVertex(
            vertex
        ).create();
    };
    forSingle.subElementsCanDo = function (vertex) {
        return vertex.hasIncludedGraphElements();
    };

    forSingle.suggestions = function (event, vertex) {
        forSingle.suggestionsAction(
            vertex
        );
    };
    forSingle.suggestionsAction = function (vertex) {
        GraphDisplayer.showSuggestions(vertex);
    };
    forSingle.suggestionsCanDo = function (vertex) {
        return vertex.hasSuggestions();
    };
    function getMakePrivateButtons() {
        return $("button[data-action=makePrivate]");
    }

    function getMakePublicButtons() {
        return $("button[data-action=makePublic]");
    }

    api.forGroup = function () {
        return MindMapInfo.isViewOnly() ?
            forGroupNotOwned :
            forGroup;
    };
    forGroup.makePrivate = function (event, vertices) {
        VertexService.makeCollectionPrivate(vertices);
    };
    forGroup.makePublic = function (event, vertices) {
        VertexService.makeCollectionPublic(vertices);
    };
    forGroup.group = function () {
        var selectedGraphElements = {
            edges: {},
            vertices: {}
        };
        EdgeUi.visitAllEdges(function (edge) {
            var sourceVertex = edge.getSourceVertex();
            var destinationVertex = edge.getDestinationVertex();
            var isSourceVertexSelected = sourceVertex.isSelected();
            var isDestinationVertexSelected = destinationVertex.isSelected();
            if (isSourceVertexSelected) {
                selectedGraphElements.vertices[
                    sourceVertex.getUri()
                    ] = ""
            }
            if (isDestinationVertexSelected) {
                selectedGraphElements.vertices[
                    destinationVertex.getUri()
                    ] = ""
            }
            if (isSourceVertexSelected && isDestinationVertexSelected) {
                selectedGraphElements.edges[
                    edge.getUri()
                    ] = "";
            }
        });
        VertexService.group(
            selectedGraphElements,
            GraphDisplayer.displayUsingCentralVertexUri
        );
    };
    return api;
});