import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageHeroData } from 'src/app/core/models/forms-and-components/page-hero-data.model';
import { PublicImagePaths } from 'src/app/core/models/routes-and-paths/image-paths.model';
import { PublicAppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { ProductIdList, ProductUrlSlugList } from 'src/app/core/models/products/product-id-list.model';
import { ImageProps } from 'src/app/core/models/images/image-props.model';
import { environment } from 'src/environments/environment';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';
import { PRODUCTION_APPS, SANDBOX_APPS } from 'src/app/core/models/environments/env-vars.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private productionEnvironment: boolean = environment.production;
  explearningUrl: string;
  // remoteCoachProductId: string;
  // remoteCoachUrlSlug: string;
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

    const title = `Mary Daphne - Upgrades for Life`;
    // tslint:disable-next-line:max-line-length
    const description = `Build skills that last for life through a suite of personal development services, spanning communications, business coaching, personal branding, and much more. Explore what Mary Daphne has to offer and take your first step toward your upgraded self.`;
    const localImagePath = this.heroData.imageProps.src;

    this.analyticsService.setSeoTags(title, description, localImagePath);
    this.analyticsService.logPageViewWithCustomDimensions();
    this.analyticsService.createNavStamp();
  }

  private setProductPathsBasedOnEnvironment() {
    switch (this.productionEnvironment) {
      case true:
        console.log('Setting productIdList to production');
        this.explearningUrl = `https://${PRODUCTION_APPS.publicApp.websiteDomain}`;
        // tslint:disable-next-line:max-line-length
        this.remoteCoachUrl = `${this.explearningUrl}${this.appRoutes.PRODUCTS}/${ProductIdList.REMOTE_COACH}/${ProductUrlSlugList.REMOTE_COACH}`;
        break;
      case false:
        console.log('Setting productIdList to sandbox');
        this.explearningUrl = `https://${SANDBOX_APPS.publicApp.websiteDomain}`;
        // tslint:disable-next-line:max-line-length
        this.remoteCoachUrl = `${this.explearningUrl}${this.appRoutes.PRODUCTS}/${ProductIdList.SANDBOX_REMOTE_COACH}/${ProductUrlSlugList.SANDBOX_REMOTE_COACH}`;
        break;
      default:
        console.log('Setting productIdList to sandbox');
        this.explearningUrl = `https://${SANDBOX_APPS.publicApp.websiteDomain}`;
        // tslint:disable-next-line:max-line-length
        this.remoteCoachUrl = `${this.explearningUrl}${this.appRoutes.PRODUCTS}/${ProductIdList.SANDBOX_REMOTE_COACH}/${ProductUrlSlugList.SANDBOX_REMOTE_COACH}`;
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
      pageTitle: 'Equip Yourself for Opportunity',
      pageSubtitle: null,
      imageProps,
      actionMessage: 'Learn More'
    };
  }

  ngOnDestroy() {
    this.analyticsService.closeNavStamp();
  }

}
