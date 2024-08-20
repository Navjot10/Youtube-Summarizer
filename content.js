function initializeSidebar() {
  let sidebar = document.createElement('div');
  sidebar.id = 'yt-summary-sidebar';
  sidebar.innerHTML = `
    <div id="yt-summary-header">
      <h3>Summary</h3>
      <button id="yt-summary-close">×</button>
    </div>
    <div id="yt-summary-content"></div>
  `;
  sidebar.style.cssText = `
    position: fixed;
    width: 250px;
    height: auto;
    max-height: 300px;
    background: #000000;
    color: #ffffff;
    box-shadow: -2px 0 5px rgba(0,0,0,0.3);
    z-index: 9999;
    border-radius: 8px;
    overflow-y: auto;
    opacity: 1;
    display: none;  /* Start hidden */
    left: 20px;
    top: 20px;
  `;
  document.body.appendChild(sidebar);

  let style = document.createElement('style');
  style.textContent = `
    #yt-summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #222222;
      border-bottom: 1px solid #333333;
      cursor: move;
    }
    #yt-summary-header h3 {
      margin: 0;
      font-size: 16px;
      color: #ffffff;
    }
    #yt-summary-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #ffffff;
    }
    #yt-summary-content {
      padding: 10px;
      font-size: 13px;
      line-height: 1.4;
    }
  `;
  document.head.appendChild(style);

  // Variables to manage the request state
  let currentVideoId = null;
  let isFetching = false;
  let sidebarTimer = null;

  // Function to show sidebar
  function showSidebar() {
    sidebar.style.display = 'block';
    sidebar.style.opacity = '1';
  }

  // Function to close the sidebar
  document.getElementById('yt-summary-close').addEventListener('click', function() {
    sidebar.style.opacity = '0';
    setTimeout(() => {
      sidebar.style.display = 'none';
    }, 300);
  });

  // Function to fetch and display summary
  function fetchAndDisplaySummary(videoId, thumbnailElement) {
    if (isFetching) {
      return; 
    }

    if (videoId === currentVideoId) {
      if (sidebarTimer) clearTimeout(sidebarTimer);
      sidebarTimer = setTimeout(() => moveSidebarToThumbnail(thumbnailElement), 300);
      return;
    }

    isFetching = true;
    currentVideoId = videoId;
    showSidebar();
    moveSidebarToThumbnail(thumbnailElement);
    updateSidebar('Loading summary...');

    chrome.runtime.sendMessage({ type: "GET_SUMMARY", videoId: videoId }, function (response) {
      if (chrome.runtime.lastError) {
        updateSidebar("Error fetching summary. Please try refreshing the page.");
      } else {
        updateSidebar(response.summary);
      }
      isFetching = false;
    });
  }

  function moveSidebarToThumbnail(thumbnailElement) {
    const rect = thumbnailElement.getBoundingClientRect();
    let sidebarX = rect.right + 10; 
    let sidebarY = rect.top; 

    if (sidebarX + sidebar.offsetWidth > window.innerWidth) {
      sidebarX = rect.left - sidebar.offsetWidth - 10; 
    }
    if (sidebarY + sidebar.offsetHeight > window.innerHeight) {
      sidebarY = window.innerHeight - sidebar.offsetHeight - 10; 
    }

    sidebar.style.left = `${sidebarX}px`;
    sidebar.style.top = `${sidebarY}px`;
  }

  // Dragging functionality
  let isDragging = false;
  let offsetX, offsetY;

  document.getElementById('yt-summary-header').addEventListener('mousedown', function(event) {
    isDragging = true;
    sidebar.style.transition = 'none'; 
    offsetX = event.clientX - sidebar.getBoundingClientRect().left;
    offsetY = event.clientY - sidebar.getBoundingClientRect().top;
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
  });

  function onDragMove(event) {
    if (isDragging) {
      let newX = event.clientX - offsetX;
      let newY = event.clientY - offsetY;

      if (newX + sidebar.offsetWidth > window.innerWidth) {
        newX = window.innerWidth - sidebar.offsetWidth;
      }
      if (newY + sidebar.offsetHeight > window.innerHeight) {
        newY = window.innerHeight - sidebar.offsetHeight;
      }
      if (newX < 0) {
        newX = 0;
      }
      if (newY < 0) {
        newY = 0;
      }

      sidebar.style.left = `${newX}px`;
      sidebar.style.top = `${newY}px`;
    }
  }

  function onDragEnd() {
    isDragging = false;
    sidebar.style.transition = 'left 0.5s ease, top 0.5s ease'; 
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
  }

  document.addEventListener('mouseover', function(event) {
    let target = event.target.closest('a#thumbnail');
    if (target && isExtensionValid()) {
      let videoId = new URL(target.href).searchParams.get('v');
      if (videoId) {
        fetchAndDisplaySummary(videoId, target);
      }
    }
  });

  function isExtensionValid() {
    return typeof chrome !== 'undefined' && chrome.runtime && !!chrome.runtime.id;
  }

  function updateSidebar(summary) {
    document.getElementById('yt-summary-content').innerHTML = `<p>${summary}</p>`;
  }
}

chrome.storage.sync.get('sidebarEnabled', function(data) {
  if (data.sidebarEnabled) {
    initializeSidebar();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'TOGGLE_SIDEBAR') {
    if (request.enabled) {
      initializeSidebar();
    } else {
      const sidebar = document.getElementById('yt-summary-sidebar');
      if (sidebar) {
        sidebar.remove();
      }
    }
  }
});
