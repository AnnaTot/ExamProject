<template>
  <div class="pageContainer">
    <div class="col-xl-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h3 style="display: inline-block" v-if="users.selectedUser">
            You are talking with {{ users.selectedUser?.username }}
            <img style="width: 30px" src="../assets/images/person-circle.svg" />
          </h3>
          <h3 style="display: inline-block" v-if="users.selectedGroup">
            You are in the {{ users.selectedGroup?.groupname }} chat owned by
            {{ group.adminUsername.username
            }}<img style="width: 30px; margin-left: 10px" src="../assets/images/people-fill.svg" />
          </h3>

          <select v-if="users.selectedGroup">
            <option>Group Members</option>
            <option >{{ group.adminUsername.username }}

              <div class="onlineSign" v-if="socketLogin.onlineUsers.find((c) => c === group.adminUsername.username)">
                online
              </div>
            </option>
            <option v-for="i in groupmembers.groupMemberByGroupIdList">
              {{ i.username }}

              <div class="onlineSign" v-if="socketLogin.onlineUsers.find((c) => c === i.username)">
                online
              </div>
            </option>
          </select>

          <img
            src="../assets/images/flag-fill.svg"
            v-show="!users.selectedGroup"
            class="reportIcon"
            @click="reportTheUser"
          />
        </div>

        <ul v-if="users.selectedGroup" class="card-body">
          <li v-for="message in messageFromBackend.messageGroupListByID" :key="message.groupChat">
            <p style="display: inline-block">{{ message.username }}</p><br>

            {{ message.message }}
          </li>

          <li v-for="message in messagesList">
            {{ message }}
          </li>
        </ul>

        <ul v-else class="card-body">
          <li v-for="messagePrivate in messageFromBackend.messagePrivateListByID">
            <p style="display: inline-block">{{ messagePrivate.sender_username }}</p>

            <br />
            {{ messagePrivate.message }}
          </li>

          <li v-for="message in messagesList">
            {{ message }}
          </li>
        </ul>

        <div class="card-footer">
          <input type="text" v-model="messageInputByUSer" placeholder="Aa" />
          <img src="../assets/images/ArrowHead.png" @click="sendMessage" class="sendIcon" />
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal">
      <div class="col-xl-12 col-sm-12">
        <form v-on:submit.prevent class="modal-content animate" id="formRulebreak">
          <span @click="closeModal" class="close">&times;</span>

          <h3>Report user</h3>

          <div class="text" v-show="users.selectedUser.username">
            Why do you want to report {{ users.selectedUser?.username }}? Please write it down in
            less then 255 and more then 10 letters. Please write down the reported user's name.
          </div>

          <textarea name="" id="" v-model="reportText" placeholder="Report user...."></textarea>

          <div class="mt-3">{{ reportText.length }} / 255</div>

          <span v-if="reportText.length > 255">Limite reached!</span>
          <span v-if="reportText.length < 10 && reportText.length > 7">Too short!</span>

          <button @click="sendToAdmin">send</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style src="../assets/css/messagePage_css.css" scoped></style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { io } from 'socket.io-client'
import { useRuleBreaksStore } from '@/stores/RuleBreaksStore.js'
import { useGroupMemberStore } from '@/stores/GroupMembersStore.js'
import { useSocketStore } from '@/stores/SocketStore.js'
import { useMessagesStore } from '@/stores/MessagesStore.js'
import { useUsersStore } from '@/stores/UserStore.js'
import { useGroupStore } from '@/stores/GroupsStore.js'

const socketLogin = useSocketStore()
const Breaks = useRuleBreaksStore()
const messageFromBackend = useMessagesStore()
const groupmembers = useGroupMemberStore()
const isModalOpen = ref(false)
const reportText = ref('')
const users = useUsersStore()
const socket = io('http://localhost:3000')
const group = useGroupStore()

const messagesList = ref([])
const messageInputByUSer = ref('')

onMounted(() => {
  socketLogin.connectSocket()
  socketLogin.userLoginToSocket(users.LoggedInUser.username)
})

if (users.selectedGroup?.group_id) {
  messageFromBackend.messagesGroupGetById(users.selectedGroup?.group_id)
  groupmembers.groupMembersGetByGroupId(users.selectedGroup?.group_id)
  group.groupAdminsUsername(users.selectedGroup?.groupadmin_id)
  console.log(group)
} else {
  messageFromBackend.messagesPrivateGetById(users.selectedUser?.user_id)
}

socket.emit(
  'register to the pritvateChat',
  users.LoggedInUser.username,
  users.selectedUser?.username,
)

socket.emit('register to the groupChat', users.selectedGroup?.group_id, users.LoggedInUser.username)

const sendMessage = () => {
  const message = messageInputByUSer.value

  if (users.selectedUser?.username) {
    if (message !== '') {
      socket.emit('send message to the privateChat', message)

      messageFromBackend.messagesPrivatePost(users.selectedUser?.user_id, message)

      messageInputByUSer.value = ''
    }
  }

  if (users.selectedGroup?.groupname) {
    if (message !== '') {
      socket.emit('send message to the group', message)

      messageFromBackend.messagesGroupPost(users.selectedGroup?.group_id, message)

      messageInputByUSer.value = ''
    }
  }
}

socket.on('private message send', (message, LoggedInUserUsername) => {
  const uzenet = `${LoggedInUserUsername} \n  ${message} \n `
  messagesList.value.push(uzenet)
})

socket.on('group message send', (message, LoggedInUsername) => {
  const uzenet = `${LoggedInUsername} \n  ${message} \n `
  messagesList.value.push(uzenet)
})

const reportTheUser = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const sendToAdmin = () => {
  if (reportText.value.length > 255) {
    reportText.value = reportText.value.substring(0, 255)
  } else if (reportText.value.length <= 255 && reportText.value.length >= 10) {
    Breaks.ruleBreaksPost(reportText.value)
    reportText.value = ''
  }
}
</script>
