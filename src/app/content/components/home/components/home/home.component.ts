import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';
import { PageHeroData } from 'shared-models/forms-and-components/page-hero-data.model';
import { PublicAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { PRODUCTION_APPS, SANDBOX_APPS } from 'shared-models/environments/env-vars.model';
import { ProductIdList, ProductUrlSlugList } from 'shared-models/products/product-id-list.model';
import { ImageProps } from 'shared-models/images/image-props.model';
import { PublicImagePaths } from 'shared-models/routes-and-paths/image-paths.model';
import { metaTagDefaults } from 'shared-models/analytics/metatags.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private productionEnvironment: boolean = environment.production;
  explearningUrl: string;
  remoteCoachUrl: string;
  blogUrl: string;

  heroData: PageHeroData;
  appRoutes = PublicAppRoutes;

  constructor(
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit() {
    this.initializeHeroData();
    this.configSeoAndAnalytics();
    this.setProductPathsBasedOnEnvironment();
  }

  // Add async data as needed and fire once loaded
  private configSeoAndAnalytics() {

    const title = metaTagDefaults.maryDaphnePublic.metaTagDefaultTitle;
    // tslint:disable-next-line:max-line-length
    const description = metaTagDefaults.maryDaphnePublic.metaTagDefaultDescription;
    const localImagePath = metaTagDefaults.maryDaphnePublic.metaTagDefaultImage;
    const canonicalUrlPath = PublicAppRoutes.HOME;

    this.analyticsService.setSeoTags(title, description, localImagePath, canonicalUrlPath);
    this.analyticsService.logPageViewWithCustomDimensions(canonicalUrlPath);
    this.analyticsService.createNavStamp(canonicalUrlPath);
  }

  private setProductPathsBasedOnEnvironment() {
    switch (this.productionEnvironment) {
      case true:
        console.log('Setting productIdList to production');
        this.explearningUrl = `https://${PRODUCTION_APPS.explearningPublicApp.websiteDomain}`;
        // tslint:disable-next-line:max-line-length
        this.remoteCoachUrl = `${this.explearningUrl}${this.appRoutes.PRODUCTS}/${ProductIdList.EXPLEARNING_REMOTE_COACH}/${ProductUrlSlugList.REMOTE_COACH}`;
        break;
      case false:
        console.log('Setting productIdList to sandbox');
        this.explearningUrl = `https://${SANDBOX_APPS.explearningPublicApp.websiteDomain}`;
        // tslint:disable-next-line:max-line-length
        this.remoteCoachUrl = `${this.explearningUrl}${this.appRoutes.PRODUCTS}/${ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH}/${ProductUrlSlugList.SANDBOX_REMOTE_COACH}`;
        break;
      default:
        console.log('Setting productIdList to sandbox');
        this.explearningUrl = `https://${SANDBOX_APPS.explearningPublicApp.websiteDomain}`;
        // tslint:disable-next-line:max-line-length
        this.remoteCoachUrl = `${this.explearningUrl}${this.appRoutes.PRODUCTS}/${ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH}/${ProductUrlSlugList.SANDBOX_REMOTE_COACH}`;
        break;
    }
  }

  private initializeHeroData() {
    const imageProps: ImageProps = {
      src: PublicImagePaths.HOME,
      sizes: null,
      srcset: null,
      width: null,
    };

    this.heroData = {
      // pageTitle: 'Equip Yourself for Opportunity',
      pageTitle: 'Develop Skills That Last a Lifetime',
      pageSubtitle: null,
      imageProps,
      actionMessage: 'Learn More'
    };
  }

  ngOnDestroy() {
    this.analyticsService.closeNavStamp();
  }

}
