// Función para obtener todos los contactos
function getContacts() {
    fetch("https://railway-node-express-production-3b13.up.railway.app/scrape")
        .then((response) => response.json())
        .then((data) => {
            const contactList = document.getElementById("contact-list");
            const contacts = data || [];

            if (contacts.length > 0) {
                contactList.innerHTML = ""; // Limpiar la lista de contactos

                contacts.forEach((contact) => {
                    const li = document.createElement("li");
                    const link = document.createElement("a");
                    link.href = `contacts/${contact.id}`;
                    link.textContent =
                        contact.nombre || contact.apellido
                            ? `${contact.nombre} ${contact.apellido}`
                            : "No Name";
                    if (contact.favorite) {
                        const span = document.createElement("span");
                        span.textContent = "★";
                        link.appendChild(span);
                    }
                    li.appendChild(link);
                    contactList.appendChild(li);
                });
            } else {
                contactList.innerHTML = "<p><i>No contacts</i></p>";
            }
        })
        .catch((error) => {
            console.error("Error fetching contacts:", error);
        });
}

// Función para crear un nuevo contacto
function createContact(event) {
    event.preventDefault();

    const form = document.getElementById("create-contact-form");
    const formData = new FormData(form);
    const data = {
        nombre: formData.get("nombre"),
        apellido: formData.get("apellido"),
        telefono: formData.get("telefono"),
    };

    fetch("https://railway-node-express-production-3b13.up.railway.app/contacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.exito) {
                console.log(
                    "Contact created successfully:",
                    result.nombre + " " + result.apellido
                );
                form.reset();
                getContacts(); // Actualizar la lista de contactos
            } else {
                console.error("Error creating contact:", result.error);
            }
        })
        .catch((error) => {
            console.error("Error creating contact:", error);
        });
} // Obtener todos los contactos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    getContacts();
});

// Manejar el evento de envío del formulario para crear un nuevo contacto
const createContactForm = document.getElementById("create-contact-form");
createContactForm.addEventListener("submit", createContact);

// Función para filtrar los contactos
function filterContacts() {
    const searchTerm = this.value.toLowerCase();
    const contactLinks = document.querySelectorAll("#contact-list a");

    contactLinks.forEach((link) => {
        const contactName = link.textContent.toLowerCase();
        if (contactName.includes(searchTerm)) {
            link.style.display = "block";
            link.parentNode.style.display = "block";
        } else {
            link.style.display = "none";
            link.parentNode.style.display = "none";
        }
    });
}

// Obtener la referencia al campo de búsqueda
const searchInput = document.getElementById("q");

// Agregar un event listener al campo de búsqueda
searchInput.addEventListener("input", filterContacts);