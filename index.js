const COHORT = "2309-FTB-ET-WEB-PT";
const API = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/" + COHORT;

const state = {
  events: [],
  event: null,
  guests: [],
  rsvps: [],
};

const $eventList = document.querySelector("#eventList");
const $eventDetails = document.querySelector("#eventDetails");
const $guests = document.querySelector("#guests");
const $guestList = document.querySelector("#guestList");

window.addEventListener("hashchange", selectEvent);

async function render() {
  await getEvents();
  await getGuests();
  await getRsvps();

  renderEvents();
  selectEvent();
}

render();

function selectEvent() {
  getEventFromHash();
  renderEventDetails();
}

function getEventFromHash() {
  const id = window.location.hash.slice(1);
  state.event = state.events.find((event) => event.id === +id);
}

async function getGuests() {
  try {
    const response = await fetch(API + "/guests");
    const json = await response.json();
    state.guests = json.data;
  } catch (error) {
    console.error(error);
  }
}


function renderGuests() {
  $guests.hidden = false;

  const rsvps = state.rsvps.filter((rsvp) => rsvp.eventId === state.event.id);
  const guestIds = rsvps.map((rsvp) => rsvp.guestId);
  const guests = state.guests.filter((guest) => guestIds.includes(guest.id));

  $guestList.innerHTML = "<li>No guests yet!</li>";
}

async function getEvents() {
  try {
    const response = await fetch(API + "/events");
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

async function getRsvps() {
  try {
    const response = await fetch(API + "/rsvps");
    const json = await response.json();
    state.rsvps = json.data;
  } catch (error) {
    console.error(error);
  }
}

function renderEvents() {
  const events = state.events.map(renderEvent);
  $eventList.replaceChildren(...events);
}

function renderEvent(event) {
  const article = document.createElement("article");
  const date = event.date.slice(0, 10);

  article.innerHTML = `
    <h3><a href="#${event.id}">${event.name} #${event.id}</a></h3>
    <time datetime="${date}">${date}</time>
    <address>${event.location}</address>
  `;

  return article;
}

function renderEventDetails() {
  if (!state.event) {
    $eventDetails.innerHTML = "<p>Select an event to see more.</p>";
    $guests.hidden = true;
    return;
  }

  const date = state.event.date.slice(0, 10);

  $eventDetails.innerHTML = `
    <h2>${state.event.name} #${state.event.id}</h2>
    <time datetime="${date}">${date}</time>
    <address>${state.event.location}</address>
    <p>${state.event.description}</p>
  `;

  renderGuests();
}
