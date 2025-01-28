import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../app.selectors';
import { PostDTO } from '../../Models/post.dto';
import { PostService } from '../../Services/post.service';
import { SharedService } from '../../Services/shared.service';

@Component({
  selector: 'app-home',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts!: PostDTO[];
  showButtons: boolean;
  userId$: any;

  constructor(
    private postService: PostService,
    private store: Store,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.userId$ = this.store.select(selectUserId);
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
