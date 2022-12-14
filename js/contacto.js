//Luego de apretar "enviar" en contacto. Aparece simplemente tocando en contacto
let contacto = "¡Gracias por elegirnos!"
let contacto2= "  Los datos han sido enviados correctamente. ¡Pronto te contactaremos!"

const formulario = document.forms.contacto;

formulario.addEventListener('submit', function(e){
    e.preventDefault();

    alert(contacto + " " + contacto2);
    formulario.reset();

    // En un futuro se agregará para enviar un correo electrónico real
    return;
});