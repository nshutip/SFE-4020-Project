async function openArticle (){
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id");
  
    console.log(articleId)
  
    const articleContainer = document.getElementById("article-container");
    const articleTitle = document.getElementById("main-article-title");
    const articleContent = document.getElementById("main-article-content");
    const articleAuthor = document.getElementById("main-article-author");
    const commentsList = document.getElementById("main-article-comments-container")
    
  
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
    document.getElementById("comment-form-container").style.display = "block";
    document.getElementById("main-article-comments-container").style.display = "none";
    document.getElementById("main-article-buttons-container").style.display = "none";
}

let commentForm = document.getElementById("comment-form");

if (commentForm) {
    commentForm.addEventListener("submit", function(event) {
        event.preventDefault(); // prevent form submission

        // get input elements

        const message = document.getElementById("comment-message").value;

        // validation flag
        const isValid = true;

        // content validation
        if (message === "") {
        // alert("content is required.");
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

function closeCommentForm() {
    document.getElementById("comment-form-container").style.display = "none";
    document.getElementById("main-article-comments-container").style.display = "block";
    document.getElementById("main-article-buttons-container").style.display = "block";
}