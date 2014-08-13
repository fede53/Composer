// VARIABILI INIZIALI
var numero_elemento = 0;
var id_selezionato = "";
var tipologia_elemento_selezionato = "";

// ARRAY TIPOLOGIE ELEMENTI
/*
0 -> titolo modale
0 -> larghezza modale
*/
var tipi_elementi = new Array();
tipi_elementi['immagine'] = new Array("Info immagine","500");


// READY
/*
- controllo se ci sono elementi nella lista #struttura
- avvio il dragable
- avvio il droppable/sortable
- avvio la finestra di dialogo
*/
$( document ).ready(function() {
		   
check_elementi();		   
		   
$( "#moduli" ).accordion();

$( "#moduli ul > li" ).draggable({
	appendTo: "body",
	helper: "clone"
});

$( "#struttura ol" ).droppable({
		activeClass: "",
		hoverClass: "place-holder-hover",
		accept: ".griglie",
		
		drop: function( event, ui ) {			
			$( ""+struttura_moduli(ui.draggable.attr("id"))+"").appendTo( this );
			check_elementi();		
			afterDrop();
		}
		
}).sortable({
		items: "li.sortable:not(.placeholder)",
		handle: ".sort",
		sort: function() {
			$( this ).removeClass( "ui-state-default" );
		}
	});

	
	dialog = $( "#dialog-form" ).dialog({autoOpen: false, modal: true});

});

// CONTROLLO SE CI SONO ELEMENTI NELLA LISTA #STRUTTURA
function check_elementi(){
	num_elementi = $("#struttura ol li[class!=placeholder]").length;
	if(num_elementi>0) $( "#struttura ol" ).find( ".placeholder" ).remove(); 
	else  $("#struttura ol").html("<li class='placeholder'>Trascina qui gli elementi che vuoi inserire</li>");
}

// APRO FINESTRA DI DIALOGO A SECONDA DELL'ELEMENTO
function open_dialog(){
	dialog.dialog( "option", "title", tipi_elementi[tipologia_elemento_selezionato][0]);
	
	carica_form();
	
	dialog.dialog( "option", "width", tipi_elementi[tipologia_elemento_selezionato][1] );	
	dialog.dialog( "option", "buttons", [ { text: "Salva", click: function() { salva_form(); $( this ).dialog( "close" ); } },{ text: "Chiudi", click: function() { $( this ).dialog( "close" ); } } ] );
	dialog.dialog( "open" );	
}


// AJAX CHE CARICA IL FORM A SECONDA DELL'ELEMENTO
function carica_form(){
	$.ajax({
		  type: "POST",
		  url: "./ajax.php",
		  data: 'opz=0&tipologia_elemento_selezionato='+tipologia_elemento_selezionato,
		  success: function(msg){
			$('#form_elementi').html(msg);
		  }
	});
}

// AJAX CHE SALVE IL FORM
function salva_form(){
	parametri = carica_parametri('myform');
	$.ajax({
		  type: "POST",
		  url: "./ajax.php",
		  data: 'opz=1&tipologia_elemento_selezionato='+tipologia_elemento_selezionato+'&id_selezionato='+id_selezionato+parametri,
		  success: function(msg){
			eval(msg);
		  }
	});
}

// FUNZIONE LANCIATA DOPO IL DROP DELLE GRIGLIE
function afterDrop(){
	
	$( ".delete" ).click(function() {
		$(this).parents('li').remove();	
		check_elementi();	
	});
	
	$( ".edit_elementi" ).click(function() {
		id_selezionato = $(this).parents('div').parents('div').attr("id");
		tipologia_elemento_selezionato = $(this).parents('div').parents('div').attr("title");
		open_dialog();
	});	
	
	$( ".delete_elementi" ).click(function() {
		$(this).parents('li').remove();	
		check_elementi();	
	});	
	
	
	$( ".droppable" ).droppable({
			activeClass: "",
			hoverClass: "place-holder-elementi-hover",
			accept: ".elementi",
			
			drop: function( event, ui ) {			
				$( ""+struttura_moduli(ui.draggable.attr("id"))+"").appendTo( this );
				check_elementi();		
				afterDrop();
			}
			
	});	
	
}

// FUNZIONE CHE SCORRE IL FORM E PRENDE I VALORI PER LE FUNZIONI AJAX
function carica_parametri(form){
var parametri = "";	
var nElementi=document.getElementById(form).elements.length;
	for(i=0;i<nElementi;i++){
	
		switch(document.getElementById(form).elements[i].type){
			case 'password':
			case 'file':
			case 'select':
			case 'select-one':
			case 'option':
			case 'text':
			case 'hidden': parametri += "&"+document.getElementById(form).elements[i].name+"="+encodeURIComponent(document.getElementById(form).elements[i].value);break;
			case 'select-multiple':
			for (var c=0; c <= document.getElementById(form).elements[i].options.length-1; c++) {
				if (document.getElementById(form).elements[i].options[c].selected) {
				parametri += "&"+document.getElementById(form).elements[i].name+"["+c+"]="+document.getElementById(form).elements[i].options[c].value;
				}
			}
			break;
			case 'checkbox':parametri += "&"+document.getElementById(form).elements[i].name+"="+1*document.getElementById(form).elements[i].checked;break;
			case 'radio':if(document.getElementById(form).elements[i].checked==true){
			parametri += "&"+document.getElementById(form).elements[i].name+"="+document.getElementById(form).elements[i].value;break;
			}
			default:break;		
			}
	}

return  parametri;

}

// DOPO IL DROP CARICA STRUTTURA HTML A SECONDA DELL'ELEMENTO
function struttura_moduli(id){
	
	var html_struttura_moduli;
	
	var html_puls = "<div class='controls clearfix'><a href='#' class='sort'>+</a><a href='#' class='delete'>cancella</a></div>";
	
	var html_puls_elementi = "<div class='controls_elementi clearfix'><a href='#' class='edit_elementi'>modifica</a><a href='#' class='delete_elementi'>cancella</a></div>";
	
		switch (id){
			case "griglia1x1":
				html_struttura_moduli = "<li class='sortable'>"+html_puls+"<ol class='griglia1x1'><li class='droppable'></li></ol></li>";
			break;
			case "griglia1x2":
				html_struttura_moduli = "<li class='sortable'>"+html_puls+"<ol class='griglia1x2 clearfix'><li class='droppable'></li><li class='droppable'></li></ol></li>";
			break;
			case "griglia1x3":
				html_struttura_moduli = "<li class='sortable'>"+html_puls+"<ol class='griglia1x3 clearfix'><li class='droppable'></li><li class='droppable'></li><li class='droppable'></li></ol></li>";
			break;		
			case "immagine":
				html_struttura_moduli = "<div id='elemento"+numero_elemento+"' class='img_placeholder' title='immagine'>"+html_puls_elementi+"</div>";
				numero_elemento++;
			break;			
			
		}
		
	return html_struttura_moduli;
}
