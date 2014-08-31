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
                                
                                if(!ui.draggable.hasClass( "sortable" )){
                       
                                // SCRIVO NELL'ARRAY "griglie_droppate" E INSERISCO LA STRUTTURA HTML 
                                id_n = contatore_griglie_droppate;                                                    
                                ordine = conta_elementi_array(griglie_droppate);                                
                                macro_elemento = ui.draggable.attr("macro_elemento");
                                id_elemento = macro_elemento+"_"+id_n;
                                tipo = ui.draggable.attr("id");
                                contatore_griglie_droppate++;
                                
                                
                                griglie_droppate[id_n]= { 'ordine' : ordine,
                                                          'id' : id_elemento,
                                                          'tipo': tipo,
                                                          'macro_elemento' : macro_elemento
                                                        };
                                
                                if(opz.debug_single_action) console.log("drop "+id_elemento);
                                                                
                                $("<li />").addClass(macro_elemento).addClass("sortable").attr("id",id_elemento).appendTo(this);
                                
                                // PULSANTI AZIONI 
                                if(typeof elementi[tipo].controls != "undefined"){                              
                                    if(Object.keys(elementi[tipo].controls).length>0){                                       
                                    $("<div />").addClass(elementi[tipo].classe_controls).attr("id","controls_"+id_n).appendTo("#"+id_elemento);                               
                                        for (var key_child in elementi[tipo].controls) {                                   
                                            $("<a />").text(elementi[tipo].controls[key_child].testo)
                                                      .addClass(elementi[tipo].controls[key_child].classe)
                                                      .attr("href","#")
                                                      .appendTo("#controls_"+id_n);    
                                        } 
                                    }
                                }
                                
                                // INSERISCO LA STRUTTURA HTML                               
                                if(elementi[tipo].drop_zone>0){
                                    $("<ol />").addClass(tipo).appendTo("#"+id_elemento);   
                                    for(i=0; i<elementi[tipo].drop_zone; i++){                                                                                 
                                        $("<li />").addClass("drop_zone").addClass("droppable")
                                                                         .attr("drop_zone", "drop_zone_"+i)
                                                                         .appendTo("#"+id_elemento+" ol");          
                                    }   
                                } 
                               
                                azioniPulsanti(id_elemento, macro_elemento);                                
                                check_elementi();
                                afterDrop();
                                
                            }
                        }
,
                                                          'valore' : ""
                }).sortable({
                        items: "li.sortable:not(.placeholder)",
                        handle: ".sort",
                        update: function() {                               
                                $(this).removeClass("ui-state-default");
                                arrayId = $(this).sortable( "toArray" );
                                
                                for(y=0; y<arrayId.length; y++){
                                    posizione = trova_posizione(griglie_droppate,arrayId[y]);  
                                    griglie_droppate[posizione]['ordine'] = y;                                    
                                }
                                if(opz.debug_mode){
                                    console.log(griglie_droppate); 
                                    console.log(elementi_droppati);
                                }    
                        }
                });
                
                               
                dialog = $("#dialog").dialog({autoOpen: false, modal: true});
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
                                    macro_elemento = ui.draggable.attr("macro_elemento");
                                    id_elemento = macro_elemento+"_"+id_n;
                                    griglia = $(this).parent().parent().attr("id");
                                    drop_zone = $(this).attr("drop_zone");
                                    tipo = ui.draggable.attr("id"); 
                                    
                                    ordine = 0;
                                    for(a=0; a<elementi_droppati.length;a++){  
                                        if(typeof elementi_droppati[a] !== 'undefined') {
                                            if(griglia==elementi_droppati[a]['griglia'] && drop_zone==elementi_droppati[a]['drop_zone']){
                                                ordine++;
                                            }
                                        }    
                                    }

                                    contatore_elementi_droppati++;   
                                    
                                    elementi_droppati[id_n] = {'ordine': ordine,
                                                               'id': id_elemento, 
                                                               'griglia': griglia, 
                                                               'drop_zone': drop_zone, 
                                                               'tipo': tipo,
                                                               'valore' : {}};                                                 
                                                                               
                                    if(opz.debug_single_action) console.log("drop "+id_elemento);

                                    $(struttura_moduli(tipo, id_n, ui.draggable.attr("macro_elemento"))).appendTo(this);  
                                  
                                    // PULSANTI AZIONI
                                    if(typeof elementi[tipo].controls != "undefined"){
                                        if(Object.keys(elementi[tipo].controls).length>0){
                                            $("<div />").addClass(elementi[tipo].classe_controls).attr("id","controls_elementi_"+id_n).appendTo("#"+id_elemento);                               
                                            for (var key_child in elementi[tipo].controls) {                                   
                                                $("<a />").text(elementi[tipo].controls[key_child].testo)
                                                          .addClass(elementi[tipo].controls[key_child].classe)
                                                          .attr("href","#")
                                                          .appendTo("#controls_elementi_"+id_n);    
                                            }
                                        }
                                    }
                                    azioniPulsanti(id_elemento, macro_elemento, griglia);

                            }

                    });   
                } 
            } 
        } 
    
    
