
const pyqForm = document.getElementById('pyq-form');
const pyqMessage = document.getElementById('pyq-message');
const pyqContainer = document.getElementById('pyq-container');

const subjectFilter = document.getElementById('subject-filter');
const yearFilter = document.getElementById('year-filter');
const pyqSearch = document.getElementById('pyq-search');

let allPYQs = [];


// ==================================
// UPLOAD A QUESTION PAPER
// ==================================

pyqForm.addEventListener('submit', async function(event) {

    event.preventDefault();

    const formData = new FormData(pyqForm);

    pyqMessage.textContent = 'Uploading question paper...';

    try {

        const response = await fetch('http://localhost:3000/api/pyqs', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Upload failed.');
        }

        pyqMessage.textContent =
            'Question paper uploaded successfully!';

        pyqForm.reset();

        await loadPYQs();

    } catch (error) {

        console.error('PYQ upload error:', error);

        pyqMessage.textContent =
            'Could not upload question paper.';

    }

});


// ==================================
// LOAD ALL QUESTION PAPERS
// ==================================

async function loadPYQs() {

    try {

        const response = await fetch('http://localhost:3000/api/pyqs');

        if (!response.ok) {
            throw new Error('Could not retrieve PYQs.');
        }

        allPYQs = await response.json();

        updateYearFilter();

        displayPYQs();

    } catch (error) {

        console.error('Loading PYQs error:', error);

        pyqContainer.textContent =
            'Could not load question papers.';

    }

}


// ==================================
// UPDATE YEAR FILTER
// ==================================

function updateYearFilter() {

    const selectedYear = yearFilter.value;

    const years = [...new Set(
        allPYQs.map(function(pyq) {
            return String(pyq.year);
        })
    )].sort(function(a, b) {
        return Number(b) - Number(a);
    });

    yearFilter.innerHTML = '<option value="All">All Years</option>';

    years.forEach(function(year) {

        const option = document.createElement('option');

        option.value = year;
        option.textContent = year;

        yearFilter.appendChild(option);

    });

    if (years.includes(selectedYear)) {
        yearFilter.value = selectedYear;
    }

}


// ==================================
// DISPLAY AND FILTER QUESTION PAPERS
// ==================================

function displayPYQs() {

    const selectedSubject = subjectFilter.value;
    const selectedYear = yearFilter.value;
    const searchText = pyqSearch.value.toLowerCase().trim();

    pyqContainer.innerHTML = '';

    const filteredPYQs = allPYQs.filter(function(pyq) {

        const subjectMatch =
            selectedSubject === 'All' ||
            pyq.subject === selectedSubject;

        const yearMatch =
            selectedYear === 'All' ||
            String(pyq.year) === selectedYear;

        const titleMatch =
            pyq.title.toLowerCase().includes(searchText);

        return subjectMatch && yearMatch && titleMatch;

    });


    if (filteredPYQs.length === 0) {

        pyqContainer.textContent =
            'No question papers found.';

        return;

    }


    filteredPYQs.forEach(function(pyq) {

        const card = document.createElement('div');

        card.className = 'resource-card';


        const title = document.createElement('h3');

        title.textContent = pyq.title;


        const subject = document.createElement('p');

        subject.textContent = 'Subject: ' + pyq.subject;


        const year = document.createElement('p');

        year.textContent = 'Exam Year: ' + pyq.year;


        const downloadLink = document.createElement('a');

        downloadLink.href =
            'http://localhost:3000/uploads/' +
            encodeURIComponent(pyq.filePath);

        downloadLink.textContent = 'Download Question Paper';

        downloadLink.setAttribute('download', '');


        card.appendChild(title);
        card.appendChild(subject);
        card.appendChild(year);
        card.appendChild(downloadLink);

        pyqContainer.appendChild(card);

    });

}


// ==================================
// FILTER EVENT LISTENERS
// ==================================

subjectFilter.addEventListener('change', displayPYQs);

yearFilter.addEventListener('change', displayPYQs);

pyqSearch.addEventListener('input', displayPYQs);


// ==================================
// LOAD PAPERS WHEN PAGE OPENS
// ==================================

loadPYQs();
