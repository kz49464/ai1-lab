const getLocationBtn = document.getElementById('getLocationBtn');
const getMapImageBtn = document.getElementById('getMapImageBtn');
const imageContainer = document.getElementById('imageContainer');
const scrambledContainer = document.getElementById('scrambledContainer');
const puzzleContainer = document.getElementById('puzzleContainer');
let map;
let mapLoaded = false;
let imageParts = [];

// Define the puzzleCells array (array of all puzzle cell elements)
const puzzleCells = Array.from(puzzleContainer.children);

getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Twoja przeglądarka nie obsługuje API geolokalizacji.");
    }
});

function showPosition(position) {
    const { latitude, longitude } = position.coords;
    if (map) {
        map.setView([latitude, longitude], 13);
    } else {
        map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup("Jesteś tutaj")
            .openPopup();
        mapLoaded = true;
    }
}

function showError(error) {
    const errorMessage = {
        1: "Odmowa dostępu do geolokalizacji.",
        2: "Informacje o lokalizacji są niedostępne.",
        3: "Przekroczono czas oczekiwania na geolokalizację.",
    }[error.code] || "Wystąpił nieznany błąd.";
    alert(errorMessage);
}

getMapImageBtn.addEventListener('click', () => {
    if (map && mapLoaded) {
        leafletImage(map, (err, canvas) => {
            if (err) return console.error("Błąd podczas tworzenia obrazu mapy:", err);
            displayImage(canvas);
            createScrambledImage(canvas);
        });
    } else {
        alert("Mapa jeszcze się ładuje. Spróbuj ponownie za kilka sekund.");
    }
});

function displayImage(canvas) {
    imageContainer.innerHTML = '';
    const img = new Image();
    img.src = canvas.toDataURL();
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    imageContainer.appendChild(img);
}

function createScrambledImage(img) {
    const partWidth = img.width / 4;
    const partHeight = img.height / 4;
    scrambledContainer.innerHTML = '';
    imageParts = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const partCanvas = document.createElement('canvas');
            partCanvas.width = partWidth;
            partCanvas.height = partHeight;
            const ctx = partCanvas.getContext('2d');
            ctx.drawImage(img, col * partWidth, row * partHeight, partWidth, partHeight, 0, 0, partWidth, partHeight);

            const imgPart = createImagePart(partCanvas, imageParts.length);
            imageParts.push(partCanvas.toDataURL());
            scrambledContainer.appendChild(imgPart);
        }
    }
    scrambleImages();
}

function createImagePart(canvas, index) {
    const imgPart = new Image();
    imgPart.src = canvas.toDataURL();
    imgPart.draggable = true;
    imgPart.style.width = "100%";
    imgPart.style.height = "100%";
    imgPart.style.border = "1px solid gray";
    imgPart.dataset.index = index;
    imgPart.addEventListener('dragstart', dragStart);
    return imgPart;
}

function scrambleImages() {
    const shuffledImages = Array.from(scrambledContainer.children);
    shuffledImages.sort(() => Math.random() - 0.5);
    scrambledContainer.innerHTML = '';
    shuffledImages.forEach(img => scrambledContainer.appendChild(img));
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.index);
}

Array.from(puzzleContainer.children).forEach(cell => {
    cell.addEventListener('dragover', event => event.preventDefault());
    cell.addEventListener('drop', handleDrop);
});

function handleDrop(event) {
    event.preventDefault();
    const index = event.dataTransfer.getData('text/plain');
    const imgData = imageParts[index];

    if (event.currentTarget.children.length === 0) {
        const imgPart = createImagePartElement(imgData, index);
        event.currentTarget.appendChild(imgPart);

        const scrambledImg = scrambledContainer.querySelector(`img[data-index="${index}"]`);
        scrambledImg && scrambledContainer.removeChild(scrambledImg);

        imageParts[index] = null;

        // Проверяем завершение пазла после каждой вставки.
        checkPuzzleCompleted();
    }
}

function createImagePartElement(src, index) {
    const imgPart = new Image();
    imgPart.src = src;
    imgPart.style.width = "100%";
    imgPart.style.height = "100%";
    imgPart.style.border = "1px solid gray";
    imgPart.dataset.index = index;
    return imgPart;
}

function checkPuzzleCompleted() {
    let correctPieces = 0;

    // Loop through all the puzzle cells
    for (let i = 0; i < puzzleCells.length; i++) {
        if (puzzleCells[i].children.length > 0) {
            const img = puzzleCells[i].children[0];
            if (img.dataset.index == i) {
                correctPieces++;
                console.log(`Piece ${i + 1} is in the correct position.`); // Log specific piece placement
            } else {
                console.log(`Piece ${i + 1} is NOT in the correct position.`); // Log incorrect placement
            }
        } else {
            console.log(`Cell ${i + 1} is empty.`); // Log if cell is empty
        }
    }

    console.log(`Filled cells: ${correctPieces} out of ${puzzleCells.length}`);

    // If all cells are filled correctly
    if (correctPieces === puzzleCells.length) {
        console.log("Puzzle completed, sending notification.");
        showBrowserNotification();
        console.log("All pieces are in the correct position!"); // Log the message for correct arrangement
    }
}

function showBrowserNotification() {
    if (Notification.permission === "granted") {
        new Notification("Gratulacje!", { body: "Udało Ci się ukończyć układankę!" });
    } else if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Gratulacje!", { body: "Udało Ci się ukończyć układankę!" });
            }
        });
    }
}
