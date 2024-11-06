<template>
  <div>
    <!-- Навигация сверху -->
    <nav>
      <router-link to="/" exact>Организации</router-link> |
      <router-link to="/departments">Отделы</router-link> |
      <router-link to="/positions">Должности</router-link>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
};
</script>

<style scoped>
nav {
  margin-bottom: 20px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #007bff;
}

nav a.router-link-exact-active {
  font-weight: bold;
  color: #0056b3;
}
</style>