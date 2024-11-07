<template>
  <div>
    <nav>
      <router-link to="/">Организации</router-link> |
      <router-link to="/departments">Отделы</router-link> |
      <router-link to="/positions">Должности</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>
