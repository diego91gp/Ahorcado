window.onload = function () {

    let canvas = document.querySelector("canvas");
    let ctx = document.querySelector("canvas").getContext("2d");



    let palabras = ["Hawai", "Rascacielos", "Cantimplora", "Murcielago", "Chipiron", "Peluqueria", "Diccionario", "Escuela", "Visado", "Informatica", "Taladro", "Amarillo", "Presidente", "Chimenea", "espinilla", "rodilla", "muslo", "cabeza", "cara", "boca", "labio", "diente", "nariz", "bigote", "cabello", "oreja", "cerebro", "brazo", "hombro", "mano", "muñeca", "palma", "Nieve", "Cepillo", "Intercambio", "Telaraña", "Hermanos", "Viaje", "Camion", "Prueba", "Huevo", "Gato", "Sistema", "Beisbol", "Comida", "Ladron", "Gobierno", "Conejos", "Burbuja", "Autopista", "Muñeca", "Preferencia", "Nacimiento", "Partida", "Zapato", "Baloncesto", "Lagartos", "Entrenador", "Dibujo", "Sopa", "Audiencia", "Dormir", "Guitarra", "Avena", "Cancer"];

    /***************Declaro los sonidos que voy a usar******/
    const sonidoerror = new Audio("images/error.mp3");
    const sonidoperdedor = new Audio("images/gameover.mp3");
    const sonidoacierto = new Audio("images/correcto.mp3");
    const sonidoganador = new Audio("images/winner.mp3");
    const cuerda = new Image();
    cuerda.src = "images/cuerda.png";
    const peluca = new Image();
    peluca.src = "images/peluca.png";
    peluca.onload = function () {
        peluca.decode();
    }
    cuerda.onload = function () {
        cuerda.decode();
    }

    //***********Array que incluye las teclas usadas contador correctas para comprobar la solucion y vidas */
    let teclasusadas = [];
    let correctas = 0;
    let vidas;

    document.body.appendChild(sonidoerror);
    document.querySelector(".restartGame").addEventListener("click", restartGame);
    document.addEventListener('keydown', vertecla);

    let lifes = document.querySelector(".lifes");
    let gameArea = document.querySelector(".letras");
    let teclaTeclado = document.querySelectorAll("li");
    for (const teclaPulsada of teclaTeclado) {
        teclaPulsada.addEventListener("click", vertecla);
    }
    restartGame();


    //quitar sonido

    function getAleatorio(params) {
        let resultado;
        if (typeof (params[0]) === "string") {
            resultado = params[Math.round(Math.random() * (params.length - 1) - 0) + 0];
            return resultado;
        } else {
            resultado = Math.round(Math.random() * (params));
            return resultado;
        }
    }
    function resetearVariables() {
        document.querySelector("h1").style.display = "none";
        document.querySelector(".puntuacion").style.opacity = "1";
        correctas = 0;
        teclasusadas = [];
        for (const teclaPulsada of teclaTeclado) {
            teclaPulsada.classList.replace(...teclaPulsada.classList, "enable");
        }
        vidas = 7;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPath();
        lifes.textContent = vidas;
        gameArea.innerHTML = "";
    }

    function restartGame() {

        resetearVariables();

        let palabra = getAleatorio(palabras).toUpperCase();
        let letras = palabra.length;
        let pista1, pista2;
        gameArea.setAttribute("name", palabra);

        //
        console.log(palabra + " " + letras);
        //

        for (let i = 0; i < letras; i++) {
            gameArea.innerHTML += `<div class="gameArea_word"><span id="letraNo${i}">${palabra[i].toUpperCase()}</span></div>`;
        }
        do {
            pista1 = getAleatorio(letras);
            pista2 = getAleatorio(letras);
        } while (palabra.match(new RegExp(palabra[pista1], 'g')).length >= 2 || palabra.match(new RegExp(palabra[pista2], 'g')).length >= 2 || pista1 == pista2);

        if (letras >= 6) {
            console.log(palabra[pista2] + " " + palabra.match(new RegExp(palabra[pista2], 'g')).length);
            console.log(palabra[pista1] + " " + palabra.match(new RegExp(palabra[pista1], 'g')).length);
            document.querySelector(`#letraNo${pista1}`).classList.add("pistas");
            document.querySelector(`#letraNo${pista2}`).classList.add("pistas");
            teclasusadas.push(palabra[pista1].toLowerCase());
            teclasusadas.push(palabra[pista2].toLowerCase());
            correctas = correctas + 2;
            pintaUsada(palabra, pista1, pista2);
        } else {
            document.querySelector(`#letraNo${pista1}`).classList.add("pistas");
            pintaUsada(palabra, pista1);
            teclasusadas.push(palabra[pista1].toLowerCase());
            correctas++;

        }

    }


    //FUNCION QUE PINTA LAS TECLAS USADAS Y LAS DESACTIVA PARA NO PODER VOLVER A APRETARLA
    function pintaUsada(palabra, pista1, pista2) {
        for (const teclaselect of teclaTeclado) {
            if (teclaselect.textContent.toUpperCase() == palabra[pista1] || teclaselect.textContent.toUpperCase() == palabra[pista2] || teclaselect.textContent.toUpperCase() == pista1)
                teclaselect.classList.replace("enable", "usada");

        }
    }
    /***LA FUNCION VER TECLA COMPRUEBA SI PULSASTE UNA TECLA DEL TECLADO O PULSASTE EL TECLADO 
    EN PANTALLA , Y QUE LO QUE PULSES EN TECLADO SEA UNA LETRA Y QUE NO ESTE REPETIDA */
    function vertecla(event) {
        if (vidas) {
            let tecla;
            let palabraActual = gameArea.getAttribute("name");
            if (event instanceof KeyboardEvent) {
                if ((event.code.includes("Key") || event.code.includes("colon")) && !teclasusadas.includes(event.key)) {
                    teclasusadas.push(event.key);
                    tecla = event.key.toUpperCase();
                }
                else {
                    return;
                }
            } else {
                teclasusadas.push(this.textContent.toLowerCase());
                tecla = this.textContent.toUpperCase();
            }
            return compruebaSolucion(palabraActual, tecla);
        }

    }

    function compruebaSolucion(palabraActual, tecla) {
        //SI LA LETRA ES INCORRECTA COMPRUEBA CUAL PULSE , LA PINTA MAL Y RESTA VIDAS Y COMPRUEBA CUANTAS LE QUEDAN
        if (!palabraActual.includes(tecla)) {
            for (const teclaselect of teclaTeclado) {
                if (teclaselect.textContent.toUpperCase() == tecla) {
                    teclaselect.classList.replace("enable", "usada_mal");
                    break;
                }
            }
            if (compruebavidas()) {
                vidas--;
                lifes.textContent = vidas;
                let draw = eval("drawPath" + vidas);
                draw();
                sonidoerror.play()
                console.log(vidas);
                document.querySelector("canvas").classList.add("tiembla");
                setTimeout(() => {
                    document.querySelector("canvas").classList.remove("tiembla");
                }, 200);

            }
            //SI LA LETRA ES CORRECTA LA PINTA DE VERDE LA DESACTIVA Y COMPRUEBA SI HAS ACERTADO TODAS 
        } else {
            for (const letraSolucion of document.querySelectorAll("span")) {
                if (letraSolucion.textContent == tecla) {
                    pintaUsada(palabraActual, tecla);
                    letraSolucion.classList.add("op");
                    correctas++;
                }
            }
            //SI LAS HAS ACERTADO TODAS SONIDO GANADOR
            if (correctas == palabraActual.length) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                document.querySelector(".puntuacion").style.opacity = "0";
                sonidoganador.play();
                document.querySelector("h1").innerHTML = "<strong>WINNER</strong>";
                document.querySelector("h1").style.display = "block";
                for (const tecla of document.querySelectorAll(".enable")) {
                    tecla.classList.replace("enable", "disable");
                }
                vidas = null;
            }

            sonidoacierto.play();
        }
    }

    function compruebavidas() {
        if (vidas == 1) {
            lifes.textContent = "0";
            drawPath0();
            sonidoperdedor.play();
            vidas = null;
            for (const tecla of document.querySelectorAll(".enable")) {
                tecla.classList.replace("enable", "disable");
            }
            for (const span of document.querySelectorAll("span")) {
                if (span.classList == "") {
                    span.style.opacity = "1";
                    span.style.color = "#E46262";
                }
            }
            return false;
        } else {
            return true;
        }
    }

    /***************FUNCIONES PARA PINTAR**************** */
    function drawPath() {
        ctx.strokeStyle = "black";
        ctx.fillStyle = "#571e02";
        ctx.beginPath();
        ctx.moveTo(180, 55);
        ctx.rect(180, 55, 15, 196);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(100, canvas.height - 50);
        ctx.rect(100, canvas.height - 50, 350, 10);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(181, 55);
        ctx.rect(180, 54, 190, 10);
        ctx.fill();
        ctx.stroke();
    }

    function drawPath6() {
        ctx.drawImage(cuerda, 241, 55);
    }

    function drawPath5() {

        ctx.strokeStyle = "black";
        ctx.fillStyle = "#DFB600";
        ctx.beginPath();
        ctx.arc(280, 120, 20, 0, 2 * Math.PI, false);
        ctx.strokeStyle = "black";
        ctx.fill();
        ctx.stroke();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(274, 115);
        ctx.fillStyle = "black";
        ctx.arc(270, 115, 4, 0, 2 * Math.PI, false);
        ctx.moveTo(294, 115);
        ctx.arc(290, 115, 4, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(271, 113.5, 2, 0, 2 * Math.PI, false);
        ctx.moveTo(292, 113);
        ctx.arc(291, 113.5, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(280, 129, 4, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#8b0000";
        ctx.fill();
        ctx.stroke();
        ctx.drawImage(peluca, 252, 84);
    }

    function drawPath4() {
        ctx.beginPath();
        ctx.fillStyle = "#DFB600";
        ctx.ellipse(280, 160, 25, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    function drawPath3() {
        ctx.beginPath();
        ctx.ellipse(310, 155, 5, 20, -20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    function drawPath2() {
        ctx.beginPath();
        ctx.ellipse(250, 155, 5, 20, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#DFB600";
        ctx.ellipse(280, 129, 5, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.arc(280, 131, 7, 0, Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = "#8b0000";
        ctx.fill();
        ctx.stroke();
    }

    function drawPath1() {
        ctx.beginPath();
        ctx.ellipse(260, 187, 5, 20, 29, 0, Math.PI * 2);
        ctx.fillStyle = "#DFB600";
        ctx.strokeStyle = "black";
        ctx.fill();
        ctx.stroke();
    }

    function drawPath0() {
        ctx.beginPath();
        ctx.ellipse(305, 187, 5, 20, -29, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(270, 115, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(290, 115, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "black";
        ctx.moveTo(286.5, 112);
        ctx.lineTo(292.5, 117);

        ctx.moveTo(292.5, 112);
        ctx.lineTo(286.5, 117);

        ctx.moveTo(266.5, 112);
        ctx.lineTo(272.5, 117);

        ctx.moveTo(272.5, 112);
        ctx.lineTo(266.5, 117);

        ctx.stroke();


    }
}