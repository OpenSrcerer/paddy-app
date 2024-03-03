<template>
  <q-page class="row items-center justify-evenly">
    <div id="container">
      <h3>Welcome!</h3>

      <div>
        <q-btn to="login">Login</q-btn>
        <q-btn to="signup">Sign Up</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
