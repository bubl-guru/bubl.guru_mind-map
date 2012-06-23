/**
 * Copyright Mozilla Public License 1.1
 */

if (triple_brain.ui.vertex_creator == undefined) {
    var eventBus = triple_brain.event_bus;
    triple_brain.ui.vertex_creator = {

        createWithArrayOfJsonHavingRelativePosition : function(jsonArray){
            for (var i in jsonArray) {
                var json = jsonArray[i];
                triple_brain.ui.vertex_creator.withArrayOfJsonHavingRelativePosition(
                    json
                ).create();
            }
        },

        withArrayOfJsonHavingAbsolutePosition : function(json){
            return new VertexCreator(json);
        },
        withArrayOfJsonHavingRelativePosition : function(json){
            triple_brain.ui.vertex_creator.addGraphOffsetToJsonPosition(json);
            return new VertexCreator(json);
        },
        addGraphOffsetToJsonPosition : function(json){
            json.position.x += triple_brain.ui.mind_map.offset().left;
            json.position.y += triple_brain.ui.mind_map.offset().top;
        }
    }

    function VertexCreator(json){
        json.id = triple_brain.id_uri.idFromUri(json.id);
        var html = triple_brain.template['vertex'].merge(json);
        this.create = function(){
            triple_brain.ui.graph.addHTML(
                html
            );
            createLabel();
            createMenu();
            var vertex = vertexFacade();
            $(html).hover(
                onMouseOver,
                onMouseOut
            );
            var graphCanvas = triple_brain.ui.graph.canvas();
            $(html).draggable({
                handle: ".move",
                containment: [
                    $(graphCanvas).position().left,
                    $(graphCanvas).position().top,
                    $(graphCanvas).width(),
                    $(graphCanvas).height()
                ],
                start : onDragStart,
                drag : onDrag,
                stop : onDragStop
            });

            $(html).mousedown(mouseDownToCreateRelationOrAddVertex);
            json.position.x -= $(html).width() / 2;
            json.position.y -= $(html).height() / 2;
            position();
            if(json.is_frontier_vertex_with_hidden_vertices){
                vertex.setNumberOfHiddenConnectedVertices(json.number_of_hidden_connected_vertices);
                vertex.setNameOfHiddenProperties(json.name_of_hidden_properties);
                vertex.buildHiddenNeighborPropertiesIndicator();
            }
            var vertex = vertexFacade();
            vertex.setNumberOfEdgesFromCentralVertex(json.min_number_of_edges_from_center_vertex);
            eventBus.publish(
                '/event/ui/html/vertex/created/',
                vertex
            );
            return vertex;
        }
        function createLabel(){
            var labelContainer = triple_brain.template['vertex_label_container'].merge(json);
            $(html).append(labelContainer);
            var label = $(labelContainer).find("input[type='text']:first");
            var vertex =  vertexFacade();
            vertex.readjustLabelWidth();
            $(label).draggable('disabled');

            if(vertex.hasDefaultText()){
                vertex.applyStyleOfDefaultText();
            }
            label.focus(function(e) {
                var vertex = vertexOfSubHtmlComponent(this);
                vertex.highlight();
                vertex.removeStyleOfDefaultText();
                if(vertex.hasDefaultText()){
                    $(this).val("");
                    vertex.readjustLabelWidth();
                }
            });
            label.blur(function(e) {
                var vertex = vertexOfSubHtmlComponent(this);
                if(!vertex.isMouseOver()){
                    vertex.unhighlight();
                }
                if($(this).val() == ""){
                    $(this).val(triple_brain.ui.vertex.EMPTY_LABEL);
                    vertex.applyStyleOfDefaultText();
                    vertex.readjustLabelWidth()
                }else{
                    vertex.removeStyleOfDefaultText();
                }
            });

            label.change(function(e) {
                triple_brain.vertex.updateLabel(vertexOfSubHtmlComponent(this), $(this).val());
            });

            label.keydown(function(e) {
                vertexOfSubHtmlComponent(this).readjustLabelWidth();
            });
            label.keyup(function(e) {
                var vertex = vertexOfSubHtmlComponent(this);
                vertex.readjustLabelWidth();
            });
        }

        function createMenu(){
            var vertexMenu = triple_brain.template['vertex_menu'].merge();
            $(html).append(vertexMenu);
            var menuListFirstCol = triple_brain.template['vertex_menu_list_first_col'].merge();
            var menuListSecondCol = triple_brain.template['vertex_menu_list_second_col'].merge();
            var menuListThirdCol = triple_brain.template['vertex_menu_list_third_col'].merge();
            $(vertexMenu).append(menuListFirstCol);
            $(vertexMenu).append(menuListSecondCol);
            $(vertexMenu).append(menuListThirdCol);

            var moveBtn = triple_brain.template['vertex_move_button'].merge();
            $(menuListFirstCol).append(moveBtn);

            var removeBtn = triple_brain.template['vertex_remove_button'].merge();
            $(menuListFirstCol).append(removeBtn);

            removeBtn.click(function(event) {
                event.stopPropagation();
                var vertex = vertexOfSubHtmlComponent(this);
                if(!vertex.isCenterVertex() && vertex.id() != "default"){
                    triple_brain.vertex.remove(vertex);
                }
            });

            var whatIsThisBtn = triple_brain.template['vertex_what_is_this_button'].merge();
            $(menuListSecondCol).append(whatIsThisBtn);
            whatIsThisBtn.click(function(event){
                event.stopPropagation();
                var vertex = vertexOfSubHtmlComponent(this);
                triple_brain.ui.identification_menu.ofVertex(vertex)
                    .create();
            });

            var suggestionsBtn = triple_brain.template['vertex_suggestion_button'].merge();
            $(menuListThirdCol).append(suggestionsBtn);
            suggestionsBtn.click(function(event){
                event.stopPropagation();
                var outOfVertexMenus = $('.peripheral-menu');
                $(outOfVertexMenus).remove();
                var vertex = vertexOfSubHtmlComponent(this);
                triple_brain.ui.suggestion_menu.ofVertex(vertex)
                    .create();

            });
            $(suggestionsBtn).hide();

            var centerBtn = triple_brain.template['vertex_center_button'].merge();
            $(menuListSecondCol).append(centerBtn);
            centerBtn.click(function() {
                triple_brain.drawn_graph.getWithNewCentralVertex(
                    vertexOfSubHtmlComponent(this)
                );
            });
        }

        function vertexOfSubHtmlComponent(htmlOfSubComponent){
            return triple_brain.ui.vertex.withHtml(
                $(htmlOfSubComponent).closest('.vertex')
            );
        }

        function position(){
            $(html).css('left', json.position.x);
            $(html).css('top', json.position.y);
        }

        function onDragStart(mouseDownEvent, ui){
            triple_brain.ui.mind_map.disableOverScroll();
            var canvasToMoveVertex = triple_brain.template['canvas_to_move_vertex'].merge();
            triple_brain.ui.graph.addHTML(
                canvasToMoveVertex
            );
            $(canvasToMoveVertex).attr('width', $("#graphCanvas").width());
            $(canvasToMoveVertex).attr('height', $("#graphCanvas").height());

            $('.edge').unbind('mouseenter mouseleave');
            $("#drawn_graph").data("edgesNormalStateZIndex", $('.edge').css('z-index'));
            $('.edge').css('z-index', '1');

            $('.vertex').unbind('mouseenter mouseleave');
            $("#drawn_graph").data("verticesNormalStateZIndex", $('.vertex').css('z-index'));
            $('.vertex').css('z-index', '1');

            $(html).addClass('highlighted-vertex');
            $(html).css('z-index', $("#drawn_graph").data("verticesNormalStateZIndex"));

            removeConnectedEdgesArrowLine();
        }

        function onDrag(dragEvent, ui){
            redrawConnectedEdgesArrowLine();
        }

        function onDragStop(dragStopEvent, ui){
            triple_brain.ui.mind_map.applyOverScroll();
            var canvasToMoveVertex = $("#canvasToMoveVertex");
            $(canvasToMoveVertex).remove();
            triple_brain.ui.edge.redrawAllEdges();
            var edgesNormalStateZIndex = $("#drawn_graph").data("edgesNormalStateZIndex");
            $('.edge').css('z-index', edgesNormalStateZIndex);
            $('.edge').hover(
                triple_brain.ui.edge.onMouseOver,
                triple_brain.ui.edge.onMouseOut
            );

            var verticesNormalStateZIndex = $("#drawn_graph").data("verticesNormalStateZIndex");
            $('.vertex').hover(onMouseOver, onMouseOut);
            $('.vertex').css('z-index', verticesNormalStateZIndex);
        }

        function removeConnectedEdgesArrowLine(){
            triple_brain.ui.graph.clear();
            var allEdges = triple_brain.ui.edge.allEdges();
            for(var i = 0; i < allEdges.length; i++){
                var edge = allEdges[i];
                if(!edge.isConnectedWithVertex(vertexFacade())){
                    edge.arrowLine().drawInContextWithDefaultStyle(
                        triple_brain.ui.graph.canvasContext()
                    );
                }
            }
        }
        function redrawConnectedEdgesArrowLine(){
            triple_brain.ui.all.clearCanvas(
                triple_brain.ui.graph.canvasToMoveAVertex()
            );
            var connectedEdges = vertexFacade().connectedEdges();
            for(var i = 0; i < connectedEdges.length; i++){
                var edge = connectedEdges[i];
                edge.setArrowLine(
                    triple_brain.ui.arrow_line.ofSourceAndDestinationVertex(
                        edge.sourceVertex(),
                        edge.destinationVertex()
                    )
                );
                edge.centerOnArrowLine();
                edge.arrowLine().drawInContextWithDefaultStyle(
                    triple_brain.ui.graph.canvasContextToMoveAVertex()
                );
            }
        }

        function onMouseOver(){
            var vertex = vertexOfSubHtmlComponent(this);
            vertex.highlight();
        }

        function onMouseOut(){
            var vertex = vertexOfSubHtmlComponent(this)
            if(!vertex.isLabelInFocus()){
                vertex.unhighlight();
            }
        }

        function mouseDownToCreateRelationOrAddVertex(mouseDownEvent){
            triple_brain.ui.mind_map.disableOverScroll();
            var sourceVertex = vertexFacade();
            if(sourceVertex.isMouseOverLabel() || sourceVertex.isMouseOverMoveButton()){
                return;
            }
            var canvasForRelation = triple_brain.template['canvas_for_relation'].merge();
            var graphCanvas = triple_brain.ui.graph.canvas();
            $(canvasForRelation).attr('width', $(graphCanvas).width());
            $(canvasForRelation).attr('height', $(graphCanvas).height());
            $(canvasForRelation).css('margin-left', $(graphCanvas).css('margin-left'));
            $(canvasForRelation).css('margin-top', $(graphCanvas).css('margin-top'));
            triple_brain.ui.graph.addHTML(canvasForRelation);
            var canvasContextForRelation = canvasForRelation[0].getContext("2d");
            $('.edge').unbind('mouseenter mouseleave');
            var normalStateEdgesZIndex = $('.edge').css('z-index');
            $('.edge').css('z-index', '1');
            var relationMouseMoveEvent;
            var relationEndPoint = triple_brain.point.centeredAtOrigin();
            $(canvasForRelation).mousemove(function(mouseMoveEvent) {
                sourceVertex.highlight();
                relationMouseMoveEvent = mouseMoveEvent;
                triple_brain.ui.all.clearCanvas(canvasForRelation);
                canvasContextForRelation.beginPath();
                relationEndPoint = triple_brain.point.fromCoordinates(
                    mouseMoveEvent.pageX,
                    mouseMoveEvent.pageY
                )

                var arrowLine = triple_brain.ui.arrow_line.withSegment(
                    triple_brain.segment.withStartAndEndPoint(
                        sourceVertex.centerPoint(),
                        relationEndPoint
                    )
                );
                arrowLine.drawInContextWithDefaultStyle(canvasContextForRelation);
            });

            $('[data-role=page]').mouseup(function(mouseUpEvent) {
                triple_brain.ui.mind_map.applyOverScroll();
                $('.edge').hover(triple_brain.ui.edge.onMouseOver, triple_brain.ui.edge.onMouseOut);
                $('.edge').css('z-index', normalStateEdgesZIndex);
                $(canvasForRelation).remove();
                $(this).unbind(mouseUpEvent);
                var isMouseOverAVertex = $(".vertex:hover").size() > 0;
                if (isMouseOverAVertex) {
                    var destinationVertex = triple_brain.ui.vertex.withHtml($(".vertex:hover"));
                    if (!sourceVertex.equalsVertex(destinationVertex)) {
                        sourceVertex.unhighlight();
                        triple_brain.edge.add(sourceVertex, destinationVertex);
                    }
                }else{
                    sourceVertex.unhighlight();
                    triple_brain.vertex.addRelationAndVertexAtPositionToVertex(sourceVertex, relationEndPoint);
                }
            });
        }

        function vertexFacade(){
            return triple_brain.ui.vertex.withHtml(html);
        }


    }
}