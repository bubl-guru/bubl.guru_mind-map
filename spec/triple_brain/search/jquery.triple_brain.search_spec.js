/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    'test/test-scenarios',
    'triple_brain.user_map_autocomplete_provider',
    "jquery",
    "jquery.triple_brain.search"
], function (Scenarios, UserMapAutocompleteProvider, $, $Search) {
    "use strict";
    describe("jquery.triple_brain.search", function () {
        it("doesn't fetch more info more than once", function () {
            var searchProvider = UserMapAutocompleteProvider.toFetchOnlyCurrentUserVerticesAndSchemas();
            var searchResult = searchProvider.formatResults(
                new Scenarios.getSearchResultsForImpact().get()
            )[0];
            var getMoreInfoSpy = spyOn(searchResult.provider,
                "getMoreInfoForSearchResult"
            ).and.callFake(function (searchResult, callback) {
                    callback({
                        conciseSearchResult: searchResult
                    });
                });
            expect(getMoreInfoSpy.calls.count()).toBe(0);
            var listHtml = $("<div>");
            $Search._onFocusAction(searchResult, listHtml);
            expect(getMoreInfoSpy.calls.count()).toBe(1);
            $Search._onFocusAction(searchResult, listHtml);
            expect(getMoreInfoSpy.calls.count()).toBe(1);
        });
    });
});