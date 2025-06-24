<template>
  <header id="header">
    <nav>
      <RouterLink v-show="!log.isLoggedIn" to="/"
        ><img src="./assets/images/applogo.png" alt="" />
        <p class="appLogoText">LanGeeks</p></RouterLink
      >

      <div class="SideMenusIcon" @click="showMenu()">&#9776;</div>
      <div id="nav-links">
        <ul>
          <div class="SideMenusIcon" @click="hideMenu()">&times;</div>

          <li><RouterLink v-show="!log.isLoggedIn" to="/"></RouterLink></li>
          <li class="registerPage">
            <RouterLink v-show="!log.isLoggedIn" to="/registerPage">Register</RouterLink>
          </li>
          <li class="loginPage">
            <RouterLink v-show="!log.isLoggedIn" to="/loginPage">Login</RouterLink>
          </li>
          <li class="loginPage" v-show="log.isLoggedIn" @click="logout"><a>Logout</a></li>
          <li><RouterLink v-show="log.isLoggedIn" to="/searchPage">Search</RouterLink></li>
          <li><RouterLink v-show="log.isLoggedIn" to="/searchGroupsPage">Groups</RouterLink></li>

          <li><RouterLink v-show="log.isLoggedIn" to="/myPage">My Page</RouterLink></li>
          <li><RouterLink v-show="log.isLoggedIn" to="/myGroup">My groups</RouterLink></li>
        </ul>
      </div>
    </nav>

    <RouterView />
  </header>
</template>

<style src="./assets/css/app_css.css" scoped></style>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import router from '@/router'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useUsersStore } from '@/stores/UserStore.js'
import { useSocketStore } from './stores/SocketStore.js'
import { useNotificationsStore } from './stores/NotificationsStore.js'
import { useMessagesStore } from '@/stores/MessagesStore.js'
import { useGroupStore } from '@/stores/GroupsStore.js'

const groups = useGroupStore()
const socket = useSocketStore()
const log = useUsersStore()
const notification = useNotificationsStore()
const messageFromBackend = useMessagesStore()

const logout = () => {
  groups.groupsUserJoinedList = []
  groups.groupsByAdminList = []
  messageFromBackend.messageGroupListByID = []
  messageFromBackend.messagePrivateListByID = []
  socket.offlineUsers(log.LoggedInUser.username)
  notification.notificationsByIdList = []
  log.isLoggedIn = false
  log.logoutUser()
  router.push('/')
}

const showMenu = () => {
  const sidePanel = document.getElementById('nav-links')

  sidePanel.style.right = '0'
}

const hideMenu = () => {
  const sidePanel = document.getElementById('nav-links')

  sidePanel.style.right = '-200px'
}

onMounted(() => {
  socket.connectSocket()
  socket.userLoginToSocket(log.LoggedInUser.username)
})
</script>
