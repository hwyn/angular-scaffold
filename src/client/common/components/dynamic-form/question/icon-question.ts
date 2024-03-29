import { BaseQuestion } from './base-question';

export class IconQuestion extends BaseQuestion {
  private target: string;
  constructor(key: string, propsKey: string, props: any) {
    const { target, ...other } = props;
    super(key, propsKey, other);
    this.target = target || 'i';
    this.isAddFormControlName = false;
    this.mergePropsExtends(this.transformProps.size);
    this.mergeTransformProps({ type: 'nzType' });
  }

  public getTemplate(): string {
    return `<${this.target} nz-icon ${this.serializationProps()}></${this.target}>`;
  }
}
