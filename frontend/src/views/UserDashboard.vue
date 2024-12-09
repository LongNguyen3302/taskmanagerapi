<template>
  <div>
    <h1>User Dashboard</h1>
    <nav>
      <ul>
        <li>
          <router-link to="/user-dashboard/manage-tasks">Manage Tasks</router-link>
        </li>
        <li>
          <router-link to="/user-dashboard/manage-projects">Manage Projects</router-link>
        </li>

      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'UserDashboard',
  // Logic của component nếu cần
}
</script>


<style scoped>
nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  margin: 5px 0;
}

nav a {
  text-decoration: none;
  color: #007bff;
}

nav a:hover {
  text-decoration: underline;
}
</style>