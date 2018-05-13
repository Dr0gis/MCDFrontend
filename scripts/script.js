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

function registrationRequest(email, password) {
    var url = serverUrl + 'Registration';
    var request = $.ajax({
        type: 'POST',
        data: JSON.stringify({email: email, password: password}),
        url: url,
        contentType: 'application/json',
        success: function(result) {
            console.log('Registration done');
            console.log(result);
        },
        error: function() {
            console.log('Registration error');
        }
    });
}

function authorizationRequest(email, password) {
    var url = serverUrl + 'Authorization';
    var request = $.ajax({
        type: 'POST',
        data: JSON.stringify({email: email, password: password}),
        url: url,
        contentType: 'application/json',
        success: function(result) {
            console.log('Authorization done');
            console.log(result);
            saveToken(result);
            showMainContent();
        },
        error: function() {
            console.log('Authorization error');
        }
    });
}

function getStatisticsRequest() {
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

Vue.component('authorization', {
    template: 
        '<div class="content" id="authorization">' +
            '<form @submit.prevent="authorization">' +
                '<span>Email</span>' +
                '<input v-model="email" type="email" placeholder="Email">' +
                '<span>Password</span>' +
                '<input v-model="password" type="password" placeholder="Password">' +
                '<button type="submit">Authorization</button>' +
            '</form>' +
        '</div>',
    data: function () {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        authorization: function () {
            authorizationRequest(this.email, this.password);
        }
    }
});

Vue.component('registration', {
    template: 
        '<div class="content" id="registration">' +
            '<form @submit.prevent="registration">' +
                '<span>Email</span>' +
                '<input v-model="email" type="email" placeholder="Email">' +
                '<span>Password</span>' +
                '<input v-model="password" type="password" placeholder="Password">' +
                '<button type="submit">Registration</button>' +
            '</form>' +
        '</div>',
    data: function () {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        registration: function (event) {
            registrationRequest(this.email, this.password);
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

var mainContent = new Vue({
    el: '#main-content',
    data: {
        isShow: false
    },
    methods: {
        logOut: function () {
            removeToken();
            showBoxRegAuth();
        }
    }
});

function showMainContent() {
    boxRegAuth.isShow = false;
    mainContent.isShow = true;
    getStatisticsRequest();
}

function showBoxRegAuth() {
    boxRegAuth.isShow = true;
    mainContent.isShow = false;
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