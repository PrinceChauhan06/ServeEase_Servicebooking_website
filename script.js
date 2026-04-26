const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const bookingForm = document.getElementById("booking-form");
const successMsg = document.getElementById("success-msg");
const newBookingBtn = document.getElementById("new-booking-btn");
const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast");
const dateInput = document.getElementById("bdate");

const showToast = (message) => {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 3200);
};

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 16);
});

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    navLinks.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
}

const getFieldGroup = (field) => field.closest(".form-group");

const setFieldError = (field, message) => {
  const group = getFieldGroup(field);
  if (!group) return;

  group.classList.toggle("is-invalid", Boolean(message));
  let error = group.querySelector(".field-error");

  if (!error) {
    error = document.createElement("div");
    error.className = "field-error";
    group.appendChild(error);
  }

  error.textContent = message || "";
};

const clearFieldError = (field) => setFieldError(field, "");

const validateField = (field) => {
  const value = field.value.trim();

  if (field.hasAttribute("required") && !value) {
    setFieldError(field, "This field is required.");
    return false;
  }

  if (field.type === "email" && value) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!emailOk) {
      setFieldError(field, "Enter a valid email address.");
      return false;
    }
  }

  if (field.type === "tel" && value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) {
      setFieldError(field, "Enter a valid phone number.");
      return false;
    }
  }

  clearFieldError(field);
  return true;
};

const attachLiveValidation = (form) => {
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => validateField(field));
    field.addEventListener("change", () => validateField(field));
  });
};

if (bookingForm) {
  attachLiveValidation(bookingForm);

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [...bookingForm.querySelectorAll("[required]")];
    const firstInvalid = fields.find((field) => !validateField(field));

    if (firstInvalid) {
      firstInvalid.focus();
      showToast("Please complete the highlighted booking fields.");
      return;
    }

    bookingForm.style.display = "none";
    successMsg.classList.add("visible");
    successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    showToast("Booking request submitted successfully.");
  });
}

if (newBookingBtn && bookingForm && successMsg) {
  newBookingBtn.addEventListener("click", () => {
    bookingForm.reset();
    bookingForm.style.display = "grid";
    successMsg.classList.remove("visible");
    bookingForm.querySelectorAll("input, select, textarea").forEach(clearFieldError);
    bookingForm.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

if (contactForm) {
  attachLiveValidation(contactForm);

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [...contactForm.querySelectorAll("[required]")];
    const firstInvalid = fields.find((field) => !validateField(field));

    if (firstInvalid) {
      firstInvalid.focus();
      showToast("Please complete the contact form before sending.");
      return;
    }

    contactForm.reset();
    contactForm.querySelectorAll("input, select, textarea").forEach(clearFieldError);
    showToast("Message sent. We will get back to you within 24 hours.");
  });
}

const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-link");

if (sections.length && navAnchors.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navAnchors.forEach((anchor) => anchor.classList.remove("active-link"));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active-link");
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-10% 0px -35% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}
