// Made by ITD
// BWINF Bomb Timer Script
// This script creates a countdown timer for the BWINF competition deadline.
// It includes visual effects for the bomb and an explosion effect when the deadline is reached.

// This is not an official BWINF script.

// -----------------------
// Anpassen für neue Daten:
// Set the deadline date (Hier: 18.November 2025, 00:00 CEST)
const deadline = new Date("2025-11-18T00:00:00+02:00").getTime();

// Hinweitext, der auf der Seite angezeigt wird. Wird mit updateText() aktualisiert. HTML Tags sind erlaubt.
const new_hinweistext = "Guten Tag,<br>der Bearbeitungszeitraum für die 1. Runde des 44. Bundeswettbewerb Informatik endet offiziell Dienstag, \
18. November 2025 00:00 Uhr. Es steht also noch der gesamte Montag zur Verfügung, der Dienstag aber nicht.<br>Jedoch wird eventuell die Abgabe erst später \
am frühen Morgen des 18. November 2025 geschlossen, <strong>MAN SOLLTE \
SICH NICHT DARAUF VERLASSEN!</strong> Vor zwei Jahren wurde die Abgabe zum Beispiel fast pünktlich um Mitternacht geschlossen!<br>Lösungen können unter \
<a href=\"https://login.bwinf.de/\" target=\"_blank\">https://login.bwinf.de/</a> als ZIP-Archiv eingereicht werden.</p>"

//Deadline Info, die auf der Seite angezeigt wird. Wird mit updateText() aktualisiert. HTML Tags sind erlaubt.
const new_deadlineInfo = "Abgabe: Dienstag, 18. November 2025, 00:00 Uhr (CEST)";

// Überschrift, die auf der Seite angezeigt wird. Wird mit updateText() aktualisiert.
const new_Ueberschrift = "44. Bundeswettbewerb Informatik - Runde 1 Deadline";

//----------------------
// DOM elements
const timeLeftElement = document.getElementById("time-left");
const bombVisual = document.getElementById("bomb-visual");
const bombImage = document.getElementById("bomb-image");
const explosionEffect = document.getElementById("explosion-effect");

// Update the countdown every second
const countdownTimer = setInterval(updateCountdown, 1000);

// Initial call to set the countdown immediately
updateCountdown();

// Function to update the countdown
function updateCountdown() {
    // Get current date and time
    const now = new Date().getTime();
    
    // Find the distance between now and the deadline
    const distance = deadline - now;
    
    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Display the result
    timeLeftElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    
    // Add visual effects as deadline approaches
    if (distance < 86400000) { // Less than 24 hours
        bombVisual.style.animation = "shake 0.5s ease-in-out";
        bombVisual.style.animationIterationCount = "infinite";
        
        // Change bomb color to red when less than 1 hour
        if (distance < 3600000) {
            bombImage.style.filter = "hue-rotate(320deg) saturate(1.5)";
        }
    }
    
    // If the countdown is over, show explosion effect
    if (distance < 0) {
        clearInterval(countdownTimer);
        timeLeftElement.innerHTML = "ABGELAUFEN!";
        triggerExplosion();
    }
}

// Function to trigger the explosion effect
function triggerExplosion() {
    // Animate the bomb before explosion
    bombImage.style.animation = "explode 1s forwards";
    
    // Show explosion effect after a short delay
    setTimeout(() => {
        explosionEffect.style.display = "flex";
        
        // Add some particles for explosion effect
        createExplosionParticles();
    }, 1000);
}

// Function to create explosion particles
function createExplosionParticles() {
    const particleCount = 50;
    const colors = ["#f39200", "#ffcc00", "#ff4500", "#ff0000"];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.width = `${Math.random() * 20 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = "50%";
        particle.style.top = "50%";
        particle.style.left = "50%";
        particle.style.transform = "translate(-50%, -50%)";
        particle.style.opacity = Math.random() * 0.8 + 0.2;
        
        // Random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 2 + 1;
        
        // Animation
        particle.animate([
            { transform: "translate(-50%, -50%)", opacity: 1 },
            { 
                transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px))`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: "cubic-bezier(0.1, 0.8, 0.2, 1)"
        });
        
        explosionEffect.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (explosionEffect.contains(particle)) {
                explosionEffect.removeChild(particle);
            }
        }, duration * 1000);
    }
}

// --------- PWA abfangen & Installationsdialog ----------------

let deferredPrompt;
const installBtn = document.getElementById("installBtn");
const new_feature_area = document.getElementById("new_features");
const view_new_features = document.getElementById("view_new_features");
let isPWAavailable = false;

console.log(new_feature_area, installBtn);
  // Abfangen, wenn die PWA installierbar ist
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // Browser-Standard verhindern
    deferredPrompt = e; // Event speichern
    isPWAavailable = true; // PWA ist verfügbar
    view_new_features.hidden = false; // "Neu" Button anzeigen
  });

view_new_features.addEventListener("click", async () => {
    if (isPWAavailable) { // Wenn PWA verfügbar ist
        new_feature_area.hidden = false; // Installationsarea anzeigen
        view_new_features.hidden = true; // "Neu" Button ausblenden
    }
});

  // Klick auf Installationsbutton
installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // Installationsdialog anzeigen

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User wählte: ${outcome}`);

    deferredPrompt = null; // Zurücksetzen
    new_feature_area.hidden = true; // Area wieder verstecken
  });

// ------------------ Text aktualisieren --------------------

function updateText() {
    //Update hinweistext
    const hinweistext_Area = document.getElementById("hinweistext");
    hinweistext_Area.innerHTML = new_hinweistext;
    hinweistext_Area.style.height = "auto";

    //Update deadline_info
    const deadlineInfo_Area = document.getElementById("deadline-info");
    deadlineInfo_Area.innerHTML = new_deadlineInfo;
    deadlineInfo_Area.style.height = "auto";

    // Update title
    const titleArea = document.getElementById("Ueberschrift");
    titleArea.innerHTML = new_Ueberschrift;
    titleArea.style.height = "auto";
}

updateText();



