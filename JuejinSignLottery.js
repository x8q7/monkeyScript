// ==UserScript==
// @name         掘金稀土-签到抽奖
// @namespace    x8q7@https://www.baidu.com/
// @version      0.0.1
// @description  掘金稀土 转盘抽奖脚本
// @author       x8q7
// @match        https://juejin.cn/
// @match        https://juejin.cn/user/center/signin?from=*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @run-at       document-idle
// ==/UserScript==

const homeUrl = "https://juejin.cn/";
const signUrl = "https://juejin.cn/user/center/signin?from=main_page";
const lotteryUrl = "https://juejin.cn/user/center/lottery?from=lucky_lottery_menu_bar";

const lotteryApi = "https://api.juejin.cn/growth_api/v1/lottery/draw";

const fetchRate = 2000;


(function () {
    'use strict';

    // class
    function Tools() {
        this.pannel = null;
    }

    Tools.prototype.init = function () {
        this.dialogInit();      // dialog 初始化

        if (window.location.href === homeUrl) {
            this.pannelInit();      // 面板 初始化
            this.dialogSay("掘金抽奖助手，初始化完成！")
        } else {
            if (window.location.href.indexOf("https://juejin.cn/user/center/signin?") >= 0) {
                return this.signInPage();
            }
        }
    }

    // require fn
    Tools.prototype.pannelInit = function () {
        const self = this;

        let pannel = document.createElement("div");
        this.pannel = pannel;
        //添加样式
        pannel.setAttribute("id", "toolPannel");

        pannel.innerText = "掘";
        pannel.style.width = "30px";
        pannel.style.height = "30px";
        pannel.style.lineHeight = "30px";
        pannel.style.borderRadius = "15px";
        pannel.style.backgroundColor = "#1E80FF";

        pannel.style.color = "#ffffff";
        pannel.style.fontSize = "16px";
        pannel.style.fontWeight = "bold";
        pannel.style.textAlign = "center";

        pannel.style.position = "fixed";
        pannel.style.top = "14px";
        pannel.style.right = "250px";
        pannel.style.zIndex = "300";

        //插入节点
        let body = document.getElementsByTagName("body")[0];
        body.append(pannel);

        pannel.addEventListener("click", function (e) {
            self.main(e);
        })
    }

    Tools.prototype.dialogInit = function () {
        const self = this;

        let dialog = document.createElement("div");
        this.dialog = dialog;
        //添加样式
        dialog.setAttribute("id", "toolDialog");
        dialog.style.display = "none";
        dialog.innerText = "";
        dialog.style.width = "200px";
        dialog.style.margin = "0 auto";
        dialog.style.padding = "10px";
        dialog.style.borderRadius = "8px";
        dialog.style.backgroundColor = "rgb(30,128,255,0.9)";

        dialog.style.color = "#ffffff";
        dialog.style.fontSize = "16px";
        dialog.style.fontWeight = "bold";
        dialog.style.textAlign = "center";

        dialog.style.position = "fixed";
        dialog.style.top = "50px";
        dialog.style.left = "0";
        dialog.style.right = "0";
        dialog.style.zIndex = "500";

        //插入节点
        let body = document.getElementsByTagName("body")[0];
        body.append(dialog);
    }

    Tools.prototype.dialogSay = async function (text) {
        let length = 200;
        if (typeof (text) === "string") {
            length = text.length * 18 + 50;
        }
        this.dialog.style.width = length + "px";
        this.dialog.innerHTML = `提示：${text}`;
        $("#toolDialog").fadeIn("slow");
        await this.sleep(2000);
        $("#toolDialog").fadeOut("slow");

    }

    Tools.prototype.resultSay = async function (result, count) {
        const self = this;
        let resultPannel = document.createElement("div");
        resultPannel.setAttribute("id", "resultPannel");
        resultPannel.style.display = "none";
        resultPannel.style.width = "200px";
        resultPannel.style.height = "200px";
        resultPannel.style.margin = "0 auto";
        resultPannel.style.padding = "10px";
        resultPannel.style.borderRadius = "8px";
        resultPannel.style.backgroundColor = "rgb(100,100,100,0.8)";

        resultPannel.style.color = "#ffffff";
        resultPannel.style.fontSize = "16px";
        resultPannel.style.fontWeight = "bold";

        resultPannel.style.position = "fixed";
        resultPannel.style.top = "200px";
        resultPannel.style.left = "0";
        resultPannel.style.right = "0";
        resultPannel.style.zIndex = "500";

        let body = document.getElementsByTagName("body")[0];
        body.append(resultPannel);
        for (const i in result) {
            if (Object.hasOwnProperty.call(result, i)) {
                const element = result[i];
                let row = document.createElement("div");
                row.innerText = `奖品：${i} --- 数量：${element}`
                resultPannel.append(row);
            }
        }
        $("#resultPannel").fadeIn("slow");
        await this.sleep(5000);
        $("#resultPannel").fadeOut("slow");
        await this.sleep(2000);
        $("#resultPannel").remove();
    }

    Tools.prototype.sleep = function (timeout) {
        return new Promise(function (resolve) {
            setTimeout(() => {
                resolve();
            }, timeout);
        })
    }

    Tools.prototype.formatDate = function (s) {
        var dateObj = s ? new Date(s) : new Date();
        var formatObj = {
            y: dateObj.getFullYear(),
            m: (dateObj.getMonth() + 1).toString().padStart(2, "0"),
            d: dateObj.getDate().toString().padStart(2, "0"),
            h: dateObj.getHours().toString().padStart(2, "0"),
            i: dateObj.getMinutes().toString().padStart(2, "0"),
            s: dateObj.getSeconds().toString().padStart(2, "0"),
            w: dateObj.getDay()
        };

        return formatObj;
    };

    Tools.prototype.request = function (method = 'GET', url, data) {
        return new Promise(function (resolve) {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                data: data,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                response: "json",
                onload: function (res) {
                    if (res.status === 200) {
                        resolve(res.response);
                    } else {
                        GM_log(new Error(err))
                        resolve(null);
                    }
                },
                onerror: function (err) {
                    GM_log(new Error(err))
                    resolve(null);
                }
            });
        });
    }

    // main--------------------------------------
    Tools.prototype.main = async function () {
        const self = this;
        let isFinish = this.checkFinish();
        if (isFinish) {
            this.dialogSay("您已完成，明天再来吧！");
            return;
        }

        let signPage = GM_openInTab(signUrl, { active: true, insert: true, setParent: true });
        signPage.onclose = async function (res) {
            self.finish();
        }
    }

    //检查 是否标记 完成
    Tools.prototype.checkFinish = function () {
        let today = this.formatDate();
        let todayStr = `${today.y}-${today.m}-${today.d}`;
        let isFinish = false;
        let cacheStr = GM_getValue("juejinSignTool");
        if (cacheStr) {
            let [todayStrCache, status] = cacheStr.split("::");
            if (todayStr !== todayStrCache || status !== "true") {
                isFinish = true;
            }
        }
        return isFinish;
    }

    //签到页
    Tools.prototype.signInPage = async function () {
        await this.sleep(3000);

        let signBtn = $(".code-calender .signin");
        if (String.prototype.trim.call(signBtn.text()) === "立即签到") {
            signBtn.click();
            await this.sleep(3000);
            let modalCloseBtn = $(".byte-modal .byte-modal__headerbtn");
            modalCloseBtn.click();
        }
        // window.location.href = lotteryUrl;

        await this.sleep(2000);
        await this.doLottery()
    }

    //抽奖
    Tools.prototype.doLottery = async function () {
        let haveMore = true, result = {}, count = 0;
        while (haveMore) {
            let res = await this.request("POST", lotteryApi, {});
            if (res) {
                const { data, err_msg, err_no } = JSON.parse(res);
                if (!data || err_no !== 0) {
                    this.dialogSay(err_msg);
                    haveMore = false;
                    break;
                }

                if (Object.prototype.hasOwnProperty.call(result, data.lottery_name)) {
                    result[data.lottery_name] += 1;
                } else {
                    result[data.lottery_name] = 1;
                }

                count++
            }
            await this.sleep(2000);
        }
        
        await this.resultSay(result, count);
        window.close();
    }

    Tools.prototype.finish = function () {
        let today = this.formatDate();
        let todayStr = `${today.y}-${today.m}-${today.d}`;

        GM_setValue("juejinSignTool", `${todayStr}::${true}`);
    }
    
    //start
    let tool = new Tools();
    tool.init();
})();
