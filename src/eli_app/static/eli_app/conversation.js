dialog = null;
html_tag = document.documentElement;

openDetails = (event) => {
    console.log("openDetails");
    console.log(event);
    event.stopImmediatePropagation();
    conversation = event.target.closest(".conversation");
    dialog = conversation.querySelector("dialog");
    dialog.showModal();
    html_tag.classList.add("modal-is-open");
}

closeDetails = (event) => {
    html_tag.classList.remove("modal-is-open");
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

// Load initial theme setting from local storage. If missing, try a media query.
theme = localStorage.getItem("data-theme");
theme ??= matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
html_tag.dataset.theme = theme;

toggleTheme = () => {
    theme = (theme == "dark") ? "light" : "dark";
    localStorage.setItem("data-theme", theme);
    html_tag.dataset.theme = theme;
}
