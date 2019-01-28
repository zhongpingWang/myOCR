import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Index from "../src/components/Index" 

const router = new VueRouter({
    mode: 'history', 
    root:"/ocr",
    routes: [{ 
            path: "/ocr",
            name: "index",
            component: Index
        }  
    ]
});

export default router;