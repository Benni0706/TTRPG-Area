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
    document.getElementById(id).style.display = 'grid';
    document.getElementById(party.id).style.textDecoration = 'underline';
}