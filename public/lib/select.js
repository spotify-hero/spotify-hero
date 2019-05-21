$(document).ready(function(){
    $("#tracklist td").click(function() {     
 
        var column_num = parseInt( $(this).index());
        var row_num = parseInt( $(this).parent().index());  
        
        console.log("ligne = " + row_num);
 
    });
});