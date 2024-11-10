import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs/operators';
import { selectUserId } from 'src/app/app.selectors';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  category: CategoryDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  css_color: UntypedFormControl;

  categoryForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private categoryId: string | null;
  userId!: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private store: Store
  ) {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.category.title, [
      Validators.required,
      Validators.maxLength(55)
    ]);

    this.description = new UntypedFormControl(this.category.description, [
      Validators.required,
      Validators.maxLength(255)
    ]);

    this.css_color = new UntypedFormControl(this.category.css_color, [
      Validators.required,
      Validators.maxLength(7),
      Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')
    ]);

    this.categoryForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      css_color: this.css_color
    });
  }

  ngOnInit(): void {
    this.store
      .select(selectUserId)
      .subscribe((userId) => (this.userId = userId));

    // update
    if (this.categoryId) {
      this.isUpdateMode = true;
      this.categoryService.getCategoryById(this.categoryId).subscribe(
        (category: CategoryDTO) => {
          this.category = category;
          this.title.setValue(this.category.title);
          this.description.setValue(this.category.description);
          this.css_color.setValue(this.category.css_color);
          this.categoryForm = this.formBuilder.group({
            title: this.title,
            description: this.description,
            css_color: this.css_color
          });
        },
        (error: any) => {
          const errorResponse: any = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private editCategory(): void {
    let errorResponse: any;
    if (this.categoryId) {
      if (this.userId) {
        this.category.userId = this.userId;
        this.categoryService
          .updateCategory(this.categoryId, this.category)
          .pipe(
            finalize(() => {
              this.sharedService
                .managementToast(
                  'categoryFeedback',
                  this.validRequest,
                  errorResponse
                )
                .finally(() => {
                  if (this.validRequest) {
                    this.router.navigateByUrl('categories');
                  }
                });
            })
          )
          .subscribe(
            () => {
              this.validRequest = true;
            },
            (error: any) => {
              this.validRequest = false;
              errorResponse = error.error;
              this.sharedService.errorLog(errorResponse);
            }
          );
      }
    }
  }

  private createCategory(): void {
    let errorResponse: any;
    if (this.userId) {
      this.category.userId = this.userId;
      this.categoryService
        .createCategory(this.category)
        .pipe(
          finalize(() => {
            this.sharedService
              .managementToast(
                'categoryFeedback',
                this.validRequest,
                errorResponse
              )
              .finally(() => {
                if (this.validRequest) {
                  this.router.navigateByUrl('categories');
                }
              });
          })
        )
        .subscribe(
          () => {
            this.validRequest = true;
          },
          (error: any) => {
            this.validRequest = false;
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
    }
  }

  saveCategory(): void {
    this.isValidForm = false;
    if (this.categoryForm.invalid) {
      return;
    }
    this.isValidForm = true;
    this.category = this.categoryForm.value;
    if (this.isUpdateMode) {
      this.editCategory();
    } else {
      this.createCategory();
    }
  }
}
