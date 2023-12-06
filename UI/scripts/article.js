const apiServer = "http://localhost:4000/api/"

let storedArticles

// get new article form element
let form3 = document.getElementById("new-article-form");

// add event listener to form
if (form3) {
  form3.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevent form submission

    // get input elements
    const title = document.getElementById("article-title").value;
    const imageInput = document.querySelector('input[name="image"]');
    const image = imageInput.value
    const content = document.getElementById("article-content").value;

    console.log(image)

    // validation flag
    let isValid = true;

    // title validation
    if (title === "") {
      alert("Title is required.");
      isValid = false;
    }

    // image validation
    if (image === "") {
      alert("Image is required.");
      isValid = false;
    }

    // content validation
    if (content === "") {
      alert("content is required.");
      isValid = false;
    }

    // if validation is successful
    if (isValid) {

      let articleAdded;

      const currentAdminToken = await localStorage.getItem('x-access-token')

      const newArticle = {
          "title" : title,
          "image" : image,
          "content" : content
      };

      await fetch(apiServer + 'articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token' : JSON.parse(currentAdminToken)
          },
          body: JSON.stringify(newArticle)
      })
      .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        console.log('message:', data);
        articleAdded = true;
      })
      .catch(error => {
          console.error('Error adding new article:', error);
      });

      if(articleAdded) {
          window.location.href = form3.getAttribute("action");
      }

    }
  });
}


async function getArticles () {
  await fetch(apiServer + 'articles',
  {
    method: "GET",
    headers: {
      "content-type": "application/json"
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
      storedArticles = data
  })
  .catch(error => {
      console.log(error)
  });

  console.log(storedArticles)

  const articlesList = document.getElementById("article-cards-container")

  if (storedArticles) {
    storedArticles.forEach( article => {
      const articleContainer = document.createElement("li");
      articleContainer.className += "card article-card grid-item";
      const articleId = article._id
      const url = `window.location.href = article.html?id=${articleId}`
      articleContainer.setAttribute("onclick", url)
      articleContainer.setAttribute("id", article._id)
      console.log(articleId)
    
      const descriptionSection = document.createElement("div");
      descriptionSection.className += "card-details-container";
      descriptionSection.innerHTML = `
        <h3 class="card-title">${article.title}</h3>
        <p class="card-description">${article.content}</p>
      `;
      articleContainer.appendChild(descriptionSection);

      const imageSection = document.createElement("div");
      imageSection.className += "card-image-container";
      imageSection.innerHTML = `
        <img src="${article.image}" alt="" class="card-image article-card-image">
      `;
      articleContainer.appendChild(imageSection)
      
      const lowerSection = document.createElement("a");
      lowerSection.className += "card-link external-link";
      lowerSection.setAttribute("href", `article.html?id=${articleId}`);
      lowerSection.innerHTML = `
          <p>
            Read more
            <svg id="right">
                <path d="M0.5 9.35772H20.9956L14.2001 2.29941L16.4134 0L27 11L16.4134 22L14.2001 19.7006L20.9956 12.6423H0.5V9.35772Z" ></path>
            </svg>
          </p>
      `;
      articleContainer.appendChild(lowerSection);
    
      if (articlesList) {
        articlesList.appendChild(articleContainer);
      }
    });
  }
}

async function readMore (articleId) {
  const articleContainer = document.getElementById("article-container");
  const articleTitle = document.getElementById("main-article-title");
  const articleContent = document.getElementById("main-article-content");
  const articleLinks = document.querySelectorAll("#articles a");

  window.location.href = "./article1.html";
  console.log(articleId)
  let article
  await fetch(apiServer + `articles/${articleId}`,{
    method: "GET",
    headers: {
      "content-type": "application/json"
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
      // article = data
  })
  .catch(error => {
      console.error('Error adding new admin:', error);
  });
}

async function openArticle (){
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  console.log(articleId)

  const articleContainer = document.getElementById("article-container");
  const articleTitle = document.getElementById("main-article-title");
  const articleContent = document.getElementById("main-article-content");
  const articleAuthor = document.getElementById("main-article-author");
  const commentsList = document.getElementById("main-article-comments-container")
  // const commentsList = document.querySelector(".main-article-comments-container")
  

  let article

  await fetch(apiServer + `articles/${articleId}`,{
    method: "GET",
    headers: {
      "content-type": "application/json"
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
      article = data
  })
  .catch(error => {
      console.error('Error adding new admin:', error);
  });

  if (article) {
    articleTitle.textContent = article.title;
    articleContent.textContent = article.content;
    articleAuthor.textContent = article.authorId

    const storedComments = article.comments

    console.log(storedComments)

    if (storedComments) {
      storedComments.forEach( comment => {
        const commentContainer = document.createElement("li");
        commentContainer.className += "comment-container";
        const commentId = comment._id
        commentContainer.setAttribute("id", comment._id)

        console.log(commentId)
      
        const commentSection = document.createElement("div");
        commentSection.className += "comment-details-container";
        commentSection.innerHTML = `
          <p class="user-name">${comment.userId}</p>
          <p class="user-comment">${comment.comment}</p>
        `;
        commentContainer.appendChild(commentSection);
      
        if (commentsList) {
          commentsList.appendChild(commentContainer);
        }
      });
    }

    const close = document.getElementsByClassName("closebtn");

    for (let i = 0; i < close.length; i++) {
      close[i].onclick = function(){
        var div = this.parentElement;
        div.style.opacity = "0";
        setTimeout(function(){ div.style.display = "none"; }, 600);
      }
    }
  }
  // const article = articles.find(a => a.id === articleId);
  // if (article) {
  //   displayArticle(article);
  // }
}

function openCommentForm() {

  const currentUserToken = localStorage.getItem("x-access-token");

  if (!currentUserToken) {
    return document.querySelector(".alert").style.display = "block";
  }

  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  console.log(articleId)

  document.getElementById("comment-form-container").style.display = "block";
  document.getElementById("main-article-comments-container").style.display = "none";
  document.getElementById("main-article-buttons-container").style.display = "none";

  let commentForm = document.getElementById("comment-form");

  if (commentForm) {
    commentForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // prevent form submission

      // get input elements

      const comment = document.getElementById("comment-message").value;

      console.log(comment)

      // validation flag
      const isValid = true;

      // content validation
      if (comment === "") {
        // alert("content is required.");
        isValid = false;
      }

      // if validation is successful
      if (isValid) {

        let commentAdded;

        await fetch(apiServer + `articles/${articleId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token' : JSON.parse(currentUserToken)
          },
          body: JSON.stringify({comment: comment})
        })
        .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(data => {
          console.log('message:', data);
          commentAdded = true;
        })
        .catch(error => {
            console.error('Error adding new comment:', error);
        });

        if(commentAdded) {
          // window.location.href = commentForm.getAttribute("action");
          location.reload()
        }
      }
    });
  }
}

function closeCommentForm() {
  document.getElementById("comment-form-container").style.display = "none";
  document.getElementById("main-article-comments-container").style.display = "block";
  document.getElementById("main-article-buttons-container").style.display = "block";
}