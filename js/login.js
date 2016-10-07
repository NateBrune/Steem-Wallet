
// Form Submission
$("#register-form").submit(function() {
  remove_loading($(this));

  if(options['useAJAX'] == true)
  {
    // Dummy AJAX request (Replace this with your AJAX code)
    // If you don't want to use AJAX, remove this
    dummy_submit_form($(this));

    // Cancel the normal submission.
    // If you don't want to use AJAX, remove this
    return false;
  }
});

// Form Submission
$("#forgot-password-form").submit(function() {
  remove_loading($(this));

  if(options['useAJAX'] == true)
  {
    // Dummy AJAX request (Replace this with your AJAX code)
    // If you don't want to use AJAX, remove this
    dummy_submit_form($(this));

    // Cancel the normal submission.
    // If you don't want to use AJAX, remove this
    return false;
  }
});

// Loading
//----------------------------------------------
function remove_loading($form)
{
  $form.find('[type=submit]').removeClass('error success');
  $form.find('.login-form-main-message').removeClass('show error success').html('');
}

function form_loading($form)
{
  $form.find('[type=submit]').addClass('clicked').html(options['<i class="fa fa-spinner fa-pulse"></i>']);
}

function form_success($form)
{
  $form.find('[type=submit]').addClass('success').html(options['<i class="fa fa-check"></i>']);
  $form.find('.login-form-main-message').addClass('show success').html('All Good!');
}

function form_failed($form)
{
  $form.find('[type=button]').addClass('error').html(options['<i class="fa fa-remove"></i>']);
  $form.find('.login-form-main-message').addClass('show error').html('Wrong login credentials!');
}

// show keys
//----------------------------------------------
// This handles displaying the actual keys

var private = false;
var loggedIn = false;

const options = {
    apis: ["database_api", "network_broadcast_api"],
    // url: "wss://node.steem.ws"
    url: "wss://steemit.com:443/wspa"
};

var account = null;
var user = new window.steemJS.Login();
user.setRoles(["active"]);

function showpriv(){
  $("#postingPub").html("Posting<br />".concat(user['keyCache']['_myKeys'].get("posting")['priv'].toWif()));
  $("#activePub").html("Active<br />".concat(user['keyCache']['_myKeys'].get("active")['priv'].toWif()));
  $("#ownerPub").html("Owner<br />".concat(user['keyCache']['_myKeys'].get("owner")['priv'].toWif()));
  $("#private").html("Show Public");
  private=true;
}
function showpub(){
  $("#postingPub").html("Posting<br />".concat(user['keyCache']['_keyCachePub'].get("posting")));
  $("#activePub").html("Active<br />".concat(user['keyCache']['_keyCachePub'].get("active")));
  $("#ownerPub").html("Owner<br />".concat(user['keyCache']['_keyCachePub'].get("owner")));
  $("#private").html("Show Private");
  private=false;
}

// login
//----------------------------------------------
// This where the credentials are churned out

function login()
{

  var Api = window.steemJS.steemRPC.Client.get(options, true);
  var username = $("#username").val();
  var password = $("#password").val();
  var form = $("#login-form");
  Api.initPromise.then(function(res) {
    Api.database_api().exec("get_accounts", [[username]]).then(function(res) {
      if(res.length < 1) {
        form_failed(form);
      }
      account = res[0];
      try {
          var login_data = {
              accountName: username,
              auths: {
                  owner: account.owner.key_auths,
                  active: account.active.key_auths,
                  posting: account.posting.key_auths
              }
          }
          // Clone object
          var with_key = JSON.parse(JSON.stringify(login_data));
          var with_pass = JSON.parse(JSON.stringify(login_data));
          with_pass['password'] = password;
          with_key['privateKey'] = password;
          // first try owner/active key
          try {
              let success_key = user.checkKeys(with_key);
              if(success_key) { //
                  window.localStorage.setItem("user", username);
                  window.localStorage.setItem("password", password);

                  $("#loginPage").hide();
                  $("#keysPage").fadeIn(500);
                  showpub();
                  loggedIn = true;
                  getPrice(1);
                  getBalance(username);
                  getWitnesses();
                  return;
              }
          } catch(e) {
              console.warn('error trying key. moving to pass');
          }

          // now try password
          let success_pass = user.checkKeys(with_pass);

          if(success_pass){ // we're in.
              window.localStorage.setItem("user", username);
              window.localStorage.setItem("password", password);
              loggedIn=true;
              $("#loginPage").hide();
              $("#keysPage").fadeIn(500);
              showpub();
              getPrice(1);
              getBalance(username);
              getWitnesses();
              return;
          }
          // user entered the wrong credentials.
          form_failed(form);
          return;
      } catch(err){
          form_failed(form);
      }

    });
  });
}

