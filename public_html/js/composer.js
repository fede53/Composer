(function($) {
// VARIABILI PER SELEZIONARE L'ELEMENTO    
    var id_selezionato = "";
    var tipologia_elemento_selezionato = "";       
    var macro_elemento_selezionato = "";
    
// ARRAY GENERALE DELLE GRIGLIE, DELLE DROP ZONE E DEGLI ELEMENTI DROPPATI
    var griglie_droppate = new Array(); 
    var elementi_droppati = new Array();
    var contatore_griglie_droppate = 0;
    var contatore_elementi_droppati = 0;
    
    info = {id: null, id_lista_elementi: "moduli", id_drop_zone: "struttura", id_dialog: "dialog"};
    opz = {debug_mode: true, debug_single_action: true};
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
                        classe_accettate : ".componenti",
                        classe_controls : "controls",
                        controls : {
                            sort : {
                                testo : "+",
                                classe : "sort"
                            },
                            cancella : {
                                testo : "cancella",
                                classe : "delete"
                            }                            
                        }                     
                },
                "griglia1x2": {
                        tipo: "griglia1x2",
                        macro_elemento: "griglie",
                        drop_zone: 2,
                        classe_accettate : ".componenti",
                        classe_controls : "controls",
                        controls : {
                            sort : {
                                testo : "+",
                                classe : "sort"
                            },
                            cancella : {
                                testo : "cancella",
                                classe : "delete"
                            }                            
                        } 
                },
                "griglia1x3": {
                        tipo: "griglia1x3",
                        macro_elemento: "griglie",
                        drop_zone: 3,
                        classe_accettate : ".componenti",
                        classe_controls : "controls",
                        controls : {
                            sort : {
                                testo : "+",
                                classe : "sort"
                            },
                            cancella : {
                                testo : "cancella",
                                classe : "delete"
                            }                            
                        } 
                },
                "immagine": {
                        tipo: "immagine",
                        macro_elemento: "componenti",
                        titolo_modale: "Info immagine",
                        larghezza: "500",
                        classe_controls : "controls_elementi",
                        controls : {
                            sort : {
                                testo : "modifica",
                                classe : "edit"
                            },
                            cancella : {
                                testo : "cancella",
                                classe : "delete"
                            }                            
                        },
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
                
                if(opz.debug_single_action) console.log('build_structure');                 
                
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
                                                                            
                       
                                // SCRIVO NELL'ARRAY "griglie_droppate" E INSERISCO LA STRUTTURA HTML 
                                id_n = contatore_griglie_droppate;
                                contatore_griglie_droppate++; 
                                
                                ordine = griglie_droppate.length;
                                
                                nuovo_elemento = {ordine : ordine,
                                                  id : "griglia_"+id_n,
                                                  tipo : ui.draggable.attr("id"),
                                                  macro_elemento : ui.draggable.attr("macro_elemento")
                                                 };                                 
                                griglie_droppate[id_n] = nuovo_elemento; 
                                
                                if(opz.debug_single_action) console.log("drop griglia_"+id_n);
                                                                
                                $("<li />").addClass("griglia").addClass("sortable").attr("id","griglia_"+id_n).appendTo(this);
                                
                                // PULSANTI AZIONI 
                                if(typeof elementi[ui.draggable.attr("id")].controls != "undefined"){                              
                                    if(Object.keys(elementi[ui.draggable.attr("id")].controls).length>0){                                       
                                    $("<div />").addClass(elementi[ui.draggable.attr("id")].classe_controls).attr("id","controls_"+id_n).appendTo("#griglia_"+id_n);                               
                                        for (var key_child in elementi[ui.draggable.attr("id")].controls) {                                   
                                            $("<a />").text(elementi[ui.draggable.attr("id")].controls[key_child].testo)
                                                      .addClass(elementi[ui.draggable.attr("id")].controls[key_child].classe)
                                                      .attr("href","#")
                                                      .appendTo("#controls_"+id_n);    
                                        } 
                                    }
                                }
                                
                                // SCRIVO NELL'ARRAY "drop_zone" E INSERISCO LA STRUTTURA HTML                               
                                if(elementi[ui.draggable.attr("id")].drop_zone>0){
                                    $("<ol />").addClass(ui.draggable.attr("id")).appendTo("#griglia_"+id_n);   
                                    for(i=0; i<elementi[ui.draggable.attr("id")].drop_zone; i++){                                                                                 
                                        $("<li />").addClass("drop_zone").addClass("droppable")
                                                                         .attr("drop_zone", "drop_zone_"+i)
                                                                         .appendTo("#griglia_"+id_n+" ol");          
                                    }   
                                } 

                                if(opz.debug_mode) console.log(griglie_droppate);
                                stampo_array();
                                
                                azioniPulsanti("#griglia_"+id_n, ui.draggable.attr("macro_elemento"), "griglia_"+id_n);
                                
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

                                    
                                    id_n = contatore_elementi_droppati;                                   
                                    contatore_elementi_droppati++;
                                    
                                    ordine = 0;
                                    for(a=0; a<elementi_droppati.length;a++){  
                                        if($(this).parent().parent().attr("id")==elementi_droppati[a].griglia && $(this).attr("drop_zone")==elementi_droppati[a].drop_zone){
                                            ordine++;
                                        }
                                    }    
                                    
                                    nuovo_elemento = {ordine : ordine,
                                                      id : ui.draggable.attr("macro_elemento")+"_"+id_n,
                                                      griglia: $(this).parent().parent().attr("id"),
                                                      drop_zone: $(this).attr("drop_zone"),
                                                      tipo : ui.draggable.attr("id")                                                 
                                                     };                                 
                                    elementi_droppati[id_n] = nuovo_elemento;
                                    if(opz.debug_single_action) console.log("drop "+ui.draggable.attr("macro_elemento")+"_"+id_n);
                                    if(opz.debug_mode) console.log(elementi_droppati);

                                    $(struttura_moduli(ui.draggable.attr("id"), id_n, ui.draggable.attr("macro_elemento"))).appendTo(this);  
                                  
                                    // PULSANTI AZIONI
                                    if(typeof elementi[ui.draggable.attr("id")].controls != "undefined"){
                                        if(Object.keys(elementi[ui.draggable.attr("id")].controls).length>0){
                                            $("<div />").addClass(elementi[ui.draggable.attr("id")].classe_controls).attr("id","controls_elementi_"+id_n).appendTo("#"+ui.draggable.attr("macro_elemento")+"_"+id_n);                               
                                            for (var key_child in elementi[ui.draggable.attr("id")].controls) {                                   
                                                $("<a />").text(elementi[ui.draggable.attr("id")].controls[key_child].testo)
                                                          .addClass(elementi[ui.draggable.attr("id")].controls[key_child].classe)
                                                          .attr("href","#")
                                                          .appendTo("#controls_elementi_"+id_n);    
                                            }
                                        }
                                    }
                                    azioniPulsanti("#"+ui.draggable.attr("macro_elemento")+"_"+id_n, ui.draggable.attr("macro_elemento"), $(this).parent().parent().attr("id"));

                                    stampo_array();
                            }

                    });   
                } 
            } 
        } 
    
    
