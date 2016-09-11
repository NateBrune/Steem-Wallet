
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

const options = {
    apis: ["database_api", "network_broadcast_api"],
    // url: "wss://node.steem.ws"
    url: "wss://steemit.com:443/wspa"
};

var account = null;
var user = new window.steemJS.Login();
user.setRoles(["master"]);

function showpriv(){

}
function showpub(){
  $("#postingPub").html("Posting<br />".concat(user['keyCache']['_keyCachePub'].get("posting")));
  $("#activePub").html("Active<br />".concat(user['keyCache']['_keyCachePub'].get("active")));
  $("#ownerPub").html("Owner<br />".concat(user['keyCache']['_keyCachePub'].get("owner")));
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
                  $("#loginPage").hide();
                  $("#keysPage").show();
                  showpub();
                  return;
              }
          } catch(e) {
              console.warn('error trying key. moving to pass');
          }

          // now try password
          let success_pass = user.checkKeys(with_pass);

          if(success_pass){ // we're in.
              $("#loginPage").hide();
              $("#keysPage").show();
              showpub();
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
$(document).ready(function () {
  $("#loginButton").click(function(){login();});
  $("#loginButton").click(function(){showpriv();});
  $("#loginButton").click(function(){showpub();});
});
