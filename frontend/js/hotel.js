document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const hotelId = urlParams.get('id'); // Assure-toi que l'URL contient ?id=1 par exemple

  if (hotelId) {
    fetch(`http://localhost:5000/api/hotels/${hotelId}`)
      .then(res => res.json())
      .then(hotel => {
        afficherHotel(hotel);
      })
      .catch(err => console.error('Erreur chargement hôtel:', err));

    fetch(`http://localhost:5000/api/rooms/hotel/${hotelId}`)
      .then(res => res.json())
      .then(rooms => {
        afficherChambres(rooms);
      })
      .catch(err => console.error('Erreur chargement chambres:', err));
  }
});

function afficherHotel(hotel) {
  const container = document.getElementById('hotelDetails');
  container.innerHTML = `
    <h2>${hotel.name}</h2>
    <p><strong>Adresse :</strong> ${hotel.address}</p>
    <p><strong>Ville :</strong> ${hotel.city}</p>
    <p><strong>Description :</strong> ${hotel.description}</p>
    <p><strong>Note :</strong> ${hotel.rating}</p>
    <button class="btn btn-warning mt-3" onclick="ouvrirFormulaireModification(${hotel.id})">Modifier</button>
  `;
}

function afficherChambres(rooms) {
  const container = document.getElementById('roomsList');
  container.innerHTML = '';
  rooms.forEach(room => {
    const div = document.createElement('div');
    div.classList.add('card', 'mb-3');
    div.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${room.type}</h5>
        <p class="card-text">Prix: ${room.price} €</p>
        <p class="card-text">Capacité: ${room.capacity}</p>
        <p class="card-text">Disponibilité: ${room.availability ? 'Disponible' : 'Indisponible'}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function ouvrirFormulaireModification(hotelId) {
  fetch(`http://localhost:5000/api/hotels/${hotelId}`)
    .then(res => res.json())
    .then(hotel => {
      const formContainer = document.getElementById('formulaireModification');
      formContainer.innerHTML = `
        <h4>Modifier l'hôtel</h4>
        <form id="modificationForm" class="mt-3">
          <div class="mb-2">
            <label>Nom</label>
            <input type="text" class="form-control" name="name" value="${hotel.name}" required>
          </div>
          <div class="mb-2">
            <label>Adresse</label>
            <input type="text" class="form-control" name="address" value="${hotel.address}" required>
          </div>
          <div class="mb-2">
            <label>Ville</label>
            <input type="text" class="form-control" name="city" value="${hotel.city}" required>
          </div>
          <div class="mb-2">
            <label>Description</label>
            <textarea class="form-control" name="description">${hotel.description}</textarea>
          </div>
          <div class="mb-2">
            <label>Note</label>
            <input type="number" class="form-control" name="rating" value="${hotel.rating}" step="0.1" required>
          </div>
          <button type="submit" class="btn btn-success">Enregistrer</button>
        </form>
      `;

      document.getElementById('modificationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        fetch(`http://localhost:5000/api/hotels/${hotelId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(() => {
          alert('Hôtel modifié avec succès');
          location.reload();
        })
        .catch(err => console.error('Erreur modification hôtel:', err));
      });
    });
}
