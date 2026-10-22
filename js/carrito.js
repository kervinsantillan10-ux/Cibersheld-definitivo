// carrito.js - Lógica completa del Carrito, Pasarela y Motor de Conversión de Divisas
document.addEventListener("DOMContentLoaded", () => {
    // 0. Asegurar que FontAwesome esté cargado
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    // 1. Estilos CSS Blindados
    const estilos = document.createElement('style');
    estilos.innerHTML = `
        #carrito-flotante-js { position: fixed !important; bottom: 30px !important; right: 30px !important; width: 70px !important; height: 70px !important; background-color: #121e3b !important; color: #ffd644 !important; border: 2px solid #ffd644 !important; border-radius: 50% !important; cursor: pointer !important; font-weight: bold !important; box-shadow: 0 5px 20px rgba(0,0,0,0.6) !important; z-index: 999999 !important; display: flex !important; justify-content: center !important; align-items: center !important; transition: transform 0.2s !important; }
        #carrito-flotante-js:hover { transform: scale(1.1) !important; }
        #carrito-flotante-js i { color: #ffd644 !important; font-size: 1.8rem !important; }
        #contador-c { position: absolute !important; top: -5px !important; right: -5px !important; background-color: #ff4c4c !important; color: #fff !important; font-size: 0.85rem !important; width: 25px !important; height: 25px !important; border-radius: 50% !important; display: flex !important; justify-content: center !important; align-items: center !important; border: 2px solid #0b1224 !important; font-weight: bold !important; }
        #panel-carrito-js { position: fixed; top: 0; right: -400px; width: 350px; height: 100vh; background-color: #121e3b; color: #ffffff; box-shadow: -5px 0 15px rgba(0,0,0,0.5); display: flex; flex-direction: column; transition: right 0.3s ease-in-out; z-index: 1000000; font-family: Arial, sans-serif; }
        #panel-carrito-js.abierto { right: 0; }
        .cabecera-c { display: flex; justify-content: space-between; align-items: center; padding: 20px; background-color: #0b1224; border-bottom: 2px solid #ffd644; }
        .cabecera-c h2 { margin: 0; color: #ffd644; font-size: 1.3rem; }
        .btn-cerrar-c { background: none; border: none; color: #ffffff; font-size: 1.5rem; cursor: pointer; }
        #lista-productos-c { flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
        .item-c { background-color: #1a294c; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; }
        .item-der-c { display: flex; align-items: center; gap: 12px; }
        .btn-eliminar-c { background: none; border: none; color: #ff4c4c; cursor: pointer; font-size: 1rem; transition: transform 0.2s; }
        .btn-eliminar-c:hover { transform: scale(1.2); }
        .pie-c { padding: 20px; background-color: #0b1224; border-top: 1px solid #1a294c; }
        .total-c { display: flex; justify-content: space-between; font-size: 1.2rem; margin-bottom: 15px; }
        .total-c strong { color: #ffd644; }
        .btn-pagar-c { width: 100%; padding: 15px; background-color: #ffd644; color: #121e3b; border: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: background-color 0.2s; }
        .btn-pagar-c:hover { background-color: #e6c03d; }
        .metodos-pago-c { text-align: center; color: #a0aabf; font-size: 0.85rem; margin-bottom: 15px; }
        .logos-pago { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
        .icono-pago { height: 20px; vertical-align: middle; border-radius: 4px; }
        .metodo-item { display: flex; align-items: center; gap: 5px; }
    `;
    document.head.appendChild(estilos);

    // 2. Construir e inyectar HTML
    const contenedorCarrito = document.createElement('div');
    contenedorCarrito.innerHTML = `
        <div id="carrito-flotante-js" title="Ver Carrito de Compras">
            <i class="fa-solid fa-cart-shopping"></i>
            <span id="contador-c">0</span>
        </div>
        
        <aside id="panel-carrito-js">
            <div class="cabecera-c">
                <h2 data-i18n="car_titulo">Carrito CiberShield</h2>
                <button class="btn-cerrar-c" id="cerrar-panel-c">✕</button>
            </div>
            
            <div id="lista-productos-c"></div>
            
            <div class="pie-c">
                <div class="total-c">
                    <span data-i18n="car_total">Total:</span>
                    <strong><span id="simbolo-total-c">S/</span> <span id="total-precio-c">0.00</span></strong>
                </div>
                
                <div class="metodos-pago-c">
                    <span data-i18n="car_seguro">Paga de forma segura con:</span><br>
                    <div class="logos-pago" id="contenedor-logos-pago"></div>
                </div>
                
                <button class="btn-pagar-c" id="btn-procesar-pago" data-i18n="car_pagar">Proceder al Pago</button>
            </div>
        </aside>
    `;
    document.body.appendChild(contenedorCarrito);

    // 3. CONFIGURACIÓN DEL MOTOR DE DIVISAS E IMPUESTOS
    const configuracionMoneda = {
        es: { simbolo: "S/", tasa: 1, impuesto: 0 }, // Perú (Local) - Sin impuesto extra
        qu: { simbolo: "S/", tasa: 1, impuesto: 0 }, // Perú (Quechua)
        en: { simbolo: "$", tasa: 0.27, impuesto: 0.35 }, // USD + 35% (Aduanas y envíos internacionales)
        zh: { simbolo: "¥", tasa: 1.95, impuesto: 0.35 }, // CNY + 35%
        ru: { simbolo: "₽", tasa: 26.5, impuesto: 0.35 }, // RUB + 35%
        de: { simbolo: "€", tasa: 0.25, impuesto: 0.35 }, // EUR + 35%
        fr: { simbolo: "€", tasa: 0.25, impuesto: 0.35 }, // EUR + 35%
        ca: { simbolo: "€", tasa: 0.25, impuesto: 0.35 }, // EUR + 35%
        ja: { simbolo: "¥", tasa: 41.0, impuesto: 0.35 }, // JPY + 35%
        ko: { simbolo: "₩", tasa: 370.0, impuesto: 0.35 } // KRW + 35%
    };

    function obtenerPrecioFinal(precioBasePEN, idioma) {
        const config = configuracionMoneda[idioma] || configuracionMoneda['es'];
        const precioConImpuestos = precioBasePEN + (precioBasePEN * config.impuesto);
        const precioConvertido = precioConImpuestos * config.tasa;
        return { valor: precioConvertido, simbolo: config.simbolo };
    }

    let carrito = [];
    let total = 0; // Guardará el total numérico ya convertido

    const panel = document.getElementById('panel-carrito-js');
    const btnFlotante = document.getElementById('carrito-flotante-js');
    const btnCerrar = document.getElementById('cerrar-panel-c');
    const listaDOM = document.getElementById('lista-productos-c');
    const contadorDOM = document.getElementById('contador-c');
    const totalDOM = document.getElementById('total-precio-c');
    const simboloDOM = document.getElementById('simbolo-total-c');
    const btnPago = document.getElementById('btn-procesar-pago');

    const clavesProductos = {
        "Antivirus Pro / Hogar": "cat_prod_1",
        "Antivirus Hogar": "cat_prod_1", 
        "VPN Segura": "cat_prod_2",
        "Firewall Empresarial": "cat_prod_3",
        "Firewall Básico": "cat_prod_4",
        "Llave USB": "cat_prod_5",
        "INSTALACIÓN": "serv_1_tit",
        "CONSULTORÍA": "serv_2_tit",
        "SOPORTE TÉCNICO": "serv_3_tit"
    };

    // 4. Lógica de Interfaz del Carrito
    btnFlotante.addEventListener('click', () => panel.classList.add('abierto'));
    btnCerrar.addEventListener('click', () => panel.classList.remove('abierto'));

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-agregar')) {
            const nombre = e.target.getAttribute('data-nombre');
            // El carrito siempre almacena internamente el precio base en PEN puro
            const precioBase = parseFloat(e.target.getAttribute('data-precio'));

            carrito.push({ nombre, precioBase });
            actualizarCarrito(); 
            panel.classList.add('abierto');
        }
    });

    listaDOM.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar-c')) {
            const index = e.target.getAttribute('data-index');
            carrito.splice(index, 1); 
            actualizarCarrito(); 
        }
    });

    function actualizarCarrito() {
        listaDOM.innerHTML = ''; 
        let totalConvertido = 0; 
        const idiomaActual = localStorage.getItem('cs_idioma') || 'es';
        const config = configuracionMoneda[idiomaActual] || configuracionMoneda['es'];

        carrito.forEach((item, index) => {
            const precioCalc = obtenerPrecioFinal(item.precioBase, idiomaActual);
            totalConvertido += precioCalc.valor; 
            
            let nombreMostrar = item.nombre;
            const claveDiccionario = clavesProductos[item.nombre];
            if (claveDiccionario && typeof traducciones !== 'undefined' && traducciones[idiomaActual] && traducciones[idiomaActual][claveDiccionario]) {
                nombreMostrar = traducciones[idiomaActual][claveDiccionario];
            }
            
            const div = document.createElement('div');
            div.classList.add('item-c');
            div.innerHTML = `
                <span>${nombreMostrar}</span> 
                <div class="item-der-c">
                    <span>${precioCalc.simbolo} ${precioCalc.valor.toFixed(2)}</span>
                    <button class="btn-eliminar-c" data-index="${index}">❌</button>
                </div>
            `;
            listaDOM.appendChild(div);
        });
        
        contadorDOM.innerText = carrito.length;
        simboloDOM.innerText = config.simbolo;
        totalDOM.innerText = totalConvertido.toFixed(2);
        total = totalConvertido; // Sincronizamos el total convertido para la pasarela
    }

    // 5. Motor de vista del Catálogo
    function actualizarPreciosVista(idioma) {
        const elementosPrecio = document.querySelectorAll('.precio-dinamico');
        elementosPrecio.forEach(el => {
            const base = parseFloat(el.getAttribute('data-base'));
            if (!isNaN(base)) {
                const precioCalc = obtenerPrecioFinal(base, idioma);
                el.innerText = `${precioCalc.simbolo} ${precioCalc.valor.toFixed(2)}`;
            }
        });
    }

    // 6. Pasarela de Pagos
    btnPago.addEventListener('click', () => {
        if (carrito.length === 0) {
            const idiomaActual = localStorage.getItem('cs_idioma') || 'es';
            let mensajeVacio = "El carrito está vacío";
            if(typeof traducciones !== 'undefined' && traducciones[idiomaActual] && traducciones[idiomaActual].car_vacio) {
                mensajeVacio = traducciones[idiomaActual].car_vacio;
            }
            alert(mensajeVacio);
            return;
        }
        
        panel.classList.remove('abierto');
        const config = configuracionMoneda[localStorage.getItem('cs_idioma') || 'es'];
        abrirPasarelaPago(total, config.simbolo);
    });

    function abrirPasarelaPago(montoTotal, simboloActual) {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'modal-pago-overlay';
        Object.assign(modalOverlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: '2000000',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        });

        const modalBox = document.createElement('div');
        modalBox.id = 'modal-pago-box';
        Object.assign(modalBox.style, {
            backgroundColor: '#121e3b', color: '#fff', padding: '30px',
            borderRadius: '12px', width: '400px', maxWidth: '90%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)', fontFamily: 'Arial, sans-serif'
        });

        modalBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #ffd644;">Checkout CiberShield</h3>
                <button id="btn-cerrar-pasarela" style="background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer;">✕</button>
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 0.9rem; color: #a0aabf;" data-i18n="chk_total">Total a Pagar</p>
                <h2 id="checkout-total-dinamico" style="margin: 5px 0 0 0; font-size: 2rem; color: #fff;">${simboloActual} ${montoTotal.toFixed(2)}</h2>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button id="tab-tarjeta" style="flex: 1; padding: 10px; background-color: #ffd644; color: #121e3b; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">💳 <span data-i18n="chk_tarjeta_btn">Tarjeta</span></button>
                <button id="tab-billetera" style="flex: 1; padding: 10px; background-color: #1a294c; color: #fff; border: 1px solid #333; border-radius: 6px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 5px;">
                    <img src="./img/yape.png" style="height: 16px; border-radius: 3px;" alt="Yape" onerror="this.style.display='none'"> / 
                    <img src="./img/plin.png" style="height: 16px; border-radius: 3px;" alt="Plin" onerror="this.style.display='none'">
                </button>
            </div>

            <div id="form-tarjeta">
                <input type="text" data-i18n="chk_ph_num" placeholder="Número de Tarjeta" style="width: 100%; padding: 12px; margin-bottom: 10px; border-radius: 6px; border: 1px solid #333; background-color: #0b1224; color: #fff; box-sizing: border-box;">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="text" placeholder="MM/AA" style="flex: 1; padding: 12px; border-radius: 6px; border: 1px solid #333; background-color: #0b1224; color: #fff; box-sizing: border-box;">
                    <input type="text" placeholder="CVC" style="flex: 1; padding: 12px; border-radius: 6px; border: 1px solid #333; background-color: #0b1224; color: #fff; box-sizing: border-box;">
                </div>
                <input type="text" data-i18n="chk_ph_titular" placeholder="Titular de la tarjeta" style="width: 100%; padding: 12px; margin-bottom: 20px; border-radius: 6px; border: 1px solid #333; background-color: #0b1224; color: #fff; box-sizing: border-box;">
            </div>

            <div id="form-billetera" style="display: none; text-align: center; padding: 20px 0;">
                <p style="color: #a0aabf; margin-bottom: 15px;" data-i18n="chk_qr_desc">Escanea el código QR para pagar</p>
                <div style="width: 180px; height: 180px; margin: 0 auto 15px auto; border-radius: 12px; overflow: hidden; display: flex; justify-content: center; align-items: center; background-color: #fff; border: 3px solid #ffd644; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                    <img src="./img/qr.jpeg" alt="Código QR" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <p style="font-size: 1.1rem; font-weight: bold; color: #ffd644;"><span data-i18n="chk_num">Número:</span> 951 108 456</p>
            </div>

            <button id="btn-procesar-final" data-i18n="chk_btn_procesar" style="width: 100%; padding: 15px; background-color: #28a745; color: #fff; border: none; border-radius: 8px; font-weight: bold; font-size: 1.1rem; cursor: pointer;">Procesar Pago</button>
        `;

        modalOverlay.appendChild(modalBox);
        document.body.appendChild(modalOverlay);

        if (typeof cambiarIdioma === 'function') {
            const idiomaActual = localStorage.getItem('cs_idioma') || 'es';
            cambiarIdioma(idiomaActual);
        }

        const tabTarjeta = document.getElementById('tab-tarjeta');
        const tabBilletera = document.getElementById('tab-billetera');
        const formTarjeta = document.getElementById('form-tarjeta');
        const formBilletera = document.getElementById('form-billetera');

        tabTarjeta.addEventListener('click', () => {
            tabTarjeta.style.backgroundColor = '#ffd644';
            tabTarjeta.style.color = '#121e3b';
            tabBilletera.style.backgroundColor = '#1a294c';
            tabBilletera.style.color = '#fff';
            formTarjeta.style.display = 'block';
            formBilletera.style.display = 'none';
        });

        tabBilletera.addEventListener('click', () => {
            tabBilletera.style.backgroundColor = '#ffd644';
            tabBilletera.style.color = '#121e3b';
            tabTarjeta.style.backgroundColor = '#1a294c';
            tabTarjeta.style.color = '#fff';
            formBilletera.style.display = 'block';
            formTarjeta.style.display = 'none';
        });

        document.getElementById('btn-cerrar-pasarela').addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });

        const btnProcesarFinal = document.getElementById('btn-procesar-final');
        btnProcesarFinal.addEventListener('click', () => {
            const idiomaActual = localStorage.getItem('cs_idioma') || 'es';
            let txtProcesando = "Procesando...";
            if(typeof traducciones !== 'undefined' && traducciones[idiomaActual] && traducciones[idiomaActual].chk_procesando) {
                txtProcesando = traducciones[idiomaActual].chk_procesando;
            }
            
            btnProcesarFinal.innerText = txtProcesando;
            btnProcesarFinal.style.backgroundColor = "#ffca28";
            btnProcesarFinal.disabled = true;

            setTimeout(() => {
                modalBox.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
                        <h2 style="color: #28a745; margin-bottom: 10px;" data-i18n="chk_exito_tit">¡Pago Exitoso!</h2>
                        <p style="color: #fff;" data-i18n="chk_exito_desc">Tu compra se ha completado. Recibirás tus credenciales en breve.</p>
                        <button id="btn-finalizar-ok" data-i18n="chk_btn_cerrar" style="margin-top: 20px; padding: 10px 20px; background-color: #ffd644; color: #121e3b; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Cerrar</button>
                    </div>
                `;

                if (typeof cambiarIdioma === 'function') cambiarIdioma(idiomaActual);

                carrito = [];
                actualizarCarrito();

                document.getElementById('btn-finalizar-ok').addEventListener('click', () => {
                    document.body.removeChild(modalOverlay);
                });
            }, 2000);
        });
    }

    // 7. Lógica INTELIGENTE A PRUEBA DE BALAS para logos de pago
    function actualizarTextoYLogosTarjetas() {
        const idiomaActual = localStorage.getItem('cs_idioma') || 'es';
        const contenedorLogos = document.getElementById('contenedor-logos-pago');
        const btnFlotante = document.getElementById('carrito-flotante-js');
        
        if (typeof traducciones !== 'undefined' && traducciones[idiomaActual]) {
            if (btnFlotante && traducciones[idiomaActual]['car_titulo']) {
                btnFlotante.title = traducciones[idiomaActual]['car_titulo'];
            }
            
            if (contenedorLogos && traducciones[idiomaActual]['car_metodos']) {
                const textoCompleto = traducciones[idiomaActual]['car_metodos'];
                const partes = textoCompleto.split('|').map(p => p.trim());
                
                if (partes.length >= 3) {
                    contenedorLogos.innerHTML = `
                        <span class="metodo-item">💳 ${partes[0]}</span>
                        <span>&nbsp;|&nbsp;</span>
                        <span class="metodo-item"><img src="img/yape.png" class="icono-pago" alt="Yape" onerror="this.style.display='none'"> ${partes[1]}</span>
                        <span>&nbsp;|&nbsp;</span>
                        <span class="metodo-item"><img src="img/plin.png" class="icono-pago" alt="Plin" onerror="this.style.display='none'"> ${partes[2]}</span>
                    `;
                } else {
                    contenedorLogos.innerHTML = `<span class="metodo-item">${textoCompleto}</span>`;
                }
            }
        }
    }

    // Al cargar la página
    if (typeof cambiarIdioma === 'function') {
        const idiomaActual = localStorage.getItem('cs_idioma') || 'es';
        cambiarIdioma(idiomaActual);
        actualizarTextoYLogosTarjetas();
        actualizarPreciosVista(idiomaActual);
    }

    // 8. Escuchar el cambio de idioma general
    document.addEventListener('change', (e) => {
        if (e.target.id === 'selector-idioma') {
            const nuevoIdioma = e.target.value;
            setTimeout(() => {
                actualizarTextoYLogosTarjetas();
                actualizarPreciosVista(nuevoIdioma); // Transforma los precios del catálogo
                actualizarCarrito();                 // Transforma los precios del carrito
                
                // Transforma el precio de la pasarela de pagos en vivo si está abierta
                if (document.getElementById('modal-pago-overlay')) {
                    cambiarIdioma(nuevoIdioma);
                    const config = configuracionMoneda[nuevoIdioma] || configuracionMoneda['es'];
                    const totalElem = document.getElementById('checkout-total-dinamico');
                    if (totalElem) {
                        totalElem.innerText = `${config.simbolo} ${total.toFixed(2)}`;
                    }
                }
            }, 50);
        }
    });
});