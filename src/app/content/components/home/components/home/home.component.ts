import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';
import { PageHeroData } from 'shared-models/forms-and-components/page-hero-data.model';
import { PublicAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { ProductIdList, ProductUrlSlugList } from 'shared-models/products/product-id-list.model';
import { ImageProps } from 'shared-models/images/image-props.model';
import { PublicImagePaths } from 'shared-models/routes-and-paths/image-paths.model';
import { metaTagDefaults, metaTagsContentPages } from 'shared-models/analytics/metatags.model';
import { PRODUCTION_APPS } from 'shared-models/environments/env-vars.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  expnUrl: string;
  remoteCoachUrl: string;

  heroData: PageHeroData;
  appRoutes = PublicAppRoutes;

  constructor(
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit() {
    this.initializeHeroData();
    this.configSeoAndAnalytics();
    this.setProductPaths();
  }

  // Add async data as needed and fire once loaded
  private configSeoAndAnalytics() {

    const title = metaTagDefaults.mdlsPublic.metaTagDefaultTitle;
    // tslint:disable-next-line:max-line-length
    const description = metaTagDefaults.mdlsPublic.metaTagDefaultDescription;
    const localImagePath = metaTagDefaults.mdlsPublic.metaTagDefaultImage;
    const canonicalUrlPath = PublicAppRoutes.HOME;

    this.analyticsService.setSeoTags(title, description, localImagePath, canonicalUrlPath);
    this.analyticsService.logPageViewWithCustomDimensions(canonicalUrlPath);
    this.analyticsService.createNavStamp(canonicalUrlPath);
  }

  private setProductPaths() {
    this.expnUrl = `https://${PRODUCTION_APPS.expnPublicApp.websiteDomain}`;
    // tslint:disable-next-line:max-line-length
    this.remoteCoachUrl = `${this.expnUrl}${this.appRoutes.PRODUCTS}/${ProductIdList.EXPLEARNING_REMOTE_COACH}/${ProductUrlSlugList.REMOTE_COACH}`;
  }

  private initializeHeroData() {
    const imageProps: ImageProps = {
      src: PublicImagePaths.HOME,
      sizes: null,
      srcset: null,
      width: null,
    };

    this.heroData = {
      pageTitle: metaTagsContentPages.mdlsPublic.homePageTitle,
      pageHeroSubtitle: null,
      imageProps,
      actionMessage: metaTagsContentPages.mdlsPublic.homeActionMessage
    };
  }

  ngOnDestroy() {
    this.analyticsService.closeNavStamp();
  }

}
