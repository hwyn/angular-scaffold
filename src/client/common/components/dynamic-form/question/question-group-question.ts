import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseQuestion } from './base-question';

export class QuestionGroupQuestion extends BaseQuestion {
  protected getQuestion: (propsKey: string, config: any) => BaseQuestion;
  protected childrenConfig: any[];
  protected children: any[];
  constructor(key: string, propsKey: string, props: any, getQuestion: (propsKey: string, config: any) => BaseQuestion) {
    const { children, ...config } = props;
    super(key, propsKey, config);
    this.getQuestion = getQuestion;
    this.childrenConfig = children;
    this.children = this.getChildren(children);
  }

  getChildren(children: any[]): any[] {
    return children.map((child: any, index: number) => {
      const { fieldDecorator, ...props } = child;
      const question = this.getQuestion(`${this.propsKey}.children${index}`, props);
      (question as this).propsExclude = (question as this).propsExclude.filter((underKey: string) => underKey !== '*ngIf');
      if (fieldDecorator) {
        question.setControlInitialValue(fieldDecorator.initialValue);
        question.setFormControlValidate(fieldDecorator.validate);
      }
      this.props[`children${index}`] = question.props;
      return question;
    });
  }

  getTemplate() {
    let template = `<span>`;
    template += this.children.reduce((underTemplate: string, child: BaseQuestion) =>  underTemplate + child.getTemplate(), ``);
    template += `</span>`;
    return template;
  }

  generateFormControlInfo(field: any, fb?: FormBuilder) {
    const underUnderField = field || {};
    return this.children.reduce((o: object, child: BaseQuestion) => {
      const underField = underUnderField[child.name];
      return {
        ...o,
        ...child.generateFormControlInfo(underField, fb)
      };
    }, {});
  }

   /**
   * 设置控制器
   * @param controlKey 控制器keyTemplate
   */
  public setFormControlKey(controlKey: string, constrolParentKey: string) {
    super.setFormControlKey(controlKey, constrolParentKey);
    const name = this.name || 'undefined';
    this.controlValidate = [];
    this.children.forEach((child: BaseQuestion) => {
      const underControlKey = this.controlKey.replace(name, child.name);
      child.setFormControlKey(underControlKey, this.constrolParentKey);
      (child as any).controlValidate.forEach((validate: any) => {
        this.controlValidate.push({
          controlKey: underControlKey,
          ...validate
        });
      });
    });
  }
}