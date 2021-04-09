<template>
  <nav>
    <div class="nav-wrapper">
      <router-link to="/" class="brand-logo">Report App</router-link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><router-link to="/report?create">Create Report</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped lang="scss">
nav {
  padding: 0 30px;
  .router-link-exact-active {
    &.brand-logo {
      background: transparent;
    }
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
