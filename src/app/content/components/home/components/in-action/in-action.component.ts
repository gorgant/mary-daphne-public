import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, PostStoreSelectors, PostStoreActions } from 'src/app/root-store';
import { withLatestFrom, map, filter } from 'rxjs/operators';
import { PublicAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { BlogIndexPostRef } from 'shared-models/posts/post.model';
import { ShorthandBusinessNames } from 'shared-models/forms-and-components/legal-vars.model';

@Component({
  selector: 'app-in-action',
  templateUrl: './in-action.component.html',
  styleUrls: ['./in-action.component.scss']
})
export class InActionComponent implements OnInit {

  posts$: Observable<BlogIndexPostRef[]>;
  error$: Observable<string>;
  isLoading$: Observable<boolean>;
  requestedPosts: boolean;

  appRoutes = PublicAppRoutes;

  siteName = ShorthandBusinessNames.MARY_DAPHNE;

  constructor(
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    this.initializeFeaturedPosts();
  }

  private initializeFeaturedPosts() {

    this.error$ = this.store$.select(PostStoreSelectors.selectLoadError);

    this.posts$ = this.store$.select(PostStoreSelectors.selectFeaturedPosts)
      .pipe(
          withLatestFrom(this.store$.select(PostStoreSelectors.selectBlogIndexLoaded)),
          map(([posts, blogIndexLoaded]) => {
            if (!blogIndexLoaded && !this.requestedPosts) {
              console.log('No featured posts loaded, loading those now');
              this.requestedPosts = true;
              this.store$.dispatch(new PostStoreActions.FeaturedPostsRequested());
            }
            return posts as BlogIndexPostRef[];
          }),
          filter(posts => posts.length > 0), // Catches the first emission which is an empty array
        );

    this.isLoading$ = this.store$.select(PostStoreSelectors.selectIsLoading);
  }

}
