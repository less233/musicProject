export const routes = [
    {
        path: '/main',
        name: 'Main',
        component: r => require(['../views/Main.vue'], r),

        children: [
            {
                path: 'my',
                name: 'My',
                component: r => require(['../views/mainViews/My.vue'], r)
            },

            {
                path: 'Discover',
                name: 'Discover',
                component: r => require(['../views/mainViews/Discover.vue'], r)
            },

            {
                path: 'cloudvillage',
                name: 'CloudVillage',
                component: r => require(['../views/mainViews/CloudVillage.vue'], r)
            },

            {
                path: 'video',
                name: 'Video',
                component: r => require(['../views/mainViews/Video.vue'], r)
            },
        ]
    },

    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/account/Register.vue')
    },

    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/account/Login.vue')
    },

    {
        path: '/personal',
        name: 'Personal',
        component: () => import('../views/account/Personal.vue')
    },


    {
        path: '/player',
        name: 'Player',
        component: () => import('../views/Player.vue')
    },

    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },

    {
        path: '/list',
        name: 'List',
        component: () => import('../views/sencondViews/List.vue')
    },

    {
        path: '/rankinglist',
        name: 'Rankinglist',
        component: () => import('../views/sencondViews/Rankinglist.vue')
    },

    {
        path: '/songlist',
        name: 'Songlist',
        component: () => import('../views/sencondViews/Songlist.vue')
    },


    {
        path: '*',
        redirect: {
            name: 'Discover'
        }
    }
]