chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script received message:", message);
  if (message.type === "GET_SUMMARY") {
    let videoId = message.videoId;
    console.log(`Received request for video ID: ${videoId}`);
    getSummary(videoId).then(summary => {
      console.log("Sending summary back to content script");
      sendResponse({summary: summary});
    }).catch(error => {
      console.error("Error in GET_SUMMARY listener:", error);
      sendResponse({error: error.toString()});
    });
    return true;  
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SUMMARY") {
    let videoId = message.videoId;
    console.log(`Received video ID: ${videoId}`);
    getSummary(videoId).then(summary => {
      sendResponse({summary: summary});
    }).catch(error => {
      console.error("Error in GET_SUMMARY listener:", error);
      sendResponse({error: error.toString()});
    });
    return true;  
  }
});

async function getSummary(videoId) {
  try {
    console.log("Fetching summary from Flask server");

    let response = await fetch(`http://localhost:5001/get_summary?video_id=${videoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error("Error in server response:", response.status, response.statusText);
      throw new Error(`Server request failed with status ${response.status}`);
    }

    let data = await response.json();
    console.log(`Summary: ${data.summary}`);
    return data.summary;
  } catch (error) {
    console.error("Error fetching summary:", error);
    return "Error fetching summary.";
  }
}