// FUNZIONE CHE ATTRIBUISCE LE AZIONI AI PULSANTI
        azioniPulsanti = function(id,tipo,griglia) {              
            switch(tipo){
                case "griglie":                  
                    $("#"+id+" .delete").click(function() {
                        
                            posizione = trova_posizione(griglie_droppate,id);
                            delete griglie_droppate[posizione];                            
                            $("#"+id).remove();
                            
                            if(opz.debug_single_action) console.log("cancello "+id);
                            if(opz.debug_single_action) console.log("verifico se ha degli elementi all'interno");
                            
                            
                            // RIASSEGNO ORDINE
                            if(griglie_droppate.length>0){
                                i=0;
                                for(a=0; a<griglie_droppate.length;a++){  
                                    if(typeof griglie_droppate[a] !== 'undefined') {
                                        griglie_droppate[a]['ordine'] = i; 
                                        i++;
                                    }    
                                }
                            }
                            
                            // CANCELLO ELEMENTI ALL'INTERNO DELLA GRIGLIA
                            if(elementi_droppati.length>0){
                                for(a=0; a<elementi_droppati.length;a++){
                                    if(typeof elementi_droppati[a] !== 'undefined') {
                                        if(id==elementi_droppati[a].griglia){
                                            console.log("cancello "+elementi_droppati[a]['id']);
                                            delete elementi_droppati[a];                                  
                                            a--;
                                        }
                                    }
                                }  
                            }
                            check_elementi(); 
                            
                            if(opz.debug_mode){
                                console.log(griglie_droppate); 
                                console.log(elementi_droppati);
                            }                            
                    });  
                break;
                
                case "componenti":  
                    $("#"+id+" .delete").click(function() {
                        
                            posizione = trova_posizione(elementi_droppati,id);
                            drop_zone = elementi_droppati[posizione]['drop_zone']; 
                            griglia = elementi_droppati[posizione]['griglia']; 
                            
                            delete elementi_droppati[posizione];                            
                            $("#"+id).remove();
                            
                            if(opz.debug_single_action) console.log("cancello "+id);
                            
                            // RIASSEGNO ORDINE                           
                            if(elementi_droppati.length>0){
                                assegna=0;
                                for(a=0; a<elementi_droppati.length;a++){
                                    if(typeof elementi_droppati[a] !== 'undefined') {
                                        if(griglia==elementi_droppati[a]['griglia'] && drop_zone==elementi_droppati[a]['drop_zone']){
                                            elementi_droppati[a]['ordine'] = assegna;  
                                            assegna++;
                                        } 
                                    }    
                                }
                            }
                            
                            if(opz.debug_mode){
                                console.log(griglie_droppate); 
                                console.log(elementi_droppati);
                            }                         
                    });
                    
                    $("#"+id+" .edit").click(function() {
                        id_selezionato = id;
                        posizione = trova_posizione(elementi_droppati,id);
                        tipo = elementi_droppati[posizione]['tipo']; 
                        open_dialog();                                                    
                    });                    
                    
                    
                break;  
            }
            
            if(opz.debug_mode){
                console.log(griglie_droppate); 
                console.log(elementi_droppati);
            }  
        }        
        
// SE NN CI SONO GRIGLIE INSERISCO LA DICITURA DI DEFAULT
        check_elementi = function() {
                num_elementi = $("#" + info.id_drop_zone + " ol li[class!=placeholder]").length;
                if (num_elementi > 0)
                        $("#" + info.id_drop_zone + " ol").find(".placeholder").remove();
                else
                        $("#" + info.id_drop_zone + " ol").html("<li class='placeholder'>"+diciture.trascina+"</li>");
        }


