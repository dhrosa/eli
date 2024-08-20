dialog = null;
html_classes = document.documentElement.classList;

openDetails = (event) => {
    console.log("openDetails");
    console.log(event);
    event.stopImmediatePropagation();
    conversation = event.target.closest(".conversation");
    dialog = conversation.querySelector("dialog");
    dialog.showModal();
    html_classes.add("modal-is-open");
}

closeDetails = (event) => {
    html_classes.remove("modal-is-open");
    dialog.close();
    dialog = null;
}

document.addEventListener("click", (event) => {
    if (dialog == null) {
        return;
    }
    content = dialog.querySelector("article");
    if (!content.contains(event.target)) {
        closeDetails();
    }
});
