import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../../app.selectors';
import { PostDTO } from '../../../Models/post.dto';
import { PostService } from '../../../Services/post.service';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-posts-list',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent {
  private postService = inject(PostService);
  private router = inject(Router);
  private store = inject(Store);
  private sharedService = inject(SharedService);

  posts!: PostDTO[];

  constructor() {
    this.loadPosts();
  }

  private loadPosts(): void {
    const userId$ = this.store.select(selectUserId);
    userId$.subscribe((userId) => {
      if (userId) {
        this.postService.getPostsByUserId(userId).subscribe(
          (posts: PostDTO[]) => {
            this.posts = posts;
          },
          (error: any) => {
            const errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
      }
    });
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  deletePost(postId: string): void {
    // show confirmation popup
    const result: boolean = confirm(
      'Confirm delete post with id: ' + postId + ' .'
    );
    if (result) {
      this.postService.deletePost(postId).subscribe(
        (rowsAffected) => {
          if (rowsAffected.affected > 0) {
            this.loadPosts();
          }
        },
        (error: any) => {
          const errorResponse: any = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }
}
