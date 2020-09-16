import { Toast } from "vant";

class Utils {
    // 序列化参数
    queryString(options) {
        let params = '';
        for (let key in options) {
            params += `${key}=${options[key]}&`;
        }
        return params.slice(0,-1);
    };

    // 验证有效表单
    // 格式
    // value: 验证内容
    // reg: 正则
    // errMsg: 错误提示
    verify(options) {
        for (let key in options) {
            if (!options[key].reg.test(options[key].value)) {
                // 提示
                Toast({
                    message: options[key].errMsg,
                    // position: 'bottom'
                })
                // 验证失败
                return false;
            }
        }
        // 验证成功
        return true;
    }
}

export const utils = new Utils();