import '@tarojs/async-await';
import Taro, { Component, Config } from '@tarojs/taro';
import { Provider } from '@tarojs/redux';

import Index from './pages/index';
import configStore from './store';
import './app.scss';
import { userSync, syncConnectResult } from './actions/user';
import { IUserState } from './reducers/user';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        pages: [
            'pages/index/index',
            'pages/patient/index',
            'pages/statistic/index',
            'pages/grid/index',
            'pages/patients/index',
            'pages/record/index',
            'pages/user/index',
            'pages/viewset/index',
        ],

        tabBar: {
            list: [
                {
                    pagePath: 'pages/patients/index',
                    text: '所有患者',
                    iconPath: './assets/list.png',
                    selectedIconPath: './assets/list_selected.png',
                },
                {
                    pagePath: 'pages/statistic/index',
                    text: '统计',
                    iconPath: './assets/summary.png',
                    selectedIconPath: './assets/summary_selected.png',
                },
                {
                    pagePath: 'pages/index/index',
                    text: '我的',
                    iconPath: './assets/user.png',
                    selectedIconPath: './assets/user_selected.png',
                },
            ],
            color: '#a6a6a6',
            selectedColor: '#78a4fa',
            backgroundColor: '#ffffff',
            borderStyle: 'black',
        },
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black',
        },
    };

    componentWillMount() {}

    componentDidMount() {
        if (!Taro.cloud) {
            console.error('请使用2.2.3或以上的基础库以使用云能力');
        } else {
            Taro.cloud.init({ traceUser: true });
            Taro.cloud.callFunction({
                name: 'getContext',
                success(res) {
                    console.log('getContext', res);
                    store.dispatch(syncConnectResult(res.result['result'])); // result.result 代表first_connected_result
                    if (res.result.record) {
                        store.dispatch(userSync((res.result as any)['record'] as IUserState));
                    }
                },
                fail: console.error,
            });
        }
    }

    componentDidShow() {}

    componentDidHide() {}

    componentDidCatchError() {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render() {
        return (
            <Provider store={store}>
                <Index />
            </Provider>
        );
    }
}

Taro.render(<App />, document.getElementById('app'));
