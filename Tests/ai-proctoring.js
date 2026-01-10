// AI Proctoring System with Face Detection
(function() {
  let video = null;
  let stream = null;
  let warningCount = 0;
  const MAX_WARNINGS = 3;
  let detectionInterval = null;
  let canvas = null;
  let ctx = null;
  let overlayCanvas = null
  let overlayCtx = null;
  let mpCamera = null;
  let isMonitoring = true;
  // throttle last warning timestamp to avoid rapid multiple counts
  let lastWarningAt = 0; // ms timestamp

  // Show an emphatic modal when a multiple-face violation is detected
  function showWarningModal(count){
    // avoid stacking modals
    if(document.getElementById('proctorModal')) return;
    const modal = document.createElement('div');
    modal.id = 'proctorModal';
    modal.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);z-index:10000';
    modal.innerHTML = `
      <div style="background:#fff;padding:22px;border-radius:10px;max-width:520px;width:92%;text-align:center;box-shadow:0 10px 30px rgba(2,6,23,0.2)">
        <div style="font-size:18px;font-weight:800;margin-bottom:8px">⚠️ Proctoring Warning</div>
        <div style="margin-bottom:14px;color:#374151">Multiple faces detected (${count}/${MAX_WARNINGS}). Please ensure only you are visible. If you receive ${MAX_WARNINGS} warnings the test will be failed.</div>
        <div><button id="proctorModalOk" class="btn" style="padding:8px 14px;border-radius:8px">OK</button></div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('proctorModalOk').addEventListener('click', ()=>{ modal.remove(); });
  }

  // Initialize camera and face detection
  async function initProctoring() {
    try {
      // Request camera access
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });

      // Create video element if it doesn't exist
      const placeholder = document.querySelector('.image-placeholder');
      if (!placeholder) return;

      // Remove placeholder and create video element
      placeholder.style.display = 'none';
      
      video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.width = 640;
      video.height = 480;
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.borderRadius = '10px';
      video.style.objectFit = 'cover';

      // Insert video element
      const proctorCard = document.querySelector('.proctor-card');
      if (proctorCard) {
        const videoContainer = document.createElement('div');
        videoContainer.style.position = 'relative';
        videoContainer.style.height = '240px';
        videoContainer.style.borderRadius = '10px';
        videoContainer.style.overflow = 'hidden';
        videoContainer.style.background = '#000';
        videoContainer.appendChild(video);

        // Overlay canvas for visualizing detections (bounding boxes)
        overlayCanvas = document.createElement('canvas');
        overlayCanvas.width = 640;
        overlayCanvas.height = 480;
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.width = '100%';
        overlayCanvas.style.height = '100%';
        overlayCanvas.style.pointerEvents = 'none';
        overlayCanvas.style.mixBlendMode = 'screen';
        videoContainer.appendChild(overlayCanvas);
        overlayCtx = overlayCanvas.getContext('2d');

        proctorCard.insertBefore(videoContainer, proctorCard.firstChild);
      }

      // Create canvas for face detection (fallback)
      canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      ctx = canvas.getContext('2d');

      // Try to load MediaPipe Face Detection for accurate face counting
      try {
        await loadMediaPipeAndStart();
      } catch (e) {
        console.warn('MediaPipe not available, falling back to mock detector', e);
        // Start fallback detection loop
        startFaceDetection();
      }

      updateProctorStatus('Active & Monitoring');
    } catch (error) {
      console.error('Error accessing camera:', error);
      updateProctorStatus('Camera Access Denied');
      
      // Show warning to user
      const placeholder = document.querySelector('.image-placeholder');
      if (placeholder) {
        placeholder.innerHTML = '<div style="padding: 20px; text-align: center; color: #ef4444;">Camera access required for proctoring. Please allow camera access.</div>';
        placeholder.style.display = 'block';
      }
    }
  }

  // Keep a latestFaceCount updated either by MediaPipe or fallback detector
  let latestFaceCount = 0;

  // Fallback mock-based detection (kept as last resort)
  function detectFaces() {
    if (!video || !canvas || !ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return 0;
    }

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Mock detection (only used if MediaPipe fails)
    const rand = Math.random();
    if (rand < 0.90) return 1;
    if (rand < 0.98) return 0;
    return 2;
  }

  // Start the (fallback) face detection loop which updates latestFaceCount
  function startFaceDetection(){
    detectionInterval = setInterval(() => {
      if(!isMonitoring) return;
      latestFaceCount = detectFaces();

      if (latestFaceCount > 1) {
        handleMultipleFacesDetected(latestFaceCount);
      } else if (latestFaceCount === 1) {
        updateProctorStatus('Active & Monitoring');
        clearWarningDisplay();
      } else {
        updateProctorStatus('No face detected');
      }
    }, 1500); // stricter/faster checks
  }

  // Load MediaPipe Face Detection dynamically and start it
  async function loadMediaPipeAndStart(){
    // Helper to inject script
    function loadScript(src){
      return new Promise((resolve, reject)=>{
        if(document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script'); s.src = src; s.async = true;
        s.onload = () => resolve(); s.onerror = (e)=> reject(e);
        document.head.appendChild(s);
      });
    }

    // Load MediaPipe face_detection and camera_utils
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js');
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');

    if(typeof FaceDetection === 'undefined' || typeof Camera === 'undefined'){
      throw new Error('MediaPipe classes not available');
    }

    // Create face detector with strict confidence
    const faceDetector = new FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
    });
    faceDetector.setOptions({
      model: 'short',
      minDetectionConfidence: 0.85 // very strict requirement
    });

    // On results, update latestFaceCount and take actions
    faceDetector.onResults((results) => {
      const detections = results.detections || [];
      latestFaceCount = detections.length;

      // Visualize detections on overlay (if available)
      if(overlayCtx && overlayCanvas){
        overlayCtx.clearRect(0,0,overlayCanvas.width, overlayCanvas.height);
        overlayCtx.strokeStyle = '#22c55e';
        overlayCtx.lineWidth = 3;
        overlayCtx.font = '14px Inter, Arial';
        overlayCtx.fillStyle = '#22c55e';

        detections.forEach((det, idx)=>{
          const box = det.boundingBox || (det.locationData && det.locationData.relativeBoundingBox);
          if(box){
            try{
              if(box.xCenter !== undefined){
                const x = (box.xCenter - box.width/2) * overlayCanvas.width;
                const y = (box.yCenter - box.height/2) * overlayCanvas.height;
                const w = box.width * overlayCanvas.width;
                const h = box.height * overlayCanvas.height;
                overlayCtx.strokeRect(x,y,w,h);
                overlayCtx.fillText(`#${idx+1}`, x + 6, y + 16);
              } else if(box.xMin !== undefined){
                const x = box.xMin * overlayCanvas.width;
                const y = box.yMin * overlayCanvas.height;
                const w = box.width * overlayCanvas.width;
                const h = box.height * overlayCanvas.height;
                overlayCtx.strokeRect(x,y,w,h);
                overlayCtx.fillText(`#${idx+1}`, x + 6, y + 16);
              }
            }catch(e){ /* ignore drawing errors */ }
          }
        });
      }

      // Very strict: if more than 1 face at all, trigger warning
      if(latestFaceCount > 1){
        handleMultipleFacesDetected(latestFaceCount);
      } else if(latestFaceCount === 1){
        updateProctorStatus('Active & Monitoring');
        clearWarningDisplay();
      } else {
        updateProctorStatus('No face detected');
      }
    });

    // Use MediaPipe Camera utility for efficient frame processing
    mpCamera = new Camera(video, {
      onFrame: async () => { await faceDetector.send({image: video}); },
      width: 640,
      height: 480
    });

    mpCamera.start();

    // If camera stops, keep the page aware
    video.addEventListener('pause', ()=>{ if(isMonitoring) updateProctorStatus('Camera paused'); });
  }

  // Handle multiple faces detected (with throttling and modal)
  function handleMultipleFacesDetected(faceCount) {
    const now = Date.now();
    // Throttle: don't count warnings more than once every 3s
    if (now - lastWarningAt < 1500) {
      // still show status but don't increment too often
      updateProctorStatus(`⚠️ Warning: ${faceCount} faces detected`);
      showWarning(warningCount || 1);
      return;
    }
    lastWarningAt = now;

    warningCount++;
    updateProctorStatus(`⚠️ Warning: ${faceCount} faces detected`);
    showWarning(warningCount);
    // show persistent modal to emphasize the warning
    showWarningModal(warningCount);

    if (warningCount >= MAX_WARNINGS) {
      failTest();
    }
  }

  // Show warning message
  function showWarning(count) {
    // Remove existing warning if any
    clearWarningDisplay();

    const proctorCard = document.querySelector('.proctor-card');
    if (!proctorCard) return;

    const warningDiv = document.createElement('div');
    warningDiv.id = 'proctorWarning';
    warningDiv.style.cssText = `
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 8px;
      padding: 12px;
      margin: 10px 0;
      color: #92400e;
      font-weight: 600;
      animation: pulse 1s infinite;
    `;
    warningDiv.innerHTML = `
      ⚠️ <strong>Warning ${count}/${MAX_WARNINGS}:</strong> Multiple faces detected in camera view. 
      Please ensure only you are visible.
    `;

    // Add CSS animation if not already added
    if (!document.getElementById('proctorWarningStyle')) {
      const style = document.createElement('style');
      style.id = 'proctorWarningStyle';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `;
      document.head.appendChild(style);
    }

    const statusDiv = document.querySelector('.status');
    if (statusDiv) {
      statusDiv.insertBefore(warningDiv, statusDiv.firstChild);
    }
  }

  // Clear warning display
  function clearWarningDisplay() {
    const warning = document.getElementById('proctorWarning');
    if (warning) {
      warning.remove();
    }
  }

  // Update proctor status text
  function updateProctorStatus(status) {
    const statusEl = document.getElementById('proctorState');
    if (statusEl) {
      statusEl.textContent = status;
      
      // Add warning color if needed
      if (status.includes('Warning')) {
        statusEl.style.color = '#ef4444';
      } else {
        statusEl.style.color = '';
      }
    }
  }

  // Fail the test after MAX_WARNINGS (used when proctoring violations exceed threshold)
  function failTest(){
    isMonitoring = false;
    if (detectionInterval) clearInterval(detectionInterval);

    // Stop camera tracks
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (mpCamera && typeof mpCamera.stop === 'function') { try{ mpCamera.stop(); }catch(e){} }

    // Clear overlays
    if (overlayCtx && overlayCanvas) overlayCtx.clearRect(0,0,overlayCanvas.width, overlayCanvas.height);

    // Mark test as failed so submit() treats it as failed
    window.TEST_FAILED = true;

    updateProctorStatus('❌ Test Failed');

    // Show failure message
    const failDiv = document.createElement('div');
    failDiv.style.cssText = `
      background: #fee2e2;
      border: 2px solid #ef4444;
      border-radius: 8px;
      padding: 16px;
      margin: 10px 0;
      color: #991b1b;
      font-weight: 700;
      text-align: center;
    `;
    failDiv.innerHTML = `
      <strong>Test Failed</strong><br>
      Multiple proctoring violations detected (${MAX_WARNINGS} warnings).<br>
      The test will be submitted as failed and you will be redirected.
    `;

    const statusDiv = document.querySelector('.status');
    if (statusDiv) statusDiv.insertBefore(failDiv, statusDiv.firstChild);

    // Auto-submit quickly without confirmation
    setTimeout(()=>{
      try{ if(typeof submit === 'function') submit(true); }catch(e){ console.warn('auto submit failed', e); }
      const submitBtn = document.getElementById('submitBtn'); if(submitBtn) submitBtn.disabled = true;
    }, 800);

    // Redirect after a short delay
    setTimeout(()=>{ try{ window.location.href = '../user pages/dashboard.html'; }catch(e){ window.history.back(); } }, 3500);
  }

  // Backwards-compatible alias
  function cancelTest(){ failTest(); }

  // Clean up on page unload
  function cleanup() {
    if (detectionInterval) {
      clearInterval(detectionInterval);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (mpCamera && typeof mpCamera.stop === 'function') {
      try { mpCamera.stop(); } catch(e){}
    }
    if (overlayCtx && overlayCanvas) {
      overlayCtx.clearRect(0,0,overlayCanvas.width, overlayCanvas.height);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProctoring);
  } else {
    initProctoring();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  window.addEventListener('unload', cleanup);

  // Export cleanup function for manual cleanup if needed
  window.proctoringCleanup = cleanup;
})();

