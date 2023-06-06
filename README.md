# Long-Term Goals

1. Baseline: Make it at least comparable to the YT Comment Search Extension in terms of functionality and UI
2. Integrate GPT-4 or some other AI model to conduct sentiment analysis for whatever the user wants.
3. Possibly use langchain to give AI model access tools to search web, make visual graphs, etc. (maybe even agents? we'll see)

## Cache Money Objectives

1. Fetch and cache comments using chrome storage API (sync or local, based on size of all comments)
2. Determine which chrome storage (sync or local) the comments a re stored in the so that they can later be accessed for future searches.
3. Make a function to get comments from the google storage cache, filter out comments based on search term, then display comments by adding the comment elements (profile picture, profile name, date published, and comment text) into the html UI containers.

## Immediate stuff to do

5. Add the likes and dislikes counter.
6. Increase the top and bottom margins inbetween comments.
7. Add something to show reply thread for each filtered comment
8. Allow search to search not just top level comments, but also the replies.
