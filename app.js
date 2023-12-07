
/*
    Debounce is suitable for control events like typing or button press.
    In this case, we are delaying the execution of other function/API after a specified delay/waiting time
    
    Throttle is suitable for events like button save, scrolling, resizing.
    In this case the event triggering is active, and we can call other function/API within specified interval.
*/

const debounceImpl = (fn, delay = 500) => {
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
    // }, 250));
    
    urlInput.addEventListener('keydown', debounceImpl(async function(event){
        const enteredURL = event.target.value;
        if(!isValidURL(enteredURL)){
            return result.textContent = "Invalid URL format";
        }
        result.textContent = await mockBackendAPI(enteredURL);
    }, 250)); // 250ms will be the wait time after the keydown event is stopped
})



// Mock server call (replace with actual server call) with asynchronous
const mockBackendAPI = (url) => {
    const fileExtensionRegex = /\.\w{3,4}($|\?)/; // Regex of file extension
    // Util function
    const getFileExtension = (url) => fileExtensionRegex.test(url);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Extract pathname from the url and check if it is exists using url npm
            // If pathname does not exists then URL does not exists otherwise it exists
            // Then check if it is file or folder
            const response = getFileExtension(url) ? `The ${url} contains a file` : `The ${url} contains a folder`;
            resolve(`Response from Backend: ${response}`);
        }, 500); // Simulating server delay of half a second
    });
};

/*
    If there is any restriction of throttling on server side then throttling behaviour must be considered.
*/
