import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { TemplateModel } from '../admin/template/template';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    id = 0;
    file = null;

    constructor(private httpclient: HttpClient, private toastr: ToastrService,
        private http: Http) { }

    getTemplateKeys() {
        return this.httpclient.get('api/template/listtemplatekeys');
    }

    getTemplate(templateId) {
        return this.httpclient.get('api/template/gettemplate/' + templateId);
    }

    updateTemplate(template: TemplateModel) {
        return this.httpclient.put('api/template/updatetemplate', template).
            pipe(map(x => {
                return x;
            }));
    }
}
