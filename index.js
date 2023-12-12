const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/events';

document.addEventListener('DOMContentLoaded', function () {
  const partyForm = document.getElementById('partyForm');
  const partyList = document.getElementById('partyList');

  fetchParties();

  partyForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const partyData = {
      name: document.getElementById('name').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      location: document.getElementById('location').value,
      description: document.getElementById('description').value,
    };

    addParty(partyData);

    partyForm.reset();
  });

  function fetchParties() {
    fetch(`${API_URL}/parties`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then(parties => {
        parties.forEach(party => {
          appendParty(party);
        });
      })
      .catch(error => console.error('Error fetching parties:', error.message));
  }

  function addParty(partyData) {
    fetch(`${API_URL}/parties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partyData),
    })
      .then(response => response.json())
      .then(newParty => {
        console.log('Server response for adding party:', newParty);
        appendParty(newParty);
      })
      .catch(error => console.error('Error adding party:', error));
  }
  

  function appendParty(party) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>${party.name}</strong> - ${party.date}, ${party.time}, ${party.location}, ${party.description}
      <button data-id="${party.id}" class="deleteButton">Delete</button>
    `;
    partyList.appendChild(listItem);

    const deleteButton = listItem.querySelector('.deleteButton');
    deleteButton.addEventListener('click', function () {
      fetch(`${API_URL}/parties/${party.id}`, {
        method: 'DELETE',
      })
        .then(() => {
          listItem.remove();
        })
        .catch(error => console.error('Error deleting party:', error));
    });
  }
});
