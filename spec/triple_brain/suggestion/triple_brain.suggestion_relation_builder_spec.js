/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    "test/test-scenarios",
    'test/mock',
    "triple_brain.suggestion_relation_builder",
    "triple_brain.bubble"
], function (Scenarios, Mock, SuggestionRelationBuilder, Bubble) {
    "use strict";
    describe("suggestion_relation_html_builder", function () {
        var suggestion,
            locationSuggestion,
            locationRelationSuggestion;
        beforeEach(function () {
            Mock.applyDefaultMocks();
            var suggestionScenario = new Scenarios.oneBubbleHavingSuggestionsGraph();
            suggestion = suggestionScenario.getOneSuggestion();
            var karaokeSchemaScenario = new Scenarios.getKaraokeSchemaGraph();
            locationSuggestion = karaokeSchemaScenario.getLocationPropertyAsSuggestion();
            locationRelationSuggestion = SuggestionRelationBuilder.withServerFacade(
                locationSuggestion
            ).create();
            spyOn(Bubble.Bubble.prototype, "addIdentification").and.callFake(function(){});
            SuggestionRelationBuilder.afterChildBuilt(locationRelationSuggestion);
        });
        it("has the suggestion label", function () {
            expect(
                locationRelationSuggestion.text()
            ).toBe("location");
        });
        // it('has "same as" uri as label if suggestion label is empty', function () {
        //     locationSuggestion.setLabel("");
        //     locationRelationSuggestion = SuggestionRelationBuilder.withServerFacade(
        //         locationSuggestion
        //     ).create();
        //     expect(
        //         locationRelationSuggestion.text()
        //     ).toBe(locationSuggestion.getSameAs().getUri());
        // });
        it('has the suggestion "same as" has a "same as" identification', function () {
            expect(
                locationRelationSuggestion.getSuggestion().getSameAs().getUri()
            ).toBe(
                locationSuggestion.getSameAs().getUri()
            );
        });
        it('has suggestion uri as own uri', function () {
            expect(
                locationRelationSuggestion.getUri()
            ).toBe(locationSuggestion.getUri());
        });
    });
});