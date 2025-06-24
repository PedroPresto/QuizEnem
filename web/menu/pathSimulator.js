// This file is used to simulate different paths for testing purposes

// Function to simulate different paths
export function simulatePath(path) {
  // Save the current URL to be able to restore it
  const currentPath = window.location.pathname;
  
  // Change the URL without reloading the page
  window.history.pushState({}, '', path);
  
  // Dispatch a custom event to notify about the path change
  const event = new CustomEvent('pathChanged', { 
    detail: { 
      previousPath: currentPath,
      currentPath: path 
    } 
  });
  window.dispatchEvent(event);
  
  return () => {
    // Return a function to restore the original URL
    window.history.pushState({}, '', currentPath);
    
    // Dispatch event about the path change back
    const revertEvent = new CustomEvent('pathChanged', { 
      detail: { 
        previousPath: path,
        currentPath: currentPath 
      } 
    });
    window.dispatchEvent(revertEvent);
  };
}

// Function to get the current simulated path
export function getCurrentPath() {
  return window.location.pathname;
}

// Function to check if the current path matches a pattern
export function pathMatches(pattern) {
  const path = getCurrentPath();
  return path.includes(pattern);
}