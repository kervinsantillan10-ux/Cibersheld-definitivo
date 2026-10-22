// chatboot.js - Soporte flotante inteligente para CiberShield con Traducción Integrada
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inyectar estilos CSS dinámicamente blindados con !important
    const estilosChat = document.createElement('style');
    estilosChat.innerHTML = `
        #chat-btn { position: fixed !important; bottom: 30px !important; left: 30px !important; z-index: 9999 !important; background-color: transparent !important; border: none !important; outline: none !important; padding: 0 !important; cursor: pointer !important; transition: transform 0.2s !important; border-radius: 50% !important; width: 75px !important; height: 75px !important; display: flex !important; justify-content: center !important; align-items: center !important; box-shadow: none !important; }
        #chat-btn:hover { transform: scale(1.05) !important; }
        .chat-logo-img { width: 100% !important; height: 100% !important; border-radius: 50% !important; border: 2px solid #ffd644 !important; box-shadow: 0 4px 10px rgba(0,0,0,0.5) !important; object-fit: cover !important; display: block !important; }
        #chat-container { position: fixed; bottom: 110px; left: 30px; width: 350px; max-width: 90vw; background-color: #121e3b; color: #fff; border-radius: 12px; border: 2px solid #ffd644; box-shadow: 0 5px 20px rgba(0,0,0,0.5); z-index: 10000; display: flex; flex-direction: column; font-family: Arial, sans-serif; overflow: hidden; }
        .chat-header { display: flex; justify-content: space-between; align-items: center; padding: 15px; background-color: #0b1224; border-bottom: 2px solid #ffd644; }
        .chat-header h3 { margin: 0; color: #ffd644; font-size: 1.1rem; }
        .header-actions { display: flex; gap: 8px; }
        .action-btn { background: none; border: none; color: #fff; font-size: 1rem; cursor: pointer; }
        .action-btn:hover { color: #ffd644; }
        .chat-box { height: 300px; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; background-color: #0b1224; }
        .message { padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; max-width: 80%; line-height: 1.4; }
        .bot-message { background-color: #1a294c; color: #fff; align-self: flex-start; border-left: 3px solid #ffd644; }
        .user-message { background-color: #ffd644; color: #121e3b; align-self: flex-end; font-weight: bold; }
        .suggestions { display: flex; flex-direction: column; gap: 6px; margin-top: 5px; }
        .sugg-btn { background-color: #121e3b; color: #ffd644; border: 1px solid #ffd644; padding: 8px 12px; border-radius: 15px; cursor: pointer; text-align: left; font-size: 0.85rem; transition: background 0.2s; }
        .sugg-btn:hover { background-color: #ffd644; color: #121e3b; }
        .chat-input-area { display: flex; padding: 10px; background-color: #121e3b; border-top: 1px solid #1a294c; }
        #chat-input { flex-grow: 1; padding: 10px; border-radius: 6px; border: 1px solid #333; background-color: #0b1224; color: #fff; outline: none; }
        #send-btn { background-color: #ffd644; color: #121e3b; border: none; padding: 0 15px; margin-left: 8px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    `;
    document.head.appendChild(estilosChat);

    // 2. Estructura HTML del Chatbot con etiquetas data-i18n
    const chatbotHTML = `
    <button id="chat-btn" title="Soporte CiberShield">
        <img src="./img/chatboot.jpg" alt="CiberBot" class="chat-logo-img">
    </button>
    <div id="chat-container" style="display: none;">
        <div class="chat-header">
            <h3 data-i18n="bot_title">Soporte CiberShield</h3>
            <div class="header-actions">
                <button class="action-btn" id="minimize-btn" title="Minimizar">_</button>
                <button class="action-btn" id="close-btn" title="Cerrar chat">✖</button>
            </div>
        </div>
        <div class="chat-box" id="chat-box">
            <div class="message bot-message" data-i18n="bot_welcome" id="bot-welcome-msg">
                ¡Hola! Soy CiberBot. Bienvenido a CiberShield. ¿En qué podemos ayudarte a proteger tu mundo digital hoy?
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" data-i18n="bot_ph_input" placeholder="Escribe tu mensaje...">
            <button id="send-btn" data-i18n="bot_btn_send">Enviar</button>
        </div>
    </div>
    `;

    const chatbotDiv = document.createElement('div');
    chatbotDiv.innerHTML = chatbotHTML;
    document.body.appendChild(chatbotDiv);

    // Forzar traducción inicial de la estructura estática si el traductor ya está cargado
    if (typeof cambiarIdioma === 'function') {
        const idiomaActual = localStorage.getItem('cs_idioma') || 'es';
        cambiarIdioma(idiomaActual);
    }

    inicializarChatbot();
});

