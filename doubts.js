
const doubtForm = document.getElementById('doubt-form');
const doubtMessage = document.getElementById('doubt-message');
const doubtsContainer = document.getElementById('doubts-container');

const doubtFilter = document.getElementById('doubt-filter');
const doubtSearch = document.getElementById('doubt-search');

let allDoubts = [];

doubtForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const doubtData = {
        name: document.getElementById('doubt-name').value.trim(),
        subject: document.getElementById('doubt-subject').value,
        title: document.getElementById('doubt-title').value.trim(),
        question: document.getElementById('doubt-description').value.trim()
    };

    doubtMessage.textContent = 'Submitting your doubt...';

    try {
        const response = await fetch('http://localhost:3000/api/doubts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doubtData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to submit doubt.');
        }

        doubtMessage.textContent = 'Doubt submitted successfully!';

        doubtForm.reset();

        await loadDoubts();

    } catch (error) {
        console.error('Submission error:', error);

        doubtMessage.textContent =
            'Could not submit your doubt. Please try again.';
    }
});


async function loadDoubts() {
    try {
        const response = await fetch('http://localhost:3000/api/doubts');

        if (!response.ok) {
            throw new Error('Could not load doubts.');
        }

        allDoubts = await response.json();

        displayDoubts();

    } catch (error) {
        doubtsContainer.textContent = 'Could not load doubts.';
        console.error('Loading error:', error);
    }
}


function displayDoubts() {

    const selectedSubject = doubtFilter.value;
    const searchText = doubtSearch.value.toLowerCase().trim();

    doubtsContainer.innerHTML = '';

    const filteredDoubts = allDoubts.filter(function(doubt) {

        const subjectMatch =
            selectedSubject === 'All' ||
            doubt.subject === selectedSubject;

        const titleMatch =
            doubt.title.toLowerCase().includes(searchText);

        return subjectMatch && titleMatch;
    });

    if (filteredDoubts.length === 0) {
        doubtsContainer.textContent = 'No doubts found.';
        return;
    }

    filteredDoubts.forEach(function(doubt) {

        const doubtCard = document.createElement('div');
        doubtCard.className = 'doubt-card';

        const title = document.createElement('h3');
        title.textContent = doubt.title;

        const subject = document.createElement('p');
        subject.textContent = 'Subject: ' + doubt.subject;

        const question = document.createElement('p');
        question.textContent = doubt.question;

        const name = document.createElement('p');
        name.textContent = 'Asked by: ' + doubt.name;

        doubtCard.appendChild(title);
        doubtCard.appendChild(subject);
        doubtCard.appendChild(question);
        doubtCard.appendChild(name);

        doubtsContainer.appendChild(doubtCard);
    });
}


doubtFilter.addEventListener('change', displayDoubts);

doubtSearch.addEventListener('input', displayDoubts);

loadDoubts();
