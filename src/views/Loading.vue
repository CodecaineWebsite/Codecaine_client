<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <div class="spinner"></div>
      <p class="loading-text">Loading...</p>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'CodeCaineLoading' })
</script>

<style>

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(23, 23, 23, 0.8); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}


.loading-content {
  text-align: center;
}

.spinner {
  width: 64px;
  height: 64px;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px; 
}


.loading-text {
  color: #ffffff;
  font-size: 1.25rem; 
  font-weight: bold;
  margin: 0;
}


@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
