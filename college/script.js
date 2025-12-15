// Tab Logic
function openTab(evt, tabName) {
    // Hide all tab content
    var i, tabContent, tabBtn;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
        tabContent[i].classList.remove("active-content");
    }

    // Remove active class from buttons
    tabBtn = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tabBtn.length; i++) {
        tabBtn[i].className = tabBtn[i].className.replace(" active", "");
    }

    // Show current tab and add active class
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active-content"); // for animation
    evt.currentTarget.className += " active";
}

// --- DATA FETCHING LOGIC (Adapted from your file) ---

$(document).ready(function() {
    // We explicitly target one department for the Homepage Demo to make it fast.
    // In a real app, you might pass the department URL as a parameter.
    const targetDeptUrl = "https://bmsce.ac.in/home/Computer-Science-and-Engineering-Faculty"; 

    // Using the proxy you provided
    const proxyUrl = 'https://api.meiraba.me/proxy?url=' + targetDeptUrl;

    $.get(proxyUrl, function (fhtml) {
        var $facultyDom = $('<div>').html(fhtml);
        const facultyContainer = document.getElementById('faculty-grid');
        
        // Hide Loading Text
        document.getElementById('loading-text').style.display = 'none';

        $facultyDom.find('.row.py-2.mb-0').each(function () {
            var $this = $(this);
            
            // Extracting Data based on your previous logic
            var name = $this.find('h2').text().trim();
            var designation = $this.find('.font-weight-semibold').text().trim();
            var email = $this.find("p:contains('@')").text().trim();
            // Handle image: use absolute path if relative
            var imgRaw = $this.find('img').attr('src');
            var image = imgRaw.includes('http') ? imgRaw : `https://bmsce.ac.in${imgRaw}`;

            // Create HTML Card
            const card = document.createElement('div');
            card.className = 'faculty-card';
            card.innerHTML = `
                <div class="f-img-container">
                    <img src="${image}" alt="${name}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
                </div>
                <div class="f-info">
                    <h3>${name}</h3>
                    <span>${designation}</span>
                    <div class="f-email"><i class="fas fa-envelope"></i> ${email}</div>
                </div>
            `;
            
            facultyContainer.appendChild(card);
        });
    }).fail(function() {
        document.getElementById('loading-text').innerText = "Failed to load data. Please check connection.";
    });
});