/*
 * Copyright Vincent Blouin under the GPL License version 3
 */

define([
    'test/test-scenarios',
    'test/test-utils',
    'test/mock',
    "triple_brain.graph_displayer_as_relative_tree",
    "triple_brain.center_bubble",
    "triple_brain.vertex_html_builder",
    "triple_brain.edge_html_builder",
    "triple_brain.graph_element"
], function (Scenarios, TestUtils, Mock, GraphDisplayerAsRelativeTree, CenterBubble, VertexHtmlBuilder, EdgeHtmlBuilder, GraphElement) {
    "use strict";
    describe("graph_displayer_as_relative_tree_spec", function () {
        var threeBubblesGraph,
            bubble1,
            bubble2,
            graphWithHiddenSimilarRelationsScenario,
            groupRelation,
            graphWithSimilarRelationsScenario,
            mergeBubbleScenario,
            karaokeSchemaScenario,
            distantGraphScenario;
        beforeEach(function () {
            threeBubblesGraph = new Scenarios.threeBubblesGraph();
            distantGraphScenario = new Scenarios.getDistantGraph();
            bubble1 = threeBubblesGraph.getCenterBubbleInTree();
            bubble2 = threeBubblesGraph.getBubble2InTree();
            graphWithHiddenSimilarRelationsScenario = new Scenarios.getGraphWithHiddenSimilarRelations();
            mergeBubbleScenario = new Scenarios.mergeBubbleGraph();
            graphWithSimilarRelationsScenario = new Scenarios.GraphWithSimilarRelationsScenario();
            groupRelation = graphWithSimilarRelationsScenario.getPossessionAsGroupRelationInTree();
            karaokeSchemaScenario = new Scenarios.getKaraokeSchemaGraph();
        });

        it("distributes triples evenly to the right and left", function () {
            var centerBubble = CenterBubble.usingBubble(bubble1);
            expect(
                centerBubble._getNumberOfImmediateBubblesToLeft()
            ).toBe(1);
            expect(
                centerBubble._getNumberOfImmediateBubblesToRight()
            ).toBe(1);
        });

        it("distributes new triples evenly to the right and left", function () {
            var firstAddedEdge = TestUtils.addTriple(bubble1).edge(),
                secondAddedEdge = TestUtils.addTriple(bubble1).edge();
            expect(
                firstAddedEdge.isToTheLeft()
            ).toBeFalsy();
            expect(
                secondAddedEdge.isToTheLeft()
            ).toBeTruthy();
        });

        it("appends to group relation when expanding", function () {
            expect(
                groupRelation.hasChildren()
            ).toBeFalsy();
            GraphDisplayerAsRelativeTree.expandGroupRelation(
                groupRelation
            );
            expect(
                groupRelation.hasChildren()
            ).toBeTruthy();
        });

        it("groups similar relations when they come out of an expanded bubble", function () {
            var bubble2 = graphWithHiddenSimilarRelationsScenario.getBubble2InTree();
            expect(
                bubble2.hasHiddenRelationsContainer()
            ).toBeTruthy();
            graphWithHiddenSimilarRelationsScenario.expandBubble2(
                bubble2
            );
            expect(
                bubble2.hasHiddenRelationsContainer()
            ).toBeFalsy();
            expect(
                bubble2.getTopMostChildBubble().isGroupRelation()
            ).toBeTruthy();
        });

        it("preserves direction with parent vertex for expanded group relations", function () {
            GraphDisplayerAsRelativeTree.expandGroupRelation(
                groupRelation
            );
            expect(
                graphWithSimilarRelationsScenario.getRelationWithBook1InTree().isInverse()
            ).toBeFalsy();
            expect(
                graphWithSimilarRelationsScenario.getRelationWithBook2InTree().isInverse()
            ).toBeTruthy();
        });
        it("removes hidden properties indicator when expanding group relation", function () {
            expect(
                groupRelation.hasHiddenRelationsContainer()
            ).toBeTruthy();
            GraphDisplayerAsRelativeTree.expandGroupRelation(
                groupRelation
            );
            expect(
                groupRelation.hasHiddenRelationsContainer()
            ).toBeFalsy();
        });
        it("contains all connected elements for included graph elements view", function () {
            expect(
                mergeBubbleScenario.getBubble1()
            ).toBeDefined();
            expect(
                mergeBubbleScenario.getRelation1()
            ).toBeDefined();
            expect(
                mergeBubbleScenario.getBubble2()
            ).toBeDefined();
            expect(
                mergeBubbleScenario.getBubble4()
            ).toBeDefined();
            expect(
                mergeBubbleScenario.getRelation4()
            ).toBeDefined();
            expect(
                mergeBubbleScenario.getRelation2()
            ).toBeDefined();
            expect(
                mergeBubbleScenario.getBubble3()
            ).toBeDefined();
        });
        it("can show a bubble suggestions", function () {
            var locationSuggestion = karaokeSchemaScenario.getLocationPropertyAsSuggestion();
            bubble2.setSuggestions(
                [
                    locationSuggestion
                ]
            );
            GraphDisplayerAsRelativeTree.showSuggestions(bubble2);
            var relationSuggestion = bubble2.getTopMostChildBubble(),
                vertexSuggestion = relationSuggestion.getTopMostChildBubble();
            expect(
                relationSuggestion.text()
            ).toBe("location");
            expect(
                vertexSuggestion.getIdentifications()[0].getLabel()
            ).toBe("Location");
        });
        it("can make a vertex connect to a distant vertex", function () {
            connectDistantVertexTest(function (distantBubble) {
                var connectedBubble = distantBubble.getTopMostChildBubble().getTopMostChildBubble();
                expect(
                    connectedBubble.text()
                ).toBe("b2");
            });
        });

        it("groups similar relations when connecting to a distant vertex, ", function () {
            connectDistantVertexTest(function (distantBubble) {
                var connectedBubble = distantBubble.getTopMostChildBubble().getTopMostChildBubble();
                var tShirtBubble = new Scenarios.TreeQuerier(
                    connectedBubble.getChildrenContainer()
                ).getGroupRelationWithLabelInTree("T-shirt");
                expect(
                    tShirtBubble.isGroupRelation()
                ).toBeTruthy();
            });
        });
        it("shows child bubbles images of a distant vertex when connecting to a distant vertex", function () {
            connectDistantVertexTest(function (distantBubble) {
                var connectedBubble = distantBubble.getTopMostChildBubble().getTopMostChildBubble();
                expect(
                    connectedBubble.hasImagesMenu()
                ).toBeTruthy();
            });
        });
        it("selects new relation when connecting to a distant vertex", function () {
            connectDistantVertexTest(function (distantBubble) {
                var newRelation = distantBubble.getTopMostChildBubble();
                expect(
                    newRelation.isRelation()
                ).toBeTruthy();
                expect(
                    newRelation.isSelected()
                ).toBeTruthy();
            });
        });

        it("does not duplicate the hidden relation image of a child bubble when creating a distant relationship", function () {
            var bubble1 = graphWithHiddenSimilarRelationsScenario.getBubble1InTree();
            var bubble2 = TestUtils.getChildWithLabel(
                bubble1, "r1"
            ).getTopMostChildBubble();
            expect(
                getNumberOfHiddenPropertiesContainer(
                    bubble2
                )
            ).toBe(1);
            connectBubbleToDistantBubbleWithUriAndGraphWhenConnected(
                bubble1,
                graphWithHiddenSimilarRelationsScenario.getDistantBubbleUri(),
                graphWithHiddenSimilarRelationsScenario.getDistantBubbleGraphWhenConnectedToBubble1(),
                function (bubble1) {
                    bubble2 = TestUtils.getChildWithLabel(
                        bubble1, "r1"
                    ).getTopMostChildBubble();
                    expect(
                        getNumberOfHiddenPropertiesContainer(
                            bubble2
                        )
                    ).toBe(1);
                }
            );
        });

        it("contains all elements for deep circular graph", function () {
            var deepGraphWithCircularity = new Scenarios.deepGraphWithCircularity();
            expect(
                deepGraphWithCircularity.getBubble3InTree()
            ).toBeDefined();
            expect(
                deepGraphWithCircularity.getBubble2InTree()
            ).toBeDefined();
            expect(
                deepGraphWithCircularity.getBubble4InTree()
            ).toBeDefined();
            expect(
                deepGraphWithCircularity.getBubble1InTree()
            ).toBeDefined();
        });
        it("can have duplicate relations", function () {
            var duplicateRelationsScenario = new Scenarios.graphWithARelationInTwoSimilarRelationsGroup(),
                impact3InIndividualContext = duplicateRelationsScenario.getImpact3RelationInTheImpactOnTheIndividualContext(),
                impact3InSocietyContext = duplicateRelationsScenario.getImpact3RelationInTheImpactOnSocietyContext();
            expect(
                impact3InIndividualContext.getUri()
            ).toBe(
                impact3InSocietyContext.getUri()
            );
            expect(
                impact3InIndividualContext.getId()
            ).not.toBe(
                impact3InSocietyContext.getId()
            );
        });
        it("completes build of new graph elements when adding new edge and vertex", function () {
            var parent = new Scenarios.threeBubblesGraph().getBubble1InTree();
            var destinationVertex = TestUtils.generateVertex();
            var edge = TestUtils.generateEdge(
                parent.getUri(),
                destinationVertex.getUri()
            );
            var spyOnVertexCompleteBuild = spyOn(VertexHtmlBuilder, "completeBuild");
            var spyOnEdgeCompleteBuild = spyOn(EdgeHtmlBuilder, "afterChildBuilt");
            GraphDisplayerAsRelativeTree.addEdgeAndVertex(
                parent,
                edge,
                destinationVertex
            );
            expect(
                spyOnEdgeCompleteBuild.calls.count()
            ).toBe(1);
            expect(
                spyOnVertexCompleteBuild.calls.count()
            ).toBe(1);
        });
        it("completes the build of a property after adding one", function () {
            var schema = new Scenarios.getProjectSchema().getSchemaInTree();
            var propertyUi = GraphDisplayerAsRelativeTree.addProperty(
                GraphElement.withUri(
                    TestUtils.generateVertexUri()
                ),
                schema
            );
            expect(
                propertyUi.getIdentifications().length
            ).toBe(0);
        });

        function connectDistantVertexTest(callback) {
            connectBubbleToDistantBubbleWithUriAndGraphWhenConnected(
                distantGraphScenario.getBubbleInTree(),
                graphWithHiddenSimilarRelationsScenario.getBubble2().getUri(),
                graphWithHiddenSimilarRelationsScenario.getB2GraphWhenConnectedToDistantBubble(),
                callback
            );
        }

        function connectBubbleToDistantBubbleWithUriAndGraphWhenConnected(currentBubble, distantBubbleUri, graphOfDistantBubble, callback) {
            Mock.setGetGraphFromService(
                graphOfDistantBubble
            );
            var hasVisitedCallback = false;
            GraphDisplayerAsRelativeTree.connectVertexToVertexWithUri(
                currentBubble,
                distantBubbleUri,
                function () {
                    hasVisitedCallback = true;
                    callback(currentBubble);
                }
            );
            expect(
                hasVisitedCallback
            ).toBeTruthy();
        }

        function getNumberOfHiddenPropertiesContainer(bubble) {
            return bubble.getHtml().find(
                ".hidden-properties-container"
            ).length;
        }
    });
});