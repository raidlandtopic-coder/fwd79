// Show the selected subject name on the subject page.
const subjectHeading = document.getElementById("subject-heading");

if (subjectHeading) {
    const params = new URLSearchParams(window.location.search);
    const subjectName = params.get("name");

    if (subjectName) {
        subjectHeading.textContent = subjectName + " Study Materials";
        document.title = subjectName + " | IntellectDeck";
    }
}

// Front-end demo message for forms.
// Connect a backend/database to actually save or verify submitted information.
document.querySelectorAll(".demo-form").forEach(function(form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const message = form.querySelector(".form-message");
        if (message) {
            message.textContent = "Your form is ready, but saving or login needs a backend connection.";
        }
    });
});
