import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserId } from 'src/app/app.selectors';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  posts!: PostDTO[];
  showButtons: boolean;
  userId$ = this.store.select(selectUserId);

  constructor(
    private postService: PostService,
    private store: Store,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.showButtons = false;
    this.loadPosts();
  }

  ngOnInit(): void {
    this.userId$.subscribe((userId) => {
      this.showButtons = userId != null;
    });
  }

  private loadPosts(): void {
    this.postService.getPosts().subscribe(
      (posts: PostDTO[]) => {
        this.posts = posts;
      },
      (error: any) => {
        const errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    );
  }

  like(postId: string): void {
    this.postService.likePost(postId).subscribe(
      () => {
        this.loadPosts();
      },
      (error: any) => {
        const errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    );
  }

  dislike(postId: string): void {
    this.postService.dislikePost(postId).subscribe(
      () => {
        this.loadPosts();
      },
      (error: any) => {
        const errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    );
  }
}
