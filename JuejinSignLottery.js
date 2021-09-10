// ==UserScript==
// @name         myTest-beta
// @namespace    x8q7@https://www.baidu.com/
// @version      0.0.1
// @description  try to take over the world!
// @author       x8q7
// @match        https://juejin.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // class
    function Tools() {
        this.pannel = null;
    }

    Tools.prototype.init = function () {
        this.pannelInit();      // 面板 初始化
        this.dialogInit();      // dialog 初始化
        this.dialogSay("掘金抽奖助手，初始化完成！")
    }

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
        dialog.innerText = "提示： 您已签到！";
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

    Tools.prototype.dialogSay = async function (text){
        let length = 200;
        if(typeof(text) === "string"){
            length = text.length * 18 + 50;
        }
        this.dialog.style.width = length + "px";
        this.dialog.innerHTML = `提示：${text}`;
        $("#toolDialog").fadeIn("slow");
        await this.sleep(2000);
        $("#toolDialog").fadeOut("slow");

    }

    Tools.prototype.sleep = function (timeout){
        return new Promise(function(resolve){
            setTimeout(() => {
                resolve();
            }, timeout);
        })
    }

    Tools.prototype.main = function (e) {
        //check 签到
        this.checkSignIn();
        this.dialogSay("开始")
        //check 抽奖
    }

    Tools.prototype.checkSignIn = function () {
        
    }

    



    //start
    let tool = new Tools();
    tool.init();
})();
