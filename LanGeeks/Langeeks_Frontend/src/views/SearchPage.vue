<template>
  <div class="pageContainer">
    <div class="container">
      <h1>Who do you want to talk with?</h1>

      <div class="searchContainer">
        <input v-model="inputByUser" type="text" id="language" placeholder="Search by username" />

        <img
          src="../assets/images/User_Language_switch_2.png"
          class="Switch_user_language"
          @click="changeTheSearch"
          alt="Switch Language"
        />
      </div>

      <div class="container">
        <div class="cardContainer">
          <div v-show="users.LoggedInUser.username !== user.username" v-for="user in searchForUser">
            <div class="card" @click="writeToUser(user)">
              <div class="card-body">
                <img src="../assets/images/person-circle.svg" />

                {{ user.username }} - {{ user.languagename }}
                <div class="logedinSign"
                  v-if="socketLogin.onlineUsers.find((c) => c === user.username)"
                ></div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="../assets/css/searchPage_css.css" scoped></style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import router from '@/router'
import { useUsersStore } from '@/stores/UserStore.js'
import { io } from 'socket.io-client'
import { useSocketStore } from '@/stores/SocketStore.js'

const inputByUser = ref('')
const isSEarcedhByLanguage = ref(true)
const users = useUsersStore()
users.usersAllGet()

const socketLogin = useSocketStore()

socketLogin.socket

onMounted(() => {
  socketLogin.connectSocket()
  socketLogin.userLoginToSocket(users.LoggedInUser.username)
})

const writeToUser = (user) => {
  users.chosenUser(user)
}

const searchForUser = computed(() => {
  const inputByUserLowerletter = inputByUser.value.toLowerCase()

  if (inputByUser.value === '') {
    return users.usersAllGetList
  }

  if (isSEarcedhByLanguage.value) {
    return users.usersAllGetList.filter((user) =>
      user.username.toLowerCase().includes(inputByUserLowerletter),
    )
  } else {
    return users.usersAllGetList.filter((user) =>
      user.languagename.toLowerCase().includes(inputByUserLowerletter),
    )
  }
})

const changeTheSearch = () => {

  isSEarcedhByLanguage.value = !isSEarcedhByLanguage.value

  const gotElement = document.getElementById('language')

  if (isSEarcedhByLanguage.value === false) {
    gotElement.placeholder = 'Search by language'
  } else {
    gotElement.placeholder = 'Search by username'
  }
}
</script>
