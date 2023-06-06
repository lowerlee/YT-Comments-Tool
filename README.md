# Long-Term Goals

1. Baseline: Make it at least comparable to the YT Comment Search Extension in terms of functionality and UI
2. Integrate GPT-4 or some other AI model to conduct sentiment analysis for whatever the user wants.
3. Possibly use langchain to give AI model access tools to search web, make visual graphs, etc. (maybe even agents? we'll see)

## Immediate stuff to do

1. Fetch and cache comments using chrome storage API
2. Make a function to get comments from the google storage cache, filter out comments based on search term, then display comments by adding the comment elements (profile picture, profile name, date published, and comment text) into the html UI containers.
3. Add the likes and dislikes counter.
4. Increase the top and bottom margins inbetween comments.
5. Add something to show reply thread for each filtered comment
6. Allow search to search not just top level comments, but also the replies.
