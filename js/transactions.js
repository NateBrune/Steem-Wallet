
$.fn.tablr = function(){
  // Set Active
  $('.tabs-navigation li:not(.key)').first().addClass('active');

  // Hide All Boxes and show first one
  $('.tabs-content li:not(.key)').hide();
  $('.tabs-content li:not(.key)').first().show();

  // Get Clicks on Li in Navigation
  $(this).find('.tabs-navigation li:not(.key)').click(function(){
    if($(this).hasClass('active') == false) {
      // Get ID of Tab
      id = $(this).attr('id');
      tabid = 'content-'+id;

      // Set Active
      $(this).parent('.tabs-navigation').find('li').removeClass('active');
      $(this).addClass('active');

      // Hide all boxes
      $(this).parent('.tabs-navigation').parent('.tabs').find('.tabs-content li:not(.key)').hide();
      $(this).parent('.tabs-navigation').parent('.tabs').find('.tabs-content #'+tabid+':not(.key)').show();
    }
  });
}
$( document ).ready(function() {
  $(function() {
    $( ".tabs" ).tablr();
  });
});
var clickedOnce=false;
function send(){
  if(clickedOnce){
    $('#sendButton').toggleClass("m-progress");
    clickedOnce=false;
    var to = $("#to").val();
    var quantity = $("#quantity").val();
    var memo = $("#memo").val();
    var symbol = "STEEM";
    if(to && quantity && memo && pair=="STM"){
      symbol="STEEM";
    } else {
      symbol="SBD";
    }
    let tr = new window.steemJS.TransactionBuilder();
    tr.add_type_operation("transfer", {
      from: user['name'],
      to: to,
      amount: Number(Math.round(quantity+'e3')+'e-3').toFixed(3) + " " + symbol,
      memo: memo
    });
    tr.process_transaction(user, null, true).then(res => {
      console.log("transfer done");
      console.log(res);
      $("#sendButton").html("Complete");
      $('#sendButton').toggleClass("m-progress");
      $("#sendButton").toggleClass("btn-default");
      $("#sendButton").toggleClass("btn-info");

    })
}
  else{
    clickedOnce=true;
    $("#sendButton").html("Sure?");
  }

}
