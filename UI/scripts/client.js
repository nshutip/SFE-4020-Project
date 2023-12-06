const loader = document.querySelector("loader")
// Get the login form and submit button
const loginForm = document.getElementById("login-form");
const submitButton = document.getElementById("submit-button");

const apiServer = "http://localhost:4000/api/"

// Add event listener to the submit button
if(submitButton){
    submitButton.addEventListener("click", async (event) => {
        event.preventDefault(); // prevent the form from submitting

        // Get the entered username and password
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        const loginData = {
            email: email,
            password: password
        };

        console.log(loginData)

        let isAuthenticated;
        let currentClientToken;
    
        await fetch(apiServer + 'user/client/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            currentClientToken = data.token
            if (currentClientToken) {
                isAuthenticated = true
            }
            console.log(currentClientToken)
            console.log('message:', data);
        })
        .catch(error => {
            console.error('Error logging in:', error);
        });

        console.log(currentClientToken)
        console.log(isAuthenticated)

        if (isAuthenticated) {
            localStorage.setItem('x-access-token', JSON.stringify(currentClientToken))
            window.location.href = loginForm.getAttribute("action");
        }
    });
}


// get registration form element
let form2 = document.getElementById("registration-form");

// add event listener to form
if(form2) {
form2.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevent form submission

    // get input elements
    let first_name = document.getElementById("first-name").value;
    let last_name = document.getElementById("last-name").value;
    let email = document.getElementById("new-email").value;
    let password = document.getElementById("new-password").value;

    // validation flag
    let isValid = true;

    // name validation
    if (first_name === "") {
        // alert("Name is required.");
        isValid = false;
    }

    if (last_name === "") {
        // alert("Name is required.");
        isValid = false;
    }

    // email validation
    if (email === "") {
        // alert("Email is required.");
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        // alert("Invalid email format.");
        isValid = false;
    }

    // password validation
    if (password === "") {
        // alert("Password is required.");
        isValid = false;
    } else if (password.length < 8) {
        // alert("Password must be at least 8 characters.");
        isValid = false;
    }

    // if validation is successful
    if (isValid) {

        let userAdded;

        const newUser = {
            "first_name" : first_name,
            "last_name" : last_name,
            "email" : email,
            "password" : password
        };

        await fetch(apiServer + 'user/client/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log('message:', data);
            userAdded = true;
        })
        .catch(error => {
            console.error('Error adding new client:', error);
        });

        if(userAdded) {
            window.location.href = form2.getAttribute("action");
        }
    }
});
}

// Log-out
// const logOut = document.querySelector(".login-link");
// if (logOut.innerHTML == "Log Out" ){
//     logOut.addEventListener("click", function(event) {
//         event.preventDefault();
//         localStorage.removeItem('x-access-token');
//         window.location.href = "index.html"
//     })
// }