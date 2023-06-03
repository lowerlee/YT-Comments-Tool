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

// Variable to store the comments
let comments = [];

// Fetch comments when the page loads
fetchComments();

// Function to search comments
function searchComments() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    // Clear previous search results
    commentsContainer.innerHTML = '';

    // Filter the stored comments based on the search term
    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i].snippet.topLevelComment.snippet.textOriginal.toLowerCase();
        if (comment.includes(searchTerm)) {
            // Create and append the comment element as before...
        }
    }
}

// Function to calculate time ago
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

// Fetch comments using the YouTube API script
function fetchComments(pageToken, currentCount = 0) {
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
              // Push the comment to the comments array
              comments.push(data.items[i]);
          }

          currentCount += data.items.length;

          // If there's a next page, fetch it
          if (data.nextPageToken) {
              fetchComments(data.nextPageToken, currentCount);
          }
      })
      .catch(error => console.error('Error:', error));
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
