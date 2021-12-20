class GlitchElement {
    constructor(glid, gltext, glsize, glcolor) {
        this.glid = glid;
        this.gltext = gltext;
        this.glsize = glsize;
        this.glcolor = glcolor;
    }
}

// ------------------------------ Працюємо з DOM ------------------------------------

function addGlitch(glid, gltext, glsize, glcolor) {						// додати новий глюк в DOM
    let newElement = document.createElement("div");
    newElement.setAttribute("data-text", gltext);
    newElement.setAttribute("id", glid);
    newElement.classList.add('glitch');
    newElement.innerText = gltext;
    newElement.style.color = glcolor;
    newElement.style.fontSize = glsize;

    let bl3 = document.getElementById("glitches");
    bl3.appendChild(newElement);
}

function clearGlitches() {											// стерти глюки в DOM
    let bl3 = document.getElementById("glitches");
    while (bl3.firstChild) {										// видалити наявні елементи для перезапису
        bl3.removeChild(bl3.lastChild);
    }
}

// ----оброблення подій кнопок ----------  взаємодія з сервером: --------------------------

// отримати глюки з сервера та додати в DOM
function getGlitches() {
    clearGlitches();

    fetch('glitches')            // local
        //	fetch('https://murmuring-retreat-55985.herokuapp.com/glitches')
        .then(response => response.json())
        .then(data => {
            data.forEach(obj => {                   // цикл в JSON по отриманим глюкам
                console.log(obj);
                addGlitch(obj.glid, obj.gltext, obj.glsize, obj.glcolor)    // відобразити глюк з отриманими техніч парам-ми
            })
        })
        .catch(function (error) {
            console.log('error', error)
        })
}

// видалити глюки з сервера та стерти в ДОМ
function delGlitches() {
    clearGlitches();
    fetch('delete', {method: 'DELETE'})
        //	fetch('https://murmuring-retreat-55985.herokuapp.com/delete', {method: 'DELETE'})
        .catch(function (error) {
            console.log('error', error)
        })
}

// створити новий глюк, додати в DOM та записати на сервер
function newGlitch() {
    let gltext = document.getElementById('gltext').value;
    let glsize = document.getElementById('glsize').value + 'px';
    let glcolor = document.getElementById('glcolor').value;
    let glid = uuidv4();                // universally unique identifier -  универсальный уникальный идентификатор
    addGlitch(glid, gltext, glsize, glcolor);									// додати в ДОМ
    let newGlitchElement = new GlitchElement(glid, gltext, glsize, glcolor); 	// створити глюк - об"єкт

    const requestOptions = {					// fetch options
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newGlitchElement)              // преобразует значение JavaScript в строку JSON
    };

    fetch('/add', requestOptions)
        //	fetch('https://murmuring-retreat-55985.herokuapp.com/add', requestOptions)
        .then(response => response.json())
        .catch(function (error) {
            console.log('error', error)
        });
}