// STRUTTURA MODULI
        struttura_moduli = function(id, numero_elemento, macro_elemento) {
                
                var html_struttura_moduli;
                
                switch (id) {
                        case "immagine":
                                html_struttura_moduli = "<div id='"+macro_elemento+"_" + numero_elemento + "' class='"+macro_elemento+" img_placeholder' title='immagine'></div>";
                        break;
                }
                return html_struttura_moduli;
        }
        
 // TROVA POSIZIONE ID ALL'INTERNO DELL'ARRAY
        trova_posizione = function(array, id) {
                for(i=0; i < array.length; i++){
                    if(typeof array[i] !== 'undefined') {
                        if(array[i]['id']==id){
                            return i;
                            break;
                        }                         
                    }                    
                }
        } 
        
 // CONTO GLI ELEMENTI ALL'INTERNO DELL'ARRAY
        conta_elementi_array = function(array) {
                var elementi=0;
                for(i=0; i < griglie_droppate.length; i++){
                    if(typeof array[i] !== 'undefined') {
                        elementi++;                           
                    }                    
                }
                return elementi;
        }       
        

// APRO FINESTRA DI DIALOGO A SECONDA DELL'ELEMENTO
        open_dialog = function() {
                posizione = trova_posizione(elementi_droppati,id_selezionato);
                tipo = elementi_droppati[posizione]['tipo']; 
            
                dialog.dialog("option", "title", elementi[tipo].titolo_modale);
                dialog.dialog("option", "width", elementi[tipo].larghezza);
                
                $('#dialog form').html('');
                
                if(Object.keys(elementi[tipo].form).length>0){
                var append = "";                
                    for (var key_child in elementi[tipo].form) { 
                        append += "<label>"+elementi[tipo].form[key_child].label_txt+"</label>";
                        switch(elementi[tipo].form[key_child].type){
                            case "input":
                                append += "<input value='"+((typeof elementi_droppati[posizione]["valore"][elementi[tipo].form[key_child].name] !== 'undefined')? elementi_droppati[posizione]["valore"][elementi[tipo].form[key_child].name] : '' )+"' name='"+elementi[tipo].form[key_child].name+"' id='"+elementi[tipo].form[key_child].id+"' type='"+elementi[tipo].form[key_child].type+"' />";    
                            break;
                            
                        }
                    }                
                }
                $('#dialog form').append(append);        
                
                
                dialog.dialog("option", "buttons", [{text: "Salva", click: function() {
                                        salva_form();
                                        $(this).dialog("close");                                                                       
                                }}, {text: "Chiudi", click: function() {
                                        $(this).dialog("close");
                                        id_selezionato = "";
                                }}]);
                dialog.dialog("open");
        }
        
 // SALVO LE INFORMAZIONE DEL FORM NELL'ARRAY
        salva_form = function() {  
            valori = $('#dialog form').serializeArray();
            posizione = trova_posizione(elementi_droppati,id_selezionato);
            
            if(valori.length>0){
                for(i=0; i<valori.length; i++){
                    console.log(valori[i]['value']);
                    elementi_droppati[posizione]["valore"][valori[i]['name']] = valori[i]['value'];
                }
            } 
            update_elementi();  
            
            if(opz.debug_mode){
                console.log(griglie_droppate); 
                console.log(elementi_droppati);
            } 
        } 
        
 // SALVO LE INFORMAZIONE DEL FORM NELL'ARRAY
        update_elementi = function() {   
            
            posizione = trova_posizione(elementi_droppati,id_selezionato);
            tipo = elementi_droppati[posizione]['tipo'];

            switch(tipo){
                case "immagine":
                    if(elementi_droppati[posizione]["valore"]['src']){
                        $('#'+id_selezionato).removeClass('img_placeholder');
                        $('#'+id_selezionato).addClass('cover');
                        $('#'+id_selezionato).css('background-image','url('+elementi_droppati[posizione]["valore"]['src']+')');
                    } else {
                        $('#'+id_selezionato).removeClass('cover');
                        $('#'+id_selezionato).addClass('img_placeholder');
                        $('#'+id_selezionato).css('background-image','url(./images/pictures.png');  
                        
                    } 
                    if(elementi_droppati[posizione]["valore"]['altezza']){
                        $('#'+id_selezionato).css('height', elementi_droppati[posizione]["valore"]['altezza']+'px');
                    } else {
                        $('#'+id_selezionato).css('height', '300px');
                    }
 
                    
                break;    
                
            }            
            id_selezionato = ""; 
        }
})(jQuery);