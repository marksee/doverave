const households = [
  {
    id: '1452',
    name: 'The Bloom Family',
    houseNumber: '1452',
    photo:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
    highlights:
      'Hosts the annual block party, keeps a pollinator garden buzzing, and sends everyone home with lemon bars.',
    tradition: 'Friday twilight potlucks on their brick patio with acoustic sing-alongs.',
    favoriteSpot: 'The pocket park at Elm & 3rd for sunset picnics.',
    contact: true,
    location: { x: 68, y: 36 },
  },
  {
    id: '1446',
    name: 'Sam & Priya Ortiz',
    houseNumber: '1446',
    photo:
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=900&q=80',
    highlights:
      'Run a weekend espresso stand on the porch and curate a rotating gallery of local art in their windows.',
    tradition: 'Saturday sunrise coffee tastings for the early walkers.',
    favoriteSpot: 'The Dover Trail overlook for painted-sky mornings.',
    contact: false,
    location: { x: 53, y: 28 },
  },
  {
    id: '1440',
    name: 'Ms. Lillian Price',
    houseNumber: '1440',
    photo:
      'https://images.unsplash.com/photo-1526285759904-71d1170ed2ac?auto=format&fit=crop&w=900&q=80',
    highlights:
      'Tends the brightest tulips on the block, leads the neighborhood book club, and shares bundles of fresh herbs.',
    tradition: 'First-Monday book swap with homemade lavender shortbread.',
    favoriteSpot: 'The little free library beneath the big maple.',
    contact: true,
    location: { x: 36, y: 44 },
  },
  {
    id: '1461',
    name: 'The Chen Family',
    houseNumber: '1461',
    photo:
      'https://images.unsplash.com/photo-1502720705749-3c925585c4d1?auto=format&fit=crop&w=900&q=80',
    highlights:
      'Parents of twin skateboarders, host driveway movie nights, and care for a revolving crew of foster cats.',
    tradition: 'Summer Sunday double-feature projected on the garage.',
    favoriteSpot: 'Riverside skate bowl after dinner.',
    contact: false,
    location: { x: 82, y: 48 },
  },
  {
    id: '1434',
    name: 'Jasmine & Theo Brooks',
    houseNumber: '1434',
    photo:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    highlights:
      'Organize impromptu sidewalk chalk festivals and keep a crate of spare bike lights for late riders.',
    tradition: 'Full-moon night rides that end with cocoa on their stoop.',
    favoriteSpot: 'Bike lane mural at Cedar Street.',
    contact: true,
    location: { x: 22, y: 30 },
  },
  {
    id: '1470',
    name: 'The Miller-Wu Loft',
    houseNumber: '1470',
    photo:
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=900&q=80',
    highlights:
      'Live above the corner bakery, DJ block clean-up days, and teach teens how to mix tracks.',
    tradition: 'Sunday brunch jams with fresh pastries and vinyl.',
    favoriteSpot: 'Sunlit stoop outside the bakery for people watching.',
    contact: false,
    location: { x: 60, y: 60 },
  },
];

const state = {
  filter: '',
  selectedId: households[0]?.id ?? null,
};

const mapMarkers = document.querySelector('#mapMarkers');
const detailContainer = document.querySelector('#houseDetail');
const detailTemplate = document.querySelector('#detailTemplate');
const directoryGrid = document.querySelector('#directoryGrid');
const cardTemplate = document.querySelector('#cardTemplate');
const directoryCount = document.querySelector('#directoryCount');
const searchInput = document.querySelector('#searchInput');

function getFilteredEntries() {
  if (!state.filter) return households;
  const term = state.filter.toLowerCase();
  return households.filter((entry) => {
    return (
      entry.name.toLowerCase().includes(term) ||
      entry.houseNumber.toLowerCase().includes(term) ||
      entry.highlights.toLowerCase().includes(term) ||
      entry.tradition.toLowerCase().includes(term) ||
      entry.favoriteSpot.toLowerCase().includes(term)
    );
  });
}

function createMarker(entry) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'house-marker';
  button.dataset.id = entry.id;
  button.setAttribute('aria-label', `${entry.name} at house ${entry.houseNumber}`);
  button.innerHTML = `
    <span class="marker__icon" aria-hidden="true">🏡</span>
    <span class="marker__number">${entry.houseNumber}</span>
  `;
  button.style.setProperty('--pos-x', `${entry.location.x}%`);
  button.style.setProperty('--pos-y', `${entry.location.y}%`);
  button.addEventListener('click', () => selectHouse(entry.id));
  return button;
}

