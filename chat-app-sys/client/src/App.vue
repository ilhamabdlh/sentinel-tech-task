<template>
  <div id="app">
    <ChatApp />
  </div>
</template>

<script>
import ChatApp from './components/ChatApp.vue';

export default {
  name: 'App',
  components: {
    ChatApp
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
}

#app {
  height: 100vh;
  overflow: hidden;
}
</style>
