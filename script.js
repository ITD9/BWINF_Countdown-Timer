// Made by ITD
// BWINF Bomb Timer Script
// This script creates a countdown timer for the BWINF competition deadline.
// It includes visual effects for the bomb and an explosion effect when the deadline is reached.

// This is not an official BWINF script.

// -----------------------
// Anpassen für neue Daten:
// Set the deadline date (Hier: 18.November 2025, 00:00 CEST)
const deadline = new Date("2025-11-18T00:00:00+02:00").getTime();

//Aufgabenrealease Datum (Hier: 01.September 2025, 00:00 CEST)
const realeaseDeadline = new Date("2025-09-01T00:00:00+02:00").getTime();

// wg. mobile IOS auch in index.html anpassen!
// Hinweitext, der auf der Seite angezeigt wird. Wird mit updateText() aktualisiert. HTML Tags sind erlaubt.
const new_hinweistext = `Guten Tag,<br>der Bearbeitungszeitraum für die 1. Runde des 44. Bundeswettbewerb Informatik endet offiziell Dienstag, 18. November 2025 00:00 Uhr. Es steht also noch der gesamte Montag zur Verfügung, der Dienstag aber nicht.<br>Jedoch wird eventuell die Abgabe erst später am frühen Morgen des 18. November 2025 geschlossen, <strong>MAN SOLLTE SICH NICHT DARAUF VERLASSEN!</strong> Vor zwei Jahren wurde die Abgabe zum Beispiel fast pünktlich um Mitternacht geschlossen!<br>Lösungen können unter <a href="https://login.bwinf.de/" target="_blank">https://login.bwinf.de/</a> als ZIP-Archiv eingereicht werden.</p>`

// wg. mobile IOS auch in index.html anpassen!
//Deadline Info, die auf der Seite angezeigt wird. Wird mit updateText() aktualisiert. HTML Tags sind erlaubt.
const new_deadlineInfo = `Abgabe am Dienstag, 18. November 2025, 00:00 Uhr (CEST)`;

// wg. mobile IOS auch in index.html anpassen!
// Überschrift, die auf der Seite angezeigt wird. Wird mit updateText() aktualisiert.
const new_Ueberschrift = `44. Bundeswettbewerb Informatik - Runde 1 Deadline`;

//----------------------
// DOM elements
const timeLeftElement = document.getElementById("time-left");
const bombVisual = document.getElementById("bomb-visual");
const bombImage = document.getElementById("bomb-image");
const explosionEffect = document.getElementById("explosion-effect");
const realeaseTimeLeftElement = document.getElementById("realease_countdown");

// Update the countdown every second
const countdownTimer = setInterval(updateCountdown, 1000);
const realeaseCountdownTimer = setInterval(updateRealeaseCountdown, 1000);
const updateRealeaseCountdownTimer = setInterval(activateRealeaseCountdown, 1000); 

