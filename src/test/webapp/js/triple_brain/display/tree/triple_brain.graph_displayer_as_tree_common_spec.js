/*
 * Copyright Mozilla Public License 1.1
 */
define([
    'triple_brain.graph_displayer_as_tree_common'
], function (TreeDisplayerCommon) {
    var vertexA;
    var vertexB;
    var vertexC;
    var abcGraph;
    describe("graph_displayer_as_tree_common", function () {
        it("duplicates vertices if graph is not a tree", function () {
            initLinearAbcGraph();
            TreeDisplayerCommon.defineChildrenInVertices(
                abcGraph,
                vertexA.id
            );
            expect(numberOfVertices()).toBe(3);
            initLinearAbcGraph();
            addEdge(
                makeEdgeBetween(vertexC, vertexA)
            );
            TreeDisplayerCommon.defineChildrenInVertices(
                abcGraph,
                vertexA.id
            );
            expect(numberOfVertices()).toBe(4);
        });
    });
    function centerVertex(){
        return vertexInGraphWithId(vertexA.id);
    }
    function vertexInGraphWithId(vertexId){
        return abcGraph.vertices[vertexId];
    }
    function numberOfVertices(){
        return 1 + getNumberOfChildren(centerVertex());
        function getNumberOfChildren(vertex){
            var numberOfChildren = 0;
            $.each(vertex.children, function(){
                var child = this;
                numberOfChildren++;
                numberOfChildren += getNumberOfChildren(vertexInGraphWithId(
                    child.vertexUri
                ));
            });
            return numberOfChildren;
        }
    }
    function initLinearAbcGraph() {
        abcGraph = {
            vertices: {},
            edges:[]
        };
        vertexA = addVertex(
            makeVertex("vertex a")
        );
        vertexB = addVertex(
            makeVertex("vertex b")
        );
        vertexC = addVertex(
            makeVertex("vertex c")
        );
        addEdge(
            makeEdgeBetween(vertexA, vertexB)
        );
        addEdge(
            makeEdgeBetween(vertexB, vertexC)
        );
        return abcGraph;
    }
    function addEdge(edge){
        abcGraph.edges.push(
            edge
        );
        return edge;
    }

    function addVertex(vertex){
        abcGraph.vertices[vertex.id] = vertex;
        return vertex;
    }
    function makeEdgeBetween(sourceVertex, destinationVertex){
        return {
            id :  generateEdgeUri(),
            source_vertex_id : sourceVertex.id,
            destination_vertex_id : destinationVertex.id,
            label : "between " + sourceVertex.label + " and " + destinationVertex.label
        }
    }

    function makeVertex(label){
        return  {
            id : generateVertexUri(),
            label : label,
            same_as : [],
            suggestions : [],
            types : []
        };
    }
    function generateVertexUri(){
        return baseUri() + "/vertex/" + generateUuid();
    }

    function generateEdgeUri(){
        return baseUri() + "/edge/" + generateUuid();
    }

    function baseUri(){
        return "/service/users/some-user/graph";
    }

    function generateUuid(){
        //taken from http://stackoverflow.com/a/2117523/600313
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
});

