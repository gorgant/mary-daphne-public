import { Component, OnInit } from '@angular/core';
import { metaTagsContentPages } from 'shared-models/analytics/metatags.model';

@Component({
  selector: 'app-feature-icons',
  templateUrl: './feature-icons.component.html',
  styleUrls: ['./feature-icons.component.scss']
})
export class FeatureIconsComponent implements OnInit {

  capTitleOne = metaTagsContentPages.mdlsPublic.homeCapTitleOne;
  capBodyOne = metaTagsContentPages.mdlsPublic.homeCapBodyOne;
  capIconOnePath = metaTagsContentPages.mdlsPublic.homeCapIconOnePath;

  capTitleTwo = metaTagsContentPages.mdlsPublic.homeCapTitleTwo;
  capBodyTwo = metaTagsContentPages.mdlsPublic.homeCapBodyTwo;
  capIconTwoPath = metaTagsContentPages.mdlsPublic.homeCapIconTwoPath;

  capTitleThree = metaTagsContentPages.mdlsPublic.homeCapTitleThree;
  capBodyThree = metaTagsContentPages.mdlsPublic.homeCapBodyThree;
  capIconThreePath = metaTagsContentPages.mdlsPublic.homeCapIconThreePath;

  constructor() { }

  ngOnInit() {
  }

}
