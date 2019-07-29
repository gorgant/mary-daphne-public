import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';
import { PageHeroData } from 'shared-models/forms-and-components/page-hero-data.model';
import { ImageProps } from 'shared-models/images/image-props.model';
import { PublicImagePaths } from 'shared-models/routes-and-paths/image-paths.model';
import { metaTagDefaults } from 'shared-models/analytics/metatags.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {

  heroData: PageHeroData;

  constructor(
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit() {
    this.initializeHeroData();
    this.configSeoAndAnalytics();
  }

  // Add async data as needed and fire once loaded
  private configSeoAndAnalytics() {
    const title = `About Us - ${metaTagDefaults.maryDaphnePublic.metaTagSiteName}`;
    // tslint:disable-next-line:max-line-length
    const description = `Our mission at ${metaTagDefaults.maryDaphnePublic.metaTagSiteName} is to empower you to become the best version of yourself.  With expertise in communications, business, and personal development, we offer powerful, research-backed strategies to help you develop critical skills that position you for success.`;
    const localImagePath = metaTagDefaults.maryDaphnePublic.metaTagDefaultImage;

    this.analyticsService.setSeoTags(title, description, localImagePath);
    this.analyticsService.logPageViewWithCustomDimensions();
    this.analyticsService.createNavStamp();
  }

  private initializeHeroData() {
    const aboutImageProps: ImageProps = {
      src: PublicImagePaths.ABOUT_ME,
      sizes: null,
      srcset: null,
      width: null,
    };

    // Text is added in-line because layout is specific to About Me page
    this.heroData = {
      pageTitle: null,
      pageSubtitle: null,
      imageProps: aboutImageProps,
      actionMessage: 'Read More'
    };
  }

  ngOnDestroy() {
    this.analyticsService.closeNavStamp();
  }

}
