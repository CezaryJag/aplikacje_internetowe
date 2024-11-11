let map = L.map('map').setView([53.430127, 14.564802], 13);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);


// Funkcja wywołująca prośbę o powiadomienia
function requestNotificationPermission() {
    if (Notification.permission === 'default') {
        // Prośba o pozwolenie na powiadomienia po kliknięciu przycisku
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Zgoda na powiadomienia została udzielona.');
            } else {
                console.log('Powiadomienia zostały zablokowane.');
            }
        }).catch(error => {
            console.error('Błąd przy proszeniu o powiadomienia:', error);
        });
    } else {
        console.log('Zgoda na powiadomienia została już wcześniej przyznana lub odrzucona.');
    }
}

// Funkcja do lokalizacji użytkownika
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            L.marker([lat, lon]).addTo(map)
                .bindPopup('Twoja lokalizacja')
                .openPopup();

            map.setView([lat, lon], map.getZoom());
        }, () => {
            alert("Nie udało się uzyskać dostępu do lokalizacji.");
        });
    } else {
        alert("Twoja przeglądarka nie wspiera geolokalizacji.");
    }
}

// Funkcja pobierania mapy
function downloadMap() {
    document.getElementById('shuffledPuzzle').innerHTML = '';
    document.getElementById('puzzleContainer').innerHTML = '';

    const markers = [];
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            markers.push(layer);
            map.removeLayer(layer);
        }
    });

    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error('Błąd podczas pobierania mapy:', err);
            return;
        }

        createPuzzlePieces(canvas);
        markers.forEach(marker => marker.addTo(map));


        requestNotificationPermission();  // Prośba o powiadomienia działa tylko z https
    });
}

// Funkcja tworzenia fragmentów puzzli
function createPuzzlePieces(mapCanvas) {
    const pieceSize = 100;
    const pieces = [];
    const puzzleContainer = document.getElementById('puzzleContainer');

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const gridCell = document.createElement('div');
            gridCell.classList.add('puzzle-cell');
            gridCell.dataset.row = row;
            gridCell.dataset.col = col;
            gridCell.addEventListener('dragover', dragOver);
            gridCell.addEventListener('drop', drop);
            puzzleContainer.appendChild(gridCell);
        }
    }

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const piece = document.createElement('canvas');
            piece.width = pieceSize;
            piece.height = pieceSize;
            piece.classList.add('puzzle-piece');
            piece.dataset.row = row;
            piece.dataset.col = col;

            const context = piece.getContext('2d');
            context.drawImage(mapCanvas, col * pieceSize, row * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);
            pieces.push(piece);

            piece.setAttribute('draggable', 'true');
            piece.addEventListener('dragstart', dragStart);
        }
    }

    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => document.getElementById('shuffledPuzzle').appendChild(piece));
}

//przeciąganie
let draggedPiece;
function dragStart(event) {
    if (event.target.classList.contains('locked')) return;
    draggedPiece = event.target;
}


function dragOver(event) {
    event.preventDefault();
}

// upuszczenie fragmentu puzzla
function drop(event) {
    event.preventDefault();

    const targetPiece = event.target;

    if (targetPiece.classList.contains('puzzle-piece') && !targetPiece.classList.contains('locked')) {
        const targetParent = targetPiece.parentElement;
        const draggedParent = draggedPiece.parentElement;

        targetParent.appendChild(draggedPiece);
        draggedParent.appendChild(targetPiece);
    } else if (targetPiece.classList.contains('puzzle-cell') && !targetPiece.hasChildNodes()) {
        targetPiece.appendChild(draggedPiece);
    }

    checkPuzzleCompletion();
}

function checkPuzzleCompletion() {
    const cells = Array.from(document.querySelectorAll('.puzzle-cell'));
    cells.forEach(cell => {
        const piece = cell.firstChild;
        if (piece && piece.dataset.row == cell.dataset.row && piece.dataset.col == cell.dataset.col) {
            piece.classList.add('locked');
            piece.setAttribute('draggable', 'false');
        }
    });

    const correctPieces = cells.filter(cell => cell.firstChild && cell.firstChild.classList.contains('locked')).length;
    if (correctPieces === 16) {
        showCompletionNotification();
    }
}

function showCompletionNotification() {
    if (Notification.permission === 'granted') {
        new Notification('Gratulacje! Ukończyłeś puzzle.');
    }
}
document.getElementById("getLocation").addEventListener("click", getLocation);
document.getElementById("downloadMap").addEventListener("click", downloadMap);
