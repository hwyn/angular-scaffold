import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import { SearchFormComponent } from '../search-form/search-form.component';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild(SearchFormComponent, { static: false }) dynamicForm: SearchFormComponent;
  @ViewChild(DynamicTableComponent, { static: false }) dynamicTable: DynamicTableComponent;
  @Input() layout: any;
  @Input() fieldStore: any;
  @Input() formConfig: any;
  @Input() theadColumns: any[][];
  @Input() tableColumns: any;
  @Input() dataSource: any[];
  @Input() total: number = 0;
  @Input() templateMap: object;
  @Input() toolsRef: TemplateRef<any>; // 工具栏的templateRef
  @Input() trTemplateRef: TemplateRef<any>;
  @Input() tdTemplateRef: TemplateRef<any>;
  @Input() showCheckbox: boolean;
  @Input() showPagination: boolean = true;
  @Input() isHeadFixed: boolean;
  @Input() loading: boolean;
  @Input() isSerial: boolean;
  @Output() readonly paginationChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly currentPageDataChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly checkChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly fetchRecords: EventEmitter<any> = new EventEmitter();

  @Input() pageStyle: object = {};
  @Input() pageClass: string;

  @Input() searchStyle: object = {};
  @Input() searchClass: string;

  @Input() tableStyle: object = {};
  @Input() tableClass: string;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this._fetchRecords();
  }

  /**
   * 获取数据
   */
  _fetchRecords() {
    this.fetchRecords.emit(this.fields);
  }

  /**
   * 查询参数
   */
  get fields(): object {
    return {
      ...this.formFields,
      ...this.page
    };
  }

  get formFields(): object {
    return {
      ...(this.formConfig ? this.dynamicForm.value : {})
    };
  }

  get page(): object {
    return {
      ...(this.showPagination && this.tableColumns ? this.dynamicTable.page : {})
    };
  }
}
