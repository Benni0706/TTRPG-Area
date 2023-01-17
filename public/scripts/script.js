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
            button.innerHTML = text + "&#8897";
        }
    } else {
        document.getElementById(id).style.display = display_mode;
        if (typeof button !== 'undefined') {
            button.innerHTML = text + "&#8896";
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
    xhttp.onload = function(){
        show_party(partyid);
    }
    xhttp.open("POST", "/add_date", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function change_attribute(element, type) {
    if (type == 'int' && /[^0-9,.]/.test(element.value)) {
        element.value = 0;
    } else {
        let value = element.value;
        if (type == 'bool') {
            if (element.checked == true) {
                value = 1;
            } else {
                value = 0;
            }
        } else if (type == 'int') {
            value = value.replace(',', '.');
            element.value = value.replace(',', '.');
            if (value == "") {
                value = 0;
                element.value = 0;
            }
        }
        const xhttp = new XMLHttpRequest();
        let cha_id = document.getElementById('cha_id').value;
        const params = "cha_id=" + cha_id + "&attribute=" + element.id + "&value=" + value;
        xhttp.onload = function(){
            
        }
        xhttp.open("POST", "/change_attribute", true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }
}

function show_div(div_id) {
    let divs = document.getElementsByClassName('tab_main');
    for (let div of divs) {
        div.hidden = true;
    }
    let buttons = document.getElementsByClassName('tab_buttons');
    for (let button of buttons) {
        button.classList.remove("underline");
    }
    document.getElementById(div_id).hidden = false;
    document.getElementById("tab_button_" + div_id).classList.add("underline");
}

function get_other_tables() {
    get_spells();
}

function get_spells() {
    const xhttp = new XMLHttpRequest();

    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        document.getElementById('spells_partial_div').innerHTML = this.responseText;
    }
    xhttp.open("POST", "/get_spells", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function add_spell() {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        get_spells();
    }
    xhttp.open("POST", "/add_spell", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function change_spell_attribute(element, type) {
    if (type == 'int' && /[^0-9,.]/.test(element.value)) {
        element.value = 0;
    } else {
        let value = element.value;
        if (type == 'bool') {
            if (element.checked == true) {
                value = 1;
            } else {
                value = 0;
            }
        } else if (type == 'int') {
            value = value.replace(',', '.');
            element.value = value.replace(',', '.');
            if (value == "") {
                value = 0;
                element.value = 0;
            }
        }
        const xhttp = new XMLHttpRequest();
        let cha_id = document.getElementById('cha_id').value;
        const params = "cha_id=" + cha_id + "&attribute=" + element.id + "&value=" + value + "&spe_id=" + element.getAttribute("data-spell");
        xhttp.onload = function(){
            if (type == 'bool') {
                get_spells();
            }
        }
        xhttp.open("POST", "/change_spell_attribute", true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }
}

function delete_spell (spe_id) {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value + "&spe_id=" + spe_id;
    xhttp.onload = function(){
        get_spells();
    }
    xhttp.open("POST", "/delete_spell", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}