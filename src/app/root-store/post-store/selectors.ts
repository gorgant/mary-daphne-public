import { State } from './state';
import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPosts from './reducer';
import { Post } from 'src/app/core/models/posts/post.model';

const getError = (state: State): any => state.error;
const getIsLoading = (state: State): boolean => state.isLoading;
const getPostsLoaded = (state: State): boolean => state.postsLoaded;
const getFeaturedPostsLoaded = (state: State): boolean => state.featuredPostsLoaded;

export const selectPostState: MemoizedSelector<object, State>
= createFeatureSelector<State>('posts');

export const selectAllPosts: (state: object) => Post[] = createSelector(
  selectPostState,
  fromPosts.selectAll
);

export const selectFeaturedPosts = createSelector(
  selectAllPosts,
  posts => posts.filter(post => post.featured)
);

export const selectPostById: (postId: string) => MemoizedSelector<object, Post>
= (postId: string) => createSelector(
  selectPostState,
  postsState => postsState.entities[postId]
);

export const selectPostError: MemoizedSelector<object, any> = createSelector(
  selectPostState,
  getError
);

export const selectPostIsLoading: MemoizedSelector<object, boolean>
= createSelector(selectPostState, getIsLoading);

export const selectPostsLoaded: MemoizedSelector<object, boolean>
= createSelector(selectPostState, getPostsLoaded);

export const selectFeaturedPostsLoaded: MemoizedSelector<object, boolean>
= createSelector(selectPostState, getFeaturedPostsLoaded);
