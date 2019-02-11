$(document).ready(function(){
        $('#singin_form').submit(function(event){
            event.preventDefault();
            post_sign_in();
    });
});

function post_sign_in(){
    var data = {
        username: $('#username').val(),
        pass1   : $('#pass1').val(),
        pass2   : $('#pass2').val()
    }

    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/signin',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(data, status){
            console.log(data);
            $('#res').html('<p>' + data.type + ' : ' + data.msg + '</p>');
        },
        error: function(jqXHR){
            console.log(jqXHR);
            $('#res').html('<p>[ERROR] ' + jqXHR.responseText + '</p>');
        }
    });
}
