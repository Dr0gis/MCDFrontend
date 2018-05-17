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
            hideProgress();
            getAdminInfo(result);
        },
        error: function() {
            console.log('Authorization error');
            hideProgress()
        }
    });
}

function getAdminInfo(token) {
    showProgress();
    var url = serverUrl + 'AdminInfo';
    var request = $.ajax({
        type: 'GET',
        data: {
            token: token
        },
        url: url,
        success: function(result) {
            console.log('AdminInfo done');
            console.log(result);
            saveAdminInfo(result.email, result.login);
            hideProgress();
        },
        error: function() {
            console.log('AdminInfo error');
            hideProgress();
        }
    });
}

function getStatisticsRequest(token) {
    showProgress();
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
            hideProgress();
        },
        error: function() {
            console.log('Statistics error');
            hideProgress();
        }
    });
}

function getDronesRequest(token) {
    showProgress();
    var url = serverUrl + 'Drones';
    var request = $.ajax({
        type: 'GET',
        data: {
            token: token
        },
        url: url,
        success: function(result) {
            console.log('Drones done');
            console.log(result);
            formDronesList(result);
            hideProgress();
        },
        error: function() {
            console.log('Drones error');
            hideProgress();
        }
    });
}

function addNewDroneRequest(token, name) {
    showProgress();
    var url = serverUrl + 'AddDrone';
    var request = $.ajax({
        type: 'POST',
        data: JSON.stringify({token: token, name: name}),
        url: url,
        contentType: 'application/json',
        success: function(result) {
            console.log('AddDrone done');
            console.log(result);
            getDronesRequest(getToken());
            hideProgress();
        },
        error: function() {
            console.log('AddDrone error');
            hideProgress();
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
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('login');
}

function saveAdminInfo(email, login) {
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('login', login);
}

function getAdminEmail() {
    return sessionStorage.getItem('email');
}

function getAdminLogin() {
    return sessionStorage.getItem('login');
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

var fullListDrones = [];
function formDronesList(drones) {
    fullListDrones = drones;
    listDrones.items.splice(0,  listDrones.items.length);
    for (var i = 0; i < drones.length; i++) {
        listDrones.items.push(drones[i].name);
    }
}

var qrcode; 
var listDrones = {
    items: [],
    isShowQrCode: false
};
Vue.component('list-drones', {
    template:
        '<div class="list">' +
            '<div v-for="(item, index) in items">' +
                '<div class="item" @click="createQrCode(index)" index="index">{{item}}</div>' +
            '</div>' +
            '<div class="qrcode-window" @click="hideQrCode" v-if="isShowQrCode">' +
                '<div id="qrcode"></div>' +
            '</div>' +
        '</div>',
    data: function () {
        return listDrones;
    },
    methods: {
        createQrCode: function (index) {
            this.showQrCode();

            function create(index) {
                qrcode = new QRCode(document.getElementById("qrcode"));
                qrcode.makeCode(fullListDrones[index].qrcode);
            }

            setTimeout(create, 50, index);
        },
        showQrCode: function() {
            this.isShowQrCode = true;
        },
        hideQrCode: function() {
            this.isShowQrCode = false;
        }
    }
});

function formUserList(statistics) {
    listUsers.items.splice(0,  listUsers.items.length);
    for (var i = 0; i < statistics.length; i++) {
        listUsers.items.push(statistics[i].email);
    }
}

var listUsers = {
    items: [],
    active: -1,
};
Vue.component('list-users', {
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
        isEventListShow: true,
        isShowNewDroneModal: false,
        nameForCreateDrone: '',
        isZoneForbidden: false,
        heightZoneValue: {
            min: '',
            max: ''
        },
        onZoneZoom: false,
        tempZoom: false
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
        showNewDroneModal: function () {
            this.isShowNewDroneModal = true;
        },
        hideNewDroneModal: function () {
            this.isShowNewDroneModal = false;
        },
        addNewDron: function () {
            addNewDroneRequest(getToken(), this.nameForCreateDrone);
            this.nameForCreateDrone = '';
        },
        checkBoxZoneFordibben: function () {
            this.isZoneForbidden = !this.isZoneForbidden;
        },
        zoomMapsAndPoint: function () {
            this.onZoneZoom = true;
            this.tempZoom = true;
            setTimeout('mainContent.tempZoom = false', 50);
        },
        unzoomMapsAndPoint: function () {
            if (!this.tempZoom) {
                this.onZoneZoom = false;
            }
        }
    },
    computed: {
        adminEmail: function () {
            return getAdminEmail();
        },
        adminLogin: function () {
            return getAdminLogin();
        }
    },
    watch: {
        isZoneForbidden: function () {
            if (!this.isZoneForbidden) {
                this.heightZoneValue.min = '';
                this.heightZoneValue.max = '';
            }
        }
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
    getDronesRequest(getToken());
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