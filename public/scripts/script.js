function show_party (party) {
    let id = 'party' + party.id;
    let elements = document.getElementsByClassName('party');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
    let buttons = document.getElementsByClassName('showParty');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.textDecoration = 'none';
    }
    document.getElementById(id).style.display = 'block';
    document.getElementById(party.id).style.textDecoration = 'underline';

    let dates_div_id = 'partydates' + party.id;
    const xhttp = new XMLHttpRequest();
    const params = 'par_id=' + party.id;
    xhttp.onload = function(){
        document.getElementById(dates_div_id).innerHTML = this.responseText;
    }
    xhttp.open("POST", "/get_dates", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}