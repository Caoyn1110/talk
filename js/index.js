(async function () {
  //验证是否有登录，如果没有登录，跳转到登录页面，如果登录，获取到登录的用户信息
  const resp = await API.profile();
  const user = resp.data;

  if (!user) {
    alert("未登录或登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };

  //下面的代码一定是登录状态才会执行
  setUdserInfo();

  //注销事件
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  };

  //加载历史记录
  loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
      scrollBottom();
    }
  }
  //发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };

  //设置用户信息
  function setUdserInfo() {
    //这边必须使用innerText,如果你使用了innerHTML,当用户了注册了<h1>1</h1>这样类似的代码就不行，这边只能显示纯文本
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  //根据消息对象，将其添加到页面中
  /**
   * content:"你是谁"
   * createdAt: 1665409301959
   * from: "cyn"
   * to: null
   */
  function addChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    //如果是我发送的消息，添加me类样式
    if (chatInfo.from) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.className = "chat-avatar";
    //设置头像
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    //显示聊天内容
    content.innerText = chatInfo.content;

    //显示时间
    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formData(chatInfo.createdAt);
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  }

  function formData(timestamp) {
    const data = new Date(timestamp);
    const year = data.getFullYear();
    const month = (data.getMonth() + 1).toString().padStart(2, "0");
    const day = data.getDate().toString().padStart(2, "0");
    const hour = data.getHours().toString().padStart(2, "0");
    const minute = data.getMinutes().toString().padStart(2, "0");
    const second = data.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  //   addChat({
  //     content: "你的性别",
  //     createdAt: 1665409301959,
  //     from: "cyn",
  //     to: null,
  //   });

  //辅助函数，让聊天区域的滚动条滚动到最后
  async function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
  //发送消息
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }

    //往界面加聊天内容
    addChat({
      content,
      createdAt: Date.now(),
      from: user.loginId,
      to: null,
    });
    doms.txtMsg.value = "";
    scrollBottom();

    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }
  window.sendChat = sendChat;
})();
