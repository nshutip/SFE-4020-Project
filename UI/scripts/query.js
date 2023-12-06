const apiServer = "http://localhost:4000/api/"

let storedQuerries

async function getQueries () {
  const currentAdminToken = await localStorage.getItem('x-access-token')
  console.log(currentAdminToken)
  await fetch(apiServer + 'queries',
  {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "x-access-token": JSON.parse(currentAdminToken)
    }
  })
  .then(response => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
      console.log(data);
      storedQuerries = data
  })
  .catch(error => {
      console.error('Error adding new admin:', error);
  });

  console.log(storedQuerries)

  const list = document.getElementById("querries-container")

  storedQuerries.forEach( querry => {
    const querryContainer = document.createElement("li");
    querryContainer.className += "container querry-container grid-item";

    const topSection = document.createElement("div");
    topSection.className += "querry-top-section";
    topSection.innerHTML = `<h3 class="querry-name">${querry.name}</h3>`;
    querryContainer.appendChild(topSection);
    
    const lowerSection = document.createElement("div");
    lowerSection.className += "querry-lower-section";
    lowerSection.innerHTML = `<p class="querry-message">${querry.message}</p>`;
    querryContainer.appendChild(lowerSection);

    if (list) {
      list.appendChild(querryContainer);
    }
  });
}

// get contact form element
let form1 = document.getElementById("contact-form");

// add event listener to form
if (form1) {
  form1.addEventListener("submit", async (event) => {
    try {
      event.preventDefault(); // prevent form submission

      // get input elements
      const name = document.getElementById("contact-name").value;
      console.log(name)
      const email = document.getElementById("contact-email").value;
      console.log(email)
      const message = document.getElementById("contact-message").value;
      console.log(message)
  
      // validation flag
      let isValid = true;
  
      // name validation
      if (name === "") {
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
  
      // message validation
      if (message === "") {
          // alert("message is required.");
          isValid = false;
      }
  
      // if validation is successful
      if (isValid) {

        let querySent
  
        const query = {
          "name" : name,
          "email" : email,
          "message" : message
        };
        
        console.log(query)
  
        await fetch(apiServer + "queries",{
          method: "POST",
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(query)
        })
        .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log('message:', data);
            querySent = true;
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });

        if(userAdded) {
            window.location.href = form1.getAttribute("action");
        }
      } 
    } catch {
      
    }
  });
}

