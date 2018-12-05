import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Home from '@/components/Home';
import ArticleList from '@/components/ArticleList';
import CateMana from '@/components/CateMana';
import DataCharts from '@/components/DataCharts';
import ConsumerAmount from '@/components/ConsumerAmount';
import PostArticle from '@/components/PostArticle';
import UserMana from '@/components/UserMana';
import BlogDetail from '@/components/BlogDetail';
import ConsumeList from '@/components/ConsumeList';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      hidden: true,
      component: Login
    }, {
      path: '/home',
      name: '',
      component: Home,
      hidden: true
    }, {
      path: '/home',
      component: Home,
      name: '文章管理',
      iconCls: 'fa fa-file-text-o',
      children: [
        {
          path: '/articleList',
          name: '文章列表',
          component: ArticleList,
          meta: {
            keepAlive: true
          }
        }, {
          path: '/postArticle',
          name: '发表文章',
          component: PostArticle,
          meta: {
            keepAlive: false
          }
        }, {
          path: '/blogDetail',
          name: '博客详情',
          component: BlogDetail,
          hidden: true,
          meta: {
            keepAlive: false
          }
        }, {
          path: '/editBlog',
          name: '编辑博客',
          component: PostArticle,
          hidden: true,
          meta: {
            keepAlive: false
          }
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: '用户管理',
      children: [
        {
          path: '/user',
          iconCls: 'fa fa-user-o',
          name: '用户列表',
          component: UserMana
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: '栏目管理',
      children: [
        {
          path: '/cateMana',
          iconCls: 'fa fa-reorder',
          name: '栏目列表',
          component: CateMana
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: '数据统计',
      iconCls: 'fa fa-bar-chart',
      children: [
        {
          path: '/charts',
          iconCls: 'fa fa-bar-chart',
          name: '浏览数据统计',
          component: DataCharts
        },
        {
          path: '/amoutCharts',
          iconCls: 'fa fa-bar-chart',
          name: '消费金额统计',
          component: ConsumerAmount
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: '消费记录',
      iconCls: 'fa fa-reorder',
      children: [
        {
          path: '/consumeList',
          iconCls: 'fa fa-reorder',
          name: '消费列表',
          component: ConsumeList
        }
      ]
    }
  ]
});
