import { Injectable } from '@angular/core';
import { Options } from '../../../common/components/dynamic-form/question/question';
import { DynamicConfigType } from '../../../common/components/dynamic-form/dynamic-form';

@Injectable()
export class ConfigService {
  constructor() {}

  /**
   * 查询条件表单配置
   */
  get searchForm(): DynamicConfigType[] {
    return [{
      key: 'radioGroup',
      props: {
        name: 'radioGroup',
        children: [{ label: '全部', value: '' }, { label: '正常', value: 0 }, { label: '异常', value: 1 }],
      },
      fieldDecorator: {
        label: 'radioGroup',
        initialValue: '',
      },
    }, {
      key: 'inputGroup',
      fieldDecorator: {
        label: 'group',
      },
      props: {
        children: [{
          key: 'select',
          fieldDecorator: {
            initialValue: '0',
          },
          props: {
            name: 'groupSelect',
            disabled: () => {
              return true;
            },
            style: { width: '30%' },
            ngModelChange: (value: any, { form: validateForm }: Options) => {
              validateForm.get('groupInput').setValue(value);
            },
            children: [{ label: '全部', value: '' }, { label: '正常', value: 0 }, { label: '异常', value: 1 }],
          }
        }, {
          key: 'input',
          fieldDecorator: {
            initialValue: '',
          },
          props: {
            name: 'groupInput',
            format: (value: string) => {
              return String(value).indexOf('金额：') !== -1 ? value : ('金额：' + (value || ''));
            },
            style: { width: '70%' },
            placeholder: '测试group',
          }
        }],
      }
    }, {
      key: 'monthPicker',
      fieldDecorator: {
        label: '查询月份',
        initialValue: new Date(new Date().setDate(0)),
      },
      props: {
        name: 'month',
        nzPlaceHolder: '请选择查询月份',
        nzAllowClear: false,
      },
    }, {
      key: 'select',
      props: {
        name: 'checkResult',
        children: [{ label: '全部', value: '' }, { label: '正常', value: 0 }, { label: '异常', value: 1 }],
        placeholder: '请选择考勤状态',
      },
      fieldDecorator: {
        label: '考勤状态',
        initialValue: '',
      },
    }, {
      key: 'input',
      isShow: (validateForm: any) => validateForm.value.checkResult === '',
      fieldDecorator: {
        label: '用户信息',
      },
      props: {
        name: 'keyWord',
        format: (val: any) => (typeof val === 'string' ? val.replace(/^\s*/g, '') : val),
        placeholder: '请输入中文名/英文名/工号查询',
      },
    }];
  }

  /**
   * 动态table配置
   */
  get tableColumn(): any[] {
    return [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    }, {
      title: '工号',
      dataIndex: 'userCode',
      key: 'userCode',
      width: 140,
    }, {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 140,
    }, {
      title: '小组',
      dataIndex: 'projectTeam',
      key: 'projectTeam',
      width: 140,
    }, {
      title: '日期',
      dataIndex: 'day',
      key: 'day',
      width: 140,
    }];
  }
}
