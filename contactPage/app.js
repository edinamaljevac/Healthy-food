window.addEventListener("load", function () {
  const form = document.getElementById("contact-form");
  form.reset();
});

const nameInput = document.getElementById("nameInput");
const lastNameInput = document.getElementById("lastNameInput");
const messageInput = document.getElementById("messageInput");

const nameError = document.getElementById("nameError");
const lastNameError = document.getElementById("lastNameError");
const messageError = document.getElementById("messageError");

const nameRegex = /^[A-Za-z]{2,}$/;
const lastNameRegex = /^[A-Za-z]{5,}$/;
const messageRegex = /^.{10,}$/;

let currentLanguage = localStorage.getItem("language") || "en";

const errorMessages = {
  name: {
    en: "First name must contain at least 2 letters.",
    sr: "Ime mora sadržati bar 2 slova.",
  },
  lastName: {
    en: "Last name must contain at least 5 letters.",
    sr: "Prezime mora sadržati bar 5 slova.",
  },
  message: {
    en: "Message must be at least 10 characters long.",
    sr: "Poruka mora imati barem 10 karaktera.",
  },
};

function validateForm() {
  let isValid = true;

  if (!nameRegex.test(nameInput.value.trim())) {
    nameError.textContent = errorMessages.name[currentLanguage];
    nameError.style.color = "red";
    isValid = false;
  } else {
    nameError.textContent = "";
  }

  if (!lastNameRegex.test(lastNameInput.value.trim())) {
    lastNameError.textContent = errorMessages.lastName[currentLanguage];
    lastNameError.style.color = "red";
    isValid = false;
  } else {
    lastNameError.textContent = "";
  }

  if (!messageRegex.test(messageInput.value.trim())) {
    messageError.textContent = errorMessages.message[currentLanguage];
    messageError.style.color = "red";
    isValid = false;
  } else {
    messageError.textContent = "";
  }

  return isValid;
}

document
  .querySelector("button[type='submit']")
  .addEventListener("click", function (e) {
    e.preventDefault();

    if (validateForm()) {
      window.location.href = "../sentMessage/index.html";
    }
  });

const en = document.getElementById("english");
const sr = document.getElementById("serbian");

const enMobile = document.getElementById("english-mobile");
const srMobile = document.getElementById("serbian-mobile");

function switchLanguage(lang) {
  document.querySelectorAll("[data-lang-en]").forEach((el) => {
    if (el.placeholder) {
      el.placeholder = el.getAttribute(`data-lang-${lang}`);
    } else {
      el.textContent = el.getAttribute(`data-lang-${lang}`);
    }
  });

  currentLanguage = lang;
  localStorage.setItem("language", lang);

  if (nameError.textContent) {
    nameError.textContent = errorMessages.name[currentLanguage];
  }
  if (lastNameError.textContent) {
    lastNameError.textContent = errorMessages.lastName[currentLanguage];
  }
  if (messageError.textContent) {
    messageError.textContent = errorMessages.message[currentLanguage];
  }
}

function updateActiveLanguage(lang) {
  if (lang === "en") {
    en.style.color = "lightgreen";
    sr.style.color = "white";
  } else if (lang === "sr") {
    sr.style.color = "lightgreen";
    en.style.color = "white";
  }
}

en.addEventListener("click", () => {
  switchLanguage("en");
  updateActiveLanguage("en");
});

sr.addEventListener("click", () => {
  switchLanguage("sr");
  updateActiveLanguage("sr");
});

if (enMobile && srMobile) {
  enMobile.addEventListener("click", () => {
    switchLanguage("en");
    updateActiveLanguage("en");
  });

  srMobile.addEventListener("click", () => {
    switchLanguage("sr");
    updateActiveLanguage("sr");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  currentLanguage = localStorage.getItem("language") || "en";
  switchLanguage(currentLanguage);
  updateActiveLanguage(currentLanguage);
});

const handleSignout = () => {
  localStorage.removeItem("loginData");
  window.location.href = "../signIn/index.html";
};

const signoutButtons = document.querySelectorAll(".signout");
signoutButtons.forEach((el) => el.addEventListener("click", handleSignout));
