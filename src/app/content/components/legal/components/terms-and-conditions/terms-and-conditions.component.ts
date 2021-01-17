import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AnalyticsService } from 'src/app/core/services/analytics/analytics.service';
import { metaTagsContentPages } from 'shared-models/analytics/metatags.model';
import { PublicAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';
import { LegalBusinessNames } from 'shared-models/forms-and-components/legal-vars.model';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {

  appRoutes = PublicAppRoutes;
  legalBusinessName = LegalBusinessNames.MDLS;

  constructor(
    private titleService: Title,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.configSeoAndAnalytics();
  }

  // Add async data as needed and fire once loaded
  private configSeoAndAnalytics() {

    const title = metaTagsContentPages.mdlsPublic.termsAndConditionsMetaTitle;
    const canonicalUrlPath = PublicAppRoutes.TERMS_AND_CONDITIONS;

    this.titleService.setTitle(title);
    this.analyticsService.logPageViewWithCustomDimensions(canonicalUrlPath);
    this.analyticsService.createNavStamp(canonicalUrlPath);
  }

  ngOnDestroy() {
    this.analyticsService.closeNavStamp();
  }

}
