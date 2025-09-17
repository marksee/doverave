const neighbors = [
  {
    name: 'The Bloom Family',
    houseNumber: '1452',
    photo:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
    highlights:
      'Hosts the annual block party, bakes famous lemon bars, and keeps a vibrant pollinator garden.',
    contact: true,
  },
  {
    name: 'Sam & Priya Ortiz',
    houseNumber: '1446',
    photo:
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=900&q=80',
    highlights:
      'Weekend coffee stand on the porch and a rotating gallery of local artwork in the windows.',
    contact: false,
  },
  {
    name: 'Ms. Lillian Price',
    houseNumber: '1440',
    photo:
      'https://images.unsplash.com/photo-1526285759904-71d1170ed2ac?auto=format&fit=crop&w=900&q=80',
    highlights:
      'Keeps the best front-yard tulips, leads the neighborhood book club, and shares fresh herbs.',
    contact: true,
  },
  {
    name: 'The Chen Family',
    houseNumber: '1461',
    photo:
      'https://images.unsplash.com/photo-1502720705749-3c925585c4d1?auto=format&fit=crop&w=900&q=80',
    highlights:
      'Parents of twin skateboarders, love movie nights projected on the garage, and rescue cats.',
    contact: false,
  },
];

const directoryGrid = document.querySelector('#directoryGrid');
const directoryCount = document.querySelector('#directoryCount');
const searchInput = document.querySelector('#searchInput');
const submissionForm = document.querySelector('#submissionForm');
const formFeedback = submissionForm?.querySelector('.form-feedback');
const cardTemplate = document.querySelector('#cardTemplate');

const state = {
  filter: '',
  entries: [...neighbors],
};

function createCard(entry) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const img = card.querySelector('img');
  const title = card.querySelector('h3');
  const house = card.querySelector('.neighbor-card__house');
  const highlights = card.querySelector('.neighbor-card__highlights');
  const detailName = card.querySelector('.detail-name');
  const detailNumber = card.querySelector('.detail-number');
  const optIn = card.querySelector('.detail-opt-in');
  const toggle = card.querySelector('.neighbor-card__toggle');
  const details = card.querySelector('.neighbor-card__details');

  img.src = entry.photo;
  img.alt = `${entry.name} household`;
  title.textContent = entry.name;
  house.textContent = `No. ${entry.houseNumber}`;
  highlights.textContent = entry.highlights;
  detailName.textContent = entry.name;
  detailNumber.textContent = entry.houseNumber;
  if (entry.contact) {
    optIn.hidden = false;
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    details.hidden = expanded;
  });

  return card;
}

function renderDirectory() {
  if (!directoryGrid) return;
  directoryGrid.innerHTML = '';

  const filtered = state.entries.filter((entry) => {
    if (!state.filter) return true;
    const term = state.filter.toLowerCase();
    return (
      entry.name.toLowerCase().includes(term) ||
      entry.houseNumber.toLowerCase().includes(term) ||
      entry.highlights.toLowerCase().includes(term)
    );
  });

  filtered.forEach((entry) => {
    directoryGrid.appendChild(createCard(entry));
  });

  directoryCount.textContent = `${filtered.length} neighbor${
    filtered.length === 1 ? '' : 's'
  } featured`;

  if (!filtered.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No neighbors matched your search just yet. Try a different phrase!';
    empty.className = 'empty-state';
    directoryGrid.appendChild(empty);
  }
}

function handleSearch(event) {
  state.filter = event.target.value.trim();
  renderDirectory();
}

function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(submissionForm);
  const entry = {
    name: formData.get('name').trim(),
    houseNumber: formData.get('houseNumber').trim(),
    photo: formData.get('photo').trim(),
    email: formData.get('email').trim(),
    highlights: formData.get('highlights').trim(),
    contact: Boolean(formData.get('contact')),
  };

  if (!entry.name || !entry.houseNumber || !entry.photo || !entry.highlights) {
    formFeedback.textContent = 'Please complete all required fields.';
    formFeedback.style.color = '#d64550';
    return;
  }

  state.entries.unshift(entry);
  renderDirectory();
  submissionForm.reset();
  formFeedback.textContent = 'Thanks for sharing! Your household was added to the top of the directory.';
  formFeedback.style.color = 'var(--color-primary)';
  submissionForm.querySelector('input[name="name"]').focus();
}

searchInput?.addEventListener('input', handleSearch);
submissionForm?.addEventListener('submit', handleSubmit);

document.addEventListener('DOMContentLoaded', () => {
  renderDirectory();
});
