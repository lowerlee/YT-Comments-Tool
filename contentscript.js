// Get the current YouTube video ID from the page URL
function getYouTubeVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
 }
 
 // Create the main container element
 const mainContainer = document.createElement('div');
 mainContainer.id = 'comment-filter-main-container';
 
 // Create the comment count element
 const commentCountElement = document.createElement('div');
 commentCountElement.id = 'comment-filter-comment-count';
 commentCountElement.textContent = 'Loading comments...';
 
 // Create the search container element
 const searchContainer = document.createElement('div');
 searchContainer.id = 'comment-filter-container';
 
 // Create the search input element
 const searchInput = document.createElement('input');
 searchInput.type = 'text';
 searchInput.placeholder = 'Search comments...';
 searchInput.id = 'comment-filter-input';
 
 // Create the search button element
 const searchButton = document.createElement('button');
 searchButton.innerText = 'Search';
 searchButton.id = 'comment-filter-button';
 
 // Append the UI elements to the search container
 searchContainer.appendChild(searchInput);
 searchContainer.appendChild(searchButton);
 
 // Create the comments container element
 const commentsContainer = document.createElement('div');
 commentsContainer.id = 'comment-filter-comments';
 
 // Append the comment count element, search container, and comments container to the main container
 mainContainer.appendChild(commentCountElement);
 mainContainer.appendChild(searchContainer);
 mainContainer.appendChild(commentsContainer);
 
 // Wait for the comment section element to be available
 waitForElement('#comments', (commentSection) => {
  // Insert the main container before the comment section
  commentSection.parentNode.insertBefore(mainContainer, commentSection);
  // Add event listener to the search button
  searchButton.addEventListener('click', searchComments);
 });
 
function timeAgo(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
      return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
      return Math.floor(interval) + " months ago";
  }
  interval = seconds / 604800;
  if (interval > 1) {
      return Math.floor(interval) + " weeks ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
      return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
      return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

let commentsCache = {};

function searchComments() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Check if comments have already been loaded
  if (commentsCache[searchTerm]) {
    // Load comments from cache
    commentsContainer.innerHTML = commentsCache[searchTerm];
  } else {
    // Clear previous search results
    commentsContainer.innerHTML = '';

    // Start fetching comments
    fetchComments().then(() => {
      // Cache the comments after all comments have been fetched
      commentsCache[searchTerm] = commentsContainer.innerHTML;
    });
  }
}

// Fetch comments using the YouTube API script
var videoId = getYouTubeVideoId();
var apiKey = 'AIzaSyBXXFXlhx29wNP2egXR4IvKmSTH5h9nyZM'; // replace with your API key

function fetchComments(pageToken, currentCount = 0) {
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Return a promise that resolves when all comments have been fetched
  return new Promise((resolve, reject) => {
    var url = 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=' + videoId + '&key=' + apiKey;
    if (pageToken) {
      url += '&pageToken=' + pageToken;
    }

    // Fetch the comments using the YouTube API
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // data.items contains the comment threads
        for (var i = 0; i < data.items.length; i++) {
          var comment = data.items[i].snippet.topLevelComment.snippet.textOriginal.toLowerCase();
          if (comment.includes(searchTerm)) {
            var commentElement = document.createElement('p');
            commentElement.innerText = comment;

            // Add author's profile image, profile name, and update date
            var authorImage = document.createElement('img');
            authorImage.src = data.items[i].snippet.topLevelComment.snippet.authorProfileImageUrl;
            authorImage.className = 'author-thumbnail';

            var authorName = document.createElement('p');
            authorName.innerText = data.items[i].snippet.topLevelComment.snippet.authorDisplayName;
            authorName.className = 'author-text';

            var updateDate = document.createElement('p');
            updateDate.innerText = timeAgo(new Date(data.items[i].snippet.topLevelComment.snippet.updatedAt));
            updateDate.className = 'published-time-text';

            var authorTextContainer = document.createElement('div');
            authorTextContainer.className = 'author-text-container';
            authorTextContainer.appendChild(authorName);
            authorTextContainer.appendChild(updateDate);

            var textContainer = document.createElement('div');
            textContainer.appendChild(authorTextContainer);
            textContainer.appendChild(commentElement);

            var commentContainer = document.createElement('div');
            commentContainer.className = 'comment-filter-comment';
            commentContainer.appendChild(authorImage);
            commentContainer.appendChild(textContainer);

            commentsContainer.appendChild(commentContainer);
          }
        }

        currentCount += data.items.length;
        commentCountElement.textContent = 'Comments loaded: ' + currentCount;

        // If there's a next page, fetch it
        if (data.nextPageToken) {
          fetchComments(data.nextPageToken, currentCount).then(resolve);
        } else {
          resolve();
        }
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
  });
}

 // Function to wait for an element to be available in the DOM
 function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  }

  else {
    setTimeout(() => waitForElement(selector, callback), 100);
  }
 }