// 3. Lógica e inteligencia del bot
function inicializarChatbot() {
    const chatBtn = document.getElementById('chat-btn');
    const minimizeBtn = document.getElementById('minimize-btn');
    const closeBtn = document.getElementById('close-btn');
    const chatContainer = document.getElementById('chat-container');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    // Guardar el estado inicial para poder resetear
    const initialChatContent = chatBox.innerHTML;
    let estadoBot = "normal";

    // --- CEREBRO DEL BOT (Se mantiene igual, en español, ya que es IA simulada de soporte técnico) ---
    function obtenerRespuestaBot(textoUsuario) {
        let texto = textoUsuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
        
        if (estadoBot === "esperando_asesor") {
            if (texto.includes("si") || texto.includes("claro") || texto.includes("por supuesto") || texto.includes("ok") || texto.includes("bueno") || texto.includes("por favor") || texto.includes("dale")) {
                estadoBot = "normal"; 
                return "Perfecto. Por favor déjanos tu número de celular aquí en el chat, o escríbenos directamente al WhatsApp +51 951 108 456 y un asesor se comunicará contigo en menos de 10 minutos.";
            } 
            else if (texto.includes("no") || texto.includes("gracias") || texto.includes("nada") || texto.includes("despues") || texto.includes("ninguno")) {
                estadoBot = "normal"; 
                return "Entendido. No te preocupes. Si cambias de opinión o tienes alguna otra duda sobre nuestros servicios, aquí estaré para ayudarte.";
            } 
            else {
                estadoBot = "normal";
            }
        }

        if (texto.includes("hackeado") || texto.includes("virus") || texto.includes("robaron") || texto.includes("urgente") || texto.includes("infectado")) {
            return "⚠️ Si crees que tu equipo está infectado, desconéctate de internet inmediatamente y no ingreses contraseñas. Escríbenos a urgencias@cibershield.com para soporte de respuesta a incidentes.";
        }
        else if (texto.includes("hola") || texto.includes("buenos") || texto.includes("buenas") || texto.includes("saludos") || texto.includes("hey")) {
            return "¡Hola! Soy CiberBot. ¿En qué te puedo ayudar a proteger tu información y tus dispositivos hoy?";
        } 
        else if (texto.includes("catalogo") || texto.includes("productos") || texto.includes("ofrece") || texto.includes("venden") || texto.includes("comprar")) {
            return "En CiberShield ofrecemos licencias de Antivirus premium, Firewalls, VPNs cifradas, llaves de seguridad física y auditorías de red. Visita la sección 'Catálogo' en el menú principal.";
        } 
        else if (texto.includes("antivirus") || texto.includes("malware") || texto.includes("analisis") || texto.includes("defender")) {
            return "Nuestros antivirus ofrecen protección en tiempo real contra malware, ransomware y phishing. Tenemos licencias para 1, 3 y 5 dispositivos.";
        }
        else if (texto.includes("vpn") || texto.includes("ip") || texto.includes("privacidad") || texto.includes("ocultar") || texto.includes("navegar")) {
            return "Nuestra VPN encripta tu tráfico web con grado militar, ocultando tu IP real para que navegues de forma anónima y segura en redes Wi-Fi públicas.";
        }
        else if (texto.includes("llave") || texto.includes("token") || texto.includes("fisica") || texto.includes("usb") || texto.includes("fido")) {
            return "Las llaves de seguridad USB (Tokens) son el método más fuerte de autenticación en dos pasos (2FA). Evitan que alguien acceda a tus cuentas aunque tengan tu contraseña.";
        }
        else if (texto.includes("windows") || texto.includes("mac") || texto.includes("android") || texto.includes("iphone") || texto.includes("linux")) {
            return "Nuestros productos son multiplataforma. Ofrecemos instaladores compatibles con Windows 10/11, macOS, distribuciones Linux, Android e iOS.";
        }
        else if (texto.includes("empresa") || texto.includes("negocio") || texto.includes("corporativo") || texto.includes("servidor")) {
            return "Para empresas, diseñamos arquitecturas de red a medida (segmentación, endpoints, firewalls perimetrales). Puedes solicitar una evaluación en la sección de 'Contacto'.";
        }
        else if (texto.includes("precio") || texto.includes("costo") || texto.includes("plan") || texto.includes("cuanto") || texto.includes("descuento")) {
            return "Los planes individuales van desde S/50 mensuales. Las llaves de seguridad físicas tienen un pago único. ¡Mantente atento a la web para ver descuentos!";
        } 
        else if (texto.includes("pago") || texto.includes("yape") || texto.includes("plin") || texto.includes("tarjeta") || texto.includes("efectivo") || texto.includes("factura")) {
            return "Puedes pagar de forma 100% segura usando Yape, Plin o tarjetas de crédito/débito. Emitimos boleta y factura electrónica.";
        }
        else if (texto.includes("envio") || texto.includes("entrega") || texto.includes("demora") || texto.includes("llega")) {
            return "Las licencias de software (Antivirus, VPN) se envían a tu correo de forma instantánea. Las llaves físicas se envían por courier y demoran de 24 a 48 horas hábiles.";
        }
        else if (texto.includes("registro") || texto.includes("cuenta") || texto.includes("sesion") || texto.includes("contraseña") || texto.includes("perfil")) {
            return "Puedes crear una cuenta o recuperar tu contraseña desde los botones de 'Registro' o 'Iniciar Sesión' en el menú principal superior.";
        }
        else if (texto.includes("phishing") || texto.includes("estafa") || texto.includes("falso") || texto.includes("robo") || texto.includes("link")) {
            return "El phishing es un fraude donde se hacen pasar por empresas reales para robar tus datos. Nunca des clic en enlaces sospechosos (links) en correos desconocidos. Nuestros antivirus bloquean estas amenazas automáticamente.";
        }
        else if (texto.includes("lento") || texto.includes("congela") || texto.includes("optimizar") || texto.includes("limpiar")) {
            return "Si tu equipo está muy lento, podría ser falta de mantenimiento, falta de memoria o un malware ejecutándose en segundo plano. Te sugerimos realizar un análisis profundo con nuestras herramientas.";
        }
        else if (texto.includes("quien eres") || texto.includes("eres humano") || texto.includes("como te llamas") || texto.includes("robot") || texto.includes("ia")) {
            return "Soy CiberBot, la Inteligencia Artificial asistente de CiberShield. Estoy aquí para resolver tus dudas de ciberseguridad las 24 horas, pero siempre puedo transferirte con un humano si lo requieres.";
        }
        else if (texto.includes("contacto") || texto.includes("hablar") || texto.includes("asesor") || texto.includes("telefono") || texto.includes("correo") || texto.includes("ayuda") || texto.includes("humano")) {
            return "Si necesitas asistencia humana directa, escríbenos a soporte@cibershield.com o envíanos un mensaje al WhatsApp +51 951 108 456.";
        } 
        else if (texto.includes("gracias") || texto.includes("excelente") || texto.includes("adios") || texto.includes("chau") || texto.includes("perfecto")) {
            return "¡Un placer ayudarte! En CiberShield tu seguridad es nuestra prioridad. Cierra el chat cuando lo desees.";
        } 
        else {
            estadoBot = "esperando_asesor";
            return "Esa es una pregunta interesante. Como asistente virtual aún estoy aprendiendo y no tengo una respuesta exacta. ¿Te gustaría que un asesor humano se ponga en contacto contigo para resolver tu duda?";
        }
    }

    // --- INTERACCIONES DE LA VENTANA ---
    chatBtn.addEventListener('click', () => {
        chatContainer.style.display = (chatContainer.style.display === 'none' || chatContainer.style.display === '') ? 'flex' : 'none';
    });

    minimizeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
        chatBox.innerHTML = initialChatContent; 
        
        // Retraducir el mensaje inicial si cerramos y abrimos el bot
        if (typeof cambiarIdioma === 'function') {
            const idiomaActual = localStorage.getItem('cs_idioma') || 'es';
            cambiarIdioma(idiomaActual);
        }

        estadoBot = "normal"; 
        mostrarSugerencias(); 
    });

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message');
        div.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        div.textContent = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // --- MOSTRAR BOTONES DE SUGERENCIA TRADUCIDOS ---
    function mostrarSugerencias() {
        const sugerenciasViejas = document.getElementById('dynamic-suggestions');
        if (sugerenciasViejas) sugerenciasViejas.remove();

        if (estadoBot !== "esperando_asesor") {
            const suggDiv = document.createElement('div');
            suggDiv.id = 'dynamic-suggestions';
            suggDiv.classList.add('suggestions');
            suggDiv.innerHTML = `
                <button class="sugg-btn" data-i18n="bot_sug_1">¿Qué servicios ofrecen?</button>
                <button class="sugg-btn" data-i18n="bot_sug_2">Ver planes y precios</button>
                <button class="sugg-btn" data-i18n="bot_sug_3">Hablar con un asesor</button>
            `;
            chatBox.appendChild(suggDiv);
            chatBox.scrollTop = chatBox.scrollHeight;

            // Traducir dinámicamente los botones recién inyectados
            if (typeof cambiarIdioma === 'function') {
                const idiomaActual = localStorage.getItem('cs_idioma') || 'es';
                cambiarIdioma(idiomaActual);
            }

            const botones = suggDiv.querySelectorAll('.sugg-btn');
            botones.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const pregunta = e.target.textContent;
                    suggDiv.remove(); 
                    appendMessage(pregunta, 'user');

                    setTimeout(() => {
                        const respuesta = obtenerRespuestaBot(pregunta);
                        appendMessage(respuesta, 'bot');
                        mostrarSugerencias(); 
                    }, 600);
                });
            });
        }
    }

    // Inicia las sugerencias la primera vez
    mostrarSugerencias();

    // --- ENVIAR MENSAJES MANUALMENTE ---
    function sendMessage() {
        const texto = chatInput.value.trim();
        if (texto !== "") {
            const sugerenciasViejas = document.getElementById('dynamic-suggestions');
            if (sugerenciasViejas) sugerenciasViejas.remove();

            appendMessage(texto, 'user');
            chatInput.value = '';

            setTimeout(() => {
                const respuesta = obtenerRespuestaBot(texto); 
                appendMessage(respuesta, 'bot');
                mostrarSugerencias(); 
            }, 800); 
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Detectar si el usuario cambia el idioma general de la página para actualizar las sugerencias
    document.addEventListener('change', (e) => {
        if (e.target.id === 'selector-idioma') {
            setTimeout(() => {
                // Forzamos la actualización de la cabecera, input y mensaje inicial si están
                if (typeof cambiarIdioma === 'function') {
                    cambiarIdioma(e.target.value);
                }
            }, 100);
        }
    });
}