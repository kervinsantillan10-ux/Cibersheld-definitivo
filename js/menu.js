document.addEventListener("DOMContentLoaded", function() {
    const authContainer = document.getElementById('auth-container');
    
    // Verifica si hay sesión iniciada
    const isLogged = localStorage.getItem('cs_username');

    if (authContainer && isLogged) {
        // Inyecta los enlaces limpios con las etiquetas data-i18n agregadas
        authContainer.innerHTML = `
            <li><a href="usuario.html" data-i18n="menu_perfil">MI PERFIL</a></li>
            <li><a href="#" onclick="cerrarSesion(event)" data-i18n="menu_cerrar">CERRAR SESIÓN</a></li>
        `;
    }

    // CORRECCIÓN: Forzar el idioma usando localStorage en lugar de selector.value
    if (typeof cambiarIdioma === 'function') {
        const idiomaGuardado = localStorage.getItem('cs_idioma') || 'es';
        cambiarIdioma(idiomaGuardado);
    }
});

function cerrarSesion(event) {
    if(event) event.preventDefault();
    localStorage.removeItem('cs_username');
    localStorage.removeItem('cs_userphoto');
    window.location.reload();
}