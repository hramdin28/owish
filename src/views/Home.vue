<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <WishList/>
  </div>
</template>

<script>
// @ is an alias to /src
import WishList from "@/components/WishList.vue";

export default {
  name: "home",
  components: {
    WishList
  }
};
</script>
