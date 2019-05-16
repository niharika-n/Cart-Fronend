import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-layout-footer',
  templateUrl: './layout-footer.component.html',
  styleUrls: ['./layout-footer.component.css']
})
export class LayoutFooterComponent implements OnInit, OnDestroy {
  categoryModel = [];
  sharedSubscription: Subscription;

  constructor(private sharedService: SharedService) {
    this.sharedSubscription = this.sharedService.getCategories().subscribe(data => this.processData(data));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sharedSubscription.unsubscribe();
  }

  processData(data) {
    this.categoryModel = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentCategory) {
        this.categoryModel.push(data[i]);
      }
    }
  }

}
