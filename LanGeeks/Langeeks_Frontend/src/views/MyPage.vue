<template>
  <div class="pageContainer">
    <div class="container">
      <h2>
        Welcome
        <p style="display: inline-block">{{ users.LoggedInUser.username }}!</p>
      </h2>
      <h4 class="mb-4">Current language: {{ users.LoggedInUser.languagename?.languagename }}</h4>

      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <form @submit.prevent="changeLangugage">
            <p>Change your preferred language:</p>
            <select v-model="selectedLanguageName" id="language">
              <option value="">Select a language</option>
              <option v-for="i in language.languagesAllGetList" :value="i.language_id">
                {{ i.languagename }}
              </option>
            </select>

            <button type="submit">Change</button>
          </form>
        </div>

        <div class="col-lg-6 col-md-6 col-sm-12">
          <div>
            <h2>My notifications <img src="../assets/images/bell-fill.svg" alt="" /></h2>
          </div>

          <div class="card">
            <div
              class="card-body"
              v-if="notification.notificationsByIdList.length !== 0"
              v-for="user in notification.notificationsByIdList"
              :key="user.notification_id"
            >
              <li>
                {{ user.message }}
                <div class="buttons">
                  <button class="leftButton" @click="addTheUserGroup(user)">Add</button>
                  <button class="rightButton" @click="cancelRequest(user)">Cancel</button>
                </div>
              </li>
            </div>
            <div v-else class="m-3" style="color: black; font-size: 18px">
              You don't have any notifications.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="../assets/css/myPage_css.css" scoped></style>

<script setup>
import { onMounted, ref } from 'vue'
import { uselanguagesStore } from '@/stores/LanguageStore.js'
import { useUsersStore } from '@/stores/UserStore.js'
import { useSocketStore } from '@/stores/SocketStore.js'
import router from '@/router'
import { computed } from 'vue'
import { useGroupMemberStore } from '@/stores/GroupMembersStore.js'
import { useNotificationsStore } from '@/stores/NotificationsStore.js'
import { useGroupStore } from '@/stores/GroupsStore.js'

const selectedLanguageName = ref('')

const socketLogin = useSocketStore()
const notification = useNotificationsStore()
const groupmember = useGroupMemberStore()
const socket = useSocketStore()
const group = useGroupStore()

const language = uselanguagesStore()
const users = useUsersStore()
language.getAllLanguages()

users.userLoggedInCheck()


onMounted(() => {
  socketLogin.connectSocket()
  socketLogin.userLoginToSocket(users.LoggedInUser.username)
})

const changeLangugage = () => {
  language.userChangeLanguagePut(selectedLanguageName.value)
  
}

const openUpTheSideMenus = () => {
  const sideMenus = document.getElementById('SideMenus')
  const sideMenusIcon = document.getElementById('SideMenusIcon')

  sideMenus.style.transform = 'translate(0px)'
  sideMenusIcon.style.display = 'none'
}

const closeTheSideMenus = () => {
  const sideMenus = document.getElementById('SideMenus')
  const sideMenusIcon = document.getElementById('SideMenusIcon')

  sideMenus.style.transform = 'translate(-260px)'
  sideMenusIcon.style.display = 'block'
}

onMounted(() => {
  notification.notificationsGetById()
})

const addTheUserGroup = async (user) => {
  await group.groupnameGetBygroupId(user.sent_to_group)
  await users.userGetById(user.sent_by)

  const groupname = group.onlyGroupname.find((c) => c.groupname)?.groupname

  const username = users.userGetByIdList.find((c) => c.username)?.username

  socket.acceptedRequestSend(users.LoggedInUser.username, groupname, username)

  groupmember.groupMemberPost(user.sent_by, user.sent_to_group)

  notification.notificationsDelete(user.notification_id)
}

const cancelRequest = async (user) => {

  await group.groupnameGetBygroupId(user.sent_to_group)

  await users.userGetById(user.sent_by)

  const groupname = group.onlyGroupname.find((c) => c.groupname)?.groupname

  const username = users.userGetByIdList.find((c) => c.username)?.username

  socket.deniedRequestSend(users.LoggedInUser.username, groupname, username)

  notification.notificationsDelete(user.notification_id)
}


const isCorrectGroupName = ref(false)
const inputGroupName = ref('')


const createGroup = () => {
  let chooseGroupName = document.getElementById('chooseGroupName')

  if (!(inputGroupName.value.length > 4 && inputGroupName.value.length < 20)) {
    isCorrectGroupName.value = true
    chooseGroupName.style.borderColor = 'red'
  } else {
    isCorrectGroupName.value = false
    chooseGroupName.style.borderColor = 'black'
  }

  if (isCorrectGroupName.value === false) {
    groups.createGroupPost(inputGroupName.value)
    inputGroupName.value = ''
  }
}
</script>
