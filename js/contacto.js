// Credenciales de Supabase
const SUPABASE_URL = 'https://ssosstgiclvshilkqksf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cZvL38ywN6K6aIe2JV0Mqw_jWcFth4N';

document.addEventListener('DOMContentLoaded', () => {
    let supabaseClient = null;
    if (typeof window.supabase !== 'undefined') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.error('Error: La librería de Supabase no se cargó.');
        return;
    }

    const miFormulario = document.getElementById('contactForm');

    if (miFormulario) {
        miFormulario.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Capturar elementos de forma directa
            const inputNombre = document.getElementById('nombre');
            const inputPresupuesto = document.getElementById('presupuesto');
            const inputEmail = document.getElementById('email');
            const inputMensaje = document.getElementById('mensaje');

            // Mostrar en la consola del navegador qué está detectando exactamente
            console.log("Input Nombre encontrado:", inputNombre);
            console.log("Valor escrito en Nombre:", inputNombre ? inputNombre.value : "No existe");
            console.log("Valor escrito en Email:", inputEmail ? inputEmail.value : "No existe");

            const nombreVal = inputNombre ? inputNombre.value.trim() : '';
            const presupuestoVal = inputPresupuesto ? inputPresupuesto.value.trim() : '';
            const emailVal = inputEmail ? inputEmail.value.trim() : '';
            const mensajeVal = inputMensaje ? inputMensaje.value.trim() : '';

            // Validación con más detalles en la alerta por si acaso
            if (!nombreVal || !emailVal) {
                alert(`Campos vacíos detectados -> Nombre: "${nombreVal}" | Email: "${emailVal}"`);
                return;
            }

            const presupuestoNum = presupuestoVal ? parseFloat(presupuestoVal) : null;

            try {
                const { data, error } = await supabaseClient
                    .from('Contactanos')
                    .insert([
                        { 
                            nombre: nombreVal, 
                            presupuesto: presupuestoNum, 
                            "correo electronico": emailVal, 
                            mensaje: mensajeVal 
                        }
                    ]);

                if (error) {
                    console.error('Error reportado por Supabase:', error);
                    alert('Error de Supabase: ' + error.message);
                } else {
                    alert('¡Mensaje enviado y guardado en Supabase con éxito!');
                    miFormulario.reset();
                    
                    // Mantener el idioma actual tras vaciar el formulario
                    const idiomaActual = localStorage.getItem('cs_idioma') || 'es';
                    if (typeof cambiarIdioma === 'function') {
                        cambiarIdioma(idiomaActual);
                    }
                }
            } catch (err) {
                console.error('Error de conexión:', err);
                alert('Ocurrió un error inesperado al conectar con Supabase.');
            }
        });
    } else {
        console.error('No se encontró el formulario con id="contactForm"');
    }
});