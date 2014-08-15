(function($) {
// VARIABILI PER SELEZIONARE L'ELEMENTO    
    var id_selezionato = "";
    var tipologia_elemento_selezionato = "";       
    var macro_elemento_selezionato = "";
    
// ARRAY GENERALE DELLE GRIGLIE, DELLE DROP ZONE E DEGLI ELEMENTI DROPPATI
    var griglie_droppate = new Array(); 
    var drop_zone = new Array();
    var elementi_droppati = new Array();
    
    info = {id: null, id_lista_elementi: "moduli", id_drop_zone: "struttura", id_dialog: "dialog"};
    diciture = {trascina: "Trascina qui gli elementi che vuoi inserire"};

// MACRO CATEGORIE     
    macro_elementi = { 
            griglie : { 
                dicitura : "Grigle",
                classe_accettate : ".griglie"
            },
            componenti : { 
                dicitura : "Componenti"
            }          
    };
    
// ELEMENTI DRAGGABILI
    elementi = {
                "griglia1x1": {
                        tipo: "griglia1x1",
                        macro_elemento: "griglie",
                        drop_zone: 1,
                        classe_accettate : ".componenti"
                },
                "griglia1x2": {
                        tipo: "griglia1x2",
                        macro_elemento: "griglie",
                        drop_zone: 2,
                        classe_accettate : ".componenti"
                },
                "griglia1x3": {
                        tipo: "griglia1x3",
                        macro_elemento: "griglie",
                        drop_zone: 3,
                        classe_accettate : ".componenti"
                },
                "immagine": {
                        tipo: "immagine",
                        macro_elemento: "componenti",
                        titolo_modale: "Info immagine",
                        larghezza: "500",
                        form : {
                            "src" : { 
                                    label_txt : "Src", 
                                    type : "input", 
                                    name : "src", 
                                    id : "src"  },
                            "altezza" : { 
                                    label_txt : "Altezza", 
                                    type : "input", 
                                    name : "altezza", 
                                    id : "altezza"}
                        }
                }
            }; 

$.fn.Composer = function() {
        info.id = this;
        start();
}
        
//AVVIO DEL COMPOSER 
        start = function() {
                build_structure();
        }

// CREAZIONE DEGLI ELEMENTI CHE COMPONGONO IL COMPOSER
        build_structure = function() {
                
                console.log('build_structure');                 
                
                // COSTRUZIONE ACCORDION SX PER LA SELEZIONE DEGLI ELEMENTI DRAGGABILI 
                $("<div/>").attr("id",info.id_lista_elementi).appendTo(info.id);
                               
                for (var key in macro_elementi) {                    
                        $("<a />").text(macro_elementi[key].dicitura).attr("href","#").appendTo("#"+info.id_lista_elementi).wrap("<h2 />");
                        $("<ul />").attr("id", key).appendTo("#"+info.id_lista_elementi).wrap("<div />");
                }        
                        
                for (var key_child in elementi) {                                                 
                        $("<li />").attr("id", elementi[key_child].tipo)
                                   .attr("class", elementi[key_child].macro_elemento)
                                   .attr("macro_elemento", elementi[key_child].macro_elemento)
                                   .text(key_child)
                                   .appendTo("#"+elementi[key_child].macro_elemento);
                }
                
                // CREAZIONE ELEMENTO PER IL DROP DEI VARI ELEMENTI    
                $("<div />").attr("id",info.id_drop_zone).appendTo(info.id);
                $("<ol />").appendTo("#"+info.id_drop_zone);
                
                // FINESTRA DIALOGO
                $("<div />").attr("id",info.id_dialog).appendTo(info.id);
                $("<form />").appendTo("#"+info.id_dialog);               
               
                
                check_elementi();

                $("#"+info.id_lista_elementi).accordion();

                $("#"+info.id_lista_elementi+" ul > li").draggable({
                        appendTo: "body",
                        helper: "clone"
                });

                $("#"+info.id_drop_zone+" ol").droppable({
                        activeClass: "",
                        hoverClass: "place-holder-hover",
                        accept: macro_elementi.griglie.classe_accettate,
                        drop: function(event, ui) {
                                                                            
                                console.log("drop "+ui.draggable.attr("id"));
                                
                                // SCRIVO NELL'ARRAY "griglie_droppate" E INSERISCO LA STRUTTURA HTML 
                                ordine = griglie_droppate.length;
                                nuovo_elemento = {ordine : ordine,
                                                  id : "griglia_"+ordine,
                                                  tipo : ui.draggable.attr("id"),
                                                  macro_elemento : ui.draggable.attr("macro_elemento")                                                   
                                                 };                                 
                                griglie_droppate.push(nuovo_elemento); 
                                
                                $("<li />").addClass("sortable").attr("id","griglia_"+ordine).appendTo(this);
                                
                                // SCRIVO NELL'ARRAY "drop_zone" E INSERISCO LA STRUTTURA HTML
                                if(elementi[ui.draggable.attr("id")].drop_zone>0){
                                    $("<ol />").addClass(ui.draggable.attr("id")).appendTo("#griglia_"+ordine);   
                                    for(i=0; i<elementi[ui.draggable.attr("id")].drop_zone; i++){
                                        nuovo_elemento = {ordine : drop_zone.length,
                                                          id : "drop_zone_"+drop_zone.length,
                                                          griglia_appartenenza : ordine                                                 
                                                         };                                                                                   
                                        $("<li />").addClass("droppable").attr("id","drop_zone_"+drop_zone.length).appendTo("#griglia_"+ordine+" ol");
                                        drop_zone.push(nuovo_elemento);  
                                    }   
                                }                             
                               
                                console.log(griglie_droppate);
                                console.log(drop_zone);
                                
                                check_elementi();
                                afterDrop();
                        }

                }).sortable({
                        items: "li.sortable:not(.placeholder)",
                        handle: ".sort",
                        sort: function() {
                                $(this).removeClass("ui-state-default");
                        }
                });


                dialog = $("#dialog-form").dialog({autoOpen: false, modal: true});
        }
        
// AZIONE DOPO IL DROP DEGLI ELEMENTI
        afterDrop = function(id) {
            
            // SCRIVO NELL'ARRAY "elementi_droppati" E INSERISCO LA STRUTTURA HTML
            for (var key_child in elementi){
                
                if(elementi[key_child].macro_elemento=="griglie"){
                    
                    $("."+elementi[key_child].tipo+" .droppable").droppable({
                            activeClass: "",
                            hoverClass: "place-holder-elementi-hover",
                            accept: elementi[key_child].classe_accettate,
                            drop: function(event, ui) {

                                    console.log("drop "+ui.draggable.attr("id"));
                                    ordine = elementi_droppati.length;    
                                    nuovo_elemento = {id : "elemento_"+ordine,
                                                      drop_zone: $(this).attr("id"),
                                                      tipo : ui.draggable.attr("id")                                                 
                                                     };                                 
                                    elementi_droppati.push(nuovo_elemento); 
                                    console.log(elementi_droppati);

                                    $(struttura_moduli(ui.draggable.attr("id")), ordine).appendTo(this);                       

                                    check_elementi();
                                    afterDrop();
                            }

                    });   
                } 
            }
        }  

// AZIONE DOPO IL DROP DEGLI ELEMENTI
        check_elementi = function() {
                num_elementi = $("#" + info.id_drop_zone + " ol li[class!=placeholder]").length;
                if (num_elementi > 0)
                        $("#" + info.id_drop_zone + " ol").find(".placeholder").remove();
                else
                        $("#" + info.id_drop_zone + " ol").html("<li class='placeholder'>"+diciture.trascina+"</li>");
        }


// AZIONE DOPO IL DROP DEGLI ELEMENTI
        struttura_moduli = function(id, numero_elemento) {
                var html_struttura_moduli;
                var html_puls = "<div class='controls clearfix'><a href='#' class='sort'>+</a><a href='#' class='delete'>cancella</a></div>";
                var html_puls_elementi = "<div class='controls_elementi clearfix'><a href='#' class='edit_elementi'>modifica</a><a href='#' class='delete_elementi'>cancella</a></div>";
                switch (id) {
                        case "immagine":
                                html_struttura_moduli = "<div id='elemento_" + numero_elemento + "' class='img_placeholder' title='immagine'>" + html_puls_elementi + "</div>";
                                numero_elemento++;
                        break;
                }
                return html_struttura_moduli;
        }

// APRO FINESTRA DI DIALOGO A SECONDA DELL'ELEMENTO
        open_dialog = function() {
                dialog.dialog("option", "title", elementi["Elementi grafici"][tipologia_elemento_selezionato].titolo_modale);

                carica_form();

                dialog.dialog("option", "width", elementi["Elementi grafici"][tipologia_elemento_selezionato].larghezza);
                dialog.dialog("option", "buttons", [{text: "Salva", click: function() {
                                        salva_form();
                                        $(this).dialog("close");
                                }}, {text: "Chiudi", click: function() {
                                        $(this).dialog("close");
                                }}]);
                dialog.dialog("open");
        }


// AJAX CHE CARICA IL FORM A SECONDA DELL'ELEMENTO
        carica_form = function() {
                $.ajax({
                        type: "POST",
                        url: "./ajax.php",
                        data: 'opz=0&tipologia_elemento_selezionato=' + tipologia_elemento_selezionato,
                        success: function(msg) {
                                $('#form_elementi').html(msg);
                        }
                });
        }

// AJAX CHE SALVE IL FORM
        salva_form = function() {
                parametri = carica_parametri('myform');
                $.ajax({
                        type: "POST",
                        url: "./ajax.php",
                        data: 'opz=1&tipologia_elemento_selezionato=' + tipologia_elemento_selezionato + '&id_selezionato=' + id_selezionato + parametri,
                        success: function(msg) {
                                eval(msg);
                        }
                });
        }

// FUNZIONE CHE SCORRE IL FORM E PRENDE I VALORI PER LE FUNZIONI AJAX
        carica_parametri = function(form) {

                var parametri = "";
                var nElementi = document.getElementById(form).elements.length;
                for (i = 0; i < nElementi; i++) {

                        switch (document.getElementById(form).elements[i].type) {
                                case 'password':
                                case 'file':
                                case 'select':
                                case 'select-one':
                                case 'option':
                                case 'text':
                                case 'hidden':
                                        parametri += "&" + document.getElementById(form).elements[i].name + "=" + encodeURIComponent(document.getElementById(form).elements[i].value);
                                        break;
                                case 'select-multiple':
                                        for (var c = 0; c <= document.getElementById(form).elements[i].options.length - 1; c++) {
                                                if (document.getElementById(form).elements[i].options[c].selected) {
                                                        parametri += "&" + document.getElementById(form).elements[i].name + "[" + c + "]=" + document.getElementById(form).elements[i].options[c].value;
                                                }
                                        }
                                        break;
                                case 'checkbox':
                                        parametri += "&" + document.getElementById(form).elements[i].name + "=" + 1 * document.getElementById(form).elements[i].checked;
                                        break;
                                case 'radio':
                                        if (document.getElementById(form).elements[i].checked == true) {
                                                parametri += "&" + document.getElementById(form).elements[i].name + "=" + document.getElementById(form).elements[i].value;
                                                break;
                                        }
                                default:
                                        break;
                        }
                }

                return  parametri;

        }
})(jQuery);