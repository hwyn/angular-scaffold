import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export class GenerateProps {
  public name: string;
  protected isShow: boolean;
  protected transformProps: any = { // 指令映射
    style: '[ngStyle]',
    htmlStyle: 'style',
    class: '[ngClass]',
    isShow: '*ngIf',
    click: '(click)',
    blur: '(blur)',
    ngModelChange: '(ngModelChange)',
    disabled: 'dynamicDisable',
    size: 'nzSize'
  };
  protected propsExclude: string[] = [ // 不进行序列化的属性
    this.transformProps.isShow,
    'updateOn'
  ];
  protected controlValidate: any[] = []; // 验证数组
  protected initialValue: any; //  初始值
  protected controlKey: string; // 控制器 key
  protected controlParentKey: string; // 上一级控制key
  protected fb: FormBuilder;
  protected isArrayChildren: boolean = false; // 数组下的控件
  protected ngForKey: string; // 数组下的控件 当前的index
  constructor(defaultProps?: any) {
    const underDefaultProps = defaultProps || {};
    this.isShow = underDefaultProps.isShow;
  }

  /**
   * 解析生成props value
   * @param key 指令，属性
   * @param underValue 值
   * @param privateProps 对应组件中的属性
   */
  protected parsetPropsValue(key: string, underValue: any, privateProps: string): any {
    const typeString = typeof underValue;
    const transformKey = this.getTransformProps(key);
    let value = `${privateProps}['${key}']`;
    switch (typeString) {
      case 'function':
        value = this.functionValue(transformKey, value);
        break;
      case 'number':
      case 'boolean':
        value = underValue;
        break;
      case 'string':
        value = `'${underValue}'`;
        break;
    }
    return value;
  }

  /**
   * 是否显示
   * @param validateForm Form
   * @param control 控制器
   */
  protected isChangeShow(validateForm: FormGroup, control?: FormControl, parentGroup?: FormGroup) {
    const isShow: any = this.isShow;
    let privateIsShow: boolean = isShow;
    if (typeof isShow === 'function') {
      privateIsShow = isShow(validateForm, control, parentGroup);
    }
    return privateIsShow;
  }

  /**
   * 初始化配置信息
   * @param config 配置
   * @param isFormat 是否格式化值
   */
  protected initProps(config: any): object {
    const isShow = this.isShow;
    const props = {
      ...config
    };
    if (![null, undefined].includes(isShow)) {
      props.isShow = (validateForm: any, control: FormControl, propsGroup?: FormGroup) => this.isChangeShow(validateForm, control, propsGroup);
    }

    if (props.style && props.style.width && !props.htmlStyle) {
      props.htmlStyle = `width: ${props.style.width};`;
    }

    return props;
  }

  /**
   * props 不进行序列化的排除合并
   * @param exclude 排除项
   */
  protected mergePropsExtends(exclude: string | string[]) {
    this.propsExclude = [].concat(this.propsExclude, exclude);
  }

  /**
   * 合并props映射对象
   * @param transformProps 映射对象
   */
  protected mergeTransformProps(transformProps: object) {
    this.transformProps = { ...this.transformProps, ...transformProps };
  }

  /**
   * 转换propskey
   * @param propsKey key
   */
  protected getTransformProps(propsKey: string) {
    return this.transformProps[propsKey] || propsKey;
  }

  /**
   * 函数调用封装
   * @param key key
   * @param value value
   */
  protected functionValue(key: string, value: string) {
    let underValue: string;
    if (/^\*ngIf$/.test(key)) {
      underValue = this.getNgIfProps(value);
      return underValue;
    }
    const paramsObject = this.getParamsObject();
    if (/\[[\s\S]+\]/.test(key)) {
      underValue = `${value}`;
    } else if (/\([\s\S]+\)/.test(key)) {
      underValue = `${value}($event, ${paramsObject})`;
    } else {
      underValue = `${value}(${paramsObject})`;
    }
    return underValue;
  }

  /**
   * 获取事件传入参数
   */
  protected getParamsObject() {
    const isArrayChildren = this.isArrayChildren;
    const paramsObject = `{
      ${this.controlKey && this.name ? `control: ${this.controlKey},` : ``}
      ${isArrayChildren ? `data: data, ngForKey: ${this.ngForKey},` : ``}
      form: validateForm,
      $implicit: validateForm,
      parentForm: ${this.controlParentKey}
    }`;
    return paramsObject;
  }

  /**
   * 获取*ngif的拼接
   * @param propsKey props对应值
   */
  protected getNgIfProps(propsKey: string) {
    return `${propsKey}(validateForm${this.controlKey ? `, ${this.controlKey}, ${this.controlParentKey}` : ''})`;
  }

  /**
   * 是否排除对key进行序列化
   * @param key string
   */
  protected isExcludeKey(key: string, value: any): boolean {
    return this.propsExclude.includes(key);
  }

  /**
   * 添加、删除当前control
   * @param controlOption controlOption
   * @param addStatus isadd
   * @param parentGroup FormGroup
   */
  protected toggleControl(generateFormControlName: any, control: FormControl, addStatus: boolean, parentGroup: FormGroup) {
    if (!parentGroup || control && addStatus || !control && !addStatus) {
      return ;
    }
    const controlOption = generateFormControlName(undefined, this.fb);
    Object.keys(controlOption).forEach((name: string) => {
      if (addStatus && !parentGroup.get(name)) {
        const option = controlOption[name];
        parentGroup.addControl(name, this.fb.control(option[0], option[1], option[2]));
      } else if (!addStatus && parentGroup.get(name)) {
        parentGroup.removeControl(name);
      }
    });
  }

  /**
   * 是否时formArray下的控件
   * @param isArrayChildren boolean
   */
  public setIsArrayChildren(isArrayChildren: boolean, ngForKey: string) {
    this.isArrayChildren = isArrayChildren;
    this.ngForKey = ngForKey;
  }

  /**
   * 设置控制器
   * @param controlKey 控制器keyTemplate
   */
  public setFormControlKey(controlKey: string, controlParentKey: string) {
    this.controlKey = controlKey;
    this.controlParentKey = controlParentKey;
  }

  /**
   * 设置控件验证规则
   * @param validate 验证规则
   */
  public setFormControlValidate(validate: any[]) {
    if (!Array.isArray(validate) && !!validate) {
      this.setFormControlValidate([validate]);
    } else {
      this.controlValidate = [...(validate || [])];
    }
  }

  /**
   * 设置初始值
   * @param initialValue 初始值
   */
  public setControlInitialValue(initialValue: any) {
    this.initialValue = initialValue;
  }

  /**
   * 获取ngIf 显示隐藏信息
   */
  public getIsShowTemplate(props: any, privateProps: string) {
    if (!props || !props.isShow) {
      return ``;
    }
    return `*ngIf="${this.getNgIfProps(`${privateProps}.isShow`)}"`;
  }
}
