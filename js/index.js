/*

______________________________________/\\\__________/\\\________________
 _____________________________________\/\\\_________\/\\\________________
  _____________________________________\/\\\_________\/\\\_____/\\\__/\\\_
   _____/\\\\\\\\__/\\\\\\\\\___________\/\\\_________\/\\\____\//\\\/\\\__
    ___/\\\//////__\////////\\\_____/\\\\\\\\\____/\\\\\\\\\_____\//\\\\\___
     __/\\\___________/\\\\\\\\\\___/\\\////\\\___/\\\////\\\______\//\\\____
      _\//\\\_________/\\\/////\\\__\/\\\__\/\\\__\/\\\__\/\\\___/\\_/\\\_____
       __\///\\\\\\\\_\//\\\\\\\\/\\_\//\\\\\\\/\\_\//\\\\\\\/\\_\//\\\\/______
        ____\////////___\////////\//___\///////\//___\///////\//___\////________

      Main App Js
      Author : Matthieu COLONNA
      Author : Yann PARMENTIER

      20/03/2015

*/

/* HELPER FUNCTIONS ----------------------------------------------------------*/


    var holeCurrent = 0;

      function expand(el){
        //alert(this);

        $(".collectiondata").slideUp();
        $(el).next(".collectiondata").slideDown();

      }

      function less1(key) {
        //alert($('#holescore').text());
        var target = '#holescore'+key;
        var score = parseInt( $(target).text() ) - 1;
        $(target).fadeOut('fast').html( score.toString() ).fadeIn('fast');

        var id = way.get("playerlist."+key+".tp_id");

        way.set("playerlist."+key+".score",score );
        way.set("scorelist."+key+".holes."+holeCurrent, score.toString() );
        way.set("scorelist."+key+".playerid",id );

        way.backup();
      }

      function plus1(key) {
        //alert($('#holescore').text());
        var target = '#holescore'+key;
        var score = parseInt( $(target).text() ) + 1;
        $(target).fadeOut('fast').html( score.toString() ).fadeIn('fast');

        var id = way.get("playerlist."+key+".tp_id");

        way.set("playerlist."+key+".score",score );
        way.set("scorelist."+key+".holes."+holeCurrent,score.toString() );
        way.set("scorelist."+key+".playerid",id );

        way.backup();

      }

      function tournamentSelect(el){
          //alert( $(el).data('id') );
          var id = $(el).data('id');

          var tid = way.get("tournamentlist."+id+".to_id");
          var tname = way.get("tournamentlist."+id+".to_name");

          // confirmation et inscription
					App.dialog({
						title        : 'Inscription',
						text         : tname,
						okButton     : 'ok',
						cancelButton : ''
					}, function (choice) {
					});

          localStorage.setItem('tournamentId', tid );
          App.load('dashboard');

      }

      function holeChangeHandler(swiper){
        console.log(swiper.activeIndex);
        way.updateRepeats();
        holeCurrent = swiper.activeIndex;

        updateScoreBinding(holeCurrent);

      }

      function updateScoreBinding( hole ){


        // Get scorelist
        var scorelist = way.get("scorelist");

          // Scorelist exist
          if( typeof scorelist != "undefined" ){
          $.each(scorelist, function(key, value) {

            // Get each player(key) score for this hole(holeCurrent)
            var score = way.get("scorelist."+key+".holes."+hole);
            // Get score label for this player/hole
            var target = '#holescore'+key;

            // Update display
            if(score)
              $(target).text(score.toString());
             else
              $(target).text(0);

            way.set("playerlist."+key+".score",score );
            //console.log(score);

          });
        }
      }

      function toastr(t){

        $(".notif").text(t);
        $(".notif").show();

        setTimeout(function() {
            $(".notif").fadeOut();
        }, 2000);
      }

      $(document).ready(function() {
        FastClick.attach(document.body);

      });

