import Vue from 'vue'
import Router from 'vue-router'
import Core from 'components/Core'
import Profile from 'components/Profile/index'
import EditProfile from 'components/Profile/EditProfile'
import ChangePassword from 'components/Profile/ChangePassword'
import DeleteAccount from 'components/Profile/DeleteAccount'
import Friendship from 'components/Friendship'
import BlackList from 'components/Friendship/BlackList'
import AddToBlackList from 'components/Friendship/AddToBlackList'
import FriendshipRequestsToMe from 'components/Friendship/FriendshipRequestsToMe'
import FriendshipRequestsFromMe from 'components/Friendship/FriendshipRequestsFromMe'
import CreatePartyDialog from 'components/Chat/CreatePartyDialog'
import AddUserToPartyDialog from 'components/Chat/AddUserToPartyDialog'
import DeleteUserFromPartyDialog from 'components/Chat/DeleteUserFromPartyDialog'
import DialogSettings from 'components/Chat/DialogSettings'

Vue.use(Router)

function emptyLogin(to, from, next) {
  if (to.path === "/profile/") {
    next(false);
  } else {
    next()
  }
}

export default new Router({
  routes: [{
    path: '/',
    component: Core,
    children: [{
      path: 'profile/:login',
      component: Profile,
      beforeEnter: emptyLogin,
    }, {
      path: 'editprofile',
      component: EditProfile
    }, {
      path: 'changepassword',
      component: ChangePassword
    }, {
      path: 'deleteaccount',
      component: DeleteAccount
    }, {
      path: 'friendship',
      component: Friendship
    }, {
      path: 'fr-req-to-me',
      component: FriendshipRequestsToMe
    }, {
      path: 'fr-req-from-me',
      component: FriendshipRequestsFromMe
    }, {
      path: 'blackList',
      component: BlackList
    }, {
      path: 'addToBlackList',
      component: AddToBlackList
    }, {
      path: 'createPartyDialog',
      component: CreatePartyDialog
    }, {
      path: 'addUserToPartyDialog',
      component: AddUserToPartyDialog
    }, {
      path: 'deleteUserFromPartyDialog',
      component: DeleteUserFromPartyDialog
    }, {
      path: 'dialogSettings',
      component: DialogSettings
    }]
  }]
})
