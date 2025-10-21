const TYPING = ["I build projects.", "I code.", "I do random stuff."];
const typingEl = document.querySelector(".typing");
let tIdx = 0, cIdx = 0, forward = true;

function typeLoop() {
  const word = TYPING[tIdx];

  if (forward) {
    cIdx++;
    typingEl.textContent = word.slice(0, cIdx);

    if (cIdx >= word.length) {
      forward = false;
      setTimeout(typeLoop, 1000); // pause at full word
      return;
    }
    setTimeout(typeLoop, 100); // typing speed
  } else {
    cIdx--;
    typingEl.textContent = word.slice(0, cIdx);

    if (cIdx <= 0) {
      forward = true;
      tIdx = (tIdx + 1) % TYPING.length;
      setTimeout(typeLoop, 400); // small pause before next word
      return;
    }
    setTimeout(typeLoop, 50); // deleting speed
  }
}

typeLoop();


// Reveal elements on scroll
const reveals = document.querySelectorAll(".reveal");
window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const height = window.innerHeight * 0.85;
    if (top < height) el.classList.add("visible");
  });
});

// Animate navbar icons
document.addEventListener("DOMContentLoaded", () => {
  const brand = document.querySelector(".brand");
  brand.classList.add("visible");
  const icons = document.querySelectorAll(".nav a");
  icons.forEach((icon,index) => {
    setTimeout(() => { icon.classList.add("visible"); }, (index+1)*200);
  });
});
