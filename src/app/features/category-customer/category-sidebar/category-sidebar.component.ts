import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-category-sidebar',
  templateUrl: './category-sidebar.component.html',
  styleUrls: ['./category-sidebar.component.css']
})
export class CategorySidebarComponent implements OnInit {
  categoryDetail: any;
  @Input() category: any;
  @Input() selectedCategory: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  selectCategory(categoryName: string) {
    const parentUrl = this.category.categoryName.replace(/[^A-Z0-9]+/ig, '-').replace(/^-+|-+$/g, '').toLowerCase();
    const url = categoryName.replace(/[^A-Z0-9]+/ig, '-').replace(/^-+|-+$/g, '').toLowerCase();
    if (parentUrl === url) {
      this.router.navigate(['', url]);
    } else {
      let parent = '';
      this.activatedRoute.params.subscribe((params: Params) => {
        parent = params.categoryId;
      });
      this.router.navigate([parent, url]);
    }
  }

}
