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

// Create the testing box
const testElement = document.createElement('div');
testElement.id = 'test';
testElement.textContent = 'Comment Array JSON Size (Bytes)...';

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
mainContainer.appendChild(testElement);
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

// Function to search comments
function searchComments() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Clear previous search results
  commentsContainer.innerHTML = '';

  // Fetch comments using the YouTube API script
  var videoId = getYouTubeVideoId();
  var apiKey = 'AIzaSyBXXFXlhx29wNP2egXR4IvKmSTH5h9nyZM';

  // Promisify the chrome.storage.get function
  function getFromStorage(storage) {
    return new Promise((resolve, reject) => {
      storage.get(result => {
        if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
        } else {
            resolve(JSON.parse(result));
        }
      });
    });
  }
  
  async function checkCommentCache(pageToken, currentCount = 0) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    try {
      // Try to get comments from chrome.storage.sync
      let comments = await getFromStorage(chrome.storage.session);
      let commentsJSON = JSON.stringify(comments);
      let size = commentsJSON.length * 2; // each character takes 2 bytes
      testElement.textContent = 'Comment Array (images, names, publishdate, and comment text) JSON Size (Bytes): ' + size;
      displayComments(comments, searchTerm);
    } catch (error) {
        // If not found, fetch and store the comments
        fetchComments(pageToken, currentCount, searchTerm);
      }
  }

  function displayComments(comments, searchTerm) {
    // Filter comments based on the search term
    const filteredComments = comments.filter(comment => 
        comment.textOriginal.toLowerCase().includes(searchTerm)
    );

    // Iterate over each comment
    filteredComments.forEach(comment => {

      // Add author's comment text, profile image, profile name, and publish date
      var commentElement = document.createElement('p');
      commentElement.innerText = comment.text;

      var authorImage = document.createElement('img');
      authorImage.src = comment.authorImage;
      authorImage.className = 'author-thumbnail';

      var authorName = document.createElement('p');
      authorName.innerText = comment.authorName;
      authorName.className = 'author-text';
      
      var updateDate = document.createElement('p');
      updateDate.innerText = timeAgo(new Date(comment.publishedAt));
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
    });

    // Update the comment count
    commentCountElement.textContent = 'Total comments: ' + filteredComments.length;
  }

  // Stores comment array in chrome.storage.session after converting to JSON
  function storeComments(comments) {
    let data = JSON.stringify(comments);
    chrome.storage.session.set({ [videoId]: data }, function() {
      console.log('Data stored in chrome.storage.session')
    })
  }

  function fetchComments(pageToken, currentCount = 0) {
    var url = 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=' + videoId + '&key=' + apiKey;

    if (pageToken) {
      url += '&pageToken=' + pageToken;
    }

    // Fetch the comments using the YouTube API (Should only do this once when first loading the comments, needs a conditional check)
    fetch(url)
    .then(response => response.json())
    .then(data => {
      let comments = [];
      // data.items contains the comment threads
      for (var i = 0; i < data.items.length; i++) {
        var comment = data.items[i].snippet.topLevelComment.snippet;
        var commentData = {
          text: comment.textOriginal.toLowerCase(),
          authorName: comment.authorDisplayName,
          authorImage: comment.authorProfileImageUrl,
          publishedAt: comment.publishedAt
        };
        comments.push(commentData);
        if (comment.textOriginal.toLowerCase().includes(searchTerm)) {
          // Add author's comment text, profile image, profile name, and publish date
          var commentElement = document.createElement('p');
          commentElement.innerText = comment.textOriginal.toLowerCase();

          var authorImage = document.createElement('img');
          authorImage.src = comment.authorProfileImageUrl;
          authorImage.className = 'author-thumbnail';

          var authorName = document.createElement('p');
          authorName.innerText = comment.authorDisplayName;
          authorName.className = 'author-text';
          
          var updateDate = document.createElement('p');
          updateDate.innerText = timeAgo(new Date(comment.updatedAt));
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
        fetchComments(data.nextPageToken, currentCount);
      }
      
      else {
        commentCountElement.textContent = 'Total comments: ' + currentCount;
      }

      storeComments(comments);
    })
    .catch(error => console.error('Error:', error));
  }
  // Start fetching comments
  checkCommentCache();
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
