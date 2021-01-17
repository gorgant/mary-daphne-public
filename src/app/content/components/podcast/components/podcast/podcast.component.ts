import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageHeroData } from 'shared-models/forms-and-components/page-hero-data.model';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';
import { metaTagDefaults, metaTagsContentPages } from 'shared-models/analytics/metatags.model';
import { ImageProps } from 'shared-models/images/image-props.model';
import { PublicImagePaths } from 'shared-models/routes-and-paths/image-paths.model';
import { PublicAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PODCAST_PATHS } from 'shared-models/podcast/podcast-vars.model';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.scss']
})
export class PodcastComponent implements OnInit, OnDestroy {

  heroData: PageHeroData;
  podcastEmbdedPlayerUrl = PODCAST_PATHS.mdls.embeddedPlayerUrl;
  sanitizedEmbededPlayerUrl: SafeHtml;
  podcastPageUrl = PODCAST_PATHS.mdls.landingPageUrl;

  constructor(
    private analyticsService: AnalyticsService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.initializeHeroData();
    this.configSeoAndAnalytics();
    this.sanitizeUrl(this.podcastEmbdedPlayerUrl);
  }

  private sanitizeUrl(unsanitizedContent: string) {
    this.sanitizedEmbededPlayerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsanitizedContent);
  }

  // Add async data as needed and fire once loaded
  private configSeoAndAnalytics() {

    const title = metaTagsContentPages.mdlsPublic.podcastMetaTitle;
    // tslint:disable-next-line:max-line-length
    const description = metaTagsContentPages.mdlsPublic.podcastMetaDescription;
    const localImagePath = metaTagDefaults.mdlsPublic.metaTagDefaultImage;
    const canonicalUrlPath = PublicAppRoutes.PODCAST;

    this.analyticsService.setSeoTags(title, description, localImagePath, canonicalUrlPath);
    this.analyticsService.logPageViewWithCustomDimensions(canonicalUrlPath);
    this.analyticsService.createNavStamp(canonicalUrlPath);
  }

  private initializeHeroData() {
    const imgProps: ImageProps = {
      src: PublicImagePaths.PODCAST,
      sizes: null,
      srcset: null,
      width: null,
    };

    this.heroData = {
      pageTitle: metaTagsContentPages.mdlsPublic.podcastPageTitle,
      pageHeroSubtitle: metaTagsContentPages.mdlsPublic.podcastPageHeroSubtitle,
      imageProps: imgProps,
      actionMessage: metaTagsContentPages.mdlsPublic.podcastActionMessage
    };
  }

  ngOnDestroy() {
    this.analyticsService.closeNavStamp();
  }

}
