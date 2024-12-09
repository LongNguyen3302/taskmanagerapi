<template>
  <div id="app">
    <h1>Task Managerapi</h1>
    <router-link to="/">Home</router-link> |


    <!-- Đây là nơi các component của từng route sẽ được hiển thị -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  text-align: center;
}
</style>