// FUNZIONE CHE ATTRIBUISCE LE AZIONI AI PULSANTI
        azioniPulsanti = function(id,tipo,griglia) {  
            
            
            switch(tipo){
                case "griglie":                  
                    $(id+" .delete").click(function() {
                        
                            $(this).parents('li').remove();
                            
                            griglia = $(this).parent().parent().attr("id");
                            id_griglia = parseInt(griglia.replace(tipo+"_",""));

                            posizione_griglia_in_array = griglie_droppate.indexOf(id_griglia);   
                            griglie_droppate.splice(posizione_griglia_in_array, 1);
                            
                            if(opz.debug_single_action) console.log("cancello "+griglia);
                            if(opz.debug_single_action) console.log("verifico se ha degli elementi all'interno");
                            posizioni_da_cancellare = new Array();
                            
                            // RIASSEGNO ORDINE
                            for(a=0; a<griglie_droppate.length;a++){  
                                griglie_droppate[a].ordine = a;                                
                            }
                            
                            for(a=0; a<elementi_droppati.length;a++){  
                                if(griglia==elementi_droppati[a].griglia){
                                    posizione_elemento_in_array = elementi_droppati.indexOf(elementi_droppati[a]);
                                    console.log("cancello "+elementi_droppati[a].id);
                                    elementi_droppati.splice(posizione_elemento_in_array, 1);                                    
                                    a--;
                                }
                            }  
                            check_elementi();                   
                            stampo_array();  
                            
                            
                    });                     
                break;
                
                case "componenti":  
                    $(id+" .delete").click(function() {
                        
                            $(this).parent().parent().remove();

                            componente = $(this).parent().parent().attr("id");
                            id_componente = parseInt(componente.replace(tipo+"_",""));   
                            
                            
                            for(a=0; a<elementi_droppati.length;a++){ 
                                if(componente==elementi_droppati[a].id){
                                    drop_zone = elementi_droppati[a].drop_zone; 
                                }
                            } 
                           
                            posizione_componente_in_array = elementi_droppati.indexOf(id_componente);  
                            elementi_droppati.splice(posizione_componente_in_array, 1);
                            
                            if(opz.debug_single_action) console.log("cancello "+componente);
                            
                            // RIASSEGNO ORDINE
                            assegna=0;
                            for(a=0; a<elementi_droppati.length;a++){ 
                                if(griglia==elementi_droppati[a].griglia && drop_zone==elementi_droppati[a].drop_zone){
                                    elementi_droppati[a].ordine = assegna;  
                                    assegna++;
                                }                                                
                            }
               
                            stampo_array();
                        
                    });                     
                break;                 
            }
            
            if(opz.debug_mode){
                console.log(griglie_droppate); 
                console.log(elementi_droppati);
            }            
    
        }        
        
       
 // AZIONE DOPO IL DROP DEGLI ELEMENTI
        stampo_array = function() {
            var array_esploso = "";
                for(i=0; i<griglie_droppate.length;i++){                
                    array_esploso += "ordine: "+griglie_droppate[i].ordine+"<br>";
                    array_esploso += "id: "+griglie_droppate[i].id+"<br>";
                    array_esploso += "tipo: "+griglie_droppate[i].tipo+"<br>";
                    array_esploso += "macro_elemento: "+griglie_droppate[i].macro_elemento+"<br><br>";
                
                    for(a=0; a<elementi_droppati.length;a++){  
                        if(griglie_droppate[i].id==elementi_droppati[a].griglia){
                            array_esploso += "- ordine: "+elementi_droppati[a].ordine+"<br>";
                            array_esploso += "- id: "+elementi_droppati[a].id+"<br>";
                            array_esploso += "- griglia: "+elementi_droppati[a].griglia+"<br>";
                            array_esploso += "- drop_zone: "+elementi_droppati[a].drop_zone+"<br>";
                            array_esploso += "- tipo: "+elementi_droppati[a].tipo+"<br>";
                            
                        }
                        
                    }          
               
                array_esploso += "<br>";
                }
                
            $('#stampo_array').html(array_esploso);    
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
        struttura_moduli = function(id, numero_elemento, macro_elemento) {
                
                var html_struttura_moduli;
                
                switch (id) {
                        case "immagine":
                                html_struttura_moduli = "<div id='"+macro_elemento+"_" + numero_elemento + "' class='"+macro_elemento+" img_placeholder' title='immagine'></div>";
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