import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'shared-models/products/product.model';
import { Store } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';
import { metaTagDefaults } from 'shared-models/analytics/metatags.model';
import { PublicAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { ProductStoreSelectors, ProductStoreActions } from 'src/app/root-store/product-store';
import { withLatestFrom, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-webcourse-list',
  templateUrl: './webcourse-list.component.html',
  styleUrls: ['./webcourse-list.component.scss']
})
export class WebcourseListComponent implements OnInit, OnDestroy {

  products$: Observable<Product[]>;

  constructor(
    private store$: Store<RootStoreState.State>,

    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.configSeoAndAnalytics();
    this.initializeProducts();
  }

  // Add async data as needed and fire once loaded
  private configSeoAndAnalytics() {

    const title = `Web Courses - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`;
    // tslint:disable-next-line:max-line-length
    const description = `${metaTagDefaults.maryDaphnePublic.metaTagSiteName} offers interactive, in-depth web courses that are designed to take your communication skills and social skills to new level.`;
    const localImagePath = metaTagDefaults.maryDaphnePublic.metaTagDefaultImage;
    const canonicalUrlPath = PublicAppRoutes.WEBCOURSES;

    this.analyticsService.setSeoTags(title, description, localImagePath, canonicalUrlPath);
    this.analyticsService.logPageViewWithCustomDimensions(canonicalUrlPath);
    this.analyticsService.createNavStamp(canonicalUrlPath);
  }

  private initializeProducts() {
    this.products$ = this.store$.select(ProductStoreSelectors.selectAllProducts)
      .pipe(
        withLatestFrom(
          this.store$.select(ProductStoreSelectors.selectProductsLoaded)
        ),
        map(([products, productsLoaded]) => {
          // Check if items are loaded, if not fetch from server
          if (!productsLoaded) {
            console.log('No products loaded, loading those now');
            this.store$.dispatch(new ProductStoreActions.AllProductsRequested());
          }
          return products;
        }),
        filter(products => products.length > 0) // Catches the first emission which is an empty array
      );
  }

  ngOnDestroy() {
    this.analyticsService.closeNavStamp();
  }

}
