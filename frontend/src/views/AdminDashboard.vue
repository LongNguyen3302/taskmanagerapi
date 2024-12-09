<template>
  <div>
    <h1>Admin Dashboard</h1>
    <nav>
      <ul>
        <li>
          <router-link to="/admin-dashboard/manage-projects">Manage Projects</router-link>
        </li>
        <li>
          <router-link to="/admin-dashboard/manage-users">Manage Users</router-link>
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>


<script>
export default {
  name: 'AdminDashboard',
};
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
