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
 
 // Function to search comments
 function searchComments() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  // Clear previous search results
  commentsContainer.innerHTML = '';
  // Fetch comments using the YouTube API script
  var videoId = getYouTubeVideoId();
  var apiKey = 'AIzaSyBXXFXlhx29wNP2egXR4IvKmSTH5h9nyZM'; // replace with your API key
  function fetchComments(pageToken, currentCount = 0) {
  var url = 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=' + videoId + '&key=' + apiKey;
  if (pageToken) {
  url += '&pageToken=' + pageToken;
  }
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
      updateDate.innerText = data.items[i].snippet.topLevelComment.snippet.updatedAt;
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
  })
    .catch(error => console.error('Error:', error));
  }
  // Start fetching comments
  fetchComments();
 }
 
 // Function to wait for an element to be available in the DOM
 function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
  callback(element);
  } else {
  setTimeout(() => waitForElement(selector, callback), 100);
  }
 }
 
