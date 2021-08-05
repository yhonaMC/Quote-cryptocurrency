const criptomonedaSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

// Crear un promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedad();

  formulario.addEventListener("submit", submitFormulario);

  criptomonedaSelect.addEventListener("change", leerMoneda);
  monedaSelect.addEventListener("change", leerMoneda);
});

function consultarCriptomonedad() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selecCriptomonedas(criptomonedas));
}

function selecCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedaSelect.appendChild(option);
  });
}

function leerMoneda(e) {
  objBusqueda[e.target.name] = e.target.value;
}
function submitFormulario(e) {
  e.preventDefault();
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  //consultar la API con los resultados

  consultarApi();
}

function mostrarAlerta(msg) {
  const existeError = document.querySelector(".error");
  if (!existeError) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("error");

    divMensaje.textContent = msg;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarApi() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) => {
      mostrarCotizacionHtml(cotizacion.DISPLAY[criptomoneda][moneda]);
    });
}

function mostrarCotizacionHtml(cotizacion) {
  limpiarHtml();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = ` El precio es <span>${PRICE}</span>`;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `<p> El precio mas alto de dia <span>${HIGHDAY}</span></p>`;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `<p> El precio mas bajo de dia <span>${LOWDAY}</span></p>`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.innerHTML = `<p> Variacion ultimas 24 Horas <span>${CHANGEPCT24HOUR}%</span></p>`;

  const ultimasActualizacion = document.createElement("p");
  ultimasActualizacion.innerHTML = `<p> Ultima actualizacion <span>${LASTUPDATE}</span></p>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimasActualizacion);
}

function limpiarHtml() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHtml();

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  spinner.innerHTML = ` 
  <div class="double-bounce1"></div>
  <div class="double-bounce2"></div>`;

  resultado.appendChild(spinner);
}
