import { Component, OnInit } from '@angular/core';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  numLikes = 0;
  numDislikes = 0;

  constructor(
    private postService: PostService,
    private sharedService: SharedService
  ) {}

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
