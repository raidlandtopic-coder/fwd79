
const uploadForm = document.getElementById('upload-form');
const uploadMessage = document.getElementById('upload-message');

uploadForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(uploadForm);

    uploadMessage.textContent = 'Uploading your resource...';

    try {
        const response = await fetch('http://localhost:3000/api/resources', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Upload failed.');
        }

        uploadMessage.textContent = 'Resource uploaded successfully!';

        uploadForm.reset();

    } catch (error) {
        console.error('Upload error:', error);

        uploadMessage.textContent =
            'Could not upload resource. Please try again.';
    }
});

async function loadResources() {
    const resourcesContainer = document.getElementById('resources-container');

    try {
        const response = await fetch('http://localhost:3000/api/resources');

        if (!response.ok) {
            throw new Error('Could not retrieve resources.');
        }

        const resources = await response.json();

        resourcesContainer.innerHTML = '';

        if (resources.length === 0) {
            resourcesContainer.textContent = 'No resources uploaded yet.';
            return;
        }

        resources.forEach(function(resource) {
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card';

            const title = document.createElement('h3');
            title.textContent = resource.title;

            const subject = document.createElement('p');
            subject.textContent = 'Subject: ' + resource.subject;

            const name = document.createElement('p');
            name.textContent = 'Uploaded by: ' + resource.name;

            const downloadLink = document.createElement('a');
            downloadLink.href = 'http://localhost:3000/uploads/' +
                encodeURIComponent(resource.filePath);
            downloadLink.textContent = 'Download Resource';
            downloadLink.setAttribute('download', '');

            resourceCard.appendChild(title);
            resourceCard.appendChild(subject);
            resourceCard.appendChild(name);
            resourceCard.appendChild(downloadLink);

            resourcesContainer.appendChild(resourceCard);
        });

    } catch (error) {
        console.error('Loading resources error:', error);
        resourcesContainer.textContent = 'Could not load resources.';
    }
}

loadResources();
