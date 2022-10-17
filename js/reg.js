var loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
  //判断账号是否存在
  const resp = await API.exists(val);
  if (resp.data) {
    return "该账号已被注册，请重新选择一个账号名";
  }
});

var nicknameValidator = new FieldValidator("txtNickname", async function (val) {
  if (!val) {
    return "请填写昵称";
  }
});

var LoginPwdValidator = new FieldValidator("txtLoginPwd", async function (val) {
  if (!val) {
    return "请填写密码";
  }
});

var LoginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async function (val) {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== LoginPwdValidator.input.value) {
      return "两次密码不一致";
    }
  }
);

const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    LoginPwdValidator,
    LoginPwdConfirmValidator
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
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功，点击确定，跳转到登录页");
    //跳转到登录页
    location.href = "./login.html";
  }
};
