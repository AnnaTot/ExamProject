<template>
  <div class="container col-xl-4 col-lg-5 col-md-6 col-sm-7">
    <form @submit.prevent="logInUser">
      <h1 class="mb-4 text-center">Login</h1>

      <div class="mt-4">
        <input type="text" placeholder="Username" v-model="usernameFromUser" id="username" />
      </div>

      <div class="mt-4">
        <input type="password" placeholder="Password" v-model="passwordFromUser" id="password" />
      </div>

      <div class="loginFaild mt-4" v-show="!login.isGoodLogin">
        Check your password or username and try again.
      </div>

      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<style src="../assets/css/loginPage_css.css" scoped></style>

<script setup>
import router from '@/router'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/UserStore.js'
import { useSocketStore } from '@/stores/SocketStore.js'

const usernameFromUser = ref('')
const passwordFromUser = ref('')
const login = useUsersStore()

login.isGoodLogin

const logInUser = () => {
  login.logUser(usernameFromUser.value, passwordFromUser.value)

  const username = document.getElementById('username')
  const password = document.getElementById('password')

  if (login.isGoodLogin === false) {
    username.style.borderColor = 'red'
    password.style.borderColor = 'red'
  } else if (login.isGoodLogin === true) {
    username.style.borderColor = 'black'
    password.style.borderColor = 'black'
  }
}
</script>
