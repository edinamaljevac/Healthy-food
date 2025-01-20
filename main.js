const language = localStorage.getItem("language") || "en";

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
  localStorage.setItem("language", "en");
  switchLanguage("en");
  updateActiveLanguage("en");
});

sr.addEventListener("click", () => {
  localStorage.setItem("language", "sr");
  switchLanguage("sr");
  updateActiveLanguage("sr");
});

if (enMobile && srMobile) {
  enMobile.addEventListener("click", () => {
    localStorage.setItem("language", "en");
    switchLanguage("en");
    updateActiveLanguage("en");
  });

  srMobile.addEventListener("click", () => {
    localStorage.setItem("language", "sr");
    switchLanguage("sr");
    updateActiveLanguage("sr");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("language") || "en";
  switchLanguage(savedLanguage);
  updateActiveLanguage(savedLanguage);
});

const handleSignout = () => {
  localStorage.removeItem("loginData");

  window.location.href = "../signIn/index.html";
};

const signoutButtons = document.querySelectorAll(".signout");
signoutButtons.forEach((el) => el.addEventListener("click", handleSignout));
