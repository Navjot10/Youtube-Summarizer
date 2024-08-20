# YouTube Summary Fetcher

**Version:** 1.0

## Description

YouTube Summary Fetcher is a Chrome extension that fetches and displays video summaries when you hover over YouTube thumbnails. It offers an easy way to get a quick overview of the content without needing to watch the entire video.

## Features

- **Thumbnail Hover Summary:** Automatically fetches and displays the video summary when hovering over a YouTube thumbnail.
- **Sidebar Toggle:** Easily enable or disable the summary sidebar from the extension popup.
- **Draggable Sidebar:** Allows you to move the sidebar around the screen and ensures it stays within the screen bounds.
- **Smooth Transition:** Sidebar adjusts its position with a reduced delay to remain near the hovered thumbnail.

## Installation

1. **Clone or Download the Repository:**

2. **Load the Extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" by toggling the switch in the top right corner.
   - Click on "Load unpacked" and select the directory where you cloned the repository.

## Environment Setup

To use the YouTube Summary Fetcher, you'll need to set an OpenAI API key as an environment variable.

### Prerequisites

- **OpenAI API Key:** Obtain an API key from the [OpenAI website](https://beta.openai.com/signup/).
- **Use any LLM:** You can always just use another LLM or method to obtain the summary. 

### Steps

1. **Set the OpenAI API Key:**
    client = OpenAI(api_key='enter your key.')

    

2. **Ensure the Flask server is running locally to serve video summaries.**



