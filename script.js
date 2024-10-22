// Fetch IP address
fetch('https://api.ipify.org?format=json')
.then(response => response.json())
.then(data => {
    document.getElementById('ip').textContent = `Your IP Address: ${data.ip}`;
})
.catch(error => {
    document.getElementById('ip').textContent = 'Unable to get IP address';
});

// Get device and browser information
function getDeviceInfo() {
    const ua = navigator.userAgent;

    let deviceType = /mobile/i.test(ua) ? "Mobile" : "Desktop";
    let browser;
    if (/chrome|crios|crmo/i.test(ua)) {
        browser = "Chrome";
    } else if (/firefox|fxios/i.test(ua)) {
        browser = "Firefox";
    } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
        browser = "Safari";
    } else if (/msie|trident/i.test(ua)) {
        browser = "Internet Explorer";
    } else {
        browser = "Unknown Browser";
    }

    let os, osVersion;
    if (/windows/i.test(ua)) {
        os = "Windows";
        osVersion = ua.match(/Windows NT (\d+\.\d+)/)[1]; 
    } else if (/android/i.test(ua)) {
        os = "Android";
        osVersion = ua.match(/Android (\d+\.\d+)/)[1];
    } else if (/linux/i.test(ua)) {
        os = "Linux";
        osVersion = "Unknown version"; 
    } else if (/iphone|ipad|ipod/i.test(ua)) {
        os = "iOS";
        osVersion = ua.match(/OS (\d+_\d+)/)[1].replace(/_/g, '.');
    } else if (/mac/i.test(ua)) {
        os = "MacOS";
        osVersion = ua.match(/Mac OS X (\d+_\d+)/)[1].replace(/_/g, '.');
    } else {
        os = "Unknown OS";
        osVersion = "N/A";
    }

    return {
        deviceType: deviceType,
        browser: browser,
        os: os,
        osVersion: osVersion
    };
}

const deviceInfo = getDeviceInfo();
document.getElementById('device').textContent = `Device: ${deviceInfo.deviceType}, Browser: ${deviceInfo.browser}`;
document.getElementById('osVersion').textContent = `OS: ${deviceInfo.os}, Version: ${deviceInfo.osVersion}`;

// Get user location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('location').textContent = 'Geolocation is not supported by this browser.';
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=696d9da5bdbf453b99084119c1f0b561`)
    .then(response => response.json())
    .then(data => {
        const location = data.results[0].formatted;
        document.getElementById('location').textContent = `Your Address: ${location}`;
    })
    .catch(error => {
        document.getElementById('location').textContent = 'Unable to get address';
    });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('location').textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('location').textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('location').textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('location').textContent = "An unknown error occurred.";
            break;
    }
}

getLocation();
