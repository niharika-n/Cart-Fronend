import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../shared/login-model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    selectedUser: LoginUser = {
        userId: null,
        firstName: '',
        lastName: '',
        userName: '',
        imageContent: '',
        emailId: '',
        roles: null
    };
    @ViewChild('imageFile') imageFile: ElementRef;

    constructor(private http: HttpClient, private toastr: ToastrService) { }

}
