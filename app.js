
/*
    Debounce is suitable for control events like typing or button press.
    In this case, we are delaying the execution of other function/API after a specified delay/waiting time
    
    Throttle is suitable for events like button save, scrolling, resizing.
    In this case the event triggering is active, and we can call other function/API within specified interval.
*/


const debounceImpl = (fn, delay = 150) => {
    let timeout;

    return (...args) => {
        clearTimeout(timeout); // clearing existing setTimeout to stop calling with old values
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const enteredInput = document.getElementById('enteredInput');
    const result = document.getElementById('result');

    const urlPatternRegex = /^(http(s?):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

    // Util function
    const isValidURL = (url) => urlPatternRegex.test(url);

    // If debounce() from loadash npm is required then uncomment cdn of loadash in index.html
    // urlInput.addEventListener('keydown', _.debounce(async function(event){
    //     const enteredURL = event.target.value;
    //     if(!isValidURL(enteredURL)){
    //         return result.textContent = "Invalid URL format";
    //     }
    //     const res = await mockBackendAPI(enteredURL);
    //     return result.textContent = res;
    // }, 100));

    urlInput.addEventListener('keydown', debounceImpl(async function (event) {
        // Incase of folder, enteredURL must not contain '/' at the end of the url. 
        // Because if fs npm module at the backend api is used then it will handle it
        const enteredURL = event.target.value;
        enteredInput.textContent = enteredURL;
        if (!isValidURL(enteredURL)) {
            return result.textContent = "Invalid URL format";
        }
        const res = await mockBackendAPI(enteredURL); // async backend api call

        // Roughly the result will be displayed within 100ms + server response time 20ms = 120ms
        // Total requests to server from this event will not be more than 10 requests/sec
        result.textContent = `Response from Backend: ${JSON.stringify(res)}`; //JSON response from Backend
        
    }, 100)); // 100ms will be the wait time after the keydown event is stopped
    // Depending upon the Backend api cost(total response time), the debounce time can be altered.
})


// Mock server call (replace with actual server call) with asynchronous
const mockBackendAPI = (url) => {
    const fileExtensionRegex = /\.\w{3,4}($|\?)/; // Regex of file extension
    // Util function
    const hasFileExtension = (url) => fileExtensionRegex.test(url);

    // const fs = require('fs');
    // const fsPromises = fs.promises;
    // fsPromises.access(path).then();
    // findFile is returning only boolean value. We can send entire file object if required
    const findFile = (property, searchValue) => !!FileStorage.find((file) => file[property] === searchValue);

    return new Promise((resolve) => {
        setTimeout(() => {

            let response = {};
            // Extract pathname from the url
            const pathname = new URL(url).pathname;

            // Mocking filepath instead of fs module
            // Check if the pathname contains any file extension
            if (hasFileExtension(pathname)) {
                // pathname contains a file
                response.isExists = findFile('filepath', pathname);
                if (response.isExists) response.isFile = true; // Add isFile property to the reponse only if pathname exists

            } else {
                // pathname contains a folder
                response.isExists = findFile('directory', pathname);
                if (response.isExists) response.isFile = false; // Add isFile property to the reponse only if pathname exists
            }

            resolve(response);
        }, 0); // Simulating server delay with 0ms
    });
};

/*
    If there is any restriction of throttling on server side then throttling behaviour must be considered.
*/

// Backend side we could use fs module to retrieve all the required information.
// To mimic file module, collection is being used
const FileStorage = [
    {
        directory: '/storage/dir1',
        filepath: '/storage/dir1/file1.txt', // Assuming filepath will be unique in the collection
        filename: 'file1.txt',
        stats: {
            fileType: 'Text',
            filesize: '1024',
        }
    },
    {
        directory: '/storage/dir1',
        filepath: '/storage/dir1/file2.pdf', // Assuming filepath will be unique in the collection
        filename: 'file2.pdf',
        stats: {
            fileType: 'PDF',
            filesize: '2048',
        }
    }
];
