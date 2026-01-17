let selectElem = document.querySelector('#theme-selection');
let logo = document.querySelector('img');

selectElem.addEventListener('change', changeTheme);

function changeTheme() {
    let current = selectElem.value;
    if (current == 'dark') {
        document.body.classList.add('dark');
        logo.src = 'byui-logo-dark.png';
    } else {
        document.body.classList.remove('dark');
        logo.src = 'byui-logo-blue.webp';
    }
}           
                    