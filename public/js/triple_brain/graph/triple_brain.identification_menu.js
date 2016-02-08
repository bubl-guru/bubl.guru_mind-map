/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
        "jquery",
        "triple_brain.identification",
        "triple_brain.mind-map_template",
        "triple_brain.ui.graph",
        "triple_brain.id_uri",
        "triple_brain.wikidata_uri",
        "triple_brain.wikidata",
        "triple_brain.wikidata_autocomplete_provider",
        "triple_brain.user_map_autocomplete_provider",
        "triple_brain.graph_element_menu",
        "triple_brain.search",
        "triple_brain.identification_context",
        "triple_brain.search_result",
        "triple_brain.mind_map_info",
        "triple_brain.suggestion_service",
        "triple_brain.schema_suggestion",
        "triple_brain.identified_to_service",
        "triple_brain.graph_element_type",
        "jquery-ui",
        "jquery.triple_brain.search",
        "jquery.i18next",
        "jquery.performance"
    ],
    function ($, Identification, MindMapTemplate, GraphUi, IdUri, WikidataUri, Wikidata, WikidataAutocompleteProvider, UserMapAutocompleteProvider, GraphElementMenu, SearchService, IdentificationContext, SearchResult, MindMapInfo, SuggestionService, SchemaSuggestion, IdentifiedToService, GraphElementType) {
        "use strict";
        var api = {},
            DESCRIPTION_MAX_CHAR = 155;

        api.ofGraphElement = function (graphElementUi) {
            return new IdentificationMenu(graphElementUi);
        };
        api._handleClickReferences = function (event) {
            event.preventDefault();
            var anchor = $(this).disableAnchor();
            IdentifiedToService.getForIdentification(
                anchor.data("identification"),
                function (searchResults) {
                    var container = anchor.next(".references");
                    var originalGraphElement = anchor.data("graphElement");
                    $.each(searchResults, function () {
                        var searchResult = this;
                        if (searchResult.getGraphElement().getUri() === originalGraphElement.getUri()) {
                            return;
                        }
                        api._renderReference(
                            container, searchResult
                        );
                    });
                }
            );
        };

        api._renderReference = function (container, reference) {
            var graphElement = reference.getGraphElement();
            var li = $("<li class='list-group-item clearfix'>").append(
                $("<span class='element-label'>").text(
                    graphElement.getLabel()
                ),
                $("<div class='info'>").append(
                    $("<span class='type'>").text(
                        $.t("search.context." + reference.getGraphElementType())
                    ),
                    $("<div class='distinction'>").text(
                        reference.getSomethingToDistinguish()
                    )
                )
            );
            if (reference.is(GraphElementType.Vertex) || reference.is(GraphElementType.Schema)) {
                li.addClass("clickable").data(
                    "uri", graphElement.getUri()
                ).click(function () {
                        window.location = IdUri.htmlUrlForBubbleUri(
                            $(this).data("uri")
                        );
                    });
            }
            li.appendTo(container);
        };
        function IdentificationMenu(graphElement) {
            this.graphElement = graphElement;
        }

        IdentificationMenu.prototype.create = function () {
            var row = $("<div class='row'>");
            this.html = $(
                "<div class='identifications col-md-12'>"
            ).appendTo(row);
            GraphUi.addHtml(row);
            this._buildMenu();
            this.html.data("graphElement", this.graphElement);
            GraphElementMenu.makeForMenuContentAndGraphElement(
                row,
                this.graphElement, {
                    height: 350,
                    width: 550
                },
                $.t("graph_element.menu.identification.title_prefix")
            );
            GraphElementMenu.setupAutoCompleteSuggestionZIndex(
                this.identificationTextField
            );
            return this;
        };

        IdentificationMenu.prototype._buildMenu = function () {
            this._addTitle();
            if (!MindMapInfo.isViewOnly()) {
                this._addIdentificationTextField().focus();
            }
            this._addInstructions();
            this._addIdentifications();
        };

        IdentificationMenu.prototype._addTitle = function () {
            this.html.append(
                $("<h4>").attr(
                    "data-i18n",
                    "graph_element.menu.identification.title"
                )
            );
        };

        IdentificationMenu.prototype._addInstructions = function () {
            var container = $("<div class='instruction'>");
            container.append(
                $("<div class='small'>").attr(
                    "data-i18n",
                    (
                        "graph_element.menu.identification.example"
                    )
                )
            );
            container.append(
                $("<a href='#' class=''>").attr(
                    "data-i18n",
                    (
                        "graph_element.menu.identification.what_for"
                    )
                ).click(function (event) {
                        event.preventDefault();
                        $(this).next('.why').toggleClass("hidden");
                    })
            );
            container.append(
                $("<span style='margin-left:0.5em;' class='hidden why'>").attr(
                    "data-i18n",
                    (
                        "graph_element.menu.identification.why"
                    )
                )
            );
            this.html.append(
                container
            );
        };

        IdentificationMenu.prototype._addIdentifications = function () {
            var identitiesList = MindMapTemplate['identification_existing_identities'].merge(),
                self = this;
            this.html.append(
                identitiesList
            );
            $.each(this.graphElement.getIdentifications(), function () {
                self._addIdentificationAsListElement(
                    this
                );
            });
        };

        IdentificationMenu.prototype._getMainListHtml = function () {
            return this.html.find(".list.main-list");
        };

        IdentificationMenu.prototype._addIdentificationAsListElement = function (identification) {
            var li = $(
                "<li class='list-group-item clearfix'>"
            ).data(
                "identification",
                identification
            );
            var self = this;
            this._makeTitle(identification).then(function (title) {
                var description = self._makeDescription(identification);
                li.append(
                    self._makeImage(identification),
                    title,
                    description,
                    self._makeOrigin(identification),
                    self._makeReferencesContainer(identification)
                );
                self._getMainListHtml().append(
                    li
                );
            });
        };

        IdentificationMenu.prototype._makeImage = function (identification) {
            var container = $("<div class='img-container'>");
            if (identification.hasImages()) {
                $("<img>").prop(
                    "src",
                    identification.getImages()[0].getBase64ForSmall()
                ).appendTo(container);
            }
            return container;
        };

        IdentificationMenu.prototype._makeDescription = function (identification) {
            var description = identification.getComment()
                .replace("\n", "<br/><br/>");
            var beginingDescriptionText = description.length > DESCRIPTION_MAX_CHAR ?
                description.substr(
                    0,
                    description.indexOf(" ", DESCRIPTION_MAX_CHAR)
                ) : description;
            var beginningDescription = $("<span>").append(
                beginingDescriptionText
            );
            var endDescription = $("<div class='end-description hidden'>").append(
                description.substr(
                    beginingDescriptionText.length + 1
                )
            );
            var container = $("<div class='group list-group-item-text description'>").append(
                beginningDescription
            );
            if (description.length > DESCRIPTION_MAX_CHAR) {
                $("<span class='read-more'>").append(
                    $(
                        "<a href='#' data-i18n='graph_element.menu.identification.readMore'>"
                    ).click(function (event) {
                            event.preventDefault();
                            var $this = $(this);
                            var collapsible = $this.closest('.description').find(
                                '.end-description'
                            ).toggleClass('hidden');
                            $this.text(
                                $.t(
                                    collapsible.is(":visible") ?
                                        "graph_element.menu.identification.readLess" :
                                        "graph_element.menu.identification.readMore"
                                )
                            );
                        }
                    )
                ).appendTo(container);
            }
            container.append(endDescription);
            return container;
        };

        IdentificationMenu.prototype._makeTitle = function (identification) {
            var deferred = $.Deferred();
            var self = this;
            var url = identification.getExternalResourceUri();
            if (IdUri.isUriOfAGraphElement(url)) {
                url = IdUri.htmlUrlForBubbleUri(
                    url
                );
            }
            if (WikidataUri.isAWikidataUri(url)) {
                Wikidata.getWikipediaUrlFromWikidataUri(url).then(function (wikipediaUrl) {
                    deferred.resolve(
                        buildTitleWithUrl(wikipediaUrl)
                    );
                });
            } else {
                deferred.resolve(
                    buildTitleWithUrl(url)
                );
            }
            return deferred.promise();
            function buildTitleWithUrl(url) {
                var anchor = $("<a target=_blank>").prop(
                    "href",
                    url
                ).append(
                    identification.isLabelEmpty() ?
                        identification.getUri() :
                        identification.getLabel()
                );
                return $(
                    "<h3 class='list-group-item-heading'>"
                ).append(
                    anchor,
                    self._makeRemoveButton()
                );
            }
        };

        IdentificationMenu.prototype._makeOrigin = function (identification) {
            var url = identification.getExternalResourceUri();
            var origin = IdUri.hostNameOfUri(url);
            if (IdUri.isUriOfAGraphElement(url)) {
                origin = window.location.hostname;
            }
            return $(
                "<div class='origin-container'>"
            ).append(
                $("<small>").append(
                    $.t(
                        "graph_element.menu.identification.origin"
                    ) + ": ",
                    $("<a target='_blank'>").prop("href", "http://" + origin).text(origin)
                )
            );
        };

        IdentificationMenu.prototype._makeReferencesContainer = function (identification) {
            var numberOfOtherReferences = identification.getNbReferences() - 1;
            var container = $(
                "<div class='references-container'>"
            );
            if (numberOfOtherReferences > 0) {
                $("<a href='#'>").data(
                    "identification", identification
                ).data(
                    "graphElement",
                    this.graphElement
                ).text(
                    numberOfOtherReferences + " " +
                    $.t(
                        "graph_element.menu.identification.nb_references"
                    )
                ).click(api._handleClickReferences).appendTo(container);
                container.append("<ul class='references list list-group'>");
            } else {
                container.text(
                    $.t(
                        "graph_element.menu.identification.no_other_references"
                    )
                );
            }
            return container;
        };

        IdentificationMenu.prototype._addIdentificationTextField = function () {
            var identificationTextField = $(
                MindMapTemplate[
                    'identification_textfield'
                    ].merge()
            );
            this.html.append(identificationTextField);
            this._setUpAutoComplete(identificationTextField);
            this.identificationTextField = identificationTextField;
            return identificationTextField;
        };

        IdentificationMenu.prototype._setUpAutoComplete = function (identificationTextField) {
            var self = this;
            identificationTextField.tripleBrainAutocomplete({
                select: function (event, ui) {
                    var semanticMenu = $(this).closest(
                            '.identifications'
                        ),
                        searchResult = ui.item;
                    self._handleSelectIdentification(
                        searchResult,
                        semanticMenu.data("graphElement")
                    );
                },
                resultsProviders: this.graphElement.isVertex() ?
                    this._getResultsProvidersForVertex() :
                    this._getResultsProvidersForRelations()
            });
        };

        IdentificationMenu.prototype._handleSelectIdentification = function (searchResult, graphElement) {
            if (graphElement.hasSearchResultAsIdentification(searchResult)) {
                return false;
            }
            var self = this;
            SchemaSuggestion.addSchemaSuggestionsIfApplicable(
                graphElement,
                searchResult
            );
            if (graphElement.isSuggestion()) {
                var vertexSuggestion = graphElement.isRelationSuggestion() ?
                    graphElement.childVertexInDisplay() : graphElement;
                SuggestionService.accept(
                    vertexSuggestion,
                    identify
                );
            } else {
                identify();
            }
            return true;
            function identify() {
                self._identifyUsingServerIdentificationFctn(
                    graphElement,
                    searchResult,
                    self._getServerIdentificationFctn()
                );
            }
        };

        IdentificationMenu.prototype._getResultsProvidersForVertex = function () {
            return [
                UserMapAutocompleteProvider.toFetchCurrentUserVerticesAndPublicOnesForIdentification(this.graphElement),
                WikidataAutocompleteProvider.build()
            ];
        };
        IdentificationMenu.prototype._getResultsProvidersForRelations = function () {
            return [
                UserMapAutocompleteProvider.toFetchRelationsForIdentification(this.graphElement),
                WikidataAutocompleteProvider.build()
            ];
        };

        IdentificationMenu.prototype._getServerIdentificationFctn = function () {
            var graphElement = this.graphElement;
            return this.graphElement.isVertex() ? function (concept, identificationResource, callback) {
                graphElement.serverFacade().addGenericIdentification(concept, identificationResource, callback);
                graphElement.refreshImages();
            } : function (concept, identificationResource, callback) {
                graphElement.serverFacade().addSameAs(concept, identificationResource, callback);
                graphElement.refreshImages();
            };
        };

        IdentificationMenu.prototype._makeRemoveButton = function () {
            var container = $("<span class='pull-right'>");
            var button = $(
                "<button class='btn remove-btn'>"
            ).append(
                "<i class='fa fa-trash-o'>"
            ).appendTo(container).click(
                function (event) {
                    event.stopPropagation();
                    var identificationListElement = $(this).closest(
                            'li'
                        ),
                        identification = identificationListElement.data(
                            "identification"
                        ),
                        semanticMenu = identificationListElement.closest(
                            '.identifications'
                        ),
                        graphElement = semanticMenu.data("graphElement");
                    identificationListElement.remove();
                    getServerRemoveIdentificationFunction()(
                        graphElement,
                        identification
                    );
                    function getServerRemoveIdentificationFunction() {
                        switch (identification.getType()) {
                            case "type" :
                                return graphElement.serverFacade().removeType;
                            case "same_as" :
                                return graphElement.serverFacade().removeSameAs;
                            default :
                                return graphElement.serverFacade().removeGenericIdentification;
                        }
                    }
                }
            );
            return container;
        };

        IdentificationMenu.prototype._identifyUsingServerIdentificationFctn = function (graphElement, searchResult, serverIdentificationFctn) {
            var identificationResource = Identification.fromSearchResult(
                searchResult
            );
            var self = this;
            serverIdentificationFctn(
                graphElement,
                identificationResource,
                function (graphElement, identifications) {
                    $.each(identifications, function(){
                        self._addIdentificationAsListElement(this);
                    });
                }
            );
        };
        return api;
    }
);