function renderMarkers() {
  if (!mapMarkers) return;
  mapMarkers.innerHTML = '';
  households.forEach((entry) => {
    mapMarkers.appendChild(createMarker(entry));
  });
  updateMarkerStates();
}

function renderDetail(entry) {
  if (!detailTemplate || !detailContainer) return;
  const node = detailTemplate.content.firstElementChild.cloneNode(true);
  const img = node.querySelector('img');
  const house = node.querySelector('.detail__house');
  const name = node.querySelector('.detail__name');
  const highlights = node.querySelector('.detail__highlights');
  const tradition = node.querySelector('.detail__tradition');
  const favorite = node.querySelector('.detail__favorite');
  const favoriteText = node.querySelector('.detail__favorite-text');
  const contact = node.querySelector('.detail__contact');

  img.src = entry.photo;
  img.alt = `${entry.name} home`;
  house.textContent = `House ${entry.houseNumber}`;
  name.textContent = entry.name;
  highlights.textContent = entry.highlights;
  tradition.textContent = entry.tradition;
  if (entry.favoriteSpot) {
    favorite.hidden = false;
    favoriteText.textContent = entry.favoriteSpot;
  }
  if (entry.contact) {
    contact.hidden = false;
  }

  detailContainer.innerHTML = '';
  detailContainer.appendChild(node);
}

function createCard(entry) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const img = card.querySelector('img');
  const title = card.querySelector('h3');
  const house = card.querySelector('.neighbor-card__house');
  const highlights = card.querySelector('.neighbor-card__highlights');
  const tradition = card.querySelector('.detail-tradition');
  const favorite = card.querySelector('.detail-favorite');
  const favoriteText = card.querySelector('.detail-favorite-text');

  card.dataset.id = entry.id;
  card.addEventListener('click', () => selectHouse(entry.id));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectHouse(entry.id);
    }
  });
  card.setAttribute('tabindex', '0');

  img.src = entry.photo;
  img.alt = `${entry.name} household`;
  title.textContent = entry.name;
  house.textContent = `No. ${entry.houseNumber}`;
  highlights.textContent = entry.highlights;
  tradition.textContent = entry.tradition;
  if (entry.favoriteSpot) {
    favorite.hidden = false;
    favoriteText.textContent = entry.favoriteSpot;
  }

  return card;
}

function renderDirectory() {
  if (!directoryGrid) return;
  const filtered = getFilteredEntries();
  directoryGrid.innerHTML = '';
  filtered.forEach((entry) => {
    directoryGrid.appendChild(createCard(entry));
  });

  if (directoryCount) {
    directoryCount.textContent = `${filtered.length} house${filtered.length === 1 ? '' : 's'}`;
  }

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No households matched your search yet. Try another name or number!';
    empty.className = 'empty-state';
    directoryGrid.appendChild(empty);
  }
  updateCardStates();
  updateMarkerStates();
}

function updateMarkerStates() {
  if (!mapMarkers) return;
  const filteredIds = new Set(getFilteredEntries().map((entry) => entry.id));
  mapMarkers.querySelectorAll('.house-marker').forEach((marker) => {
    const id = marker.dataset.id;
    marker.classList.toggle('is-selected', id === state.selectedId);
    marker.classList.toggle('is-muted', Boolean(state.filter) && !filteredIds.has(id));
  });
}

function updateCardStates() {
  if (!directoryGrid) return;
  directoryGrid.querySelectorAll('.neighbor-card').forEach((card) => {
    card.classList.toggle('is-selected', card.dataset.id === state.selectedId);
  });
}

function selectHouse(id) {
  const entry = households.find((item) => item.id === id);
  if (!entry) return;
  const filtered = getFilteredEntries();
  const isVisibleInFilter = filtered.some((item) => item.id === id);
  state.selectedId = id;

  if (state.filter && !isVisibleInFilter) {
    state.filter = '';
    if (searchInput) {
      searchInput.value = '';
    }
    renderDirectory();
  } else {
    updateCardStates();
  }

  renderDetail(entry);
  updateMarkerStates();

  const selectedCard = directoryGrid?.querySelector(`.neighbor-card[data-id="${id}"]`);
  selectedCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleSearch(event) {
  state.filter = event.target.value.trim();
  renderDirectory();
}

document.addEventListener('DOMContentLoaded', () => {
  renderMarkers();
  renderDirectory();
  if (state.selectedId) {
    const entry = households.find((item) => item.id === state.selectedId);
    if (entry) {
      renderDetail(entry);
      updateMarkerStates();
    }
  }
});

searchInput?.addEventListener('input', handleSearch);