// Function to update the countdown
function updateCountdown() {
    // Get current date and time
    const now = new Date().getTime();
    
    // Find the distance between now and the deadline
    const distance = deadline - now;
    globalThis.distance = distance;
    
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


function planPush() {
    Notification.requestPermission().then(permission => {
        if (permission !== "granted") return;

        const now = Date.now();
        const events = [
            {
                time: deadline,
                title: "Die Abgabe ist abgelaufen!",
                body: "Die Abgabe für die 1. Runde des 44. Bundeswettbewerb Informatik ist jetzt geschlossen.",
                icon: "https://itd9.github.io/BWINF_Countdown-Timer/media/biber_standing_alpha.png",
                done: false
            },
            {
                time: deadline - 86400000,
                title: "Nur noch 24h!",
                body: "Die Abgabe für die 1. Runde des 44. Bundeswettbewerb Informatik schließt in 24h.",
                icon: "https://itd9.github.io/BWINF_Countdown-Timer/media/bomb1_512-512.png",
                done: false
            },
            {
                time: deadline - 3600000,
                title: "Nur noch eine Stunde!",
                body: "Die Abgabe für die 1. Runde des 44. Bundeswettbewerb Informatik schließt in einer Stunde.",
                icon: "https://itd9.github.io/BWINF_Countdown-Timer/media/bomb1_512-512.png",
                done: false
            },
            {
                time: deadline - 600000,
                title: "Nur noch 10 Minuten!",
                body: "Die Abgabe für die 1. Runde des 44. Bundeswettbewerb Informatik schließt in 10 Minuten.",
                icon: "https://itd9.github.io/BWINF_Countdown-Timer/media/bomb1_512-512.png",
                done: false
            }
        ];

        events.forEach(event => {
            const delay = event.time - now;
            if (delay > -60000 && !event.done && delay < 864000000) { // Only schedule if not already passed && event in less than 10 days because of 32-bit limit && event not already done
                setTimeout(() => {
                    new Notification(event.title, {
                        body: event.body,
                        icon: event.icon
                    });
                }, Math.max(0, delay));
            }
        });
    });
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
    const particleCount = 300;
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
        const distance = Math.random() * 700 + 50;
        const duration = Math.random() * 4 + 1;
        
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
function featureZone() {
    let deferredPrompt;
    const installBtn = document.getElementById("installBtn");
    const new_feature_area = document.getElementById("new_features");
    const view_new_features = document.getElementById("view_new_features");
    const activatePushBtn = document.getElementById("activatePushBtn");

    let isPWAavailable = false;
    let showPWABtn = false;
    let showPushBtn = true;
    let showFeatureArea = false;
    updateFeatureArea();

    if (Notification.permission === "granted") {
        showPushBtn = false;
        updateFeatureArea();
    }

    console.log(new_feature_area, installBtn);
    // Abfangen, wenn die PWA installierbar ist
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault(); // Browser-Standard verhindern
        deferredPrompt = e; // Event speichern
        isPWAavailable = true; // PWA ist verfügbar
        showPWABtn = true;
        updateFeatureArea();
    });

    // Klick auf "Neu" Button
    view_new_features.addEventListener("click", () => {
        showFeatureArea = true; // Area soll jetzt angezeigt werden
        updateFeatureArea();
    });

    // Klick auf Installationsbutton
    installBtn.addEventListener("click", async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt(); // Installationsdialog anzeigen

        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User wählte: ${outcome}`);

        deferredPrompt = null; // Zurücksetzen
        showPWABtn = false;
        updateFeatureArea();
    });

    // Klick auf Push-Button
    activatePushBtn.addEventListener("click", async () => {
        planPush();
        showPushBtn = false;
        updateFeatureArea();
    })

    // NewFeatureArea Updaten
    function updateFeatureArea() {
        // Feature-Area anzeigen, wenn es noch Buttons gibt
        const shouldShowArea = showPWABtn || showPushBtn;

        if (!shouldShowArea) {
            showFeatureArea = false;
            view_new_features.hidden = true;
        }
        // Feature-Area wird nur angezeigt, wenn showFeatureArea true ist
        if (showFeatureArea) {
            new_feature_area.hidden = false;

            // Buttons innerhalb der Area anzeigen/ausblenden
            installBtn.hidden = !showPWABtn;
            activatePushBtn.hidden = !showPushBtn;

            // "View New Features" Button ausblenden
            view_new_features.hidden = true;
        } else {
            // Feature-Area ausblenden
            new_feature_area.hidden = true;

            // "View New Features" Button nur anzeigen, wenn es noch Features gibt
            view_new_features.hidden = !(showPWABtn || showPushBtn);
        
        }
    }
}

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



// If permission already granted, plan notifications
if (Notification.permission === "granted") {
    planPush();
}



function updateRealeaseCountdown() {
    // NOT IN USE, da zurzeit nicht benötigt, reaktivierung bei nächster Runde

    // Get current date and time
    const now = new Date().getTime();
    
    // Find the distance between now and the deadline
    const distance = realeaseDeadline - now;
    
    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Display the result
    realeaseTimeLeftElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Function to activate/deactivate realease countdown field
// NOT IN USE, da zurzeit nicht benötigt, reaktivierung bei nächster Runde
function activateRealeaseCountdown() {
    if (Date.now() > realeaseDeadline && Date.now() < realeaseDeadline + 60000) { // Between realease time and 1 minute after
        document.getElementById("realease_countdown").innerHTML = "AUFGABEN SIND DA!";
        clearInterval(realeaseCountdownTimer);
    } else if (Date.now() > realeaseDeadline + 60000) { // More than 1 minute after realease
        document.getElementById("time_to_realease").hidden = true;
        clearInterval(updateRealeaseCountdownTimer);
    } else { // Before realease
        document.getElementById("time_to_realease").hidden = false;
        updateRealeaseCountdown()
    }
}

if(document.readyState !== 'loading') { // Wenn das DOM schon geladen ist
    updateText();
    // activateRealeaseCountdown(); // NOT IN USE, da zurzeit nicht benötigt, reaktivierung bei nächster Runde
    updateCountdown();
    featureZone()
} else {
    // Falls das DOM noch lädt, Eventlistener hinzufügen
    document.addEventListener('DOMContentLoaded', function () {
        updateText();
        // activateRealeaseCountdown(); // NOT IN USE, da zurzeit nicht benötigt, reaktivierung bei nächster Runde
        updateCountdown();
        featureZone()
    });
}