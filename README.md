# Goals

1. Baseline: Make it at least comparable to the YT Comment Search Extension in terms of functionality and UI
2. Integrate GPT-4 or some other AI model to conduct sentiment analysis for whatever the user wants.
3. Possibly use langchain to give AI model access tools to search web, make visual graphs, etc. (maybe even agents? we'll see)

## Comment CSS Style

1. The profile image style (circular profile picture) is made using this CSS code:

```css
#author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer {
    margin-right: 16px;
    border-radius: 50%;
    background-color: transparent;
    overflow: hidden;
}
```
2. Profile name style

```css
#author-text.yt-simple-endpoint.ytd-comment-renderer {
    margin-right: 4px;
    color: var(--yt-spec-text-primary);
    margin-bottom: 2px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.3rem;
    font-weight: 500;
    line-height: 1.8rem;
}
```
3. Comment time (x years ago)

```css
.published-time-text.ytd-comment-renderer {
    --yt-endpoint-color: var(--yt-spec-text-secondary);
    --yt-endpoint-visited-color: var(--yt-spec-text-secondary);
    color: var(--yt-spec-text-secondary);
    white-space: nowrap;
    font-family: "Roboto","Arial",sans-serif;
    font-size: 1.2rem;
    line-height: 1.8rem;
    font-weight: 400;
}
```
