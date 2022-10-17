/**
 * 对某个表单项进行验证的构造函数
 */
class FieldValidator {
  /**
   *构造器
   * @param {String} txtId
   * @param {Function} validatorFunc
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    // console.log(this.p);
    this.validatorFunc = validatorFunc;
    //表单失去焦点，表单验证
    this.input.onblur = () => {
      this.validate();
    };
  }

  //验证方法
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      //有错误
      this.p.innerHTML = err;
      return false;
    } else {
      this.p.innerHTML = "";
      return true;
    }
  }

  /**
   * 对传入的所有验证器进行统一的验证,如果所有的验证均通过，则返回true，否则返回false
   * @param {FieldValidator[]} validators
   */
  static async validate(...validators) {
    //需要调用所有验证器的验证方法,v表示一个需要的验证的表单项
    const proms = validators.map((v) => v.validate());
    const results = await Promise.all(proms);
    return results.every((r) => r);
  }
}
