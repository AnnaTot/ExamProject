<template>
  <div class="pageContainer">
    <div class="container">
      <div class="row">
        <h2>Group management:</h2>

        <form @submit.prevent>
          <span v-if="groups.groupsByAdminList.length !== 0"><h4>Your groups:</h4></span>
          <span v-else><h4>You don't have any groups.</h4> </span>

          <div class="card col-12" v-for="group in groups.groupsByAdminList" :key="group.group_id">
            <div class="card-body">
              <div class="card-title">
                <h4>{{ group.groupname }}</h4>
              </div>

              <button @click="deleteTheGroup(group)">Delete</button>

              <button @click="SendToTheGroupChat(group)">Write</button>

              <button @click="chooseGroupMember(group)">Members</button>
            </div>
          </div>
        </form>
      </div>

      <h2>Create your own group:</h2>

      <div class="col-md-6 col-lg-4">
        <form @submit.prevent="createGroup" class="createGroupForm">
          <div>
            <p>Enter the group name:</p>
            <input type="text" v-model="inputGroupName" id="chooseGroupName" />
          </div>
          <span v-show="isCorrectGroupName">
            <p style="text-align: justify" class="mt-3">
              The group's name can't be longer then 20 or less then 4 letters!
            </p></span
          >

          <div>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div v-if="isModalOpen" class="modal">
    <form v-on:submit.prevent class="modal-content animate" id="formGroupMembers">
      <div class="imgcontainer">
        <span @click="closeModal" class="close">&times;</span>
      </div>

      <div class="container" v-if="groupmember.groupMemberByGroupIdList.length !== 0">
        <div v-for="user in groupmember.groupMemberByGroupIdList">
          <div class="card">
            <div class="card-body">
              {{ user.username }} <button @click="banUser(user)" type="submit">ban</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else>This group does not have any groupmembers</div>
    </form>
  </div>
</template>
<style src="../assets/css/myGroup_css.css" scoped></style>

<script setup>
import { onMounted, ref } from 'vue'
import { useUsersStore } from '@/stores/UserStore.js'
import { useGroupStore } from '@/stores/GroupsStore.js'
import { Socket } from 'socket.io-client'
import { useSocketStore } from '@/stores/SocketStore.js'
import { useGroupMemberStore } from '@/stores/GroupMembersStore.js'

const users = useUsersStore()
const groups = useGroupStore()
const socket = useSocketStore()
const groupmember = useGroupMemberStore()
const group = useGroupStore()
const isModalOpen = ref(false)

const isCorrectGroupName = ref(false)
const inputGroupName = ref('')

group.getGroupsByAdmin()

onMounted(() => {
  groups.groupsUserJoined()
})

const deleteTheGroup = (group) => {
  groups.deleteCreatedGroups(group.group_id)
  groups.groupsByAdminList = groups.groupsByAdminList.filter(
    (groupByAdmin) => groupByAdmin.group_id !== group.group_id,
  )
}

const SendToTheGroupChat = (group) => {
  users.chosenGroup(group)
}

const WriteTotheGroup = (group) => {
  users.chosenGroup(group)
}

const banUser = async (user) => {
  await groups.groupsUserJoined(user.user_id)

  const groupname = groups.groupsUserJoinedList.find(
    (groups) => groups.group_id === user.group_id,
  )?.groupname

  groupmember.groupMemberBanByid(user.user_id)
  socket.userBannedByAdmin(user.username, groupname, users.LoggedInUser.username, user.group_id)
}

const leaveTheGroup = (group) => {
  groupmember.groupMemberLeaveGroupById(group.group_id)
}

const chooseGroupMember = (group) => {
  isModalOpen.value = true

  groupmember.groupMembersGetByGroupId(group.group_id)
}

const closeModal = () => {
  isModalOpen.value = false
}


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
     groups.groupsByAdminList = groups.groupsByAdminList.filter(
    (groupByAdmin) => groupByAdmin.group_id !== group.group_id,
  )
  }
}
</script>
