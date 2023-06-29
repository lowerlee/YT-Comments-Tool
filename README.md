# Long-Term Goals

1. Baseline: Make it at least comparable to the YT Comment Search Extension in terms of functionality and UI
2. Integrate GPT-4 or some other AI model to conduct sentiment analysis for whatever the user wants.
3. Possibly use langchain to give AI model access tools to search web, make visual graphs, etc. (maybe even agents? we'll see)

## Immediate stuff to do

1. Cache comments so that way it only loads comments once, and not every search.
2. Add the likes and dislikes counter.
3. Increase the top and bottom margins inbetween comments.
4. Add something to show reply thread for each filtered comment
5. Allow search to search not just top level comments, but also the replies.

# Overall Goals
1. Make a UI element with a text input searchbar, search button, text displaying number of comments loaded, section that displays all filtered comments
2. Fetch comments from youtube comment section using youtube data api
3. Cache fetched comments into google.storage.session
4. Develop a workflow where the comments are fetched from youtube data api, cached in google.storage.session, filtered from the cache when the user first clicks the search button, but any subsequent searches just filters from the cache
