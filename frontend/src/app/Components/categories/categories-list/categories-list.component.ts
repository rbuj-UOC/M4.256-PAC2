import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../../app.selectors';
import { CategoryDTO } from '../../../Models/category.dto';
import { CategoryService } from '../../../Services/category.service';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-categories-list',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent {
  categories!: CategoryDTO[];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private store: Store,
    private sharedService: SharedService
  ) {
    this.loadCategories();
  }

  private loadCategories(): void {
    const userId$ = this.store.select(selectUserId);
    userId$.subscribe((userId) => {
      if (userId) {
        this.categoryService.getCategoriesByUserId(userId).subscribe(
          (categories: CategoryDTO[]) => {
            this.categories = categories;
          },
          (error: any) => {
            const errorResponse: any = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
      }
    });
  }

  createCategory(): void {
    this.router.navigateByUrl('/user/category/');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  deleteCategory(categoryId: string): void {
    // show confirmation popup
    const result: boolean = confirm(
      'Confirm delete category with id: ' + categoryId + ' .'
    );
    if (result) {
      this.categoryService.deleteCategory(categoryId).subscribe(
        (rowsAffected: any) => {
          if (rowsAffected.affected > 0) {
            this.loadCategories();
          }
        },
        (error: any) => {
          const errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }
}
