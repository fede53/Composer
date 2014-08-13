(function($) {
	
        info = {id: null, id_lista_elementi:"moduli", id_drop_zone:"struttura"};        
	opz = {title: 'aAS', onEndStart:null};
        
        elementi = {"Grigle" : {
                        "griglia1x1" : {
                            tipo:"griglia1x1",
                            classe:"griglie"
                        },
                        "griglia1x2" : {
                            tipo:"griglia1x2",
                            classe:"griglie"
                        },                        
                        "griglia1x3" : {
                            tipo:"griglia1x3",
                            classe:"griglie"
                        }                 
                    }, 
                    "Elementi grafici" : {
                        "immagine" : {
                            tipo:"immagine",
                            classe:"elementi"
                        }    
                    }}; 
        
        
	
	$.fn.Composer = function(){
                info.id = this;
		if(typeof arguments[0] == 'string'){
			switch(arguments[0]){
				case 'start':
					start();
				break;
			}
		}
		else if(typeof arguments[0] == 'object'){
			opz = $.extend({},opz,arguments[0]);
		}
		else if(typeof arguments[0] == 'string' && typeof arguments[1] == 'string'){
			opz2 = {}
			opz2[arguments[0]] = arguments[1];
			opz = $.extend({},opz,opz2);
		}
		else if(typeof arguments[0] == 'function'){
			arguments[0]();
		}
		
		start();
	}
	
	start = function(){
                        build_structure();
                        
			if(typeof opz.onEndStart == 'function'){
				opz.onEndStart();
			}
		}
		
		
	build_structure = function(){
            
                HTML_composer = "<div id=\""+info.id_lista_elementi+"\">";
                
            for (var key in elementi) {
                
                HTML_composer += "<h2><a href=\"#\">"+key+"</a></h2>"; 
                HTML_composer += "<div><ul>";
                
                    for (var key_child in elementi[key]) {
                      
                            HTML_composer += "<li id=\""+elementi[key][key_child].tipo+"\" class=\""+elementi[key][key_child].classe+"\">"+key_child+"</li>";
                       
                    }
                HTML_composer += "</ul></div>";
                    
                }
                
                HTML_composer += "</div>";           
            
                      
                HTML_composer += "<div id=\""+info.id_drop_zone+"\"><ol></ol></div>";
                
                HTML_composer += "<div id=\"dialog\"><form id=\"myform\"><div id=\"form_elementi\"></div></form></div>";	
                
		$(info.id).html(HTML_composer);

	}		
		
	check_elementi = function(){
            num_elementi = $("#"+info.id_drop_zone+" ol li[class!=placeholder]").length;
            if(num_elementi>0) $( "#"+info.id_drop_zone+" ol" ).find( ".placeholder" ).remove(); 
            else  $("#"+info.id_drop_zone+" ol").html("<li class='placeholder'>Trascina qui gli elementi che vuoi inserire</li>");
        }		
	
})(jQuery);