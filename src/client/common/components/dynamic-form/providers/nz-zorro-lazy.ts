import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { UploadModule } from '../../upload/upload.module';
import { DirectivesModule } from '../directives/directives.module';

export const NzZorroImport = [
  NzButtonModule,
  NzFormModule,
  NzRadioModule,
  NzDatePickerModule,
  NzSelectModule,
  NzGridModule,
  NzInputModule,
  NzIconModule,
  NzCheckboxModule,
  NzInputNumberModule,
  NzTimePickerModule,
  UploadModule,
  DirectivesModule
];
