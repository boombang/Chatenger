import Vue from 'vue'
import Router from 'vue-router'
import Main from 'components/Main'
import Profile from 'components/Profile'
import EditProfile from 'components/EditProfile'
import ChangePassword from 'components/ChangePassword'
import DeleteAccount from 'components/DeleteAccount'
import Friends from 'components/Friends'
import BlackList from 'components/BlackList'
import AddToBlackList from 'components/AddToBlackList'
import FriendshipRequestsToMe from 'components/FriendshipRequestsToMe'
import FriendshipRequestsFromMe from 'components/FriendshipRequestsFromMe'
import CreatePartyDialog from 'components/CreatePartyDialog'
import AddUserToPartyDialog from 'components/AddUserToPartyDialog'
import DeleteUserFromPartyDialog from 'components/DeleteUserFromPartyDialog'
import DialogSettings from 'components/DialogSettings'

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
    component: Main,
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
      path: 'friends',
      component: Friends
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