/* APP -----------------------------------------------------------------------*/

      App.setDefaultTransition('rotate-right'); // global

      /* CONTROLLER DASHBOARD ------------------------------------------------*/
      App.controller('dashboard', function (page) {
        // put stuff here

      });  // [ Page Controller End ]

      /* CONTROLLER LEADERBOARD -----------------------------------------------*/
      App.controller('leaderboard', function (page) {
        // put stuff here

      });  // [ Page Controller End ]

      /* CONTROLLER TOURNOIS -------------------------------------------------*/
      App.controller('tournois', function (page) {
        // put stuff here

        $(page).on('appShow', function () {

              $('.dimmer').show();

              //var data = '&deviceid=' + localStorage.getItem( 'deviceId');

              $.ajax({
                     //url:"http://golf.logestia.net/app/app_players.php?action=getfromdevice&callback=?"+data,
                     url:"http://golf.logestia.net/app/app_players.php?action=getalltournament&callback=?",
                     dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
                     success:function(data){
                       // do stuff with json (in this case an array)

                        way.set("tournamentlist", data );

                        $('.dimmer').hide();
                        $('#tournamentlist').slideDown();

              var tid = localStorage.getItem( 'tournamentId');
              if(tid!=''){ // Pas tournois inscrit, sélection impossible
                $(".tournament").hide();
              }

                     },
                     error:function(jqXHR, textStatus, ex) {
                        alert(textStatus + "," + ex + "," + jqXHR.responseText);
                        $('.dimmer').hide();
                     }
              });


        }); // [ Page show End ]




      });  // [ Page Controller End ]

      /* CONTROLLER JOUEURS --------------------------------------------------*/
      App.controller('joueurs', function (page) {
        // put stuff here


        $(page).on('appShow', function () {

          var swiper = new Swiper('.swiper-container', {
            onSlideChangeEnd : holeChangeHandler
          });

          var sel = localStorage.getItem( 'playerSelection');

          way.restore();

          if(sel!=''){

            var test = way.get("playerlist");
            if( test != 'undefined' ){

              $('.dimmer').show();

              //var data = '&deviceid=' + localStorage.getItem( 'deviceId');
              var data = '&selection=' + localStorage.getItem( 'playerSelection');

              $.ajax({
                     //url:"http://golf.logestia.net/app/app_players.php?action=getfromdevice&callback=?"+data,
                     url:"http://golf.logestia.net/app/app_players.php?action=getfromselection&callback=?"+data,
                     dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
                     success:function(data){
                         // do stuff with json (in this case an array)

                          way.set( "playerlist", data );
                          /*
                          var items = [];
                            $.each( data, function( key, val ) {
                              items.push( '{"playerid":"' +val.tp_player + '", "holes":{} }' );
                            });

                          way.set("scorelist", items );
                          */
                          $('.dimmer').hide();
                          $('#playerlist').slideDown();
                          updateScoreBinding(0);

                     },
                     error:function(jqXHR, textStatus, ex) {
                        alert(textStatus + "," + ex + "," + jqXHR.responseText);
                        $('.dimmer').hide();
                     }
              });

            }



          }else{

              $('#playerlist').html("<p style='text-align:center'>Pas de joueurs sélectionnés.</p>");
              $('#playerlist').slideDown();
          }

        });  // [ Page show End ]

        /*
        way.set("scorelist",[
            {id:"Pierre", holes:{} },
            {id:"Pierre", holes:{} },
            {id:"Pierre", holes:{} }

        ]);
        */

        $(page).find('#playerToJson').on('click', function () {
          way.updateRepeats("playerlist");
          var sl = way.get("scorelist") ;
          var tid = "&tid="+localStorage.getItem('tournamentId')+"&deviceid="+localStorage.getItem('deviceId');

          sl = JSON.stringify(sl) ;

          toastr("sync scores");

          // debug
          //window.location.href = "http://golf.logestia.net/app/app_players.php?action=addscores&callback=?"+tid+"&scores="+sl;


          $.ajax({
                 url:"http://golf.logestia.net/app/app_players.php?action=addscores&callback=?"+tid+"&scores="+sl,
                 method:"POST",
                 dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
                 success:function(data){

                      $('.dimmer').hide();
                      $('#result').show();

                 },
                 error:function(jqXHR, textStatus, ex) {
                    alert(textStatus + "," + ex + "," + jqXHR.responseText);
                    $('.dimmer').hide();
                 }
          });


        });


      });  // [ Page Controller End ]

      /* CONTROLLER SETTINGS -------------------------------------------------*/
      App.controller('settings', function (page) {
        // put stuff here

          // Unlock device
          // * empty player selection
          // * empty tournament id
          // * empty scorelist
          $(page).find('#unlockDevice').on('click', function () {
            localStorage.setItem( 'deviceLocked', 0 );
            localStorage.setItem( 'deviceId', '' );
            localStorage.setItem( 'playerSelection', '' );
            localStorage.setItem('tournamentId', '' );
            way.clear();

            App.load('dashboard');

          });

          // Get selection
          // * display player selected on device
          $(page).find('#getSelection').on('click', function () {

            var sel = "sel: "+localStorage.getItem('playerSelection');
            var devid = "devid: "+localStorage.getItem('deviceId');

            var data = sel + '\n' + devid;

						App.dialog({
							title        : 'Selection',
							text         : data,
							okButton     : 'ok',
							cancelButton : ''
						}, function (choice) {
						});

          });

          // Send Selection
          // * send selected players to server
          $(page).find('#setSelection').on('click', function () {

						App.dialog({
							title        : 'Ajout',
							text         : 'Voulez-vous inscrire cette selection sur ce device ?',
							okButton     : 'oui',
							cancelButton : 'non'
						}, function (choice) {
							console.log(choice);
              if (choice=="ok"){
                //var selection = $('#playerSelection').serialize();

                var data = '&selection=';

                var sel = $('.selectioncheck:checked').map( function() {
                  return $(this).val();
                }).get().join(',');

                data += sel;

                localStorage.setItem('deviceLocked', 1 );
                localStorage.setItem( 'playerSelection', sel );
                localStorage.setItem( 'deviceId', Date.now() );

                data += '&deviceid=' + localStorage.getItem( 'deviceId');

                //alert(data);

                $('.dimmer').show();

                //window.location = "http://golf.logestia.net/app/app_players.php?action=add&callback=?&selection="+data;

                $.ajax({
                       url:"http://golf.logestia.net/app/app_players.php?action=add&callback=?"+data,
                       dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
                       success:function(data){
                           // do stuff with json (in this case an array)

                            $('.dimmer').hide();
                            $('#result').show();


                       },
                       error:function(jqXHR, textStatus, ex) {
                          alert(textStatus + "," + ex + "," + jqXHR.responseText);
                          $('.dimmer').hide();
                       }
                });

                App.load('dashboard');

              }
						});
					});

        $(page).on('appShow', function () {
          /* Device is not lockedyet, we need to add the selection */
          if( localStorage.getItem('deviceLocked') == 0 ){

            $('.dimmer').show();

            var tid = localStorage.getItem( 'tournamentId');

            if(tid==''){ // Pas tournois inscrit, sélection impossible
  						App.dialog({
  							title        : 'Selection',
  							text         : 'Pas de tournoi sélectionné',
  							okButton     : 'ok',
  							cancelButton : ''
  						}, function (choice) {
  						});

              App.load('tournois');
            }

            var data = "&tid="+tid;

            $.ajax({
                   url:"http://golf.logestia.net/app/app_players.php?action=get&callback=?"+data,
                   dataType: 'jsonp', // Notice! JSONP <-- P (lowercase)
                   success:function(data){
                       // do stuff with json (in this case an array)

                       var items = [];

                        items.push( "<tr><td>Nom Joueur</td><td>#/Id</td><td>Selection</td></tr>" );
                        $.each( data, function( key, player ) {
                            items.push( "<tr><td>" + player.tp_firstname + "</td><td> " + player.tp_player.trim() + "</td><td><input type='checkbox' name='selection"+player.tp_player.trim()+"' class='selectioncheck' value='"+player.tp_player.trim()+"'/></td></tr>" );
                        });


                        $( "<table/>", {
                            "class": "centered",
                            html: items.join( "" )
                        }).appendTo( "#result form" );

                        $('.dimmer').hide();
                        $('#result').show();

                   },
                   error:function(jqXHR, textStatus, ex) {
                      alert(textStatus + "," + ex + "," + jqXHR.responseText);
                      $('.dimmer').hide();
                   }
            });

          }else{
              $('#result').hide();
          }



        });
      });

      try {
        App.restore();
      } catch (err) {
        App.load('dashboard');
      }
