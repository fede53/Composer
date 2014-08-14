        $.fn.Composer = function() {
                info.id = this;
                /*if (typeof arguments[0] == 'string') {
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
                }*/

                start();
        }
//AVVIO DEL COMPOSER 
        start = function() {
                build_structure();

                if (typeof opz.onEndStart == 'function') {
                        opz.onEndStart();
                }
        }
        
        
        $(".delete").click(function() {
                        $(this).parents('li').remove();
                        check_elementi();
                });

                $(".edit_elementi").click(function() {
                        id_selezionato = $(this).parents('div').parents('div').attr("id");
                        console.log("selezionato "+id_selezionato);
                        
                        tipologia_elemento_selezionato = $(this).parents('div').parents('div').attr("title");
                        open_dialog();
                });

                $(".delete_elementi").click(function() {
                        $(this).parents('li').remove();
                        check_elementi();
                });