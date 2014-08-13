(function($) {

        info = {id: null, id_lista_elementi: "moduli", id_drop_zone: "struttura"};
        opz = {};

        var numero_elemento = 0;
        var id_selezionato = "";
        var tipologia_elemento_selezionato = "";
        var tipi_elementi = new Array();
        tipi_elementi['immagine'] = new Array("Info immagine", "500");

        elementi = {"Grigle": {
                        "griglia1x1": {
                                tipo: "griglia1x1",
                                classe: "griglie"
                        },
                        "griglia1x2": {
                                tipo: "griglia1x2",
                                classe: "griglie"
                        },
                        "griglia1x3": {
                                tipo: "griglia1x3",
                                classe: "griglie"
                        }
                },
                "Elementi grafici": {
                        "immagine": {
                                tipo: "immagine",
                                classe: "elementi"
                        }
                }};



        $.fn.Composer = function() {
                info.id = this;
                if (typeof arguments[0] == 'string') {
                        switch (arguments[0]) {
                                case 'start':
                                        start();
                                        break;
                        }
                }
                else if (typeof arguments[0] == 'object') {
                        opz = $.extend({}, opz, arguments[0]);
                }
                else if (typeof arguments[0] == 'string' && typeof arguments[1] == 'string') {
                        opz2 = {}
                        opz2[arguments[0]] = arguments[1];
                        opz = $.extend({}, opz, opz2);
                }
                else if (typeof arguments[0] == 'function') {
                        arguments[0]();
                }

                start();
        }

        start = function() {
                build_structure();

                if (typeof opz.onEndStart == 'function') {
                        opz.onEndStart();
                }
        }


        build_structure = function() {

                HTML_composer = "<div id=\"" + info.id_lista_elementi + "\">";

                for (var key in elementi) {

                        HTML_composer += "<h2><a href=\"#\">" + key + "</a></h2>";
                        HTML_composer += "<div><ul>";

                        for (var key_child in elementi[key]) {

                                HTML_composer += "<li id=\"" + elementi[key][key_child].tipo + "\" class=\"" + elementi[key][key_child].classe + "\">" + key_child + "</li>";

                        }
                        HTML_composer += "</ul></div>";

                }

                HTML_composer += "</div>";


                HTML_composer += "<div id=\"" + info.id_drop_zone + "\"><ol></ol></div>";

                HTML_composer += "<div id=\"dialog\"><form id=\"myform\"><div id=\"form_elementi\"></div></form></div>";

                $(info.id).html(HTML_composer);

                check_elementi();

                $("#moduli").accordion();

                $("#moduli ul > li").draggable({
                        appendTo: "body",
                        helper: "clone"
                });

                $("#struttura ol").droppable({
                        activeClass: "",
                        hoverClass: "place-holder-hover",
                        accept: ".griglie",
                        drop: function(event, ui) {
                                $("" + struttura_moduli(ui.draggable.attr("id")) + "").appendTo(this);
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








        check_elementi = function() {
                num_elementi = $("#" + info.id_drop_zone + " ol li[class!=placeholder]").length;
                if (num_elementi > 0)
                        $("#" + info.id_drop_zone + " ol").find(".placeholder").remove();
                else
                        $("#" + info.id_drop_zone + " ol").html("<li class='placeholder'>Trascina qui gli elementi che vuoi inserire</li>");
        }



        struttura_moduli = function(id) {

                var html_struttura_moduli;

                var html_puls = "<div class='controls clearfix'><a href='#' class='sort'>+</a><a href='#' class='delete'>cancella</a></div>";

                var html_puls_elementi = "<div class='controls_elementi clearfix'><a href='#' class='edit_elementi'>modifica</a><a href='#' class='delete_elementi'>cancella</a></div>";

                switch (id) {
                        case "griglia1x1":
                                html_struttura_moduli = "<li class='sortable'>" + html_puls + "<ol class='griglia1x1'><li class='droppable'></li></ol></li>";
                                break;
                        case "griglia1x2":
                                html_struttura_moduli = "<li class='sortable'>" + html_puls + "<ol class='griglia1x2 clearfix'><li class='droppable'></li><li class='droppable'></li></ol></li>";
                                break;
                        case "griglia1x3":
                                html_struttura_moduli = "<li class='sortable'>" + html_puls + "<ol class='griglia1x3 clearfix'><li class='droppable'></li><li class='droppable'></li><li class='droppable'></li></ol></li>";
                                break;
                        case "immagine":
                                html_struttura_moduli = "<div id='elemento" + numero_elemento + "' class='img_placeholder' title='immagine'>" + html_puls_elementi + "</div>";
                                numero_elemento++;
                                break;

                }

                return html_struttura_moduli;
        }


        afterDrop = function(id) {

                $(".delete").click(function() {
                        $(this).parents('li').remove();
                        check_elementi();
                });

                $(".edit_elementi").click(function() {
                        id_selezionato = $(this).parents('div').parents('div').attr("id");
                        tipologia_elemento_selezionato = $(this).parents('div').parents('div').attr("title");
                        open_dialog();
                });

                $(".delete_elementi").click(function() {
                        $(this).parents('li').remove();
                        check_elementi();
                });


                $(".droppable").droppable({
                        activeClass: "",
                        hoverClass: "place-holder-elementi-hover",
                        accept: ".elementi",
                        drop: function(event, ui) {
                                $("" + struttura_moduli(ui.draggable.attr("id")) + "").appendTo(this);
                                check_elementi();
                                afterDrop();
                        }

                });

        }

// APRO FINESTRA DI DIALOGO A SECONDA DELL'ELEMENTO
        open_dialog = function() {
                dialog.dialog("option", "title", tipi_elementi[tipologia_elemento_selezionato][0]);

                carica_form();

                dialog.dialog("option", "width", tipi_elementi[tipologia_elemento_selezionato][1]);
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

// FUNZIONE LANCIATA DOPO IL DROP DELLE GRIGLIE


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
