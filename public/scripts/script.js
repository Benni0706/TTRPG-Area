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
        get_commitments_for_dates();
    }
    xhttp.open("POST", "/get_dates", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function get_commitments_for_dates () {
    let datedivs = document.getElementsByClassName('datediv');
    for (var i = 0; i < datedivs.length; i++) {
        const xhttp = new XMLHttpRequest();
        const params = 'dat_id=' + datedivs[i].id;
        xhttp.onload = function(){
            let zusage_id = 'zusage' + datedivs[0].id;
            console.log(zusage_id);
            let unsicher_id = 'unsicher' + datedivs[0].id;
            let absage_id = 'absage' + datedivs[0].id;
            console.log(this.responseText);
            if (this.responseText == 'zusage') {
                document.getElementById(zusage_id).style.backgroundColor = "009900";
                document.getElementById(unsicher_id).style.backgroundColor = "22333B";
                document.getElementById(absage_id).style.backgroundColor = "22333B";
            } else if (this.responseText == 'unsicher') {
                document.getElementById(zusage_id).style.backgroundColor = "22333B";
                document.getElementById(unsicher_id).style.backgroundColor = "ffcc00";
                document.getElementById(absage_id).style.backgroundColor = "22333B";
            } else if (this.responseText == 'absage') {
                document.getElementById(zusage_id).style.backgroundColor = "22333B";
                document.getElementById(unsicher_id).style.backgroundColor = "22333B";
                document.getElementById(absage_id).style.backgroundColor = "D00000";
            }
        }
        xhttp.open("POST", "/get_commitment", true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }
}

function commit (status, id) {
    const xhttp = new XMLHttpRequest();
    const params = 'dat_id=' + id + '&status=' + status;
    xhttp.onload = function(){
        window.location.reload();
    }
    xhttp.open("POST", "/commit", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}