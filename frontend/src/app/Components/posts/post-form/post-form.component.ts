import { formatDate } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs/operators';
import { selectUserId } from '../../../app.selectors';
import { CategoryDTO } from '../../../Models/category.dto';
import { PostDTO } from '../../../Models/post.dto';
import { CategoryService } from '../../../Services/category.service';
import { PostService } from '../../../Services/post.service';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-post-form',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private postService = inject(PostService);
  private formBuilder = inject(UntypedFormBuilder);
  private router = inject(Router);
  private sharedService = inject(SharedService);
  private store = inject(Store);
  private categoryService = inject(CategoryService);

  post: PostDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  num_likes!: UntypedFormControl;
  num_dislikes!: UntypedFormControl;
  publication_date: UntypedFormControl;
  categories!: UntypedFormControl;

  postForm: UntypedFormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private postId: string | null;

  categoriesList!: CategoryDTO[];
  userId!: string | null;

  constructor() {
    this.isValidForm = null;
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.post = new PostDTO('', '', 0, 0, new Date());
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.post.title, [
      Validators.required,
      Validators.maxLength(55)
    ]);

    this.description = new UntypedFormControl(this.post.description, [
      Validators.required,
      Validators.maxLength(255)
    ]);

    this.publication_date = new UntypedFormControl(
      formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.num_likes = new UntypedFormControl(this.post.num_likes);
    this.num_dislikes = new UntypedFormControl(this.post.num_dislikes);

    this.categories = new UntypedFormControl([]);

    // get categories by user and load multi select
    this.loadCategories();

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categories: this.categories,
      num_likes: this.num_likes,
      num_dislikes: this.num_dislikes
    });
  }

  private loadCategories() {
    this.store.select(selectUserId).subscribe((userId) => {
      if (userId) {
        this.categoryService.getCategoriesByUserId(userId).subscribe(
          (categoriesList) => {
            this.categoriesList = categoriesList;
          },
          (error: any) => {
            const errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
      }
    });
  }

  ngOnInit(): void {
    this.store
      .select(selectUserId)
      .subscribe((userId) => (this.userId = userId));

    // update
    if (this.postId) {
      this.isUpdateMode = true;
      this.postService.getPostById(this.postId).subscribe(
        (post: PostDTO) => {
          this.post = post;
          this.title.setValue(this.post.title);
          this.description.setValue(this.post.description);
          this.publication_date.setValue(
            formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en')
          );
          const categoriesIds: string[] = [];
          this.post.categories.forEach((cat: CategoryDTO) => {
            categoriesIds.push(cat.categoryId);
          });
          this.categories.setValue(categoriesIds);
          this.num_likes.setValue(this.post.num_likes);
          this.num_dislikes.setValue(this.post.num_dislikes);
          this.postForm = this.formBuilder.group({
            title: this.title,
            description: this.description,
            publication_date: this.publication_date,
            categories: this.categories,
            num_likes: this.num_likes,
            num_dislikes: this.num_dislikes
          });
        },
        (error: any) => {
          const errorResponse: any = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  private editPost(): void {
    let errorResponse: any;
    if (this.postId) {
      if (this.userId) {
        this.post.userId = this.userId;
        this.postService
          .updatePost(this.postId, this.post)
          .pipe(
            finalize(() => {
              this.sharedService
                .managementToast(
                  'postFeedback',
                  this.validRequest,
                  errorResponse
                )
                .finally(() => {
                  if (this.validRequest) {
                    this.router.navigateByUrl('posts');
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

  private createPost(): void {
    let errorResponse: any;
    if (this.userId) {
      this.post.userId = this.userId;
      this.postService
        .createPost(this.post)
        .pipe(
          finalize(() => {
            this.sharedService
              .managementToast('postFeedback', this.validRequest, errorResponse)
              .finally(() => {
                if (this.validRequest) {
                  this.router.navigateByUrl('posts');
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

  savePost(): void {
    this.isValidForm = false;
    if (this.postForm.invalid) {
      return;
    }
    this.isValidForm = true;
    this.post = this.postForm.value;
    if (this.isUpdateMode) {
      this.editPost();
    } else {
      this.createPost();
    }
  }
}
