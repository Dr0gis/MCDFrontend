var serverUrl = 'http://192.168.31.168:9000/';
var googleMapsApiKey = 'AIzaSyAfdWr8eiluFFBNtPGeMcv3CnLAOk76Wgs';

/*----------          REQUESTS          ----------*/

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

function getUsersListRequest(token) {
    showProgress();
    var url = serverUrl + 'UsersList';
    var request = $.ajax({
        type: 'GET',
        data: {
            token: token
        },
        url: url,
        success: function(result) {
            console.log('UsersList done');
            console.log(result);
            formUserList(result);
            hideProgress();
        },
        error: function() {
            console.log('UsersList error');
            hideProgress();
        }
    });
}

function getStatisticsRequest(token, userEmail) {
    showProgress();
    var url = serverUrl + 'Statistics';
    var request = $.ajax({
        type: 'GET',
        data: {
            token: token,
            emailUser: userEmail
        },
        url: url,
        success: function(result) {
            console.log('Statistics done');
            console.log(result);
            formUserOffenceDroneMovements(result);
            hideProgress();
        },
        error: function() {
            console.log('Statistics error');
            hideProgress();
        }
    });
}

function getEventsRequest(token) {
    showProgress();
    var url = serverUrl + 'Events';
    var request = $.ajax({
        type: 'GET',
        data: {
            token: token,
        },
        url: url,
        success: function(result) {
            console.log('Events done');
            console.log(result);
            formEventsList(result);
            hideProgress();
        },
        error: function() {
            console.log('Events error');
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

function getZonePointsRequest(token) {
    showProgress();
    var url = serverUrl + 'ZonePoints';
    var request = $.ajax({
        type: 'GET',
        data: {
            token: token
        },
        url: url,
        success: function(result) {
            console.log('ZonePoints done');
            console.log(result);
            listZonePoints = result;
            hideProgress();
        },
        error: function() {
            console.log('ZonePoints error');
            hideProgress();
        }
    });
}

function clearZonePointsRequest(token) {
    showProgress();
    var url = serverUrl + 'ClearZonePoints';
    var request = $.ajax({
        type: 'POST',
        data: JSON.stringify({token: token}),
        url: url,
        contentType: 'application/json',
        success: function(result) {
            console.log('ClearZonePoints done');
            console.log(result);
            hideProgress();
        },
        error: function() {
            console.log('ClearZonePoints error');
            hideProgress();
        }
    });
}

function updateZonePointsRequest(token, id, minHeight, maxHeight, forbidden) {
    showProgress();
    var url = serverUrl + 'UpdateZonePoints';
    var request = $.ajax({
        type: 'PUT',
        data: JSON.stringify({token: token, id: Number.parseInt(id), minHeight: Number.parseInt(minHeight), maxHeight: Number.parseInt(maxHeight), forbidden: forbidden}),
        url: url,
        contentType: 'application/json',
        success: function(result) {
            console.log('UpdateZonePoints done');
            console.log(result);
            hideProgress();
            getZonePointsRequest(getToken());
        },
        error: function() {
            console.log('UpdateZonePoints error');
            hideProgress();
        }
    });
}

/*----------          GLOBAL          ----------*/

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

/*----------          VUE          ----------*/

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

                var socket = new WebSocket('ws://192.168.31.168:9000/ConnectionWithDrones?qrcode=lvvg-yf7ojGPYaQsL-2kEnjNix5H5U-zT5_Us-EtAo4=');
                // Message received on the socket
                socket.onmessage = function(event) {
                    console.log(JSON.parse(event.data));
                };
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
            getStatisticsRequest(getToken(), listUsers.items[index]);
            showUserData();
        }
    }
});


var listZonePoints;

var userOffenceDroneMovements = [];
function formUserOffenceDroneMovements(droneMovements) {
    userOffenceDroneMovements.splice(0,  userOffenceDroneMovements.length);
    for (var i = 0; i < droneMovements.length; i++) {
        userOffenceDroneMovements.push(droneMovements[i]);
    }
}

var eventsList = [];
function formEventsList(events) {
    eventsList.splice(0,  eventsList.length);
    for (var i = 0; i < events.length; i++) {
        eventsList.push(events[i]);
    }
}

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
        pointZoneValue: {
            x: '',
            y: '',
            minHeight: '',
            maxHeight: '',
        },
        onZoneZoom: false,
        tempZoom: false,
        selectedZonePoint: -1,
        userOffenceDroneMovements: userOffenceDroneMovements,
        eventsList: eventsList
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
            if (this.selectedZonePoint != -1) {
                this.isZoneForbidden = !this.isZoneForbidden;
            }
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
        },
        selectZonePoint: function (index) {
            if (this.selectedZonePoint == index) {
                this.selectedZonePoint = -1;
                return;
            }
            this.selectedZonePoint = index;
            this.pointZoneValue.x = listZonePoints[index].x;
            this.pointZoneValue.y = listZonePoints[index].y;
            this.isZoneForbidden = listZonePoints[index].forbidden;
            if (this.isZoneForbidden) {
                this.pointZoneValue.minHeight = listZonePoints[index].minHeight;
                this.pointZoneValue.maxHeight = listZonePoints[index].maxHeight;
            }
        },
        getZonePoints: function () {
            getZonePointsRequest(getToken());
        },
        clearZonePoints: function () {
            clearZonePointsRequest(getToken());
        },
        saveZonePoint: function () {
            var minHeight = this.pointZoneValue.minHeight;
            var maxHeight = this.pointZoneValue.maxHeight;
            if (!this.isZoneForbidden) {
                minHeight = listZonePoints[this.selectedZonePoint].minHeight;
                maxHeight = listZonePoints[this.selectedZonePoint].maxHeight;
            }
            updateZonePointsRequest(getToken(), listZonePoints[this.selectedZonePoint].id, minHeight, maxHeight, this.isZoneForbidden);
            this.selectedZonePoint = -1;
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
            if (this.isZoneForbidden) {
                this.pointZoneValue.minHeight = listZonePoints[this.selectedZonePoint].minHeight;
                this.pointZoneValue.maxHeight = listZonePoints[this.selectedZonePoint].maxHeight;
            }
            else {
                this.pointZoneValue.minHeight = '';
                this.pointZoneValue.maxHeight = '';
            }
        },
        selectedZonePoint: function () {
            if (this.selectedZonePoint == -1) {
                this.pointZoneValue.x = '';
                this.pointZoneValue.y = '';
                this.isZoneForbidden = false;
            }
        }
    }
});

function showMainContent() {
    boxRegAuth.isShow = false;
    mainContent.isShow = true;
    getUsersListRequest(getToken());
    getZonePointsRequest(getToken());
    getEventsRequest(getToken());
}

function showBoxRegAuth() {
    boxRegAuth.isShow = true;
    mainContent.isShow = false;
}

function showContent() {
    mainContent.isContentShow = true;
    mainContent.isProfileShow = false;
    mainContent.indexActiveTitle = 1;
    getUsersListRequest(getToken());
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


/*----------          MAIN          ----------*/

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