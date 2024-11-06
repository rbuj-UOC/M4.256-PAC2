import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from 'src/app/Models/post.dto';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent {
  posts!: PostDTO[];
  constructor(
    private postService: PostService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loadPosts();
  }

  private loadPosts(): void {
    const userId: string | null = this.localStorageService.get('user_id');
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
