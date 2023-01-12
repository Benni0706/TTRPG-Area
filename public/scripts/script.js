function show_party (party_id) {
    const xhttp = new XMLHttpRequest();
    const params = "par_id=" + party_id;
    xhttp.onload = function(){
        document.getElementById('dates').innerHTML = this.responseText;
        document.getElementById('partyname').innerHTML = document.getElementById('party_name_tmp' + party_id).getAttribute('value');
        document.getElementById('partycode').innerHTML = 'Beitrittscode: ' + document.getElementById('party_code_tmp' + party_id).getAttribute('value');
        document.getElementById('partyid').setAttribute('value', party_id);
    }
    xhttp.open("POST", "/appointer", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function commit (status, dat_id) {
    const xhttp = new XMLHttpRequest();
    const params = "dat_id=" + dat_id + "&status=" + status;
    xhttp.onload = function(){
        show_party(document.getElementById('partyid').getAttribute('value'));
    }
    xhttp.open("POST", "/commit", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function show_hide_element(id, display_mode, button, text) {
    if (document.getElementById(id).style.display == display_mode) {
        document.getElementById(id).style.display = "none";
        if (typeof button !== 'undefined') {
            button.innerHTML = text + ' +';
        }
    } else {
        document.getElementById(id).style.display = display_mode;
        if (typeof button !== 'undefined') {
            button.innerHTML = text + ' -';
        }
    }
}

function add_date() {
    const xhttp = new XMLHttpRequest();
    let partyid = document.getElementById('partyid').value;
    let date_description = document.getElementById('date_description').value;
    let date_unconverted = new Date(document.getElementById('date_date').value);
    let date_date = date_unconverted.getDate() + '.' + (date_unconverted.getMonth() + 1) + '.' + date_unconverted.getFullYear();
    const params = "dat_description=" + date_description + "&dat_date=" + date_date + "&par_id=" + partyid;
    console.log(params)
    xhttp.onload = function(){
        show_party(partyid);
    }
    xhttp.open("POST", "/add_date", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}