function storageLogin(){
  var Api = window.steemJS.steemRPC.Client.get(options, true);
  var username = window.localStorage.getItem("user");
  var password = window.localStorage.getItem("password");
  var form = $("#login-form");
  Api.initPromise.then(function(res) {
    Api.database_api().exec("get_accounts", [[username]]).then(function(res) {
      if(res.length < 1) {
        form_failed(form);
      }
      account = res[0];
      try {
          var login_data = {
              accountName: username,
              auths: {
                  owner: account.owner.key_auths,
                  active: account.active.key_auths,
                  posting: account.posting.key_auths
              }
          }
          // Clone object
          var with_key = JSON.parse(JSON.stringify(login_data));
          var with_pass = JSON.parse(JSON.stringify(login_data));
          with_pass['password'] = password;
          with_key['privateKey'] = password;
          // first try owner/active key
          try {
              let success_key = user.checkKeys(with_key);
              if(success_key) { //
                  window.localStorage.setItem("user", username);
                  window.localStorage.setItem("password", password);
                  $("#loginPage").hide();
                  $("loadingPage").hide();
                  $("#keysPage").fadeIn(500);
                  showpub();
                  getPrice(1);
                  getBalance(username);
                  getWitnesses();
                  return;
              }
          } catch(e) {
              console.warn('error trying key. moving to pass');
          }

          // now try password
          let success_pass = user.checkKeys(with_pass);

          if(success_pass){ // we're in.
              window.localStorage.setItem("user", username);
              window.localStorage.setItem("password", password);
              $("#loginPage").hide();
              $("#loadingPage").hide();
              $("#keysPage").fadeIn(600);
              showpub();
              loggedIn=true;
              getPrice(1);
              getBalance(username);
              getWitnesses();
              return;
          }
          // user entered the wrong credentials.
          form_failed(form);
          return;
      } catch(err){
          form_failed(form);
      }
    });
  });

}

function logout() {
  $("#keysPage").hide();
  $("#loginPage").fadeIn(500);
  account = null;
  user = null;
  window.localStorage.clear();

}
var pair = "STM";
function getPrice(num) {

  $.getJSON('https://poloniex.com/public?command=returnTicker', function(data) {
    var btcsteem = data['BTC_STEEM']['last'];
    var usdbtc = 0;
    $.getJSON('https://bitpay.com/api/rates', function(prices) {
      usdbtc = prices[1]['rate'];
      var price = btcsteem*usdbtc;
      if(pair=='STM'){
        $("#price").html(num + ' STEEM = $'+Math.round(price*num*100) / 100);
      }
      else {
        $("#price").html(Math.round(((num/price)*100)/100) + ' STEEM = $'+Math.round(price*(num/price)*100) / 100);
      }
    });
  });
}

function getBalance(user) {
  steem.api.getAccounts([user], function(err, response){

    if(response.length != 0){
      $("#steem-balance").html(response[0]['balance'].split(".")[0]);
      $("#steem-savings-balance").html(response[0]['savings_balance'].split(".")[0]);
      $("#sbd-savings-balance").html(response[0]['savings_sbd_balance'].split(".")[0]);
      $("#sbd-balance").html(response[0]['sbd_balance'].split(".")[0]);
      steem.api.getDynamicGlobalProperties(function(err, response2){
        var sp = (response[0]['vesting_shares'].split(".")[0])*(response2['total_vesting_fund_steem'].split(".")[0]/response2['total_vesting_shares'].split(".")[0]);
        $("#vests-balance").html(sp.toString().split(".")[0])
      });

    }
  });
}

function wvote(theButton){
  var uname = window.localStorage.getItem("user");
  var wvotes=null
  steem.api.getAccounts([uname], function(err, data){
    wvotes = data[0]['witness_votes'];
    var Api = window.steemJS.steemRPC.Client.get(options, true);
    var bId = $(theButton).attr('id');
    var wname = bId.split('()-')[2];
    let tr = new window.steemJS.TransactionBuilder();
    if(wvotes.includes(wname)){
      tr.add_type_operation("account_witness_vote", {
        account: uname,
        witness: wname,
        approve: false
      });
      tr.process_transaction(user, null, true).then(res => {
        $(theButton).html("Vote")
      })
    }else{
      tr.add_type_operation("account_witness_vote", {
        account: uname,
        witness: wname,
        approve: true
      });
      tr.process_transaction(user, null, true).then(res => {
        $(theButton).html("Unvote")
      })
    }
  });
}

function getWitnesses(){
  var wvotes = null;
  var uname = window.localStorage.getItem("user");
  steem.api.getAccounts([uname], function(err, data){wvotes = data[0]['witness_votes'];});
  steem.api.getWitnessesByVote("", 50, function(err, response){
    for (var i in response){
      $("#witnessList").append('\
      <tr> \
        <td class="col-sm-0 text-left"> \
          <p>'.concat(parseInt(i)+1).concat('.</p> \
        </td> \
        <td class="col-sm-0 text-left"> \
          <p>').concat(response[i]['owner']).concat('</p> \
        </td> \
        <td class="col-sm-2 text-left"> \
          <span id="votebutton-').concat(i).concat('"></span> \
        </td> \
      </tr> \
      '))
      if(wvotes.includes(response[i]['owner'])){
        $('#votebutton-'.concat(i)).html('<button type="button" id="selected()-button()-'.concat(response[i]['owner']).concat('" class="btn btn-sm btn-default witbutton" style="float: right;" >Unvote</button>'))
      } else {
        $('#votebutton-'.concat(i)).html('<button type="button" id="selected()-button()-'.concat(response[i]['owner']).concat('" class="btn btn-sm btn-default witbutton" style="float: right;" >Vote</button>'))
      }
      i=i+1;
    }
    $("button.witbutton").click(function(){wvote(this);});
  })
}

$(document).ready(function () {
  $("#loginButton").click(function(){login();});
  $("#logoutButton").click(function(){logout();});
  $("#sendButton").click(function(){send();});
  $("#quantity").keyup(function(){getPrice($("#quantity").val());});
  $("#user-balance").keyup(function(){getBalance($("#user-balance").val());});
  $("#currency_pair").change(function(){pair = $("#currency_pair :selected").text(); getPrice($("#quantity").val());});
  $("#private").click(function(){if(private){showpub();}else{showpriv();}});
  $("#loginButton").click(function(){showpub();});

  if(window.localStorage.getItem("user") !== null){
    storageLogin();
  }
  else {
    $("#loadingPage").hide();
    $("#loginPage").fadeIn(500);
  }

});
