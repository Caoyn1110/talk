var loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
});

var LoginPwdValidator = new FieldValidator("txtLoginPwd", async function (val) {
  if (!val) {
    return "请填写密码";
  }
});

const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    LoginPwdValidator
  );
  if (!result) {
    //验证未通过
    return;
  }

  //验证通过，调用API注册
  // const data = {
  //   loginId: loginIdValidator.input.value,
  //   loginPwd: LoginPwdValidator.input.value,
  //   nickname: nicknameValidator.input.value,
  // };
  //浏览器提供了一个构造函数,组装表单数据
  //传入表单dom，得到一个表单数据对象
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  // console.log(data);
  //注册API
  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功，点击确定，跳转到首页");
    //跳转到登录页
    location.href = "./index.html";
  } else {
    alert("账号密码不匹配，请重新输入");
    loginIdValidator.input.value = "";
    LoginPwdValidator.input.value = "";
  }
};
