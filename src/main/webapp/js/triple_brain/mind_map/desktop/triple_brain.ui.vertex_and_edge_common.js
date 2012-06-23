if (triple_brain.ui.vertex_and_edge_common == undefined) {

    (function($) {
        triple_brain.ui.vertex_and_edge_common = {
            adjustTextFieldWidthToNumberOfChars: function(textField) {
                var nbCharacter = $(textField).val().length;
                var charWidth = $(textField).css('font-size').substring(0, 2);
                //i have not found a trick to calculate de good number. The first one represent the font size and the second the font to write
                //20=12  19=11  18=11  17=10  16=10  15=9  14=8  13=8  12=7  11=7  10=6
                var fontWithCorrection = 8;
                $(textField).css('width', ((nbCharacter + 1) * fontWithCorrection) + 2);
            },
            highlightLabel : function(id) {
                $("#" + id + " input[type=text]:first").css('color', 'black');
                $("#" + id + " input[type=text]:first").animate({color:'#32CD32'}, 2000);
                $("#" + id + " input[type=text]:first").animate({color:'black'}, 2000);
            }
        }

    })(jQuery);

}