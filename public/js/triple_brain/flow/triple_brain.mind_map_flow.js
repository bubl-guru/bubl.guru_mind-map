/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "jquery",
    "triple_brain.ui_utils",
    "triple_brain.user_service",
    "triple_brain.event_bus",
    "triple_brain.header",
    "triple_brain.selection_handler",
    "triple_brain.graph_displayer",
    "triple_brain.graph_displayer_factory",
    "triple_brain.mind_map_info",
    "triple_brain.graph_element_main_menu",
    "triple_brain.graph_ui",
    "triple_brain.language_manager",
    "triple_brain.id_uri",
    "mr.connected-home-flow",
    "triple_brain.flow",
    "triple_brain.bubble_factory",
    "triple_brain.identification_menu",
    "triple_brain.image_menu",
    "triple_brain.graph_element_ui",
    "mr.app_controller",
    "triple_brain.other_user_flow"
], function ($, UiUtils, UserService, EventBus, Header, SelectionHandler, GraphDisplayer, GraphDisplayerFactory, MindMapInfo, GraphElementMainMenu, GraphUi, LanguageManager, IdUriUtils, ConnectedHomeFlow, Flow, BubbleFactory, IdentificationMenu, ImageMenu, GraphElementUi, AppController, html2canvas) {
    "use strict";
    var api = {};
    api.enterConnectedHomeFlow = function () {
        setupMindMap(false, true);
    };
    api.enterMindMapForAuthenticatedUser = function () {
        setupMindMap(false, false);
    };
    api.enterMindMapForAnonymousUser = function () {
        setupMindMap(true, false);
    };
    EventBus.subscribe(
        '/event/ui/user/get_authenticated/success',
        function (event, authenticatedUser) {
            var isADevUser = [
                "",
                ""
            ].indexOf(authenticatedUser.user_name) !== -1;
            var devOnlyHtml = $(".dev-only");
            if (isADevUser) {
                devOnlyHtml.removeClass("hidden");
            } else {
                devOnlyHtml.remove();
            }
        }
    );
    EventBus.subscribe(
        '/event/ui/graph/drawing_info/updated/',
        function (event, centralBubbleUri) {
            SelectionHandler.removeAll();
            GraphDisplayer.getVertexSelector().visitAllVertices(function (vertex) {
                EventBus.publish(
                    '/event/ui/vertex/visit_after_graph_drawn',
                    vertex
                );
            });
            GraphDisplayer.getGroupRelationSelector().visitAll(function (groupRelationUi) {
                EventBus.publish(
                    '/event/ui/group_relation/visit_after_graph_drawn',
                    groupRelationUi
                );
            });
            var centralBubble = BubbleFactory.getGraphElementFromUri(
                centralBubbleUri
            );
            document.title = centralBubble.getTextOrDefault() + " | MindRespect";
            if (MindMapInfo.isViewOnly()) {
                GraphUi.getDrawnGraph().find(".bubble").addClass("not-editable");
                $("body").addClass("not-editable");
            }
            if (centralBubble.isSchema() && !MindMapInfo.isViewOnly()) {
                GraphUi.showSchemaInstructions();
            } else {
                GraphUi.hideSchemaInstructions();
            }
            centralBubble.setAsCentral();
            if (GraphElementUi.getCenterVertexOrSchema().isVertex()) {
                var backgroundColor = centralBubble.getModel().getColors().background;
                if (backgroundColor) {
                    GraphUi.changeBackgroundColor(backgroundColor);
                } else {
                    GraphUi.resetBackGroundColor();
                }
            } else {
                GraphUi.resetBackGroundColor();
            }
            GraphUi.getDrawnGraph().on(
                "mousedown",
                function (event) {
                    var whatGotClicked = $(event.target);
                    var clickedOnOtherInstancesButton = whatGotClicked.closest(".visit-other-instances").length === 1;
                    if (clickedOnOtherInstancesButton) {
                        return;
                    }
                    var clickedOnSomethingInsideABubble = whatGotClicked.closest(".bubble").length === 1;
                    if (clickedOnSomethingInsideABubble) {
                        return;
                    }
                    $("#font-picker").addClass('hidden');
                    GraphUi.removePopovers();
                    SelectionHandler.getSelectedBubbles().forEach(function (bubble) {
                        bubble.hideMenu();
                    });
                }
            );
            GraphUi.refreshWidth();
            $("body").removeClass(
                "hidden"
            ).addClass("mind-map-flow");

            GraphUi.initDragScroll();
            GraphUi.enableDragScroll();
            SelectionHandler.setToSingleVertex(centralBubble);
            AppController.zoomOut();
            EventBus.publish('/event/ui/graph/drawn');
            centralBubble.scrollTo();
            GraphElementMainMenu.reviewAppButtonsDisplay();
            // html2canvas(document.body).then(function(canvas) {
            //     document.body.innerHTML = canvas;
            // });
            //if (window.callPhantom === 'function') {
            //    window.callPhantom('takeShot');
            //}
        }
    );
    return api;

    function setupMindMap(isAnonymous, isTagCloudFlow) {
        // $("body").addClass("no-scroll");
        MindMapInfo.setIsAnonymous(isAnonymous);
        MindMapInfo.setIsTagCloudFlow(isTagCloudFlow);
        Header.earlyInit();
        handleHistoryBrowse();
        if (isAnonymous) {
            loadLocaleAndGraph();
        } else {
            UserService.authenticatedUser(function () {
                MindMapInfo.defineIsViewOnly();
                MindMapInfo.defineIsFriend().then(loadLocaleAndGraph);
            });
        }

        function loadLocaleAndGraph() {
            LanguageManager.loadLocaleContent(function () {
                if (isAnonymous) {
                    Header.commonSetupForAnonymous();
                } else {
                    Header.commonSetupForAuthenticated();
                }
                translateText();
                if (isTagCloudFlow) {
                    ConnectedHomeFlow.enter();
                    return;
                }
                Flow.showOnlyFlow("mindMap");
                GraphDisplayer.displayForBubbleWithUri(
                    MindMapInfo.getCenterBubbleUri()
                );
                GraphElementMainMenu._getGraphElementMenu().removeClass("hidden");
                GraphElementMainMenu.reset();
                IdentificationMenu.setup();
                GraphElementMainMenu.reviewAppButtonsDisplay();
                ImageMenu.setup();
            });
        }
    }

    function handleHistoryBrowse() {
        $(window).on("popstate", function () {
            GraphDisplayer.displayForBubbleWithUri(
                MindMapInfo.getCenterBubbleUri()
            );
        });
    }

    function translateText() {
        $("html").i18n();
    }
});
