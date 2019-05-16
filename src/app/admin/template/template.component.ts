import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../../services/content-template.service';
import { TemplateModel } from './template';
import { SpinnerService } from '../../services/spinner.service';
import { TemplateType } from './template.enum';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  model: TemplateModel;
  id = 0;
  content = '';
  templateType = TemplateType;
  heading = '';
  keys = [];
  selectCheck = false;

  constructor(private contentService: TemplateService, private spinnerService: SpinnerService,
    private translate: TranslateService, private toastr: ToastrService, private errorService: ErrorService) {
    this.model = {
      id: 0,
      content: '',
      templateName: ''
    };
  }

  ngOnInit() {
    this.pageStart();
  }

  pageStart() {
    this.spinnerService.startRequest();
    this.contentService.getTemplateKeys().
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        for (let i = 0; i < result.body.contentResult.length; i++) {
          this.keys.push(result.body.contentResult[i]);
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.errorService.handleError(error.status);
      });
  }

  onSelect(event: any) {
    this.selectCheck = true;
    const newVal = event.target.value;
    this.spinnerService.startRequest();
    this.contentService.getTemplate(newVal).
      subscribe((result: any) => {
        this.spinnerService.endRequest();
        if (result.status === 1) {
          if (!isNullOrUndefined(result.body)) {
            this.heading = result.body.templateName;
            this.model = result.body;
            this.content = result.body.content;
          }
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.spinnerService.endRequest();
        this.errorService.handleError(error.status);
        const message = this.translate.instant('templates.empty-template');
      });
  }

  update(templateValue: string) {
    this.model.content = templateValue;
    this.contentService.updateTemplate(this.model).subscribe(
      (result: any) => {
        if (result.status === 1) {
          this.toastr.success(this.translate.instant('common.update', { param: 'Template' }), '');
        } else {
          this.errorService.handleFailure(result.statusCode);
        }
      }, (error: any) => {
        this.errorService.handleError(error.status);
        const message = this.translate.instant('templates.empty-template');
      });
  }

}
