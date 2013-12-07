/*
 * Copyright Mozilla Public License 1.1
 */

window.config = {
    baseUrl: 'js',
    urlArgs: "bust=" + 10,
    paths: {
        module : '../module',
        "jquery" : "jquery/jquery-2.0.3",
        "jquery-ui" : "jquery/jquery-ui-10-2/jquery-ui.min",
        "jquery.url" : "jquery/jquery.url",
        "jquery.nano" : "jquery/jquery.nano",
        "jquery.json.min" : "jquery/jquery.json.min",
        "jquery.tinysort.min" : "jquery/jquery.tinysort.min",
        "jquery.cookie" :  "jquery/jquery.cookie",
        "jquery.colorbox" : "jquery/jquery.colorbox-min",
        "jquery.cursor-at-end" : "jquery/jquery.cursor-at-end",
        "jquery.center-on-screen" : "jquery/jquery.center-on-screen",
        "jquery.is-fully-on-screen" : "jquery/jquery.is-fully-on-screen",
        "org/cometd" : "cometd/cometd",
        "jquery.cometd" : "jquery/cometd/jquery.cometd",
        "jquery.cometd-ack" : "jquery/cometd/jquery.cometd-ack",
        "jquery.cometd-reload" : "jquery/cometd/jquery.cometd-reload",
        "jquery.cometd-timestamp" : "jquery/cometd/jquery.cometd-timestamp",
        "jquery.cometd-timesync" : "jquery/cometd/jquery.cometd-timesync",
        "org/cometd/AckExtension" : "cometd/plugins/AckExtension",
        "org/cometd/ReloadExtension" : "cometd/plugins/ReloadExtension",
        "org/cometd/TimeStampExtension" : "cometd/plugins/TimeStampExtension",
        "org/cometd/TimeSyncExtension" : "cometd/plugins/TimeSyncExtension",
        "jquery.i18next" : "plugins/i18next.amd.withJQuery-1.6.3",
        "twitter_bootstrap" : "plugins/twitter_bootstrap/3-0/js/bootstrap.min",
        "jquery.triple_brain.search" : "triple_brain/search/jquery.triple_brain.search",
        "triple_brain.object_utils" : "triple_brain/triple_brain.object_utils",
        "triple_brain.keyboard_utils" : "triple_brain/triple_brain.keyboard_utils",
        "triple_brain.selection_handler" : "triple_brain/triple_brain.selection_handler",
        "triple_brain.scroll_on_mouse_frontier" : "triple_brain/triple_brain.scroll_on_mouse_frontier",
        "triple_brain.top_center_menu" : "triple_brain/triple_brain.top_center_menu",
        "triple_brain.language_manager" : "triple_brain/triple_brain.language_manager",
        "triple_brain.external_page_loader" : "triple_brain/triple_brain.external_page_loader",
        "triple_brain.menu" : "triple_brain/triple_brain.menu",
        "triple_brain.graph_element_button" : "triple_brain/triple_brain.graph_element_button",
        "triple_brain.graph_element_main_menu" : "triple_brain/triple_brain.graph_element_main_menu",
        "triple_brain.graph_element_menu" : "triple_brain/triple_brain.graph_element_menu",
        "triple_brain.ui.utils" : "triple_brain/triple_brain.ui.utils",
        "triple_brain.user" : "triple_brain/triple_brain.user",
        "triple_brain.login_handler" : "triple_brain/triple_brain.login_handler",
        "triple_brain.registration_handler" : "triple_brain/triple_brain.registration_handler",
        "triple_brain.event_bus" : "triple_brain/triple_brain.event_bus",
        "jquery.triple_brain.drag_scroll" : "triple_brain/jquery.triple_brain.drag_scroll",
        "triple_brain.bubble_distance_calculator" : "triple_brain/graph/triple_brain.bubble_distance_calculator",
        "triple_brain.ui.graph" : "triple_brain/graph/triple_brain.ui.graph",
        "triple_brain.ui.vertex" : "triple_brain/graph/vertex/triple_brain.ui.vertex",
        "triple_brain.ui.vertex_segments" : "triple_brain/graph/vertex/triple_brain.ui.vertex_segments",
        "triple_brain.search" : "triple_brain/search/triple_brain.search",
        "triple_brain.ui.search" : "triple_brain/search/triple_brain.ui.search",
        "triple_brain.freebase_autocomplete_provider" : "triple_brain/search/autocomplete_results_provider/triple_brain.freebase_autocomplete_provider",
        "triple_brain.user_map_autocomplete_provider" : "triple_brain/search/autocomplete_results_provider/triple_brain.user_map_autocomplete_provider",
        "triple_brain.ui.depth_slider" : "triple_brain/triple_brain.ui.depth_slider",
        "triple_brain.mind-map_template" : "triple_brain/triple_brain.mind-map_template",
        "triple_brain.config" : "triple_brain/triple_brain.config",
        "triple_brain.id_uri" : "triple_brain/triple_brain.id_uri",
        "triple_brain.straight_and_square_edge_drawer" : "triple_brain/graph/edge/triple_brain.straight_and_square_edge_drawer",
        "triple_brain.straight_arrow_edge_drawer" : "triple_brain/graph/edge/triple_brain.straight_arrow_edge_drawer",
        "triple_brain.graph_element" : "triple_brain/graph/triple_brain.graph_element",
        "triple_brain.ui.graph_element" : "triple_brain/graph/triple_brain.ui.graph_element",
        "triple_brain.vertex" : "triple_brain/graph/vertex/triple_brain.vertex",
        "triple_brain.ui.edge" : "triple_brain/graph/edge/triple_brain.ui.edge",
        "triple_brain.edge" : "triple_brain/graph/edge/triple_brain.edge",
        "triple_brain.suggestion" : "triple_brain/triple_brain.suggestion",
        "triple_brain.external_resource" : "triple_brain/triple_brain.external_resource",
        "triple_brain.identification_context" : "triple_brain/triple_brain.identification_context",
        "triple_brain.ui.identification_menu" : "triple_brain/graph/triple_brain.ui.identification_menu",
        "triple_brain.link_to_far_vertex_menu" : "triple_brain/graph/vertex/triple_brain.link_to_far_vertex_menu",
        "triple_brain.included_graph_elements_menu" : "triple_brain/graph/vertex/triple_brain.included_graph_elements_menu",
        "triple_brain.ui.suggestion_menu" : "triple_brain/graph/vertex/triple_brain.ui.suggestion_menu",
        "triple_brain.image_displayer" : "triple_brain/graph/vertex/triple_brain.image_displayer",
        "triple_brain.delete_menu" : "triple_brain/graph/triple_brain.delete_menu",
        "triple_brain.image_menu" : "triple_brain/graph/vertex/triple_brain.image_menu",
        "triple_brain.ui.all" : "triple_brain/triple_brain.ui.all",
        "triple_brain.point" : "triple_brain/triple_brain.point",
        "triple_brain.segment" : "triple_brain/triple_brain.segment",
        "triple_brain.ui.vertex_hidden_neighbor_properties_indicator" : "triple_brain/graph/vertex/hidden_neighbor_properties/triple_brain.ui.vertex_hidden_neighbor_properties_indicator",
        "triple_brain.ui.vertex_and_edge_common" : "triple_brain/graph/triple_brain.ui.vertex_and_edge_common",
        "triple_brain.freebase" : "triple_brain/triple_brain.freebase",
        "triple_brain.transform_matrix_2d" : "triple_brain/triple_brain.transform_matrix_2d",
        "triple_brain.error" : "triple_brain/triple_brain.error",
        "triple_brain.ui.triple" : "triple_brain/graph/triple_brain.ui.triple",
        "triple_brain.template" : "triple_brain/triple_brain.template",
        "triple_brain.ui.vertex_hidden_neighbor_properties_indicator_dashed_segment" : "triple_brain/graph/vertex/hidden_neighbor_properties/triple_brain.ui.vertex_hidden_neighbor_properties_indicator_dashed_segment",
        "triple_brain.ui.left_panel" : "triple_brain/triple_brain.ui.left_panel",
        "triple_brain.image" : "triple_brain/triple_brain.image",
        "triple_brain.server_subscriber" : "triple_brain/triple_brain.server_subscriber",
        "triple_brain.graph" : "triple_brain/graph/triple_brain.graph",
        "triple_brain.graph_displayer" : "triple_brain/display/triple_brain.graph_displayer",
        "triple_brain.graph_displayer_factory" : "triple_brain/display/triple_brain.graph_displayer_factory",
        "triple_brain.vertex_html_builder_common" : "triple_brain/display/triple_brain.vertex_html_builder_common",
        "triple_brain.vertex_menu_handler_common" : "triple_brain/display/triple_brain.vertex_menu_handler_common",
        "triple_brain.graph_displayer_as_absolute_tree" : "triple_brain/display/tree/absolute/triple_brain.graph_displayer_as_absolute_tree",
        "triple_brain.graph_displayer_as_relative_tree" : "triple_brain/display/tree/relative/triple_brain.graph_displayer_as_relative_tree",
        "triple_brain.relative_tree_graph_menu_handler" : "triple_brain/display/tree/relative/triple_brain.relative_tree_graph_menu_handler",
        "triple_brain.graph_element_menu_handler" : "triple_brain/display/triple_brain.graph_element_menu_handler",
        "triple_brain.edge_html_builder_for_relative_tree" : "triple_brain/display/tree/relative/triple_brain.edge_html_builder_for_relative_tree",
        "triple_brain.edge_html_builder_view_only_for_relative_tree_displayer" : "triple_brain/display/tree/relative/triple_brain.edge_html_builder_view_only_for_relative_tree_displayer",
        "triple_brain.relative_tree_vertex" : "triple_brain/display/tree/relative/triple_brain.relative_tree_vertex",
        "triple_brain.relative_tree_vertex_menu_handler" : "triple_brain/display/tree/relative/triple_brain.relative_tree_vertex_menu_handler",
        "triple_brain.vertex_html_builder_for_tree_displayer" : "triple_brain/display/tree/relative/triple_brain.vertex_html_builder_for_tree_displayer",
        "triple_brain.vertex_html_builder_view_only_for_relative_tree_displayer" : "triple_brain/display/tree/relative/triple_brain.vertex_html_builder_view_only_for_relative_tree_displayer",
        "triple_brain.relative_tree_displayer_templates" : "triple_brain/display/tree/relative/triple_brain.relative_tree_displayer_templates",
        "triple_brain.tree_edge" : "triple_brain/display/tree/triple_brain.tree_edge",
        "triple_brain.tree_edge_menu_handler" : "triple_brain/display/tree/triple_brain.tree_edge_menu_handler",
        "triple_brain.tree_vertex" : "triple_brain/display/tree/triple_brain.tree_vertex",
        "triple_brain.graph_displayer_as_tree_common" : "triple_brain/display/tree/triple_brain.graph_displayer_as_tree_common",
        "triple_brain.mind_map_info" : "triple_brain/triple_brain.mind_map_info"
    },
    shim : {
        "jquery-ui" : ["jquery"],
        "jquery.url" : ["jquery"],
        "jquery.nano" : ["jquery"],
        "jquery.json.min" : ["jquery"],
        "jquery.tinysort.min" : ["jquery"],
        "jquery.cookie" :  ["jquery"],
        "jquery.cometd" : ["jquery"],
        "jquery.cometd-ack" : ["jquery"],
        "jquery.cometd-reload" : ["jquery"],
        "jquery.cometd-timestamp" : ["jquery"],
        "jquery.cometd-timesync" : ["jquery"],
        "jquery.colorbox" : ["jquery"],
        "twitter_bootstrap" : ["jquery"]
    }
};

requirejs.config(window.config);