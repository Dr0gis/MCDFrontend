/*function getStatisticsRequest() {
    var url = serverUrl + 'Statistics';
    var request = $.ajax({
        type: 'GET',
        data: {
            param1: "param1",
            param2: 2
        },
        url: url,
        success: function(result) {
            console.log('Statistics done');
            console.log(result);
        },
        error: function() {
            console.log('Statistics error');
        }
    });
}*/

var serverUrl = 'http://localhost:9000/';
var googleMapsApiKey = 'AIzaSyAfdWr8eiluFFBNtPGeMcv3CnLAOk76Wgs';

function registrationRequest(email, login, password) {
    showProgress()
    var url = serverUrl + 'RegistrationAdmin';
    var request = $.ajax({
        type: 'POST',
        data: JSON.stringify({email: email, login: login, password: password}),
        url: url,
        contentType: 'application/json',
        success: function(result) {
            console.log('Registration done');
            console.log(result);
            hideProgress()
        },
        error: function() {
            console.log('Registration error');
            hideProgress()
        }
    });
}

function authorizationRequest(emailOrLogin, password) {
    showProgress()
    var url = serverUrl + 'AuthorizationAdmin';
    var request = $.ajax({
        type: 'POST',
        data: JSON.stringify({emailOrLogin: emailOrLogin, password: password}),
        url: url,
        contentType: 'application/json',
        success: function(result) {
            console.log('Authorization done');
            console.log(result);
            saveToken(result);
            showMainContent();
            hideProgress()
        },
        error: function() {
            console.log('Authorization error');
            hideProgress()
        }
    });
}

function getStatisticsRequest(token) {
    showProgress()
    var url = serverUrl + 'Statistics';
    var request = $.ajax({
        type: 'GET',
        data: {
            token: token
        },
        url: url,
        success: function(result) {
            console.log('Statistics done');
            console.log(result);
            formUserList(result);
            hideProgress()
        },
        error: function() {
            console.log('Statistics error');
            hideProgress()
        }
    });
}

function showProgress() {
    progress.isShow = true;
}

function hideProgress() {
    setTimeout('progress.isShow = false', 500);
}

function saveToken(token) {
    sessionStorage.setItem('token', token);
}

function getToken() {
    return sessionStorage.getItem('token');
}

function removeToken() {
    return sessionStorage.removeItem('token');
}

var progress = new Vue({
    el: '#progress',
    data: {
        isShow: false,
    }
});

Vue.component('authorization', {
    template: 
        '<div class="content" id="authorization">' +
            '<form @submit.prevent="authorization">' +
                '<span>Email or Login</span>' +
                '<input v-model="emailOrLogin" type="text" placeholder="Email or Login" required>' +
                '<span>Password</span>' +
                '<input v-model="password" type="password" placeholder="Password" required>' +
                '<button type="submit">Authorization</button>' +
            '</form>' +
        '</div>',
    data: function () {
        return {
            emailOrLogin: '',
            password: ''
        };
    },
    methods: {
        authorization: function () {
            authorizationRequest(this.emailOrLogin, this.password);
        }
    }
});

Vue.component('registration', {
    template: 
        '<div class="content" id="registration">' +
            '<form @submit.prevent="registration">' +
                '<span>Email</span>' +
                '<input v-model="email" type="email" placeholder="Email" required>' +
                '<span>Login</span>' +
                '<input v-model="login" type="text" placeholder="Login" required>' +
                '<span>Password</span>' +
                '<input v-model="password" type="password" placeholder="Password" required>' +
                '<button type="submit">Registration</button>' +
            '</form>' +
        '</div>',
    data: function () {
        return {
            email: '',
            login: '',
            password: ''
        };
    },
    methods: {
        registration: function (event) {
            registrationRequest(this.email, this.login, this.password);
        }
    }
});

var boxRegAuth = new Vue({
    el: '#box-reg-auth',
    data: {
        activeClass: [ 
            { title: true, active: true }, 
            { title: true, active: false }
        ],
        isShow: false
    },
    methods: {
        setActive: function (event) {
            var index = $(event.target).attr('index');

            if (this.activeClass[index].active) {
                return;
            }

            for (var i = 0; i < this.activeClass.length; i++) {
                if (i == index) {
                    this.activeClass[i].active = true;
                    continue;
                }
                this.activeClass[i].active = false;
            }
        },
    }
});

function formUserList(statistics) {
    listUsers.items.splice(0,  listUsers.items.length)
    for (var i = 0; i < statistics.length; i++) {
        listUsers.items.push(statistics[i].email);
    }
}

var listUsers = {
    items: [],
    active: -1,
};
Vue.component('list', {
    template: 
        '<div class="list">' +
            '<div v-for="(item, index) in items">' +
                '<div :class="{item: true, active: index == active}" :index="index" @click="setActive(index)">{{item}}</div>' +
            '</div>' +
        '</div>',
    data: function () {
        return listUsers;
    },
    methods: {
        setActive: function (index) {
            if (this.active == index) {
                this.active = -1;
                hideUserData();
                return;
            }
            this.active = index;
            showUserData();
        }
    }
});

var mainContent = new Vue({
    el: '#main-content',
    data: {
        isShow: false,
        isContentShow: true,
        isProfileShow: false,
        indexActiveTitle: 1,
        isUserDataShow: false,
        isZoneDataShow: true,
        isEventListShow: true
    },
    methods: {
        logOut: function () {
            removeToken();
            showBoxRegAuth();
        },
        showContent: function () {
            showContent();
        },
        showProfile: function () {
            showProfile();
        },
    }
});

function showMainContent() {
    boxRegAuth.isShow = false;
    mainContent.isShow = true;
    getStatisticsRequest(getToken());
}

function showBoxRegAuth() {
    boxRegAuth.isShow = true;
    mainContent.isShow = false;
}

function showContent() {
    mainContent.isContentShow = true;
    mainContent.isProfileShow = false;
    mainContent.indexActiveTitle = 1;
    getStatisticsRequest(getToken());
}

function showProfile() {
    mainContent.isContentShow = false;
    mainContent.isProfileShow = true;
    mainContent.indexActiveTitle = 2;
}

function showUserData() {
    mainContent.isUserDataShow = true;
    mainContent.isZoneDataShow = false;
    mainContent.isEventListShow = false;
}

function hideUserData() {
    mainContent.isUserDataShow = false;
    mainContent.isZoneDataShow = true;
    mainContent.isEventListShow = true;
}

function startApp() {
    token = getToken();
    if (token) {
        showMainContent();
    }
    else {
        showBoxRegAuth();
    }
}
$(document).ready(startApp);