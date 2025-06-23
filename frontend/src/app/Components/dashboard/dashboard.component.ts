import { Component, OnInit, inject } from '@angular/core';
import { PostDTO } from '../../Models/post.dto';
import { PostService } from '../../Services/post.service';
import { SharedService } from '../../Services/shared.service';

@Component({
  selector: 'app-dashboard',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private postService = inject(PostService);
  private sharedService = inject(SharedService);

  numLikes = 0;
  numDislikes = 0;

  ngOnInit(): void {
    this.postService.getPosts().subscribe(
      (posts: PostDTO[]) => {
        posts.forEach((post) => {
          this.numLikes = this.numLikes + post.num_likes;
          this.numDislikes = this.numDislikes + post.num_dislikes;
        });
      },
      (error: any) => {
        const errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    );
  }
}
