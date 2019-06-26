import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SerializationConfig } from './serialization-config';

/**
 * 动态component
 * @param config 表单配置
 * @param layout 表单布局
 */
export const factoryForm = (config: any, layout?: any, nzLayout?: string) => {
  // 序列化配置项
  const serializationConfig = new SerializationConfig(config, {
    nzLayout,
    ...layout,
  });
  @Component({
    template: serializationConfig.generateTemplate(), // 获取动态的template
    providers: [FormBuilder],
  })
  class TemComponent implements OnInit, OnDestroy {
    @Output() dynamicSubmit: EventEmitter<any> = new EventEmitter();
    @Output() valueChanges: EventEmitter<any> = new EventEmitter();
    @Input() set fieldStore(value: object) {
      this._fieldStore = value || {};
      this.resetValidateForm();
    }
    private _fieldStore: any = {};
    private subscription: Subscription = new Subscription();
    public validateForm: FormGroup;
    public serialization: SerializationConfig = serializationConfig;
    constructor(private fb: FormBuilder) {
      
    }

    ngOnInit() {
      if (!this.validateForm) {
        this.resetValidateForm();
      }
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    /**
     * 遍历controls
     * @param validateForm form
     * @param back 回掉函数
     */
    private eachForm(validateForm: FormGroup | FormControl | FormArray, back: (control?: AbstractControl) => void): boolean {
      if (validateForm instanceof FormArray) {
        validateForm.value.forEach((v: any, i: number) => this.eachForm(validateForm.get(i.toString()) as any, back));
      } else if (validateForm instanceof FormGroup) {
        const { controls } = validateForm;
        Object.keys(controls).forEach((controlKey: string) => {
          this.eachForm(controls[controlKey] as any, back);
        });
      } else if (validateForm instanceof FormControl) {
        if (back) {
          back(validateForm);
        }
      }
      return false;
    }

    /**
     * 创建form
     * @param fieldStore 数据
     */
    private createValidateForm(fieldStore?: any) {
      this.validateForm = serializationConfig.generateFormGroup(this.fb, fieldStore);
      this.subscription.add(
        this.validateForm.valueChanges.subscribe((value: any) => {
          this.valueChanges.emit(value);
        })
      );
    }

    /**
     * 表单提交 对应onSubmit事件
     * @param event MoustEvent
     */
    onSubmit(event?: any) {
      const { validateForm } = this;
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      // 验证表单
      this.eachForm(validateForm, (control: FormControl) => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      if (validateForm.valid) {
        this.dynamicSubmit.emit(validateForm.value);
      }
    }

    /**
     * 重置表单
     * @param event MoustEvent
     */
    resetForm(event?: MouseEvent) {
      if (event) {
        event.preventDefault();
      }
      if (serializationConfig.typeOrInclude('formArray')) {
        this.createValidateForm(this.initialValues);
      } else if (this.validateForm) {
        this.validateForm.reset(this.initialValues);
        this.eachForm(this.validateForm, (control: AbstractControl) => {
          control.markAsPristine();
          control.updateValueAndValidity();
        });
      }
    }

    /**
     * 从新设置表单的值
     * @param fieldStore 表单值 {}
     */
    resetValidateForm(fieldStore?: any) {
      if (fieldStore) {
        this._fieldStore = fieldStore;
      }
      const { _fieldStore } = this;
      if (this.validateForm && !serializationConfig.typeOrInclude('formArray')) {
        this.validateForm.reset(_fieldStore);
      } else {
        this.createValidateForm(_fieldStore);
      }
    }

    /**
     * 获取表单数据
     */
    getFormValue(): object {
      return this.validateForm.value;
    }

    get initialValues() {
      return serializationConfig.initialValues;
    }
  }

  return TemComponent;
};