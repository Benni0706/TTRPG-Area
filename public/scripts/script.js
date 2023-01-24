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
    get_weapons();
    get_armor();
    get_inventory();
    get_talents();
    calculate_attributes();
    get_spellslots();
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
        const params = "cha_id=" + cha_id + "&attribute=" + element.name + "&value=" + value + "&spe_id=" + element.getAttribute("data-spell");
        xhttp.onload = function(){
            get_spells();
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

function save_spell (spe_id) {
    if (document.getElementById('spe_level' + spe_id).value == 0) {
        document.getElementById('spe_needs_preparing' + spe_id).checked = false;
    }
    change_spell_attribute(document.getElementById('spe_level' + spe_id), 'int');
    change_spell_attribute(document.getElementById('spe_name' + spe_id));
    change_spell_attribute(document.getElementById('spe_casting_time' + spe_id));
    change_spell_attribute(document.getElementById('spe_range' + spe_id));
    change_spell_attribute(document.getElementById('spe_duration' + spe_id));
    change_spell_attribute(document.getElementById('spe_damage' + spe_id));
    change_spell_attribute(document.getElementById('spe_needs_preparing' + spe_id), 'bool');
    change_spell_attribute(document.getElementById('spe_casting_components' + spe_id));
    change_spell_attribute(document.getElementById('spe_material_components' + spe_id));
    change_spell_attribute(document.getElementById('spe_description' + spe_id));
}

function get_armor() {
    const xhttp = new XMLHttpRequest();

    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        document.getElementById('armor').innerHTML = this.responseText;
        let rk_value_inputs = document.getElementsByClassName('armor_rk_value');
        let rk_value = 0;
        for (let input of rk_value_inputs) {
            rk_value += +input.value;
        }
        let rk_type_inputs = document.getElementsByClassName('armor_type');
        let armor_type;
        for (let input of rk_type_inputs) {
            if (input.value == 'Schwer') {
                armor_type = 'Schwer';
            } else if (input.value = 'Mittelschwer' && armor_type != 'Schwer') {
                armor_type = 'Mittelschwer';
            }
        }
        let dex_mod = Math.trunc((document.getElementById('cha_dexterity').value - 10) / 2);
        if (dex_mod > 2 && armor_type == 'Mittelschwer') {
            dex_mod = 2;
        } else if (armor_type == 'Schwer') {
            dex_mod = 0;
        }
        document.getElementById('armor_class').value = rk_value + 10 + dex_mod + +document.getElementById('cha_armor_bonus').value;
    }
    xhttp.open("POST", "/get_armor", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function add_armor() {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        get_armor();
    }
    xhttp.open("POST", "/add_armor", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function change_armor_attribute(element, type) {
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
        const params = "cha_id=" + cha_id + "&attribute=" + element.id + "&value=" + value + "&arm_id=" + element.getAttribute("data-armor");
        xhttp.onload = function(){
            if (type == 'bool' || type == 'int' || element.id == 'arm_type') {
                get_armor();
            }
        }
        xhttp.open("POST", "/change_armor_attribute", true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }
}

function delete_armor (arm_id) {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value + "&arm_id=" + arm_id;
    xhttp.onload = function(){
        get_armor();
    }
    xhttp.open("POST", "/delete_armor", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function get_weapons() {
    const xhttp = new XMLHttpRequest();

    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        document.getElementById('weapons').innerHTML = this.responseText;
    }
    xhttp.open("POST", "/get_weapons", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function add_weapon() {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        get_weapons();
    }
    xhttp.open("POST", "/add_weapon", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function change_weapon_attribute(element, type) {
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
        const params = "cha_id=" + cha_id + "&attribute=" + element.id + "&value=" + value + "&wea_id=" + element.getAttribute("data-weapon");
        xhttp.onload = function(){
            if (type == 'bool' || type == 'int' || element.id == 'wea_attribute') {
                get_weapons();
            }
        }
        xhttp.open("POST", "/change_weapon_attribute", true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }
}

function delete_weapon (wea_id) {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value + "&wea_id=" + wea_id;
    xhttp.onload = function(){
        get_weapons();
    }
    xhttp.open("POST", "/delete_weapon", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function get_inventory() {
    const xhttp = new XMLHttpRequest();

    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        document.getElementById('inventory').innerHTML = this.responseText;
    }
    xhttp.open("POST", "/get_inventory", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function add_inventory() {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        get_inventory();
    }
    xhttp.open("POST", "/add_inventory", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function change_inventory_attribute(element, type) {
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
        const params = "cha_id=" + cha_id + "&attribute=" + element.id + "&value=" + value + "&inv_id=" + element.getAttribute("data-inventory");
        xhttp.onload = function(){
            if (type == 'bool' || type == 'int' || element.id == 'inv_attribute') {
                get_inventory();
            }
        }
        xhttp.open("POST", "/change_inventory_attribute", true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }
}

function delete_inventory (inv_id) {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value + "&inv_id=" + inv_id;
    xhttp.onload = function(){
        get_inventory();
    }
    xhttp.open("POST", "/delete_inventory", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function get_talents() {
    const xhttp = new XMLHttpRequest();

    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        document.getElementById('talents').innerHTML = this.responseText;
    }
    xhttp.open("POST", "/get_talents", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function add_talent() {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        get_talents();
    }
    xhttp.open("POST", "/add_talent", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function change_talent_attribute(element, type) {
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
        const params = "cha_id=" + cha_id + "&attribute=" + element.id + "&value=" + value + "&tal_id=" + element.getAttribute("data-talent");
        xhttp.onload = function(){
            if (type == 'bool' || type == 'int' || element.id == 'tal_attribute') {
                get_talents();
            }
        }
        xhttp.open("POST", "/change_talent_attribute", true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(params);
    }
}

function delete_talent (tal_id) {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value + "&tal_id=" + tal_id;
    xhttp.onload = function(){
        get_talents();
    }
    xhttp.open("POST", "/delete_talent", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function get_spellslots() {
    const xhttp = new XMLHttpRequest();

    const params = "cha_id=" + document.getElementById('cha_id').value;
    xhttp.onload = function(){
        document.getElementById('spellslots').innerHTML = this.responseText;
    }
    xhttp.open("POST", "/get_spellslots", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function add_spellslot(level) {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value + "&level=" + level;
    xhttp.onload = function(){
        get_spellslots();
    }
    xhttp.open("POST", "/add_spellslot", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function change_spellslot_attribute(element) {
    if (element.checked == true) {
        value = 1;
    } else {
        value = 0;
    }
    const xhttp = new XMLHttpRequest();
    let cha_id = document.getElementById('cha_id').value;
    const params = "cha_id=" + cha_id + "&attribute=" + element.id + "&value=" + value + "&sps_id=" + element.getAttribute("data-spellslot");
    xhttp.onload = function(){
        get_spellslots();
    }
    xhttp.open("POST", "/change_spellslot_attribute", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function delete_spellslot (sps_level) {
    const xhttp = new XMLHttpRequest();
    const params = "cha_id=" + document.getElementById('cha_id').value + "&sps_level=" + sps_level;
    xhttp.onload = function(){
        get_spellslots();
    }
    xhttp.open("POST", "/delete_spellslot", true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function calculate_attributes () {
    if (document.getElementById('cha_xp').value < 300) {
        document.getElementById('character_level').value = 1;
    } else if (document.getElementById('cha_xp').value < 900) {
        document.getElementById('character_level').value = 2;
    } else if (document.getElementById('cha_xp').value < 2700) {
        document.getElementById('character_level').value = 3;
    } else if (document.getElementById('cha_xp').value < 6500) {
        document.getElementById('character_level').value = 4;
    } else if (document.getElementById('cha_xp').value < 14000) {
        document.getElementById('character_level').value = 5;
    } else if (document.getElementById('cha_xp').value < 23000) {
        document.getElementById('character_level').value = 6;
    } else if (document.getElementById('cha_xp').value < 34000) {
        document.getElementById('character_level').value = 7;
    } else if (document.getElementById('cha_xp').value < 48000) {
        document.getElementById('character_level').value = 8;
    } else if (document.getElementById('cha_xp').value < 64000) {
        document.getElementById('character_level').value = 9;
    } else if (document.getElementById('cha_xp').value < 85000) {
        document.getElementById('character_level').value = 10;
    } else if (document.getElementById('cha_xp').value < 10000) {
        document.getElementById('character_level').value = 11;
    } else if (document.getElementById('cha_xp').value < 120000) {
        document.getElementById('character_level').value = 12;
    } else if (document.getElementById('cha_xp').value < 140000) {
        document.getElementById('character_level').value = 13;
    } else if (document.getElementById('cha_xp').value < 165000) {
        document.getElementById('character_level').value = 14;
    } else if (document.getElementById('cha_xp').value < 195000) {
        document.getElementById('character_level').value = 15;
    } else if (document.getElementById('cha_xp').value < 225000) {
        document.getElementById('character_level').value = 16;
    } else if (document.getElementById('cha_xp').value < 265000) {
        document.getElementById('character_level').value = 17;
    } else if (document.getElementById('cha_xp').value < 305000) {
        document.getElementById('character_level').value = 18;
    } else if (document.getElementById('cha_xp').value < 355000) {
        document.getElementById('character_level').value = 19;
    } else if (document.getElementById('cha_xp').value >= 355000) {
        document.getElementById('character_level').value = 20;
    }
    document.getElementById('strength_mod').value = Math.trunc((document.getElementById('cha_strength').value - 10) / 2);
    document.getElementById('dexterity_mod').value = Math.trunc((document.getElementById('cha_dexterity').value - 10) / 2);
    document.getElementById('constitution_mod').value = Math.trunc((document.getElementById('cha_constitution').value - 10) / 2);
    document.getElementById('intelligence_mod').value = Math.trunc((document.getElementById('cha_intelligence').value - 10) / 2);
    document.getElementById('wisdom_mod').value = Math.trunc((document.getElementById('cha_wisdom').value - 10) / 2);
    document.getElementById('charism_mod').value = Math.trunc((document.getElementById('cha_charism').value - 10) / 2);
    let prof_bonus = 2;
    if (document.getElementById('character_level').value > 4) {
        prof_bonus = 3;
    }
    if (document.getElementById('character_level').value > 8) {
        prof_bonus = 4;
    }
    if (document.getElementById('character_level').value > 12) {
        prof_bonus = 5;
    }
    if (document.getElementById('character_level').value > 16) {
        prof_bonus = 6;
    }
    calculate_saving_throw('strength', prof_bonus);
    calculate_saving_throw('dexterity', prof_bonus);
    calculate_saving_throw('constitution', prof_bonus);
    calculate_saving_throw('intelligence', prof_bonus);
    calculate_saving_throw('wisdom', prof_bonus);
    calculate_saving_throw('charism', prof_bonus);

    calculate_ability('dexterity', 'acrobatics', prof_bonus);
    calculate_ability('intelligence', 'arcane', prof_bonus);
    calculate_ability('strength', 'athletics', prof_bonus);
    calculate_ability('charism', 'performance', prof_bonus);
    calculate_ability('charism', 'intimidation', prof_bonus);
    calculate_ability('dexterity', 'sleight_of_hand', prof_bonus);
    calculate_ability('intelligence', 'history', prof_bonus);
    calculate_ability('wisdom', 'medicine', prof_bonus);
    calculate_ability('dexterity', 'stealth', prof_bonus);
    calculate_ability('wisdom', 'animal_handling', prof_bonus);
    calculate_ability('wisdom', 'insight', prof_bonus);
    calculate_ability('intelligence', 'investigation', prof_bonus);
    calculate_ability('intelligence', 'nature', prof_bonus);
    calculate_ability('intelligence', 'religion', prof_bonus);
    calculate_ability('charism', 'deception', prof_bonus);
    calculate_ability('wisdom', 'survival', prof_bonus);
    calculate_ability('charism', 'persuasion', prof_bonus);
    calculate_ability('wisdom', 'perception', prof_bonus);

    if (document.getElementById('cha_spell_attribute').value == 'Intelligenz') {
        document.getElementById('spell_rw_sg').value = 10 + +document.getElementById('intelligence_mod').value + prof_bonus;
        document.getElementById('spell_attack_bonus').value = +document.getElementById('intelligence_mod').value + prof_bonus;
    } else if (document.getElementById('cha_spell_attribute').value == 'Weisheit') {
        document.getElementById('spell_rw_sg').value = 10 + +document.getElementById('wisdom_mod').value + prof_bonus;
        document.getElementById('spell_attack_bonus').value = +document.getElementById('wisdom_mod').value + prof_bonus;
    } else if (document.getElementById('cha_spell_attribute').value == 'Charisma') {
        document.getElementById('spell_rw_sg').value = 10 + +document.getElementById('charism_mod').value + prof_bonus;
        document.getElementById('spell_attack_bonus').value = +document.getElementById('charism_mod').value + prof_bonus;
    }

}

function calculate_saving_throw (attribute, prof_bonus) {
    if (document.getElementById('cha_' + attribute + '_prof').checked == true) {
        document.getElementById(attribute + '_save').value = prof_bonus + +document.getElementById(attribute + '_mod').value;
    } else {
        document.getElementById(attribute + '_save').value = document.getElementById(attribute + '_mod').value;
    }

}

function calculate_ability (attribute, ability, prof_bonus) {
    if (document.getElementById('cha_' + ability + '_prof').checked == true) {
        document.getElementById(ability).value = prof_bonus + +document.getElementById(attribute + '_mod').value;
    } else {
        document.getElementById(ability).value = document.getElementById(attribute + '_mod').value;
    }

}