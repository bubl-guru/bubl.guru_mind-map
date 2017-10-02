/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "jquery",
    "triple_brain.ui_utils",
    "triple_brain.mind_map_info",
    "triple_brain.friendly_resource_service",
    "triple_brain.selection_handler",
    "triple_brain.relative_tree_displayer_templates",
    "triple_brain.identification",
    "triple_brain.user_map_autocomplete_provider",
    "triple_brain.suggestion_service",
    "triple_brain.graph_element_html_builder",
    "triple_brain.bubble_factory"
], function ($, UiUtils, MindMapInfo, FriendlyResourceService, SelectionHandler, RelativeTreeTemplates, Identification, UserMapAutocompleteProvider, SuggestionService, GraphElementHtmlBuilder, BubbleFactory) {
    "use strict";
    var api = {};
    api.moveInLabelButtonsContainerIfIsToTheLeft = function (edge) {
        if (edge.isToTheLeft()) {
            var noteButton = edge.getInLabelButtonsContainer();
            edge.getLabelAndButtonsContainer().append(noteButton);
        }
    };
    api.buildLabel = function (edgeUi, text, whenEmptyLabel, isViewOnly) {
        var edgeHtml = edgeUi.getHtml();
        if(isViewOnly){
            edgeUi.makeLabelNonEditable();
        }
        var bubbleContentContainer = edgeHtml.find(".in-bubble-content");
        var labelContainer = $(
            "<div class='label-container'>"
        ).appendTo(bubbleContentContainer).on(
            "click",
            function (event) {
                event.stopPropagation();
                var edge = BubbleFactory.fromSubHtml(
                    $(this)
                );
                if (UiUtils.isMacintosh() ? event.metaKey : event.ctrlKey) {
                    if (edge.isSelected()) {
                        SelectionHandler.removeRelation(edge);
                    } else {
                        SelectionHandler.addRelation(edge);
                    }
                } else {
                    SelectionHandler.setToSingleRelation(edge);
                }
            }
        );
        var labelAndButtons = $(
            "<div class='label label-info label-and-buttons'>"
        );
        var label = $(
            "<div class='bubble-label'>"
        ).text(
            text
        ).attr(
            "data-placeholder",
            whenEmptyLabel
        ).appendTo(
            labelAndButtons
        ).tripleBrainAutocomplete({
                select: function (event, ui) {
                    var edge = BubbleFactory.fromSubHtml(
                        $(this)
                    );
                    var identification = Identification.fromSearchResult(
                        ui.item
                    ).makeSameAs();
                    edge.getController().addIdentification(
                        identification
                    );
                    edge.getController().setLabel(
                        ui.item.label
                    );
                },
                resultsProviders: [
                    UserMapAutocompleteProvider.toFetchRelationsForIdentification(
                        BubbleFactory.fromHtml(
                            edgeHtml
                        )
                    )
                ]
            }
        );
        labelAndButtons.appendTo(labelContainer);
        if (!MindMapInfo.isViewOnly() && !isViewOnly) {
            label.on(
                "dblclick",
                function (event) {
                    event.stopPropagation();
                    var edge = BubbleFactory.fromSubHtml(
                        $(this)
                    );
                    if(edge.isInEditMode()){
                        return;
                    }
                    edge.deselect();
                    edge.hideMenu();
                    edge.focus();
                }
            );
        }
        GraphElementHtmlBuilder.setUpLabel(label);
        return label;
    };
    api.buildInLabelButtons = function (edge) {
        var inLabelButtons = GraphElementHtmlBuilder.buildInLabelButtons(edge);
        edge.getLabelAndButtonsContainer().prepend(
            inLabelButtons
        );
    };
    return api;
});